import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import WeeklyPlanner from './components/WeeklyPlanner';
import LoginButton from './components/LoginButton';
import ErrorBoundary from './components/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, DISCOVERY_DOC, CALENDAR_SCOPES, validateConfig } from './config';
import './App.css';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    // Validate configuration on startup
    const validation = validateConfig();
    if (validation.isValid) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✓ Configuration validated successfully');
        console.log('API Key:', validation.config.apiKey);
        console.log('Client ID:', validation.config.clientId);
        console.log('Scopes:', validation.config.scopes);
      }
    } else {
      console.error('✗ Configuration validation failed');
      validation.errors.forEach(error => console.error('  -', error));
    }

    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => initializeGapiClient();
    document.body.appendChild(script);

    // Load the Google Identity Services library
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => initializeGisClient();
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(gisScript);
    };
  }, []);

  const initializeGapiClient = async () => {
    await window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
    });
  };

  const initializeGisClient = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: CALENDAR_SCOPES,
      callback: (response) => {
        if (response.error) {
          console.error('Token error:', response);
          return;
        }
        setIsSignedIn(true);
      },
    });
    setTokenClient(client);
  };

  const handleSignIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  const handleSignOut = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setIsSignedIn(false);
    }
  };

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="App">
          <header className="App-header">
            <h1>📅 Weekly Planner</h1>
            {gapiInited && tokenClient && (
              <LoginButton 
                isSignedIn={isSignedIn}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
              />
            )}
          </header>
          <main>
            {!gapiInited ? (
              <div className="loading">Loading Google Calendar API...</div>
            ) : !isSignedIn ? (
              <div className="welcome">
                <h2>Welcome to Your Weekly Planner</h2>
                <p>Sign in with Google to view your calendar events</p>
              </div>
            ) : (
              <WeeklyPlanner />
            )}
          </main>
          <PWAInstallPrompt />
        </div>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
