# Security Incident Report - Google API Key Exposure

**Date:** January 27, 2025  
**Time:** 22:13 UTC  
**Severity:** 🔴 **CRITICAL**  
**Status:** ⚠️ **PARTIALLY RESOLVED - ACTION REQUIRED**

---

## Incident Summary

A Google API key was accidentally committed and pushed to the public GitHub repository, detected by GitHub Secret Scanning approximately 1 hour after exposure.

---

## Incident Details

### What Was Exposed

**Secret Type:** Google API Key  
**Value:** `AIzaSyADt3mh905po1LySFmo_PyXrszGCfVAJoA`  
**File:** `weekly-planner/CONFIG_SUMMARY.md`  
**Line:** 22  
**Commit:** Included in repository cleanup push

### Detection

**Detected By:** GitHub Secret Scanning  
**Detection Time:** ~1 hour after commit  
**Alert Status:** Open (1 Open, 0 Closed)  
**Visibility:** Public repository

### Timeline

```
Time            Event
────────────────────────────────────────────────────────
~21:00 UTC      Key committed to CONFIG_SUMMARY.md
~21:05 UTC      Changes pushed to GitHub (main branch)
~22:00 UTC      GitHub Secret Scanning detected exposure
22:13 UTC       Alert discovered by developer
22:15 UTC       Key removed from CONFIG_SUMMARY.md
22:16 UTC       Security fix committed and pushed
22:17 UTC       This incident report created
```

**Exposure Duration:** ~1 hour (from push to fix)

---

## Risk Assessment

### ⚠️ Severity: CRITICAL

**Reasons:**
1. ✅ Public repository - accessible to anyone
2. ✅ Valid API key - can be used immediately
3. ✅ Google Calendar API access - can read/write calendar data
4. ⚠️ Key restrictions unknown - may have broad access
5. ⚠️ Usage limits unknown - potential for abuse

### Potential Impact

**High Risk:**
- ❌ Unauthorized access to Google Calendar API
- ❌ Data exfiltration (calendar events, user data)
- ❌ Quota exhaustion (API rate limits)
- ❌ Financial costs if API usage exceeds free tier

**Medium Risk:**
- ⚠️ Service disruption if quota exhausted
- ⚠️ Reputation damage
- ⚠️ Compliance issues (data privacy)

**Low Risk:**
- ℹ️ Key appears to be restricted to Calendar API only
- ℹ️ OAuth flow still required for user data access
- ℹ️ Development/testing key (not production)

---

## Immediate Actions Taken

### ✅ 1. Key Removed from Repository

**Action:** Removed exposed key from CONFIG_SUMMARY.md  
**Commit:** `8aaedc8`  
**Status:** ✅ Complete  
**Verification:** `git grep "AIzaSyADt3mh905po1LySFmo"` returns empty

### ✅ 2. Fix Pushed to GitHub

**Action:** Pushed security fix to main branch  
**Status:** ✅ Complete  
**Result:** Current repository no longer contains exposed key

### ✅ 3. Incident Documented

**Action:** Created this security incident report  
**Status:** ✅ Complete  

---

## 🚨 CRITICAL ACTIONS STILL REQUIRED

### ❗ 1. REVOKE THE EXPOSED API KEY IMMEDIATELY

**This is the most critical step and must be done NOW!**

**Steps:**

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Find the exposed key:**
   - Project: `day-planner-476114`
   - Key value starts with: `AIzaSyADt3mh905po1LySFmo_PyXrszGCfVAJoA`

3. **Delete the key:**
   - Click on the key
   - Click **"Delete"** button
   - Confirm deletion

**Why This is Critical:**
- Even though removed from repository, the key is still valid
- Anyone who cloned/viewed the repository has the key
- Git history still contains the key (requires force push to remove)
- Bots scan GitHub for exposed keys constantly

### ❗ 2. Generate New API Key

**After revoking the old key:**

1. In Google Cloud Console, click **"Create Credentials"**
2. Select **"API Key"**
3. Copy the new key immediately
4. **Restrict the key:**
   - Application restrictions: HTTP referrers (websites)
   - Add: `http://localhost:3000/*`
   - API restrictions: Google Calendar API only

### ❗ 3. Update Application Configuration

**Option A: Environment Variable (Recommended)**

1. Create `.env.local` in project root:
   ```bash
   REACT_APP_GOOGLE_API_KEY=your_new_key_here
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   ```

2. Update `src/config.js` to read from env:
   ```javascript
   export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
   export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
   ```

3. Restart development server

**Option B: Direct Configuration (Less Secure)**

1. Update `src/config.js` with new key
2. **DO NOT** commit this file with the actual key
3. Add `src/config.js` to `.gitignore` or use a template

### ❗ 4. Monitor for Unauthorized Usage

**Check Google Cloud Console for unusual activity:**

1. Go to: https://console.cloud.google.com/apis/dashboard
2. Select project: `day-planner-476114`
3. Check **API usage metrics** for:
   - Unusual traffic spikes
   - Requests from unexpected locations
   - High error rates
   - Quota exhaustion

**Monitoring Period:** 7 days minimum

### ❗ 5. Review Other Secrets

**Check for other exposed credentials:**

```bash
# Search for potential secrets
git grep -i "api.*key"
git grep -i "client.*secret"
git grep -i "password"
git grep -i "token"
```

**Files to check:**
- CONFIG_SUMMARY.md ✅ Fixed
- src/config.js ⚠️ May contain keys
- .env files ✅ Not committed (.gitignore)
- Documentation files ⚠️ Review all

---

## Git History Cleanup (Optional but Recommended)

The exposed key is still in git history. To completely remove it:

### Option 1: BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror git@github.com:j-w-code/Weekly-Planner.git

# Remove the secret
java -jar bfg.jar --replace-text passwords.txt Weekly-Planner.git

# Force push
cd Weekly-Planner.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option 2: git filter-branch

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch CONFIG_SUMMARY.md" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**⚠️ Warning:** This rewrites history and requires force push

---

## Prevention Measures

### ✅ Implemented

1. ✅ Created `.env.example` template
2. ✅ `.gitignore` configured for `.env*` files
3. ✅ Security incident documented

### 🔄 To Implement

1. **Pre-commit Hooks**
   ```bash
   npm install --save-dev husky lint-staged
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

2. **Secret Scanning Tools**
   - Install `git-secrets` or `detect-secrets`
   - Scan commits before pushing
   - Block commits containing patterns like API keys

3. **Code Review Process**
   - Always review diffs before committing
   - Check for hardcoded credentials
   - Use `git diff --cached` before commit

4. **Documentation Updates**
   - Update README with security guidelines
   - Add section on credential management
   - Document .env.local usage

5. **CI/CD Integration**
   - Add secret scanning to CI pipeline
   - Fail builds if secrets detected
   - Use GitHub Secret Scanning

---

## Lessons Learned

### What Went Wrong

1. ❌ API key committed to documentation file
2. ❌ No pre-commit scanning in place
3. ❌ Key not using environment variables
4. ❌ Repository cleanup included sensitive files

### What Went Right

1. ✅ GitHub Secret Scanning detected exposure quickly
2. ✅ Response was immediate (within minutes)
3. ✅ Key removed and fix pushed quickly
4. ✅ Incident properly documented

### Improvements Needed

1. **Never commit secrets** - Use .env files exclusively
2. **Pre-commit scanning** - Catch secrets before push
3. **Regular audits** - Check for exposed credentials
4. **Education** - Review security best practices
5. **Automation** - Implement secret scanning tools

---

## Verification Checklist

### Immediate Actions

- [x] Key removed from CONFIG_SUMMARY.md
- [x] Fix committed and pushed
- [x] Incident documented
- [ ] **OLD KEY REVOKED** ⚠️ **CRITICAL - DO THIS NOW**
- [ ] New key generated with restrictions
- [ ] Application updated with new key
- [ ] Application tested with new key

### Monitoring

- [ ] Check Google Cloud Console for unusual activity (Days 1-7)
- [ ] Monitor API usage metrics daily
- [ ] Review access logs
- [ ] Check for quota exhaustion

### Long-term

- [ ] Implement pre-commit hooks
- [ ] Install secret scanning tools
- [ ] Update documentation with security guidelines
- [ ] Review and update .gitignore
- [ ] Educate team on credential management

---

## Additional Resources

### Google Cloud Security

- [Managing API Keys](https://cloud.google.com/docs/authentication/api-keys)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys#securing)
- [Revoking API Keys](https://cloud.google.com/docs/authentication/api-keys#delete)

### GitHub Security

- [Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

### Tools

- [git-secrets](https://github.com/awslabs/git-secrets)
- [detect-secrets](https://github.com/Yelp/detect-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [gitleaks](https://github.com/gitleaks/gitleaks)

---

## Contact Information

**If you notice unauthorized activity:**

1. Immediately revoke all API keys
2. Review Google Cloud audit logs
3. Contact Google Cloud Support
4. Document all findings
5. Consider filing incident report with authorities if needed

**Google Cloud Support:**
- https://cloud.google.com/support

---

## Incident Status

**Current Status:** ⚠️ **PARTIALLY RESOLVED**

**Pending Actions:**
1. 🔴 **CRITICAL:** Revoke exposed API key in Google Cloud Console
2. 🟡 **HIGH:** Generate new restricted API key
3. 🟡 **HIGH:** Update application with new key
4. 🟢 **MEDIUM:** Monitor for unusual activity (7 days)
5. 🟢 **LOW:** Implement prevention measures

**Resolution Date:** TBD (when all actions complete)

---

## Sign-off

**Incident Reported By:** AI Code Analyzer + Developer  
**Date:** January 27, 2025  
**Time:** 22:17 UTC  

**Next Review:** January 28, 2025 (24 hours after incident)

---

## Appendix: Commands Used

### Remove Key from Repository
```bash
# Edit CONFIG_SUMMARY.md to remove key
git add CONFIG_SUMMARY.md
git commit -m "security: Remove exposed Google API key"
git push origin main
```

### Verify Key Removed
```bash
git grep "AIzaSyADt3mh905po1LySFmo"
# Should return empty
```

### Check Git History
```bash
git log --all --source --full-history -- CONFIG_SUMMARY.md
```

### Search for Other Secrets
```bash
git grep -i "api.*key"
git grep -i "AIza"
```

---

**⚠️ CRITICAL REMINDER: The exposed key is still valid until you revoke it in Google Cloud Console!**

**Do this immediately:** https://console.cloud.google.com/apis/credentials
