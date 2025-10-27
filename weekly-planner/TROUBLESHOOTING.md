# 🔧 Troubleshooting Guide

Common issues and their solutions for the Weekly Planner application.

---

## Configuration Issues

### ❌ "Configuration validation failed" Error

**Symptoms:**
- Error in browser console: "CRITICAL: REACT_APP_GOOGLE_API_KEY is not set"
- Application shows loading screen indefinitely

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   # Check if .env exists in project root
   ls -la | grep .env  # Mac/Linux
   dir | findstr .env  # Windows
   ```

2. **Check .env file contents:**
   - Open `.env` file
   - Ensure it contains both keys:
     ```env
     REACT_APP_GOOGLE_API_KEY=AIzaSy...
     REACT_APP_GOOGLE_CLIENT_ID=123456...apps.googleusercontent.com
     ```

3. **Restart development server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm start
   ```

   ⚠️ **Important:** Environment variables are read only at startup. You must restart the server after modifying `.env`.

---

## Authentication Issues

### ❌ "Sign In with Google" Button Doesn't Appear

**Possible Causes:**
1. API hasn't finished loading
2. Invalid Client ID

**Solutions:**

1. **Check browser console for errors**
2. **Verify Client ID format:**
   - Must end with `.apps.googleusercontent.com`
   - Example: `123456789-abc123xyz.apps.googleusercontent.com`

3. **Clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data

---

### ❌ OAuth Error: "redirect_uri_mismatch"

**Error Message:**
```
Error 400: redirect_uri_mismatch
The redirect URI in the request: http://localhost:3000 does not match...
```

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000`
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
6. Click **Save**
7. Wait 5-10 minutes for changes to propagate
8. Try signing in again

---

### ❌ "Access Blocked: This app's request is invalid"

**Causes:**
- OAuth consent screen not configured
- App not added to test users (for unverified apps)

**Solutions:**

1. **Configure OAuth Consent Screen:**
   - Google Cloud Console → **APIs & Services** → **OAuth consent screen**
   - Fill in all required fields
   - Add your email as a test user

2. **For Development:**
   - User type: "External"
   - Publishing status: "Testing"
   - Add your Google account as a test user

---

## API Issues

### ❌ Events Not Loading

**Symptoms:**
- Signed in successfully
- Week view shows "No events" for all days
- Events exist in your Google Calendar

**Solutions:**

1. **Check API Key restrictions:**
   - Google Cloud Console → **Credentials** → Click your API Key
   - Under "API restrictions", ensure Google Calendar API is selected
   - If "None" is selected, the key might be over-restricted elsewhere

2. **Verify Calendar API is enabled:**
   - Google Cloud Console → **APIs & Services** → **Library**
   - Search "Google Calendar API"
   - Should show "API enabled" (if not, click "Enable")

3. **Check browser console:**
   ```javascript
   // Look for errors like:
   // "Error fetching events: ..."
   ```

4. **Verify you have events in the current week:**
   - Open [Google Calendar](https://calendar.google.com/)
   - Check if events exist in the displayed week

---

### ❌ "Failed to Create Event" Error

**Possible Causes:**
- Insufficient permissions
- Invalid event data
- Network issues

**Solutions:**

1. **Re-authorize the app:**
   - Sign out
   - Sign in again
   - Grant all requested permissions

2. **Check OAuth scope:**
   - Should be: `https://www.googleapis.com/auth/calendar`
   - NOT: `https://www.googleapis.com/auth/calendar.readonly`

3. **Check form validation:**
   - Title is required
   - End time must be after start time
   - Check browser console for validation errors

---

### ❌ API Quota Exceeded

**Error Message:**
```
Error 403: Rate Limit Exceeded
```

**Solutions:**

1. **Check quota usage:**
   - Google Cloud Console → **APIs & Services** → **Dashboard**
   - Click "Google Calendar API"
   - View quota usage

2. **Request quota increase:**
   - In quota page, click "Request increase"
   - Fill out the form

3. **Temporary workaround:**
   - Reduce `maxResults` in `src/config.js`
   - Wait for quota to reset (usually daily)

---

## Browser-Specific Issues

### ❌ Application Not Loading in Safari

**Issue:** White screen or errors

**Solutions:**

1. **Enable cross-site tracking:**
   - Safari → Preferences → Privacy
   - Uncheck "Prevent cross-site tracking" (temporarily for localhost)

2. **Clear Safari cache:**
   - Safari → Preferences → Privacy → Manage Website Data
   - Remove All

3. **Try incognito mode:**
   - File → New Private Window

---

### ❌ Modals Not Closing with Escape Key (Firefox)

**Solution:**

1. Update to latest Firefox version
2. Check browser console for JavaScript errors
3. Disable browser extensions that might interfere

---

## Build & Deployment Issues

### ❌ Build Fails: "Module not found"

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json  # Mac/Linux
   # Or
   rmdir /s node_modules && del package-lock.json  # Windows
   
   npm install
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

### ❌ Production Build Doesn't Load

**Symptoms:**
- `npm run build` succeeds
- But production app shows blank page

**Solutions:**

1. **Check environment variables:**
   - Production builds need environment variables set
   - For Vercel/Netlify: Add in dashboard
   - For custom hosting: Set server environment variables

2. **Check HTTPS requirement:**
   - Google OAuth requires HTTPS in production
   - Ensure your domain has valid SSL certificate

3. **Update authorized origins:**
   - Add production URL to Google Cloud Console
   - **Credentials** → OAuth client → **Authorized JavaScript origins**
   - Add `https://yourdomain.com`

---

## Performance Issues

### ❌ App Feels Slow

**Solutions:**

1. **Check number of events:**
   - If you have >250 events per week, increase `maxResults`
   - Or implement pagination

2. **Clear browser cache**

3. **Check network tab:**
   - Open DevTools → Network
   - Look for slow API requests

4. **Reduce week range:**
   - Edit `src/config.js`
   - Reduce `maxResults`

---

## Development Issues

### ❌ Hot Reload Not Working

**Solutions:**

1. **Restart development server:**
   ```bash
   npm start
   ```

2. **Check file system:**
   - Some file systems (like network drives) don't support file watching

3. **Disable browser extensions:**
   - Some extensions interfere with hot reload

---

### ❌ ESLint Warnings/Errors

**Common Warnings:**

1. **"React Hook useEffect has a missing dependency"**
   - Solution: Add missing dependency to dependency array
   - Or use ESLint disable comment if intentional

2. **"'variable' is defined but never used"**
   - Solution: Remove unused imports/variables
   - Or prefix with underscore: `_unusedVar`

---

## Getting Help

### Before Asking for Help

1. **Check browser console** (F12 → Console tab)
2. **Check network tab** (F12 → Network tab)
3. **Review this troubleshooting guide**
4. **Check existing GitHub issues**

### How to Report an Issue

Include:

1. **Environment:**
   - OS (Windows, Mac, Linux)
   - Browser and version
   - Node.js version (`node --version`)

2. **Steps to reproduce**

3. **Expected vs actual behavior**

4. **Console errors** (screenshot or copy-paste)

5. **Network errors** (if applicable)

---

## Emergency Reset

If nothing else works:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Delete all build artifacts and dependencies
rm -rf node_modules build .env
rm package-lock.json

# 3. Reinstall from scratch
npm install

# 4. Copy environment file
cp .env.example .env

# 5. Add your credentials to .env

# 6. Start fresh
npm start
```

---

## Still Having Issues?

- 📧 Create an issue on GitHub
- 📚 Check [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- 💬 Ask in the project discussions

**Remember:** Most issues are related to Google Cloud Console configuration. Double-check all settings there first!
