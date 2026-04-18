# CI/CD Pipeline Guide

Complete guide to setting up and using GitHub Actions CI/CD pipeline for automated testing, building, and deployment.

---

## 📋 Overview

This guide explains the automated CI/CD pipeline that:

- ✅ Lints code on every push
- ✅ Runs tests automatically
- ✅ Scans for security vulnerabilities
- ✅ Builds backend and frontend
- ✅ Deploys to staging (develop branch)
- ✅ Deploys to production (main branch)
- ✅ Runs performance tests
- ✅ Sends Slack notifications
- ✅ Creates database backups
- ✅ Runs health checks

**Result:** Your code is automatically tested, built, and deployed without manual intervention!

---

## 🎯 Pipeline Overview

```
Push to GitHub
       ↓
┌─────────────────────────────────────────┐
│         CONTINUOUS INTEGRATION          │
├─────────────────────────────────────────┤
│  ✅ Lint Code                           │
│  ✅ Run Tests                           │
│  ✅ Security Scan                       │
│  ✅ Build Backend                       │
│  ✅ Build Frontend                      │
└─────────────────────────────────────────┘
       ↓
  All tests pass?
       ├─ NO  → Notify Slack (FAIL)
       └─ YES → Continue
       ↓
┌─────────────────────────────────────────┐
│       CONTINUOUS DEPLOYMENT             │
├─────────────────────────────────────────┤
│  develop branch → Deploy to Staging     │
│  main branch → Deploy to Production     │
└─────────────────────────────────────────┘
       ↓
  Deployment successful?
       ├─ NO  → Rollback + Notify
       └─ YES → Notify Slack (SUCCESS)
       ↓
  ✅ App is live!
```

---

## 🔧 Setup Instructions

### Step 1: Create GitHub Secrets

GitHub Actions needs secrets to deploy and notify. Add these to your repository:

1. **Go to GitHub repository**
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"
   - Click "New repository secret"

2. **Add Railway Secrets**
   ```
   RAILWAY_TOKEN_STAGING
   RAILWAY_TOKEN_PRODUCTION
   RAILWAY_PROJECT_ID_STAGING
   RAILWAY_PROJECT_ID_PRODUCTION
   ```

   **How to get Railway tokens:**
   - Go to Railway dashboard
   - Click your profile (top right)
   - Click "Account" → "API Tokens"
   - Create new token
   - Copy token value

3. **Add Database URLs**
   ```
   DATABASE_URL_STAGING
   DATABASE_URL_PRODUCTION
   ```

   **How to get database URLs:**
   - Go to Railway PostgreSQL service
   - Click "Variables" tab
   - Copy DATABASE_URL value

4. **Add Slack Webhook**
   ```
   SLACK_WEBHOOK_URL
   ```

   **How to get Slack webhook:**
   - Go to Slack workspace
   - Create incoming webhook
   - Copy webhook URL

5. **Add AWS Credentials** (for backups)
   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_BACKUP_BUCKET
   ```

6. **Add Frontend Environment Variables**
   ```
   VITE_API_URL
   VITE_STRIPE_PUBLISHABLE_KEY
   ```

7. **Add Production URLs**
   ```
   PRODUCTION_API_URL
   PRODUCTION_URL
   STAGING_URL
   ```

8. **Add Security Scanning** (optional)
   ```
   SNYK_TOKEN
   ```

### Step 2: Create Workflow File

The workflow file is already created at `.github/workflows/ci-cd.yml`

This file defines all the pipeline steps.

### Step 3: Create Performance Config

The Lighthouse config is already created at `lighthouserc.json`

This file defines performance testing thresholds.

### Step 4: Add npm Scripts

Make sure your `package.json` has these scripts:

```json
{
  "scripts": {
    "lint:server": "eslint src --ext .ts",
    "lint:client": "eslint client/src --ext .tsx",
    "format:check": "prettier --check .",
    "test:server": "jest --coverage",
    "test:client": "vitest --coverage",
    "build:server": "tsc && node -r esbuild-register src/index.ts",
    "build:client": "cd client && npm run build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "dev": "ts-node src/index.ts"
  }
}
```

### Step 5: Test the Pipeline

1. **Make a test commit**
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin develop
   ```

2. **Watch pipeline run**
   - Go to GitHub repository
   - Click "Actions" tab
   - Watch workflow run in real-time

3. **Check results**
   - All jobs should pass (green checkmarks)
   - Slack notification should appear
   - Staging should be deployed

---

## 📊 Pipeline Stages

### Stage 1: Lint & Format Check (2 min)

**What it does:**
- Runs ESLint on backend code
- Runs ESLint on frontend code
- Checks code formatting
- Fails if linting errors found

**Why it matters:**
- Ensures code quality
- Catches errors early
- Maintains consistent style

**If it fails:**
- Fix linting errors locally
- Run `npm run lint:server` and `npm run lint:client`
- Commit and push again

---

### Stage 2: Unit Tests (5 min)

**What it does:**
- Starts test PostgreSQL database
- Runs backend tests
- Runs frontend tests
- Uploads coverage reports
- Fails if tests fail

**Why it matters:**
- Ensures code works correctly
- Catches regressions
- Maintains test coverage

**If it fails:**
- Run tests locally: `npm test`
- Fix failing tests
- Commit and push again

---

### Stage 3: Security Scan (3 min)

**What it does:**
- Runs npm audit
- Scans for vulnerabilities
- Checks dependencies
- Warns about security issues

**Why it matters:**
- Finds security vulnerabilities
- Prevents dependency attacks
- Keeps app secure

**If it fails:**
- Review security warnings
- Update vulnerable packages
- Commit and push again

---

### Stage 4: Build Backend (3 min)

**What it does:**
- Compiles TypeScript
- Bundles code
- Creates production build
- Uploads build artifact

**Why it matters:**
- Ensures code compiles
- Catches build errors early
- Creates deployable artifact

**If it fails:**
- Check TypeScript errors
- Fix compilation issues
- Commit and push again

---

### Stage 5: Build Frontend (3 min)

**What it does:**
- Builds React app
- Optimizes assets
- Creates production bundle
- Uploads build artifact

**Why it matters:**
- Ensures frontend builds
- Optimizes for production
- Creates deployable artifact

**If it fails:**
- Check build errors
- Fix React issues
- Commit and push again

---

### Stage 6: Deploy to Staging (5 min)

**Triggers on:** Push to `develop` branch

**What it does:**
- Downloads build artifacts
- Deploys to Railway staging
- Runs database migrations
- Sends Slack notification

**Why it matters:**
- Tests deployment process
- Validates in production-like environment
- Catches deployment issues early

**If it fails:**
- Check Railway logs
- Verify environment variables
- Fix issues and push again

---

### Stage 7: Deploy to Production (5 min)

**Triggers on:** Push to `main` branch

**What it does:**
- Downloads build artifacts
- Creates database backup
- Deploys to Railway production
- Runs database migrations
- Runs health check
- Creates GitHub release
- Sends Slack notification

**Why it matters:**
- Automatically deploys to production
- Creates backup before deployment
- Verifies deployment health
- Tracks releases

**If it fails:**
- Check Railway logs
- Verify environment variables
- Rollback if needed
- Fix issues and push again

---

### Stage 8: Performance Test (5 min)

**Triggers on:** Push to `develop` branch

**What it does:**
- Runs Lighthouse performance tests
- Tests accessibility
- Tests best practices
- Runs load tests
- Uploads results

**Why it matters:**
- Ensures good performance
- Checks accessibility
- Validates best practices
- Catches performance regressions

**If it fails:**
- Review Lighthouse report
- Optimize performance
- Commit and push again

---

## 🌳 Branch Strategy

### Main Branch (Production)

**Purpose:** Production-ready code

**Rules:**
- Only merge tested code
- Requires pull request review
- Runs full CI/CD pipeline
- Automatically deploys to production

**Workflow:**
```
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Create pull request
5. Pipeline runs (tests, lint, build)
6. Code review
7. Merge to main
8. Pipeline deploys to production
```

### Develop Branch (Staging)

**Purpose:** Staging environment for testing

**Rules:**
- Merge from feature branches
- Runs full CI/CD pipeline
- Automatically deploys to staging
- Used for integration testing

**Workflow:**
```
1. Create feature branch from develop
2. Make changes
3. Push to GitHub
4. Create pull request to develop
5. Pipeline runs (tests, lint, build)
6. Code review
7. Merge to develop
8. Pipeline deploys to staging
```

### Feature Branches

**Purpose:** Individual feature development

**Naming:** `feature/feature-name`

**Example:**
```bash
git checkout -b feature/add-video-generation
# Make changes
git push origin feature/add-video-generation
# Create pull request
```

---

## 🔄 Workflow Examples

### Example 1: Deploy New Feature

```bash
# 1. Create feature branch
git checkout -b feature/add-gift-recommendations

# 2. Make changes
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Add gift recommendations engine"

# 4. Push to GitHub
git push origin feature/add-gift-recommendations

# 5. Create pull request
# Go to GitHub and create PR to develop

# 6. Pipeline runs automatically
# - Lints code
# - Runs tests
# - Builds code
# - Shows results in PR

# 7. Code review
# Team reviews and approves

# 8. Merge to develop
# Click "Merge pull request"

# 9. Pipeline deploys to staging
# - Deploys to Railway staging
# - Sends Slack notification
# - App is live on staging!

# 10. Test on staging
# Test the feature on staging environment

# 11. Merge to main
# Create PR from develop to main
# Merge after approval

# 12. Pipeline deploys to production
# - Creates backup
# - Deploys to Railway production
# - Runs health check
# - Sends Slack notification
# - App is live in production!
```

### Example 2: Fix Bug in Production

```bash
# 1. Create hotfix branch
git checkout -b hotfix/fix-login-bug

# 2. Fix the bug
# ... edit files ...

# 3. Commit fix
git add .
git commit -m "Fix login bug"

# 4. Push to GitHub
git push origin hotfix/fix-login-bug

# 5. Create PR to main
# Go to GitHub and create PR to main

# 6. Pipeline runs
# - Tests pass
# - Build succeeds

# 7. Merge to main
# Click "Merge pull request"

# 8. Pipeline deploys to production
# - Creates backup
# - Deploys fix
# - Runs health check
# - Bug is fixed!

# 9. Merge back to develop
# Ensure develop has the fix too
git checkout develop
git pull origin develop
git merge hotfix/fix-login-bug
git push origin develop
```

### Example 3: Rollback Failed Deployment

```bash
# 1. Deployment failed
# - Check Slack notification
# - Review error in GitHub Actions

# 2. Identify issue
# - Check logs
# - Review recent changes

# 3. Revert commit
git revert HEAD
git push origin main

# 4. Pipeline runs again
# - Tests pass
# - Build succeeds
# - Deploys rollback version

# 5. App is restored
# - Backup is available
# - Previous version is running

# 6. Fix issue
# - Fix the bug
# - Test locally
# - Create new PR

# 7. Deploy fix
# - Merge to main
# - Pipeline deploys
# - App is working!
```

---

## 📊 Monitoring Pipeline

### View Pipeline Status

1. **Go to GitHub repository**
   - Click "Actions" tab
   - See all workflow runs
   - Click on a run to see details

2. **View job details**
   - Click on a job
   - See step-by-step execution
   - View logs for each step

3. **Check for failures**
   - Red ❌ = Failed
   - Green ✅ = Passed
   - Yellow ⏳ = Running

### Check Slack Notifications

Pipeline sends Slack notifications:

**On Success:**
```
✅ Deployed to Staging
Branch: develop
Commit: abc1234
Author: john
```

**On Failure:**
```
❌ CI/CD Pipeline Failed
Branch: develop
Commit: abc1234
Author: john
Details: [link to GitHub Actions]
```

---

## 🔐 Security Best Practices

### Protect Secrets

1. **Never commit secrets**
   - Add `.env` to `.gitignore`
   - Use GitHub Secrets instead
   - Review commits before pushing

2. **Rotate secrets regularly**
   - Change API keys monthly
   - Update passwords quarterly
   - Review access logs

3. **Limit secret access**
   - Only needed jobs can access
   - Use environment-specific secrets
   - Audit who has access

### Secure Deployments

1. **Require reviews**
   - Require PR reviews before merge
   - Use branch protection rules
   - Require status checks to pass

2. **Use environments**
   - Separate staging and production
   - Require approvals for production
   - Track who deployed what

3. **Monitor deployments**
   - Check Slack notifications
   - Review GitHub releases
   - Audit deployment logs

---

## 🚨 Troubleshooting

### Pipeline Fails at Lint Stage

**Error:** Linting errors found

**Fix:**
```bash
# Fix linting errors locally
npm run lint:server
npm run lint:client

# Or auto-fix
npm run lint:server -- --fix
npm run lint:client -- --fix

# Commit and push
git add .
git commit -m "Fix linting errors"
git push
```

### Pipeline Fails at Test Stage

**Error:** Tests failed

**Fix:**
```bash
# Run tests locally
npm test

# Fix failing tests
# ... edit test files ...

# Run tests again
npm test

# Commit and push
git add .
git commit -m "Fix failing tests"
git push
```

### Pipeline Fails at Build Stage

**Error:** Build failed

**Fix:**
```bash
# Build locally
npm run build:server
npm run build:client

# Check for TypeScript errors
npm run build:server 2>&1 | head -20

# Fix errors
# ... edit source files ...

# Build again
npm run build:server

# Commit and push
git add .
git commit -m "Fix build errors"
git push
```

### Pipeline Fails at Deploy Stage

**Error:** Deployment failed

**Fix:**
1. Check Railway logs
   - Go to Railway dashboard
   - Click service
   - View logs

2. Check environment variables
   - Verify all secrets are set
   - Check values are correct

3. Check database
   - Verify database connection
   - Check migrations ran

4. Rollback if needed
   ```bash
   git revert HEAD
   git push origin main
   ```

### Slack Notifications Not Appearing

**Issue:** No Slack notifications

**Fix:**
1. Check Slack webhook URL
   - Go to GitHub Secrets
   - Verify SLACK_WEBHOOK_URL is set
   - Test webhook manually

2. Check Slack workspace
   - Verify webhook is active
   - Check channel permissions
   - Verify bot is in channel

3. Check GitHub Actions logs
   - Look for Slack notification step
   - Check for error messages

---

## 📈 Performance Optimization

### Reduce Pipeline Time

1. **Cache dependencies**
   - Pipeline caches npm packages
   - Reduces install time

2. **Parallel jobs**
   - Lint, test, security run in parallel
   - Build backend and frontend in parallel
   - Reduces total time

3. **Conditional jobs**
   - Only deploy if tests pass
   - Only deploy on main/develop
   - Skips unnecessary jobs

### Current Pipeline Time

| Stage | Time |
|-------|------|
| Lint | 2 min |
| Test | 5 min |
| Security | 3 min |
| Build Backend | 3 min |
| Build Frontend | 3 min |
| Deploy Staging | 5 min |
| Deploy Production | 5 min |
| Performance Test | 5 min |
| **Total** | **~15 min** |

---

## 📚 Configuration Files

### GitHub Actions Workflow

**File:** `.github/workflows/ci-cd.yml`

**Contains:**
- Lint job
- Test job
- Security job
- Build jobs
- Deploy jobs
- Performance test job
- Notification jobs

### Lighthouse Config

**File:** `lighthouserc.json`

**Contains:**
- Performance thresholds
- Accessibility requirements
- Best practices checks
- SEO requirements

---

## 🎯 Best Practices

### Commit Messages

Write clear commit messages:

```bash
# Good
git commit -m "Add gift recommendations engine"
git commit -m "Fix login bug in authentication"
git commit -m "Optimize database queries"

# Bad
git commit -m "fix stuff"
git commit -m "changes"
git commit -m "update"
```

### Pull Requests

Create descriptive pull requests:

```markdown
## Description
Added gift recommendations engine that suggests personalized gifts based on event type and budget.

## Changes
- Added gift recommendation service
- Added gift API endpoints
- Added gift UI components
- Added tests for gift service

## Testing
- Tested with 50+ gift items
- Tested filtering by budget
- Tested search functionality

## Screenshots
[Add screenshots if applicable]

## Checklist
- [x] Tests pass
- [x] Code linted
- [x] Documentation updated
- [x] No breaking changes
```

### Code Review

Review code before merging:

- ✅ Tests pass
- ✅ Code is linted
- ✅ No security issues
- ✅ Performance is acceptable
- ✅ Documentation is clear
- ✅ No breaking changes

---

## 📞 Support & Resources

### GitHub Actions Docs
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

### Railway Docs
- [Railway Documentation](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/reference/cli)

### Slack Integration
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Slack API](https://api.slack.com)

---

## ✅ Setup Checklist

- [ ] GitHub repository created
- [ ] `.github/workflows/ci-cd.yml` file created
- [ ] `lighthouserc.json` file created
- [ ] GitHub Secrets added:
  - [ ] RAILWAY_TOKEN_STAGING
  - [ ] RAILWAY_TOKEN_PRODUCTION
  - [ ] RAILWAY_PROJECT_ID_STAGING
  - [ ] RAILWAY_PROJECT_ID_PRODUCTION
  - [ ] DATABASE_URL_STAGING
  - [ ] DATABASE_URL_PRODUCTION
  - [ ] SLACK_WEBHOOK_URL
  - [ ] AWS_ACCESS_KEY_ID
  - [ ] AWS_SECRET_ACCESS_KEY
  - [ ] AWS_BACKUP_BUCKET
  - [ ] VITE_API_URL
  - [ ] VITE_STRIPE_PUBLISHABLE_KEY
  - [ ] PRODUCTION_API_URL
  - [ ] PRODUCTION_URL
  - [ ] STAGING_URL
- [ ] npm scripts added to package.json
- [ ] Test pipeline with develop branch
- [ ] Test pipeline with main branch
- [ ] Verify Slack notifications
- [ ] Verify deployments to staging
- [ ] Verify deployments to production
- [ ] Set up branch protection rules
- [ ] Document deployment process for team
- [ ] Train team on CI/CD workflow

---

## 🎉 You're Ready!

Your CI/CD pipeline is now set up and ready to use!

**Next steps:**
1. Push code to develop branch
2. Watch pipeline run
3. Review results
4. Merge to main for production
5. Celebrate automated deployments! 🚀

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
