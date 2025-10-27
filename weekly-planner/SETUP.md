# 📅 Weekly Planner - Setup Instructions

## Google Calendar API Configuration

Before running the app, you need to set up Google Calendar API credentials:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - Add app name, user support email, and developer contact
   - Add scope: `https://www.googleapis.com/auth/calendar.readonly`
4. Select "Web application" as the application type
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
6. Add authorized redirect URIs:
   - `http://localhost:3000`
7. Click "Create"
8. **Copy your Client ID** (you'll need this)

### Step 3: Create API Key

1. Click "Create Credentials" > "API Key"
2. **Copy your API Key** (you'll need this)
3. (Optional) Restrict the API key to Google Calendar API for security

### Step 4: Configure the Application

1. Open `src/config.js` in your editor
2. Replace the placeholder values:
   ```javascript
   export const GOOGLE_API_KEY = 'YOUR_ACTUAL_API_KEY';
   export const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   ```

### Step 5: Run the Application

```powershell
# Make sure you're in the weekly-planner directory
cd C:\Users\jeffr\weekly-planner

# Ensure Node.js is in PATH (if needed)
$env:Path += ";C:\Program Files\nodejs"

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## First-Time Usage

1. Click **"Sign In with Google"**
2. Choose your Google account
3. Review and grant calendar permissions
4. Your calendar events will appear in the weekly view!

## Troubleshooting

### "node" or "npm" not recognized
- Restart your PowerShell terminal after installing Node.js
- Or manually add to PATH: `$env:Path += ";C:\Program Files\nodejs"`

### API Key errors
- Verify you've enabled Google Calendar API in your Cloud Console
- Check that the API key is correctly copied to `src/config.js`

### OAuth errors
- Ensure `http://localhost:3000` is in authorized origins
- Make sure Client ID is correct
- Clear browser cache and try again

### No events showing
- Check you have events in your Google Calendar
- Verify you granted calendar access permissions
- Open browser console (F12) to see detailed error messages
