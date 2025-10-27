# 🛠️ Setup Guide - Weekly Planner

Complete guide to setting up the Weekly Planner application with Google Calendar API integration.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning) - [Download](https://git-scm.com/)
- **Google Account** - For Google Calendar API access

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd weekly-planner
```

Or download and extract the ZIP file.

---

## Step 2: Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

---

## Step 3: Google Cloud Console Setup

### 3.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `weekly-planner` (or your preferred name)
4. Click "Create"

### 3.2 Enable Google Calendar API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3.3 Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "API Key"
3. Copy the API key (starts with `AIza...`)
4. Click "Restrict Key" (recommended)
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Calendar API" from the dropdown
   - Click "Save"

### 3.4 Create OAuth 2.0 Client ID

1. Still in **Credentials**, click "Create Credentials" → "OAuth client ID"
2. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in:
     - App name: `Weekly Planner`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Add test users (your email) if needed
   - Click "Save and Continue"

3. Now create the OAuth client ID:
   - Application type: "Web application"
   - Name: `Weekly Planner Web Client`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - Add your production domain later
   - **Authorized redirect URIs:**
     - `http://localhost:3000`
   - Click "Create"

4. Copy the **Client ID** (format: `xxxx.apps.googleusercontent.com`)

---

## Step 4: Configure Environment Variables

### 4.1 Create .env File

In the project root directory, copy the example file:

```bash
cp .env.example .env
```

Or on Windows:

```powershell
copy .env.example .env
```

### 4.2 Add Your Credentials

Open `.env` in a text editor and replace the placeholder values:

```env
REACT_APP_GOOGLE_API_KEY=AIzaSyABC123...your-actual-api-key
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc...your-actual-client-id.apps.googleusercontent.com
```

⚠️ **IMPORTANT:** Never commit the `.env` file to version control!

---

## Step 5: Run the Application

### Development Mode

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## Step 6: First-Time Usage

### 6.1 Sign In

1. Open the application in your browser
2. Click "Sign In with Google"
3. **Grant Permissions:**
   - View and manage your Google Calendar
   - The app needs these permissions to read and write events

4. After authorization, you'll see your calendar events!

### 6.2 Add Your First Event

1. Click the "+ Add Event" button in the header
2. Or click the "+" button on any day
3. Fill in the event details
4. Click "Create Event"

---

## Verification Checklist

After setup, verify everything works:

- [ ] Application loads without errors
- [ ] Configuration validation passes (check browser console)
- [ ] Google Sign-In button appears
- [ ] Can sign in with Google account
- [ ] Events load from your calendar
- [ ] Can create new events
- [ ] Can delete events
- [ ] Week navigation works (Previous/Next/Today)

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

---

## Security Best Practices

### Production Deployment

1. **Use Environment Variables:**
   - Never hardcode API keys in source code
   - Use your hosting platform's environment variable system

2. **Update Authorized Origins:**
   - Add your production domain to Google Cloud Console
   - **APIs & Services** → **Credentials** → Edit OAuth client
   - Add `https://yourdomain.com` to authorized origins

3. **Restrict API Key:**
   - In Google Cloud Console, restrict the API key
   - Set HTTP referrer restrictions
   - Only allow requests from your domain

4. **Enable HTTPS:**
   - Always use HTTPS in production
   - Google OAuth requires HTTPS for production apps

### Environment Variables for Different Environments

Create multiple environment files:

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment

---

## Additional Configuration

### Week Start Day

By default, the week starts on Sunday. To change this:

Edit `src/config.js`:

```javascript
export const APP_CONFIG = {
  weekStartsOn: 1, // 0 = Sunday, 1 = Monday
  // ...
};
```

### Maximum Events

To change the number of events fetched:

```javascript
export const APP_CONFIG = {
  maxResults: 250, // Increase or decrease as needed
  // ...
};
```

---

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in the Vercel dashboard.

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

Add environment variables in the Netlify dashboard.

### GitHub Pages

Not recommended for this app due to OAuth redirect restrictions. Use a hosting service that supports SPAs with server-side routing.

---

## Development Tools

### React DevTools

Install the [React Developer Tools](https://react-devtools.netlify.app/) browser extension for debugging.

### ESLint

Run linting:

```bash
npm run lint
```

---

## Need Help?

- **Issues:** Check existing issues or create a new one
- **Documentation:** Review all `.md` files in the repository
- **Google Calendar API:** [Official Documentation](https://developers.google.com/calendar/api)

---

## Next Steps

- Customize the UI in `src/App.css` and component CSS files
- Add more features (recurring events, reminders, etc.)
- Integrate with other calendar services
- Deploy to production

**Congratulations! Your Weekly Planner is now set up and ready to use! 🎉**
