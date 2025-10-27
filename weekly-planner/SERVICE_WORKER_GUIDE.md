# Service Worker Guide

## Overview

The Weekly Planner uses a service worker to enable Progressive Web App (PWA) capabilities including offline functionality, faster load times, and installability.

---

## Service Worker Location

**File:** `public/service-worker.js`

This file is served from the public directory and registered in `src/index.js`.

---

## Cache Strategy

The service worker uses two caching strategies:

### 1. Network-First Strategy (HTML)
- **Applied to:** All HTML files (navigation requests)
- **Behavior:** Attempts to fetch from network first, falls back to cache if offline
- **Reason:** Ensures users always get the latest version when online

### 2. Cache-First Strategy (Assets)
- **Applied to:** JS, CSS, images, fonts
- **Behavior:** Serves from cache first, falls back to network if not cached
- **Reason:** Fast loading for static assets that don't change often

### Exclusions
- **Google APIs:** Always fetched from network (never cached)
- **External CDNs:** Fetched from network
- **Dynamic content:** Calendar events and user data not cached

---

## Cache Versioning

### Current Version

```javascript
const CACHE_NAME = 'weekly-planner-v1';
```

Located at: **Line 4** of `public/service-worker.js`

### When to Update Cache Version

You MUST update the cache version when:

1. ✅ **Updating JavaScript bundles** (new features, bug fixes)
2. ✅ **Changing CSS styles** (UI updates)
3. ✅ **Modifying HTML structure** (index.html changes)
4. ✅ **Adding/removing static assets** (images, fonts)
5. ✅ **Service worker logic changes** (caching strategy updates)

You DON'T need to update when:

1. ❌ Only changing backend API endpoints
2. ❌ Updating environment variables (not in cached files)
3. ❌ Changing README or documentation

---

## Deployment Checklist

### Before Deploying

- [ ] Review changes to determine if cache update needed
- [ ] If needed, increment cache version
- [ ] Test locally that service worker updates correctly
- [ ] Verify offline functionality works

### Updating Cache Version

**Step 1:** Open `public/service-worker.js`

**Step 2:** Increment the version number:

```javascript
// Before
const CACHE_NAME = 'weekly-planner-v1';

// After
const CACHE_NAME = 'weekly-planner-v2';
```

**Version Naming Convention:**
- Minor updates (bug fixes): v1 → v1.1 → v1.2
- Feature updates: v1 → v2 → v3
- Major releases: v1 → v10 → v20

**Step 3:** The service worker automatically:
1. Detects the new version
2. Installs the new service worker
3. Deletes old caches
4. Activates the new service worker

### After Deploying

- [ ] Clear browser cache and test
- [ ] Verify service worker update in DevTools (Application → Service Workers)
- [ ] Test offline functionality
- [ ] Check browser console for errors

---

## Testing Service Worker Updates

### In Development

```bash
npm start
```

1. Open DevTools → Application → Service Workers
2. Check "Update on reload" for easier testing
3. Make changes to `service-worker.js`
4. Reload page
5. Verify new service worker activated

### In Production Build

```bash
npm run build
npx serve -s build
```

1. Open app in browser
2. Open DevTools → Application → Service Workers
3. Note current version
4. Update cache version in `service-worker.js`
5. Rebuild: `npm run build`
6. Restart server
7. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
8. Verify new version activated

---

## Debugging Service Worker

### View Service Worker Status

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers" in left sidebar
4. See status, version, and controls

**Firefox:**
1. Open DevTools (F12)
2. Go to Application tab (may be under "..." menu)
3. Click "Service Workers"

### Common Issues

#### Issue: Service Worker Not Updating

**Symptoms:**
- Old version still active after deployment
- Changes not reflected

**Solutions:**
1. Increment cache version
2. Hard refresh browser (Ctrl+Shift+R)
3. Unregister old service worker in DevTools
4. Clear all cache storage

#### Issue: Offline Mode Not Working

**Symptoms:**
- White screen when offline
- Console errors about failed fetches

**Solutions:**
1. Verify service worker is active
2. Check cache contains necessary files
3. Verify no errors in service worker console
4. Ensure HTTPS is being used (required for service workers)

#### Issue: Old Content Cached

**Symptoms:**
- Old CSS styles persist
- Old JavaScript behavior

**Solutions:**
1. **Immediate fix:** Increment cache version
2. Deploy new build
3. Clear browser cache on client side

---

## Cache Management

### Automatic Cleanup

The service worker automatically:
- Deletes old cache versions on activation
- Only keeps the current version

### Manual Cache Clearing

**For Users:**
```
DevTools → Application → Storage → Clear Site Data
```

**For Developers:**
```javascript
// In browser console
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

---

## Best Practices

### 1. Always Increment Version on Deployment

```javascript
// ✅ Good: Clear versioning
const CACHE_NAME = 'weekly-planner-v1';
const CACHE_NAME = 'weekly-planner-v2';

// ❌ Bad: Timestamps (hard to track)
const CACHE_NAME = 'weekly-planner-20250127';
```

### 2. Test Before Deploying

Always test service worker updates locally before production deployment.

### 3. Document Changes

Keep a changelog of cache version updates:

```
v1 → v2: Added keyboard shortcuts feature
v2 → v3: Fixed calendar sync bug
v3 → v4: Updated PWA install prompt UI
```

### 4. Monitor Service Worker Errors

Check browser console and error tracking for service worker issues.

### 5. Consider User Impact

- Service worker updates happen on next page load
- Users may need to refresh to see changes
- Consider showing "Update Available" notification

---

## Cache Version History

| Version | Date | Changes |
|---------|------|---------|
| v1 | 2025-01-27 | Initial PWA implementation with keyboard shortcuts |

**Update this table when incrementing cache version.**

---

## Service Worker Lifecycle

### 1. **Install**
- Triggered when new service worker detected
- Caches all necessary files
- Prepares for activation

### 2. **Waiting**
- New service worker installed but not active yet
- Waits for old service worker to finish
- User may need to close all tabs

### 3. **Activate**
- Old service worker stopped
- New service worker takes control
- Old caches deleted
- New version now serving requests

### 4. **Fetch**
- Intercepts all network requests
- Applies caching strategies
- Returns cached or network responses

---

## Production Optimization

### Reducing Cache Size

**Current approach:** Selective caching
- Only cache app shell (HTML, CSS, JS)
- Don't cache dynamic content
- Don't cache external APIs

**If cache grows too large:**
1. Review cached assets
2. Implement cache size limits
3. Use cache expiration strategies

### Cache Expiration (Future Enhancement)

```javascript
// Potential future implementation
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Add timestamp check in fetch handler
const cachedResponse = await cache.match(event.request);
if (cachedResponse) {
  const cachedTime = cachedResponse.headers.get('sw-cache-time');
  if (Date.now() - cachedTime > MAX_CACHE_AGE) {
    // Fetch fresh version
  }
}
```

---

## Troubleshooting Commands

### Check Service Worker Registration

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Active service workers:', registrations);
});
```

### Unregister Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### View Cache Contents

```javascript
// In browser console
caches.keys().then(keys => {
  console.log('Cache keys:', keys);
  keys.forEach(key => {
    caches.open(key).then(cache => {
      cache.keys().then(requests => {
        console.log(`${key} contains:`, requests.map(r => r.url));
      });
    });
  });
});
```

---

## Security Considerations

### HTTPS Required

Service workers only work on HTTPS (or localhost for development).

**Development:** `http://localhost:3000` ✅  
**Production:** `https://yourapp.com` ✅  
**Production:** `http://yourapp.com` ❌

### No Sensitive Data in Cache

- ✅ Cache public assets (HTML, CSS, JS, images)
- ❌ Don't cache authentication tokens
- ❌ Don't cache user personal data
- ❌ Don't cache API responses with sensitive info

---

## Future Enhancements

### Planned Features

1. **Background Sync**
   - Queue failed requests when offline
   - Sync when connection restored

2. **Push Notifications**
   - Calendar event reminders
   - Sequence notifications

3. **Cache Expiration**
   - Auto-refresh old cached content
   - Time-based invalidation

4. **Precaching**
   - Cache critical resources immediately
   - Faster first load

---

## References

- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google: Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)
- [PWA Best Practices](https://web.dev/pwa/)

---

**Last Updated:** January 27, 2025  
**Maintainer:** Weekly Planner Development Team
