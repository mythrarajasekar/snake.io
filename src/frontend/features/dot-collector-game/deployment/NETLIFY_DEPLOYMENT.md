# Netlify Deployment Guide - Dot Collector Game

## Overview

This guide provides step-by-step instructions for deploying the Dot Collector Game to Netlify, a modern web hosting platform with excellent React support and built-in CI/CD.

**Platform**: Netlify
**Status**: ✓ Recommended alternative to Vercel
**Setup Time**: 3 minutes
**Cost**: Free tier available

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Netlify Account Setup](#netlify-account-setup)
3. [GitHub Repository Preparation](#github-repository-preparation)
4. [Connect Repository to Netlify](#connect-repository-to-netlify)
5. [Build Configuration](#build-configuration)
6. [Deploy](#deploy)
7. [Verify Deployment](#verify-deployment)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Environment Variables](#environment-variables)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Site Analytics](#site-analytics)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Requirements
- Node.js 18.x or higher
- npm 9.x or higher
- Git 2.30.0 or higher
- GitHub account

### GitHub Repository
- Repository created and pushed to GitHub
- Main branch set as default
- Code is up to date

---

## Netlify Account Setup

### Step 1: Create Netlify Account

1. Go to https://app.netlify.com/signup
2. Click **"GitHub"**
3. Authorize Netlify to access GitHub
   - Verifies your identity
   - Allows repo access
4. Click **"Authorize Netlify"**

### Step 2: Email Verification

1. Check your email
2. Click verification link
3. Email is now verified

### Step 3: Access Dashboard

Visit https://app.netlify.com

You should see:
- ✓ Your GitHub account connected
- ✓ Empty sites list
- ✓ Option to add new site

---

## GitHub Repository Preparation

### Ensure Code is Pushed

```bash
# Check remote
git remote -v
# Output: origin https://github.com/YOUR_USERNAME/dot-collector-game.git

# Push to GitHub
git push origin main
```

### Verify Files

Netlify will look for:
- ✓ `package.json` in root
- ✓ `public/index.html`
- ✓ Source files in `src/`

```bash
# Verify structure
ls -la package.json
ls -la public/
ls -la src/
```

---

## Connect Repository to Netlify

### Step 1: Create New Site

1. Go to https://app.netlify.com/
2. Click **"Add new site"** or **"New site from Git"**
3. Click **"Connect to Git provider"**

### Step 2: Select GitHub

1. Click **"GitHub"**
2. Authorize Netlify if prompted again
3. You should see your repositories

### Step 3: Choose Repository

1. Search for: `dot-collector-game`
2. Click the repository
3. Repository selected ✓

---

## Build Configuration

### Step 1: Netlify Build Settings

After selecting repository, you'll see:

#### Build Command
```
npm run build
```

#### Publish Directory
```
build
```

**These should be auto-detected.** If not, enter them manually.

#### Node Version (optional)
```
18.x
```

Click **"Show advanced"** if needed to set Node version.

### Step 2: Environment Variables (Optional)

Click **"New variable"** to add environment variables:

**Name**: `REACT_APP_ENV`
**Value**: `production`

Leave blank for this game (none required).

### Step 3: Advanced Settings (Optional)

You can configure:
- Deploy on push (automatic)
- Deploy previews (for PRs)
- Deploy notifications

All recommended defaults are fine.

---

## Deploy

### Step 1: Start Deployment

1. Review settings
2. Click **"Deploy site"**
3. Netlify starts build

### Step 2: Build Progress

You'll see:
```
Building...
npm install
npm run build
Optimizing...
✓ Build complete (45 seconds)
```

Expected output:
```
✓ Artifacts ready
✓ Deploying site
```

### Step 3: Deployment Complete

You'll see:
```
✓ Deploy complete
https://RANDOM-ID.netlify.app
Your site is live
```

**Your game is now live!**

---

## Verify Deployment

### Step 1: Visit Your Site

1. Click the URL: `https://RANDOM-ID.netlify.app`
2. Your game loads
3. Check console for errors (F12)

### Step 2: Functional Testing

- [ ] Start screen displays
- [ ] Click "Play" button
- [ ] Game starts
- [ ] Keyboard controls work
- [ ] Score displays and updates
- [ ] Timer counts down correctly
- [ ] Game over screen appears
- [ ] Restart button works

### Step 3: Performance Check

Open DevTools (F12):

**Network Tab**:
- [ ] All assets load (green)
- [ ] No 404 errors
- [ ] Load time < 500ms

**Performance Tab**:
- [ ] Frame rate ≥ 55 FPS
- [ ] Smooth animations
- [ ] No jank

**Console Tab**:
- [ ] No JavaScript errors
- [ ] No TypeScript errors

### Step 4: Responsive Design

Test viewport sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (1024x768)
- [ ] Mobile (390x844)

All should display correctly.

---

## Custom Domain Setup

### Prerequisites

- Domain name registered
- Access to domain's DNS settings

### Step 1: Add Domain in Netlify

1. Go to Netlify Dashboard
2. Click your site
3. Go to **Site Settings** → **Domain Management**
4. Click **"Add custom domain"**
5. Enter your domain: `dotcollector.game`
6. Click **"Verify"**

### Step 2: Configure DNS

Netlify shows two options:

#### Option 1: Nameservers (Recommended)
```
ns1.netlify.com
ns2.netlify.com
ns3.netlify.com
ns4.netlify.com
```

#### Option 2: A Record (Alternative)
```
Type: A
Name: @
Value: 75.2.60.5 (may vary)
TTL: 3600
```

### Step 3: Update Domain Registrar

1. Log into domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS settings
3. Add nameservers or A record from Netlify
4. Save changes

### Step 4: Wait for DNS

- DNS propagation: 5-30 minutes
- Netlify dashboard shows status
- SSL certificate auto-generated
- Once "Valid" shows, you're ready

### Step 5: Test Custom Domain

1. Visit `https://dotcollector.game`
2. Should load your game
3. SSL certificate shows green lock

---

## Environment Variables

### Add Environment Variables

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Add variable:
   - **Key**: `REACT_APP_ENV`
   - **Value**: `production`
4. Click **"Save"**

### Variable Format

Only variables prefixed with `REACT_APP_` are available in React:

```
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
REACT_APP_DEBUG=false
```

### Using Variables

In your React code:
```typescript
console.log(process.env.REACT_APP_ENV);  // "production"
```

---

## CI/CD Pipeline

### Automatic Deployments

Every push to GitHub automatically deploys:

```
git push origin main
↓
GitHub webhook → Netlify
↓
Netlify builds: npm run build
↓
Deploy to production
↓
https://DOMAIN.netlify.app updates
```

Deployment time: 1-3 minutes

### Preview Deployments

Pull requests get automatic preview URLs:

```
Create PR on GitHub
↓
Netlify builds preview
↓
PR comment with preview URL
↓
Test before merging
↓
Merge to main → goes live
```

### Deployment Logs

View build logs:

1. Go to Netlify Dashboard
2. Click **"Deploys"**
3. Click a deployment
4. Click **"Deploy log"** to see:
   - npm install output
   - Build command output
   - Deployment status
   - Any errors

---

## Site Analytics

### Netlify Analytics

Netlify includes basic analytics:

1. Go to **Site Settings** → **Analytics**
2. Enable analytics
3. View dashboard:
   - Page views
   - Visitors
   - Bandwidth usage
   - Error rates

### Detailed Metrics

For advanced metrics, integrate:

**Option 1: Netlify built-in**
- Basic page view tracking
- Visitor counts

**Option 2: Google Analytics**
```html
<!-- Add to public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Option 3: Sentry (Error Tracking)**
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN"
});
```

---

## netlify.toml Configuration

Create `netlify.toml` in project root for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = "build"
  node_version = "18.x"

[build.environment]
  REACT_APP_ENV = "production"

# Redirect for single-page app
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Cache settings
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

Push this file to GitHub and Netlify will use it.

---

## Troubleshooting

### Build Fails

#### Error: "npm ERR!"

**Solution**:
```bash
# Test build locally
npm ci
npm run build

# If fails locally, fix before pushing
git push origin main
```

#### Error: "Cannot find module"

**Solution**:
```bash
# Check dependencies installed
npm list

# Install missing packages
npm install

# Push changes
git add package-lock.json
git push origin main
```

### Deployment Issues

#### Site Shows Old Version

**Solution**:
1. Go to Netlify → Deploys
2. Click "Trigger deploy"
3. Select "Deploy site" from Git
4. Wait for new deployment

#### Custom Domain Not Working

**Solution**:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 30 min)
3. Check "Status" in Domain settings
4. If still not working, try:
   - Clear browser cache
   - Try different browser
   - Wait another 15 minutes

### Performance Issues

#### Slow Build

**Solution**:
1. Check build time in "Deploy log"
2. If > 3 min, something is slow
3. Possible causes:
   - Large dependencies (`npm ls`)
   - Slow network
   - Large assets

#### Slow Page Load

**Solution**:
```bash
# Analyze bundle
npm run build:analyze

# Check for:
# 1. Unused dependencies
# 2. Large packages
# 3. Duplicate packages
```

### Static Files Not Uploading

**Solution**:
1. Ensure files in `public/` directory
2. Build locally: `npm run build`
3. Check `build/` has assets
4. Push to GitHub and redeploy

---

## Rollback

If deployment has issues, rollback quickly:

1. Go to **Deploys**
2. Find previous stable deployment
3. Click its checkbox
4. Click **"Restore"**
5. Previous version is live

Or via GitHub:
```bash
git revert <commit-hash>
git push origin main
# Netlify redeploys automatically
```

---

## Performance Optimization

### 1. Cache Headers

Set in netlify.toml:
```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### 2. Gzip Compression

Automatically enabled by Netlify.

### 3. HTTP/2

Automatically enabled on all deployments.

### 4. Image Optimization

For future images:
```bash
npm install --save-dev image-webpack-loader
```

---

## Monitoring Checklist

### Daily
- [ ] Site loads without errors
- [ ] Game is playable
- [ ] No console errors

### Weekly
- [ ] Check deploy logs for warnings
- [ ] Monitor analytics
- [ ] Check build time trends

### Monthly
- [ ] Dependency updates (`npm update`)
- [ ] Security audit (`npm audit`)
- [ ] Performance review

---

## Best Practices

### 1. Use Netlify Toml

Keep configuration in git:
```bash
# Create netlify.toml
echo '[build]
command = "npm run build"
publish = "build"' > netlify.toml

git add netlify.toml
git commit -m "Add Netlify config"
git push origin main
```

### 2. Review Deploy Previews

Every PR gets a preview URL:
- Test thoroughly before merging
- Check responsive design
- Verify performance

### 3. Monitor Error Logs

1. Go to Deploy log
2. Look for warnings
3. Address any issues
4. Redeploy if needed

### 4. Keep Dependencies Updated

Monthly:
```bash
npm update
npm audit fix
git push origin main
```

### 5. Use Environment Variables

For different configs:
```
REACT_APP_ENV=production  (in Netlify dashboard)
REACT_APP_ENV=development (in .env local)
```

---

## Advanced Configuration

### Custom Headers

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### Redirects

```toml
# Redirect old URL to new
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

### Functions (Serverless)

For future API endpoints:
```
netlify/functions/api.js
```

---

## Support & Resources

### Documentation
- https://docs.netlify.com/
- https://docs.netlify.com/git/overview/
- https://docs.netlify.com/site-deploys/overview/

### Support
- https://support.netlify.com/
- Chat support in Netlify dashboard

### Community
- Stack Overflow tag: `netlify`
- GitHub Discussions: netlify/netlify-cli

---

## Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Setup | 3 min | 2 min |
| Build | npm run build | npm run build |
| Analytics | Basic | Advanced |
| Pricing | Free tier | Free tier |
| Preview URLs | Yes | Yes |
| Recommended | ✓ Good | ✓ Best |

---

## Summary

**Deployment Complete**:
- ✓ Account created
- ✓ Repository connected
- ✓ Site deployed
- ✓ Custom domain set up (optional)
- ✓ Auto-deploy enabled

**Your Game**:
- Netlify URL: `https://RANDOM-ID.netlify.app`
- Custom domain: `https://dotcollector.game` (if set up)
- Auto-deploys on main branch push
- Preview URLs for all PRs

**Next Steps**:
- Monitor analytics
- Gather user feedback
- Plan improvements
- Update dependencies monthly

---

**Last Updated**: 2026-05-06
**Maintained By**: DevOps Team

