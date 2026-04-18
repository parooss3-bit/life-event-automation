# GitHub Setup & Workflow Guide

Complete guide to setting up and managing your Life Event Automation platform on GitHub.

---

## 📋 Overview

This guide covers:

- ✅ Creating a GitHub repository
- ✅ Setting up the project structure
- ✅ Configuring GitHub Actions (CI/CD)
- ✅ Branch strategy and workflow
- ✅ Collaboration best practices
- ✅ Security and secrets management
- ✅ Deployment automation
- ✅ Monitoring and troubleshooting

---

## 🚀 Step 1: Create GitHub Repository

### 1.1 Create New Repository

**On GitHub.com:**

1. Click "+" icon in top right corner
2. Select "New repository"
3. Fill in repository details:
   - **Repository name:** `life-event-automation`
   - **Description:** "Life Event Automation Platform - Never forget important dates"
   - **Visibility:** Public (for open source) or Private (for proprietary)
   - **Initialize with:** Add .gitignore (Node), Add a license (MIT)
4. Click "Create repository"

### 1.2 Clone Repository Locally

```bash
git clone https://github.com/YOUR_USERNAME/life-event-automation.git
cd life-event-automation
```

### 1.3 Add Remote Origin

If you already have a local project:

```bash
git remote add origin https://github.com/YOUR_USERNAME/life-event-automation.git
git branch -M main
git push -u origin main
```

---

## 📁 Step 2: Set Up Project Structure

### 2.1 Directory Structure

```
life-event-automation/
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml              # GitHub Actions CI/CD pipeline
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── question.md
├── src/                            # Backend source code
│   ├── index.ts
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── utils/
├── client/                         # Frontend source code
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── prisma/                         # Database schema
│   └── schema.prisma
├── scripts/                        # Deployment and utility scripts
│   ├── deploy-automated.sh
│   ├── rollback-automated.sh
│   └── setup.sh
├── docs/                           # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── README.md
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
├── package.json                    # Backend dependencies
├── tsconfig.json                   # TypeScript config
├── README.md                       # Project README
└── LICENSE                         # MIT License

```

### 2.2 Create .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
*.db
*.sqlite
*.sqlite3

# OS
Thumbs.db
.DS_Store

# Testing
coverage/
.nyc_output/

# Temporary
tmp/
temp/
```

### 2.3 Create README.md

```markdown
# Life Event Automation Platform

Never forget important dates again. Automated reminders, smart gift recommendations, and personalized AI videos.

## Features

- 🎂 Birthday and event reminders (email, SMS, push)
- 🎁 Smart gift recommendations
- 🎬 AI video generation
- 📱 Contact management
- 💳 Subscription billing
- 🔐 OAuth authentication

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, Tailwind CSS, Zustand
- **Database:** PostgreSQL, Prisma
- **Payments:** Stripe
- **Email:** SendGrid
- **SMS:** Twilio
- **Video:** HeyGen
- **Hosting:** Railway

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or pnpm

### Installation

1. Clone repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/life-event-automation.git
   cd life-event-automation
   ```

2. Install dependencies
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. Set up environment
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Set up database
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start development servers
   ```bash
   # Terminal 1: Backend
   npm run dev

   # Terminal 2: Frontend
   cd client && npm run dev
   ```

6. Open http://localhost:3000

## Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Architecture](docs/ARCHITECTURE.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- 📧 Email: support@lifeventautomation.com
- 💬 Discord: [Join our community](https://discord.gg/...)
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/life-event-automation/issues)

## Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Calendar integration (Google, Outlook)
- [ ] Physical card printing
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API for third-party integrations

---

Made with ❤️ by [Your Name]
```

---

## 🔐 Step 3: Configure GitHub Secrets

### 3.1 Add Secrets for CI/CD

Go to **Settings → Secrets and variables → Actions**

Add the following secrets:

**Backend Secrets:**
```
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1
GOOGLE_MAPS_API_KEY=your_google_maps_key
HEYGEN_API_KEY=your_heygen_key
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=your_database_url
FIREBASE_CREDENTIALS=your_firebase_json
```

**Deployment Secrets:**
```
RAILWAY_API_TOKEN=your_railway_token
RAILWAY_PROJECT_ID=your_project_id
SLACK_WEBHOOK_URL=your_slack_webhook
```

### 3.2 Add Environment Variables

Create `.env.example`:

```
# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/life_event_automation
JWT_SECRET=your_jwt_secret_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@lifeventautomation.com

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# HeyGen
HEYGEN_API_KEY=your_heygen_key

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Firebase
FIREBASE_CREDENTIALS=your_firebase_json

# Frontend
VITE_API_URL=http://localhost:3000
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

---

## 🌿 Step 4: Branch Strategy

### 4.1 Main Branches

**main**
- Production-ready code
- Protected branch (requires PR review)
- Automatically deploys to production
- Tag each release (v1.0.0, v1.0.1, etc.)

**develop**
- Development branch
- Automatically deploys to staging
- Base branch for feature branches
- Requires PR review

### 4.2 Feature Branches

**Naming convention:** `feature/feature-name`

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/contact-import

# Make changes
git add .
git commit -m "feat: add contact import functionality"

# Push to GitHub
git push origin feature/contact-import

# Create Pull Request on GitHub
```

### 4.3 Bug Fix Branches

**Naming convention:** `bugfix/bug-name`

```bash
# Create bugfix branch
git checkout develop
git pull origin develop
git checkout -b bugfix/email-sending-error

# Make changes
git add .
git commit -m "fix: resolve email sending issue"

# Push to GitHub
git push origin bugfix/email-sending-error

# Create Pull Request on GitHub
```

### 4.4 Release Branches

**Naming convention:** `release/v1.0.0`

```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Update version numbers
# Update CHANGELOG
git add .
git commit -m "chore: prepare v1.0.0 release"

# Push to GitHub
git push origin release/v1.0.0

# Create Pull Request to main
```

---

## 📝 Step 5: Commit Message Convention

### 5.1 Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 5.2 Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

### 5.3 Examples

```bash
# Feature
git commit -m "feat(contacts): add bulk import from CSV"

# Bug fix
git commit -m "fix(email): resolve SendGrid API timeout"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor(auth): simplify JWT token generation"
```

---

## 🔄 Step 6: Pull Request Workflow

### 6.1 Create Pull Request

1. Push your branch to GitHub
2. Go to GitHub repository
3. Click "Compare & pull request"
4. Fill in PR details:
   - **Title:** Clear, descriptive title
   - **Description:** What changes, why, how to test
   - **Link issues:** Fixes #123
5. Click "Create pull request"

### 6.2 PR Template

Create `.github/pull_request_template.md`:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Fixes #123

## How to Test

1. Step 1
2. Step 2
3. Step 3

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes tested locally
```

### 6.3 Code Review

**Reviewer responsibilities:**
- Check code quality
- Verify tests pass
- Check for security issues
- Provide constructive feedback
- Approve or request changes

**Author responsibilities:**
- Respond to feedback
- Make requested changes
- Push updates
- Request re-review

### 6.4 Merge

Once approved:
1. Ensure all checks pass
2. Click "Squash and merge" (for cleaner history)
3. Delete branch after merge
4. Close related issues

---

## 🔄 Step 7: GitHub Actions CI/CD

### 7.1 CI/CD Pipeline

The `.github/workflows/ci-cd.yml` file automatically:

1. **Lint** - Check code style
2. **Test** - Run unit tests
3. **Security** - Scan for vulnerabilities
4. **Build** - Build backend and frontend
5. **Deploy to Staging** - On develop branch
6. **Deploy to Production** - On main branch

### 7.2 Monitor Pipeline

1. Go to **Actions** tab
2. Click on workflow run
3. View logs and status
4. Check deployment status

### 7.3 Troubleshoot Failures

If a workflow fails:

1. Click on failed job
2. Expand failed step
3. Read error message
4. Fix issue locally
5. Push fix
6. Pipeline re-runs automatically

---

## 📊 Step 8: Issues & Project Management

### 8.1 Create Issues

Go to **Issues → New issue**

**Issue types:**

**Bug Report**
```markdown
## Description
Clear description of bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: macOS 12.0
- Node: 18.0
- Browser: Chrome 100
```

**Feature Request**
```markdown
## Description
Clear description of feature

## Use Case
Why is this needed?

## Proposed Solution
How should it work?

## Alternatives
Other solutions considered

## Additional Context
Any other information
```

### 8.2 GitHub Projects

1. Go to **Projects** tab
2. Click "New project"
3. Choose "Table" or "Board" layout
4. Add issues to project
5. Organize by status (To Do, In Progress, Done)

---

## 🚀 Step 9: Deployment via GitHub

### 9.1 Deploy to Railway

Railway automatically deploys when you push to:
- `develop` branch → Staging environment
- `main` branch → Production environment

### 9.2 Monitor Deployments

1. Go to **Actions** tab
2. Click on "Deploy" workflow
3. View deployment progress
4. Check deployment logs

### 9.3 Rollback Deployment

If deployment fails:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

---

## 📚 Step 10: Documentation

### 10.1 Create Wiki

1. Go to **Settings → Features**
2. Enable "Wiki"
3. Click "Wiki" tab
4. Create pages:
   - Home
   - Getting Started
   - Architecture
   - API Reference
   - Deployment
   - Troubleshooting

### 10.2 Add Documentation Files

Create `docs/` directory:

```
docs/
├── README.md              # Documentation index
├── GETTING_STARTED.md     # Setup guide
├── API.md                 # API reference
├── ARCHITECTURE.md        # System design
├── DEPLOYMENT.md          # Deployment guide
├── CONTRIBUTING.md        # Contribution guidelines
└── TROUBLESHOOTING.md     # Common issues
```

---

## 🔐 Step 11: Security Best Practices

### 11.1 Protect Main Branch

1. Go to **Settings → Branches**
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews (2 reviewers)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require code reviews before merging
   - ✅ Dismiss stale pull request approvals
   - ✅ Require signed commits

### 11.2 Manage Secrets

**Never commit secrets!**

```bash
# ❌ Bad
git add .env
git commit -m "add environment variables"

# ✅ Good
git add .env.example
git commit -m "add environment template"
```

### 11.3 Use GitHub Secrets

Store sensitive data in GitHub Secrets, not in code:

```bash
# In GitHub Actions workflow
env:
  SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

---

## 📋 Step 12: Team Collaboration

### 12.1 Invite Collaborators

1. Go to **Settings → Collaborators**
2. Click "Add people"
3. Enter username
4. Select role:
   - **Pull access:** Read-only
   - **Push access:** Can push to branches
   - **Admin access:** Full control

### 12.2 Code Review Guidelines

**Before merging:**
- ✅ All tests pass
- ✅ 2+ approvals from team members
- ✅ No merge conflicts
- ✅ Code follows style guide
- ✅ Documentation updated

### 12.3 Communication

Use GitHub for:
- **Issues:** Bug reports, feature requests
- **Discussions:** Questions, ideas
- **Pull requests:** Code review
- **Releases:** Changelog, version notes

---

## 🎯 Your GitHub Workflow

### Day-to-Day

1. **Start work**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   ```bash
   # Edit files
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Fill in details
   - Request review

5. **Address feedback**
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review feedback"
   git push origin feature/my-feature
   ```

6. **Merge**
   - Once approved, click "Squash and merge"
   - Delete branch

### Release Process

1. **Create release branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update version**
   - Update `package.json` version
   - Update `CHANGELOG.md`

3. **Create PR to main**
   ```bash
   git push origin release/v1.0.0
   ```

4. **Merge to main**
   - Get approval
   - Merge to main

5. **Tag release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

6. **Create GitHub Release**
   - Go to **Releases**
   - Click "Create a release"
   - Enter version and changelog
   - Publish

---

## ✅ GitHub Setup Checklist

- [ ] Create GitHub repository
- [ ] Clone repository locally
- [ ] Set up project structure
- [ ] Create .gitignore
- [ ] Create README.md
- [ ] Add GitHub Secrets
- [ ] Create .env.example
- [ ] Set up branch protection rules
- [ ] Create PR template
- [ ] Create issue templates
- [ ] Set up GitHub Actions
- [ ] Create documentation
- [ ] Invite team members
- [ ] Create GitHub Project board
- [ ] First commit and push
- [ ] Verify CI/CD pipeline works

---

## 🚀 Ready to Use GitHub!

Your GitHub repository is now set up and ready to use!

**Next steps:**
1. Push your code to GitHub
2. Create your first Pull Request
3. Invite team members
4. Start collaborating
5. Deploy to production

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
