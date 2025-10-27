import React from 'react';
import './LoginButton.css';

function LoginButton({ isSignedIn, onSignIn, onSignOut }) {
  return (
    <button 
      className={`login-button ${isSignedIn ? 'signed-in' : ''}`}
      onClick={isSignedIn ? onSignOut : onSignIn}
    >
      {isSignedIn ? '🚪 Sign Out' : '🔑 Sign In with Google'}
    </button>
  );
}

export default LoginButton;
