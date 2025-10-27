/**
 * Google Calendar API Configuration
 * 
 * This file contains all configuration settings for the Weekly Planner app.
 * API credentials are loaded from environment variables or hardcoded values.
 * 
 * Setup Instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Select project: day-planner-476114
 * 3. Ensure Google Calendar API is enabled
 * 4. OAuth 2.0 credentials are configured for http://localhost:3000
 */

// ============================================================================
// API CREDENTIALS
// ============================================================================

/**
 * Google API Key - Used for public API access
 * REQUIRED: Must be set in .env file as REACT_APP_GOOGLE_API_KEY
 * Get from: https://console.cloud.google.com/apis/credentials
 */
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

/**
 * Google OAuth 2.0 Client ID - Used for user authentication
 * REQUIRED: Must be set in .env file as REACT_APP_GOOGLE_CLIENT_ID
 * Get from: https://console.cloud.google.com/apis/credentials
 */
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * OAuth 2.0 Scopes - Define what permissions the app requests
 * - calendar: Full access to calendar events (read, write, delete)
 * - calendar.readonly: Read-only access to calendar events
 */
export const CALENDAR_SCOPES = 'https://www.googleapis.com/auth/calendar';

/**
 * Google Calendar API Discovery Document
 * Used to dynamically load the Calendar API client library
 */
export const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

/**
 * API Configuration Object
 */
export const API_CONFIG = {
  apiKey: GOOGLE_API_KEY,
  clientId: GOOGLE_CLIENT_ID,
  scope: CALENDAR_SCOPES,
  discoveryDocs: [DISCOVERY_DOC],
};

// ============================================================================
// APP CONFIGURATION
// ============================================================================

/**
 * Application Settings
 */
export const APP_CONFIG = {
  // Week starts on Sunday (0) or Monday (1)
  weekStartsOn: 0,
  
  // Calendar ID to fetch events from ('primary' = user's main calendar)
  calendarId: 'primary',
  
  // Maximum number of events to fetch per request
  maxResults: 250,
  
  // Show deleted events
  showDeleted: false,
  
  // Expand recurring events into individual instances
  singleEvents: true,
  
  // Order events by start time
  orderBy: 'startTime',
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates that all required configuration is present
 * @returns {Object} Validation result with status and any errors
 */
export const validateConfig = () => {
  const errors = [];
  const warnings = [];
  
  // Critical: API Key validation
  if (!GOOGLE_API_KEY) {
    errors.push('CRITICAL: REACT_APP_GOOGLE_API_KEY is not set in environment variables');
    errors.push('Create a .env file in the project root with: REACT_APP_GOOGLE_API_KEY=your_key_here');
  } else if (GOOGLE_API_KEY.length < 30) {
    errors.push('Google API Key appears to be invalid (too short)');
  }
  
  // Critical: Client ID validation
  if (!GOOGLE_CLIENT_ID) {
    errors.push('CRITICAL: REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
    errors.push('Create a .env file in the project root with: REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here');
  } else if (!GOOGLE_CLIENT_ID.includes('apps.googleusercontent.com')) {
    errors.push('Google Client ID appears to be invalid (must end with apps.googleusercontent.com)');
  }
  
  // Security check: Ensure not using example/placeholder values
  if (GOOGLE_API_KEY && (GOOGLE_API_KEY.includes('YOUR_') || GOOGLE_API_KEY.includes('EXAMPLE'))) {
    errors.push('Google API Key appears to be a placeholder value');
  }
  
  if (GOOGLE_CLIENT_ID && (GOOGLE_CLIENT_ID.includes('YOUR_') || GOOGLE_CLIENT_ID.includes('EXAMPLE'))) {
    errors.push('Google Client ID appears to be a placeholder value');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: {
      apiKey: GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 10) + '...' : 'NOT SET',
      clientId: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'NOT SET',
      scopes: CALENDAR_SCOPES,
    }
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

const config = {
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  CALENDAR_SCOPES,
  DISCOVERY_DOC,
  API_CONFIG,
  APP_CONFIG,
  validateConfig,
};

export default config;
