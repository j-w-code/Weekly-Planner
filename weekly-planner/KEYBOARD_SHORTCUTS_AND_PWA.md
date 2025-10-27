# Keyboard Shortcuts & PWA Features

## Keyboard Shortcuts

Weekly Planner now supports comprehensive keyboard shortcuts for faster navigation and actions.

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `←` (Left Arrow) | Go to previous week |
| `→` (Right Arrow) | Go to next week |
| `T` | Go to today (current week) |

### Action Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | Create new event |
| `S` | Create new sequence |
| `ESC` | Close any open modal/dialog |
| `?` or `Shift + /` | Show keyboard shortcuts help |

### Tips

- **Shortcuts work globally**: You can use navigation shortcuts from anywhere in the app
- **Input field safety**: Shortcuts don't trigger when typing in text fields (except ESC)
- **Help always available**: Press `?` anytime to see the full shortcuts list
- **Keyboard button**: Click the ⌨️ button in the header to view shortcuts

### Technical Implementation

- Custom `useKeyboardShortcuts` hook for managing shortcuts
- Proper cleanup on component unmount
- No interference with form inputs
- Support for modifier keys (Ctrl, Alt, Shift)

---

## PWA (Progressive Web App) Features

Weekly Planner is now a full Progressive Web App with offline capabilities and installability.

### Installation

#### Desktop (Chrome, Edge, Brave)
1. Look for the install icon (➕) in the address bar
2. Click it to install the app
3. Or click the "Install" prompt that appears at the bottom

#### Mobile (Chrome, Safari, Edge)
1. Tap the browser menu (⋮ or share icon)
2. Select "Add to Home Screen" or "Install App"
3. Follow the prompts

#### iOS Safari
1. Tap the Share button
2. Scroll and tap "Add to Home Screen"
3. Name the app and tap "Add"

### Features

#### ✅ Offline Support
- **App Shell Caching**: Core app files cached for instant loading
- **Network-First Strategy**: Always tries to fetch latest data
- **Fallback to Cache**: Works offline when network is unavailable
- **Smart Caching**: Only caches successful responses

#### ✅ Install Prompt
- Automatic prompt appears after first visit
- Dismissible and remembers your choice
- Beautiful native-like installation experience

#### ✅ Standalone Mode
- Runs in its own window (no browser UI)
- Appears in app launcher/Start menu
- Custom app icon and splash screen

#### ✅ Fast Loading
- Service worker caches assets
- Instant startup after first visit
- Optimized bundle size (77.46 KB gzipped)

### What Works Offline

✅ **Available Offline:**
- App shell and UI
- Navigation between weeks
- Viewing cached sequences
- Creating/editing sequences (stored locally)
- Keyboard shortcuts
- All UI interactions

❌ **Requires Connection:**
- Google Calendar authentication
- Fetching calendar events
- Creating/deleting calendar events
- Syncing sequences to cloud (feature not implemented)

### PWA Metadata

```json
{
  "name": "Weekly Planner - Google Calendar & Sequences",
  "short_name": "Weekly Planner",
  "theme_color": "#4285f4",
  "background_color": "#ffffff",
  "display": "standalone",
  "categories": ["productivity", "lifestyle", "utilities"]
}
```

### Technical Details

#### Service Worker
- **Cache Strategy**: Network-first for HTML, Cache-first for assets
- **Cache Names**: 
  - `weekly-planner-v1` (app shell)
  - `weekly-planner-runtime` (runtime cache)
- **Auto-Update**: Service worker updates automatically
- **Cache Cleanup**: Old caches automatically removed

#### Browser Support
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ⚠️ Safari Desktop (limited PWA support)

### Verification

#### Check Installation
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

#### Check Cache
```javascript
// In browser console
caches.keys().then(keys => {
  console.log('Caches:', keys);
});
```

#### Lighthouse Audit
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Check "Progressive Web App"
4. Click "Generate report"

### Troubleshooting

#### Service Worker Not Registering
- Make sure you're on HTTPS (or localhost)
- Check browser console for errors
- Clear site data and reload

#### Install Prompt Not Showing
- Already installed
- User dismissed it before (check localStorage)
- Browser doesn't support PWA
- Missing manifest or icons

#### Offline Mode Not Working
- Service worker may not be installed yet
- Check Network tab in DevTools
- Verify cache is populated

### Development

#### Testing Locally
```bash
# Build the app
npm run build

# Serve with service worker
npx serve -s build

# Visit http://localhost:3000
```

#### Debugging Service Worker
1. Chrome DevTools → Application tab
2. Service Workers section
3. Check status and cache storage
4. Use "Update on reload" for development

### Security

- Service worker only works on HTTPS
- Same-origin policy enforced
- Google API calls always use network (no caching)
- User data stays secure

---

## Best Practices

### For Users
1. **Install the app** for best experience
2. **Use keyboard shortcuts** for faster workflow
3. **Work offline** when needed (sequences only)
4. **Stay updated** - app auto-updates when online

### For Developers
1. **Update cache version** when deploying changes
2. **Test offline** before releasing
3. **Monitor service worker** errors
4. **Keep manifest updated** with new features

---

## Future Enhancements

Potential improvements:
- [ ] Background sync for offline changes
- [ ] Push notifications for events
- [ ] Offline calendar event creation queue
- [ ] Advanced caching strategies
- [ ] Share target API
- [ ] File system access API

---

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google: PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use: Service Worker](https://caniuse.com/serviceworkers)
- [Web.dev: Learn PWA](https://web.dev/learn/pwa/)

---

**Version:** 0.1.0  
**Last Updated:** January 27, 2025
