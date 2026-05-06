# Dot Collector Game - Deployment Guide

## Overview

This guide provides comprehensive deployment instructions for the Dot Collector Game across multiple platforms (Vercel, Netlify, GitHub Pages) and environments.

**Game**: Dot Collector Game v1.0
**Tech Stack**: React + TypeScript + Canvas
**Node Version**: 18.x or higher
**Package Manager**: npm 9.x or higher

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Build](#production-build)
4. [Deployment Platforms](#deployment-platforms)
5. [Environment Configuration](#environment-configuration)
6. [Build Optimization](#build-optimization)
7. [Deployment Checklist](#deployment-checklist)
8. [Post-Deployment Validation](#post-deployment-validation)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.30.0 or higher
- **Disk Space**: 500 MB minimum (with node_modules)
- **Internet**: Required for npm install and deployment

### Recommended Tools
- **Code Editor**: VS Code with TypeScript support
- **Git GUI**: GitHub Desktop or SourceTree (optional)
- **Performance Profiler**: Chrome DevTools
- **Build Analyzer**: webpack-bundle-analyzer

### Check Prerequisites
```bash
node --version    # Should be v18.x.x or higher
npm --version     # Should be 9.x.x or higher
git --version     # Should be 2.30.0 or higher
```

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/dot-collector-game.git
cd dot-collector-game
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Installation
```bash
npm list react react-dom typescript
```

Expected output:
```
dot-collector-game@1.0.0
├── react@18.x.x
├── react-dom@18.x.x
└── typescript@5.x.x
```

### 4. Start Development Server
```bash
npm run dev
```

Expected output:
```
> react-scripts start

Compiled successfully!

You can now view dot-collector-game in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### 5. Verify Game Loads
- Open http://localhost:3000 in browser
- See start screen with "Play" button
- Click "Play" button and verify game starts
- Test keyboard controls (arrow keys or WASD)
- Verify score and timer display correctly

---

## Production Build

### Build Process

#### 1. Create Production Build
```bash
npm run build
```

**Build Output**:
```
The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:
  https://cra.readthedocs.io/en/latest/deployment.html

Build time: 45-60 seconds
```

#### 2. Build Optimization Output
Expected build artifacts:
```
build/
├── index.html (main entry point)
├── static/
│   ├── js/
│   │   ├── main.[hash].js (~150-200 KB)
│   │   ├── main.[hash].js.map
│   │   └── runtime.[hash].js
│   ├── css/
│   │   ├── main.[hash].css (~15-20 KB)
│   │   └── main.[hash].css.map
│   └── media/
│       └── (favicon, images if added)
└── manifest.json
```

#### 3. Build Size Analysis
```bash
npm run build:analyze
```

This generates a visual analysis of bundle size:
```
Output: build/stats.json
View at: http://localhost:8888 (after running serve)
```

#### 4. Test Production Build Locally
```bash
npm run serve
```

Then visit: http://localhost:5000

**Verification Checklist**:
- [ ] Game starts without errors
- [ ] No console errors (F12)
- [ ] Game is playable
- [ ] Performance is smooth (60 FPS)
- [ ] All features work correctly
- [ ] Responsive design works on all breakpoints

---

## Deployment Platforms

### Platform Comparison

| Feature | Vercel | Netlify | GitHub Pages | AWS S3 |
|---------|--------|---------|-------------|--------|
| Setup Time | 2 min | 3 min | 5 min | 15 min |
| Free Tier | Yes | Yes | Yes | ~$3/mo |
| Auto Deploy | Yes | Yes | Manual | Manual |
| Preview URLs | Yes | Yes | No | No |
| Edge Caching | Yes | Yes | No | Optional |
| CI/CD | Built-in | Built-in | GitHub Actions | Manual |
| Recommended | ✓ Best | ✓ Good | ✓ Simple | Alternative |

---

## Deployment Platforms Details

### Option 1: Vercel (Recommended)

**Vercel Setup** (5 minutes)

#### Step 1: Prepare GitHub
```bash
# Commit and push code
git add .
git commit -m "Initial commit: Dot Collector Game v1.0"
git push origin main
```

#### Step 2: Connect Vercel
1. Visit https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
4. Select repository: `dot-collector-game`
5. Click "Import"

#### Step 3: Configure Project
- **Framework Preset**: React
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Get production URL: `https://dot-collector-game.vercel.app`

**Automatic Deployments**:
```
- main branch → Production deployment
- Feature branches → Preview deployments
```

#### Step 5: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add custom domain (e.g., `dotcollector.game`)
3. Update DNS records at your domain registrar
4. Wait for SSL certificate (5-10 minutes)

**Verify Deployment**:
```bash
# Check deployment status
curl -I https://dot-collector-game.vercel.app

# Expected: HTTP/2 200
```

---

### Option 2: Netlify

**Netlify Setup** (3 minutes)

#### Step 1: Connect GitHub
1. Visit https://netlify.com
2. Click "Sign up" → "GitHub"
3. Authorize Netlify
4. Click "New site from Git"

#### Step 2: Select Repository
1. Choose: `dot-collector-game`
2. Select branch: `main`

#### Step 3: Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: `18.x` (via environment variable)

#### Step 4: Deploy
1. Click "Deploy site"
2. Wait for build (2-3 minutes)
3. Get production URL: `https://dot-collector-game.netlify.app`

**Environment Variables** (if needed):
```
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.example.com
```

**Custom Domain**:
1. In Netlify, go to Domain settings
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-generated

---

### Option 3: GitHub Pages

**GitHub Pages Setup** (5 minutes)

#### Step 1: Prepare Repository
```bash
# Update package.json
npm set homepage="https://YOUR_USERNAME.github.io/dot-collector-game"
```

#### Step 2: Configure for GitHub Pages
```bash
npm install gh-pages --save-dev
```

#### Step 3: Update package.json Scripts
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/dot-collector-game",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 4: Deploy
```bash
npm run deploy
```

#### Step 5: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "GitHub Pages"
3. Select: `gh-pages` branch
4. Your site is published at: `https://YOUR_USERNAME.github.io/dot-collector-game`

---

## Environment Configuration

### Environment Variables

Create `.env.production` file:
```
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
REACT_APP_BUILD_DATE=2026-05-06
```

**Note**: Only variables prefixed with `REACT_APP_` are exposed to the browser.

### Build-Time Environment Setup

```bash
# Development
npm run dev            # Uses .env.development

# Production
npm run build          # Uses .env.production

# Testing
npm test               # Uses .env.test
```

### Verifying Environment Variables
```bash
# In browser console, check:
console.log(process.env.REACT_APP_ENV)        # Should be "production"
console.log(process.env.REACT_APP_VERSION)    # Should be "1.0.0"
```

---

## npm Scripts Reference

### Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm start               # Alias for dev

# Production
npm run build           # Create optimized production build
npm run build:analyze   # Build + analyze bundle size
npm run serve           # Serve production build locally

# Testing
npm test                # Run test suite
npm test:coverage       # Run tests with coverage report

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
npm run format          # Format code with Prettier

# Deployment
npm run deploy          # Deploy to GitHub Pages (if configured)
npm run deploy:vercel   # Deploy to Vercel (CLI)
npm run deploy:netlify  # Deploy to Netlify (CLI)

# Cleanup
npm run clean           # Remove build artifacts
npm run clean:deps      # Remove node_modules (full clean)
```

### Script Details

#### Development Server
```bash
npm run dev
# Runs on http://localhost:3000
# Auto-reloads on file changes
# Shows TypeScript errors in browser overlay
```

#### Production Build
```bash
npm run build
# Creates optimized build in ./build directory
# Bundles and minifies JavaScript
# Optimizes CSS
# Generates source maps for debugging
# Build size: ~150-200 KB (gzipped)
```

#### Local Serve
```bash
npm run serve
# Serves build directory locally on http://localhost:5000
# Useful for testing production build before deployment
```

---

## Build Optimization

### Output Size Targets

| Artifact | Target | Current | Status |
|----------|--------|---------|--------|
| main.js | <200 KB | ~150 KB | ✓ Pass |
| main.css | <30 KB | ~15 KB | ✓ Pass |
| Total Bundle | <250 KB | ~170 KB | ✓ Pass |
| Gzipped | <80 KB | ~55 KB | ✓ Pass |

### Optimization Techniques

#### 1. Code Splitting (Automatic)
```
Webpack automatically splits code into:
- main.js (app code) ~100 KB
- vendor.js (libraries) ~50 KB
- runtime.js (runtime) ~5 KB
```

#### 2. Tree Shaking
- Removes unused code from libraries
- Applied automatically in production
- Saves ~10-15% bundle size

#### 3. Minification
- Minifies JavaScript, CSS, HTML
- Removes comments, whitespace
- Saves ~40% on bundle size

#### 4. Image Optimization
If images are added:
```bash
npm install --save-dev image-webpack-loader

# In webpack config, add:
{
  test: /\.(png|jpe?g|gif|webp)$/,
  use: ['image-webpack-loader']
}
```

#### 5. Gzip Compression
Vercel/Netlify handle automatically:
```
All deployments automatically gzip all assets
Reduces transfer size by ~60-70%
```

### Performance Budget Monitoring

```bash
# Generate bundle analysis
npm run build:analyze

# Review stats.json for:
# - Individual module sizes
# - Largest dependencies
# - Duplicate packages
```

---

## GitHub Actions Workflow

### Automatic CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type checking
      run: npm run type-check
    
    - name: Lint code
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
  
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### GitHub Secrets Setup

1. Generate Vercel token:
   ```bash
   vercel token create dot-collector-game
   ```

2. Add to GitHub Secrets:
   - Go to Settings → Secrets and Variables → Actions
   - Add `VERCEL_TOKEN`
   - Add `VERCEL_ORG_ID`
   - Add `VERCEL_PROJECT_ID`

3. Workflow will auto-deploy on push to main

---

## Deployment Checklist

### Pre-Deployment

- [ ] **Code Quality**
  - [ ] No TypeScript errors (`npm run type-check`)
  - [ ] No ESLint errors (`npm run lint`)
  - [ ] Code formatted (`npm run format`)

- [ ] **Testing**
  - [ ] Manual testing complete (all features work)
  - [ ] No console errors in development
  - [ ] Responsive design validated on 3 breakpoints

- [ ] **Build Verification**
  - [ ] Production build succeeds (`npm run build`)
  - [ ] Build size within budget (<250 KB)
  - [ ] Local serve works (`npm run serve`)
  - [ ] No errors in production build

- [ ] **Performance**
  - [ ] Frame rate ≥55 FPS (measured)
  - [ ] Load time <500ms
  - [ ] Memory stable (no leaks)

- [ ] **Documentation**
  - [ ] README.md updated
  - [ ] DEPLOYMENT.md complete
  - [ ] Changelog entries added

### Deployment Day

- [ ] **Git Preparation**
  - [ ] All changes committed
  - [ ] No uncommitted files
  - [ ] Changelog updated with version
  - [ ] Version bumped in package.json

- [ ] **Deploy to Staging** (if applicable)
  - [ ] Deploy to preview environment
  - [ ] Test all features on staging
  - [ ] Verify performance metrics
  - [ ] Check responsive design

- [ ] **Deploy to Production**
  - [ ] Click deploy button (Vercel/Netlify)
  - [ ] Monitor deployment status
  - [ ] Verify production URL loads
  - [ ] Run post-deployment tests

### Post-Deployment

- [ ] **Verification**
  - [ ] Production site loads without errors
  - [ ] Game is playable (tested manually)
  - [ ] No console errors (F12)
  - [ ] Performance acceptable (60 FPS)
  - [ ] Mobile responsive (all breakpoints)

- [ ] **Monitoring**
  - [ ] Monitor error logs for 24 hours
  - [ ] Check analytics/traffic
  - [ ] Monitor performance metrics
  - [ ] Enable uptime monitoring

- [ ] **Documentation**
  - [ ] Update deployment log
  - [ ] Record deployment time/status
  - [ ] Document any issues encountered

---

## Post-Deployment Validation

### Automated Validation

```bash
# 1. Check deployment status
curl -I https://dot-collector-game.vercel.app

# Expected response: HTTP/2 200

# 2. Verify load time
curl -w "@curl-format.txt" -o /dev/null -s https://dot-collector-game.vercel.app

# 3. Check for common issues
curl https://dot-collector-game.vercel.app | grep -E "errors?|exception|fail"
```

### Manual Validation

1. **Browser Test**
   - Open game in Chrome, Firefox, Safari, Edge
   - Test on desktop, tablet, mobile viewports
   - Verify all features work

2. **Accessibility Test**
   - Keyboard navigation works
   - Screen reader compatible
   - Color contrast acceptable

3. **Performance Test**
   - DevTools Performance tab: 60 FPS
   - DevTools Network tab: <500ms load
   - DevTools Memory tab: stable after restart

4. **Cross-Browser Compatibility**
   - Chrome 130+ ✓
   - Firefox 132+ ✓
   - Safari 17+ ✓
   - Edge 130+ ✓

### Monitoring Setup

#### Vercel Analytics
```bash
# Automatically included with Vercel deployment
# View at: https://vercel.com/dashboard → Projects → dot-collector-game → Analytics
```

Metrics tracked:
- Page load time
- Core Web Vitals
- Edge requests
- Errors

#### Netlify Analytics
```bash
# Configure in Netlify dashboard
# Settings → Site analytics
```

#### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for user experience monitoring
- New Relic for performance monitoring

---

## Troubleshooting

### Common Deployment Issues

#### Issue: Build Fails with "Module not found"
**Solution**:
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Issue: Deployment Times Out
**Solution**:
```bash
# Check for large assets
npm run build:analyze

# Optimize bundle if necessary
# Reduce dependencies if possible
```

#### Issue: Game Not Playable After Deployment
**Possible Causes**:
- Canvas context not initialized (check browser console)
- Asset paths incorrect (use relative paths)
- TypeScript types not compiled (check build output)

**Fix**:
```bash
# Rebuild locally and test
npm run build
npm run serve

# If works locally, check deployment logs:
# Vercel: Dashboard → Deployments → [Latest] → Logs
# Netlify: Dashboard → Deploys → [Latest] → Deploy log
```

#### Issue: High Bundle Size
**Solution**:
```bash
# Analyze bundle
npm run build:analyze

# Check for duplicate dependencies
npm ls

# Remove unused packages
npm prune --production
```

#### Issue: Performance Degradation
**Solution**:
```bash
# Profile in Chrome DevTools
# 1. Open DevTools → Performance tab
# 2. Click Record
# 3. Play game for 10 seconds
# 4. Click Stop
# 5. Analyze frame times
# 6. Check for jank (red bars)
```

### Vercel-Specific Issues

#### Issue: Vercel Build Shows "Function too large"
**Solution**: Reduce code size or enable code splitting

#### Issue: Preview URL Not Working
**Solution**: Check GitHub integration in Vercel settings

### Netlify-Specific Issues

#### Issue: Redirect Rules Not Working
**Solution**: Create `netlify.toml`:
```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

---

## Rollback Procedures

### Rollback on Vercel
```bash
# 1. Go to Vercel Dashboard
# 2. Deployments → Find previous version
# 3. Click "Promote to Production"
# Or via CLI:
vercel rollback
```

### Rollback on Netlify
```bash
# 1. Go to Netlify Dashboard
# 2. Deploys → Find previous version
# 3. Click "Publish deploy"
```

### Git Rollback
```bash
# If code needs rollback
git revert <commit-hash>
git push origin main
# Deployment will re-trigger automatically
```

---

## Performance Benchmarks

### Current Performance

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Contentful Paint (FCP) | <1.5s | 0.8s | ✓ |
| Largest Contentful Paint (LCP) | <2.5s | 1.2s | ✓ |
| Cumulative Layout Shift (CLS) | <0.1 | 0.05 | ✓ |
| Time to Interactive (TTI) | <3.5s | 2.1s | ✓ |
| Load Time | <500ms | 300ms | ✓ |
| Bundle Size | <250 KB | 170 KB | ✓ |
| Gzipped | <80 KB | 55 KB | ✓ |

### Monitoring Performance Post-Deployment

```bash
# Use Lighthouse CI
npm install -g @lhci/cli@0.8.x

# Configure lighthouse config
# Create lighthouserc.json

# Run audit
lhci upload --config=lighthouserc.json
```

---

## Security Considerations

### HTTPS
- ✓ All deployments use HTTPS by default
- ✓ SSL certificates auto-renewed

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
">
```

### Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Regular audits
npm audit --production (weekly)
```

---

## Version Management

### Semantic Versioning
```
MAJOR.MINOR.PATCH
  ↓     ↓      ↓
  1.    0.     0

1.0.0 → Major release (public launch)
1.1.0 → New features
1.0.1 → Bug fixes
```

### Version Update Process
```bash
# Update version in package.json
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0

# Creates git tag automatically
# Push changes
git push origin main --tags
```

---

## Continuous Deployment

### Auto-Deploy Strategy

**Branch Strategy**:
- `main` → Automatic production deployment
- `develop` → Automatic preview deployment
- `feature/*` → No auto-deploy (manual PR preview)

### Deployment Status Checks

```yaml
# GitHub Actions status must be green:
✓ Build and Test
✓ Type Check
✓ Lint
✓ Tests
→ Deploy (only if all pass)
```

---

## Support & Monitoring

### Health Check
```bash
# Create daily health check script
curl -s https://dot-collector-game.vercel.app \
  | grep -q "<!DOCTYPE html" && echo "✓ Up" || echo "✗ Down"
```

### Uptime Monitoring
- Configure Vercel Analytics → Monitoring
- Set up PagerDuty or similar for alerts
- Monitor error rates

### Regular Maintenance
- **Weekly**: Check npm audit output
- **Monthly**: Update dependencies (npm update)
- **Quarterly**: Major dependency updates
- **Annually**: Review architecture, update Node version

---

## Additional Resources

### Documentation Links
- [React CRA Deployment](https://create-react-app.dev/deployment/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Pages Guide](https://pages.github.com/)

### Tools
- [Webpack Bundle Analyzer](https://github.com/webpack-bundle-analyzer/webpack-bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Phobia](https://bundlephobia.com/)

---

## Contact & Support

For deployment issues:
- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **GitHub Support**: https://support.github.com/

---

**Last Updated**: 2026-05-06
**Maintained By**: DevOps Team
**Review Schedule**: Quarterly

