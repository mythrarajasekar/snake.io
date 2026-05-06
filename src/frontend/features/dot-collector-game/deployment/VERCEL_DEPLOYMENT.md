# Vercel Deployment Guide - Dot Collector Game

## Overview

This guide provides step-by-step instructions for deploying the Dot Collector Game to Vercel, a modern serverless hosting platform optimized for React applications.

**Platform**: Vercel
**Recommended**: ✓ Best choice for React
**Setup Time**: 5 minutes
**Cost**: Free tier available

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Account Setup](#vercel-account-setup)
3. [GitHub Repository Preparation](#github-repository-preparation)
4. [Connect Repository to Vercel](#connect-repository-to-vercel)
5. [Configuration](#configuration)
6. [Deploy](#deploy)
7. [Verify Deployment](#verify-deployment)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Environment Variables](#environment-variables)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Requirements
- Node.js 18.x or higher
- npm 9.x or higher
- Git 2.30.0 or higher
- GitHub account (free)

### GitHub Repository
- Repository created and initialized
- Code pushed to GitHub
- Main branch set as default

---

## Vercel Account Setup

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
   - Vercel will request permission to:
     - Access public repositories
     - Access private repositories (if needed)
     - Access user profile information
4. Click **"Authorize Vercel"**

### Step 2: Verify Email

1. Check your email (same as GitHub account)
2. Click verification link in Vercel email
3. You're now ready to deploy!

### Step 3: Vercel Dashboard

Visit https://vercel.com/dashboard

You should see:
- ✓ Your GitHub username connected
- ✓ Option to import projects

---

## GitHub Repository Preparation

### Ensure Code is on GitHub

```bash
# Check remote is configured
git remote -v
# Output: origin https://github.com/YOUR_USERNAME/dot-collector-game.git

# Push to main branch
git push origin main
```

### Verify package.json

```bash
# Check package.json structure
cat package.json | head -20
```

Expected:
```json
{
  "name": "dot-collector-game",
  "version": "1.0.0",
  "homepage": "https://dot-collector-game.vercel.app",
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "start": "react-scripts start"
  }
}
```

### README.md Present

```bash
# Verify README exists
ls -la README.md
```

---

## Connect Repository to Vercel

### Step 1: Start Import

1. Go to https://vercel.com/dashboard
2. Click **"New Project"** or **"Import Project"**
3. Click **"Select Repository"**

### Step 2: Choose Repository

1. Search for: `dot-collector-game`
2. Click the repository name
3. Click **"Import"**

### Step 3: Vercel Import Dialog

Vercel will auto-detect:
- ✓ Framework: React (detected)
- ✓ Build Command: `npm run build`
- ✓ Output Directory: `build`
- ✓ Install Command: `npm install`

**All settings should be correct automatically.**

---

## Configuration

### Step 1: Project Settings

In the import dialog:

#### Root Directory
- Default: `./` (correct)
- Leave as is

#### Build & Development Settings

Should show:
```
Framework: React
Build Command: npm run build
Output Directory: build
Install Command: npm install
Development Command: npm run dev
```

**All correct - no changes needed.**

### Step 2: Environment Variables (Optional)

If you have environment variables:

1. Click **"Environment Variables"**
2. Add each variable:
   ```
   Name: REACT_APP_ENV
   Value: production
   ```
3. Add to environments: Production, Preview

For this game, no environment variables are strictly required.

### Step 3: Advanced Settings (Optional)

You can set:
- Root directory (if not in repo root)
- Build cache (keep default: 24 hours)
- Function region (keep default)

---

## Deploy

### Step 1: Start Deployment

1. Review all settings
2. Click **"Deploy"**
3. Vercel shows build progress

### Step 2: Build Phase (2-3 minutes)

You'll see:
```
Building...
npm install
npm run build
Generating static files...
✓ Build complete
```

Expected:
```
Analyzed build output size: 150 KB
Build Time: 45 seconds
```

### Step 3: Deployment Complete

You'll see:
```
✓ Production Deployment
Your project is live!
https://dot-collector-game.vercel.app
```

**Your game is now live!**

---

## Verify Deployment

### Step 1: Visit Production URL

1. Click the production URL or visit: `https://dot-collector-game.vercel.app`
2. Game should load
3. Check for errors (F12 → Console)

### Step 2: Test Functionality

- [ ] Start screen displays
- [ ] Click "Play" button
- [ ] Game starts
- [ ] Controls work (arrow keys or WASD)
- [ ] Score updates
- [ ] Timer counts down
- [ ] Game over screen appears
- [ ] Restart works

### Step 3: Check Performance

Open DevTools (F12):

**Network Tab**:
- [ ] All assets load (no red ✗)
- [ ] Load time < 500ms
- [ ] No 404 errors

**Performance Tab**:
- [ ] Frame rate ≥ 55 FPS
- [ ] Smooth scrolling
- [ ] No jank observed

**Console Tab**:
- [ ] No errors
- [ ] No warnings (if possible)

### Step 4: Cross-Browser Test

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

---

## Custom Domain Setup

### Prerequisites

- Domain name registered (e.g., `dotcollector.game`)
- Access to domain registrar (GoDaddy, Namecheap, etc.)

### Step 1: Add Domain in Vercel

1. Go to Vercel Dashboard
2. Select your project: `dot-collector-game`
3. Go to **Settings** → **Domains**
4. Click **"Add"**
5. Enter your domain: `dotcollector.game`
6. Click **"Add Domain"**

### Step 2: Configure DNS

Vercel will show DNS records to add:

**Nameserver Setup** (Recommended):
```
ns1.vercel.com
ns2.vercel.com
ns3.vercel.com
ns4.vercel.com
```

Or **A Record** (if nameservers not supported):
```
Type: A
Name: @
Value: 76.76.19.165
TTL: 3600
```

### Step 3: Update Domain Registrar

1. Log into your domain registrar
2. Go to DNS settings
3. Add the nameservers or A record
4. Save changes

### Step 4: Wait for DNS Propagation

- DNS can take 5-30 minutes to propagate
- Check status in Vercel dashboard
- Once it shows "Valid Configuration":
  - [ ] SSL certificate will be auto-generated
  - [ ] Your domain is live

### Step 5: Verify Custom Domain

1. Visit `https://dotcollector.game` (your domain)
2. Should redirect to your deployment
3. SSL certificate active (green lock)
4. Game loads and works

---

## Environment Variables

### Adding Environment Variables

1. Go to Vercel Dashboard → Project → Settings
2. Scroll to **Environment Variables**
3. Click **"Add New"**
4. Fill in:
   - **Name**: `REACT_APP_ENV`
   - **Value**: `production`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **"Save"**

### Available Environment Variables

Only variables prefixed with `REACT_APP_` are exposed to the browser:

```
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
REACT_APP_DEBUG=false
```

### Using in Code

```typescript
console.log(process.env.REACT_APP_ENV);      // "production"
console.log(process.env.REACT_APP_VERSION);  // "1.0.0"
```

---

## CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys:

**Push to main branch**:
```bash
git push origin main
↓
GitHub webhook triggers Vercel
↓
Vercel builds and deploys to production
↓
https://dot-collector-game.vercel.app is updated
```

**Status**: Shows in Vercel dashboard instantly

### Preview Deployments

Every pull request automatically gets a preview URL:

```bash
git checkout -b feature/new-feature
git commit -m "New feature"
git push origin feature/new-feature
↓
GitHub creates pull request
↓
Vercel builds preview deployment
↓
Comment on PR with preview URL: https://dot-collector-game-feature-123.vercel.app
```

### Deployment Status

Check in Vercel dashboard:
- Green checkmark ✓ = Deployment successful
- Orange circle ⊙ = Deployment in progress
- Red X ✗ = Deployment failed

### View Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on a deployment
3. Click **"View Build Logs"** to see:
   - npm install output
   - Build command output
   - Any errors or warnings

---

## Monitoring & Analytics

### Vercel Analytics

Analytics are included with Vercel.

#### View Analytics

1. Go to Vercel Dashboard → Project
2. Click **"Analytics"**
3. View metrics:
   - Core Web Vitals
   - Page load time
   - Edge requests
   - Bandwidth usage

#### Metrics Tracked

| Metric | Target | Monitor |
|--------|--------|---------|
| First Contentful Paint (FCP) | <1.5s | Real Users |
| Largest Contentful Paint (LCP) | <2.5s | Real Users |
| Cumulative Layout Shift (CLS) | <0.1 | Real Users |
| Edge Requests | N/A | Total requests |

### Error Tracking

Vercel doesn't include built-in error tracking. Consider:

**Option 1: Sentry** (Free tier)
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
```

**Option 2: LogRocket** (Free tier)
```javascript
import LogRocket from 'logrocket';

LogRocket.init('YOUR_LOGROCKET_ID');
```

---

## Troubleshooting

### Build Failures

#### Error: "Module not found"

**Solution**:
```bash
# Check locally first
npm ci
npm run build

# If this fails locally, fix it first
# Then push to GitHub
git add .
git commit -m "Fix build"
git push origin main
```

#### Error: "Build timeout"

**Solution**:
```bash
# Reduce build time
# 1. Check for large dependencies
npm ls

# 2. Remove unused dependencies
npm prune

# 3. Rebuild and push
git push origin main
```

### Performance Issues

#### Slow Build

**Solution**:
- Check build command in Vercel settings
- Ensure it matches `npm run build`
- Check for large source maps

#### Slow Page Load

**Solution**:
```bash
# Analyze bundle
npm run build:analyze

# Check for:
# 1. Large dependencies
# 2. Unused code
# 3. Duplicate packages
```

### Deployment Issues

#### Site Not Accessible

**Solution**:
1. Check Vercel dashboard for failed build (red X)
2. Click deployment to see build logs
3. Fix errors and redeploy

#### Custom Domain Not Working

**Solution**:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 30 minutes)
3. Check "Valid Configuration" shows in Vercel
4. Clear browser cache (Ctrl+Shift+Delete)

### Rollback to Previous Version

If latest deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous stable deployment
3. Click three dots (⋯)
4. Click **"Promote to Production"**
5. Previous version is now live

---

## Monitoring Checklist

### Daily
- [ ] Check for new deployments in dashboard
- [ ] Monitor error logs
- [ ] Spot-check production URL

### Weekly
- [ ] Review analytics
- [ ] Check build time trends
- [ ] Monitor bundle size

### Monthly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Security audit (npm audit)

---

## Best Practices

### 1. Use Preview Deployments

Always test in preview before merging to main:
```bash
git checkout -b feature/new-feature
# Make changes
git commit -am "New feature"
git push origin feature/new-feature
# Create PR, wait for preview URL, test thoroughly
# Then merge to main
```

### 2. Monitor Build Time

Vercel shows build time on dashboard:
- Target: < 2 minutes
- If increasing, check what changed

### 3. Watch Bundle Size

Vercel shows size on dashboard:
- Target: < 250 KB
- If increasing, use `npm run build:analyze`

### 4. Use Env Vars for Configuration

**Bad**:
```javascript
const API_URL = "https://api.example.com"; // Hardcoded
```

**Good**:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

### 5. Keep main Branch Stable

- [ ] Only merge tested code to main
- [ ] Use feature branches for development
- [ ] Review PRs before merging
- [ ] main branch should always be deployable

---

## Additional Resources

### Vercel Docs
- https://vercel.com/docs
- https://vercel.com/docs/git
- https://vercel.com/docs/concepts/git/monorepos

### React Deployment
- https://create-react-app.dev/deployment/
- https://create-react-app.dev/docs/deployment/

### Performance Optimization
- https://web.dev/performance/
- https://developer.chrome.com/docs/lighthouse/

---

## Summary

**What You've Done**:
1. ✓ Created Vercel account
2. ✓ Connected GitHub repository
3. ✓ Configured project settings
4. ✓ Deployed to production
5. ✓ Verified deployment
6. ✓ Set up custom domain (optional)
7. ✓ Configured CI/CD pipeline

**Your Game is Live**:
- Production URL: `https://dot-collector-game.vercel.app`
- Custom domain: `https://dotcollector.game` (if configured)
- Auto-deploys on push to main
- Preview URLs for PRs

**Next Steps**:
- Monitor analytics in Vercel dashboard
- Gather user feedback
- Plan next features
- Monitor performance metrics

---

## Support

For issues:
- **Vercel Support**: https://vercel.com/support
- **GitHub Support**: https://support.github.com/
- **Stack Overflow**: Tag `vercel` and `react`

---

**Last Updated**: 2026-05-06
**Maintained By**: DevOps Team

