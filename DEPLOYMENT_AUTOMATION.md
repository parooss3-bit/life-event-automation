# Deployment Automation Guide

Complete guide for using the automated deployment and rollback scripts.

---

## 📋 Overview

The automated deployment system includes two main scripts:

1. **deploy-automated.sh** - Fully automated deployment to production
2. **rollback-automated.sh** - Automated rollback if deployment fails

These scripts handle all steps from testing to deployment, with built-in safety checks and logging.

---

## 🚀 Quick Start

### Deploy to Production

```bash
# Deploy to Railway (default)
./scripts/deploy-automated.sh production railway

# Deploy to Render
./scripts/deploy-automated.sh production render

# Deploy to Vercel
./scripts/deploy-automated.sh production vercel

# Deploy to AWS
./scripts/deploy-automated.sh production aws
```

### Rollback Deployment

```bash
# Rollback to latest backup
./scripts/rollback-automated.sh latest

# Rollback to specific backup
./scripts/rollback-automated.sh backups/backup_20260409_120000.sql
```

---

## 📊 Deployment Steps

The automated deployment script performs 10 steps:

### Step 1: Pre-Deployment Validation
- Checks environment file exists
- Verifies required tools installed
- Checks git status
- Validates configuration

### Step 2: Install Dependencies
- Installs backend dependencies (npm install)
- Installs frontend dependencies
- Verifies all packages available

### Step 3: Run Tests
- Executes all unit tests
- Ensures code quality
- Fails if tests don't pass

### Step 4: Lint Code
- Runs ESLint
- Checks code style
- Fails if linting errors found

### Step 5: Security Audit
- Runs npm audit
- Checks for vulnerabilities
- Warns if issues found

### Step 6: Build Backend
- Compiles TypeScript
- Bundles backend code
- Creates production build

### Step 7: Build Frontend
- Compiles React code
- Optimizes assets
- Creates production bundle

### Step 8: Create Database Backup
- Exports current database
- Saves backup file
- Creates rollback information

### Step 9: Prepare Database Migrations
- Generates Prisma client
- Prepares migration scripts
- Validates schema

### Step 10: Deploy to Provider
- Deploys to selected provider
- Handles provider-specific steps
- Verifies deployment success

### Step 11: Run Migrations
- Applies database migrations
- Updates schema
- Seeds data if needed

### Step 12: Post-Deployment Verification
- Tests API health check
- Verifies service running
- Confirms deployment success

---

## 🔧 Configuration

### Environment Files

Create environment files for each deployment target:

**`.env.production`** - Production environment
```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_production_secret
SENDGRID_API_KEY=SG.xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
# ... other production variables
```

**`.env.staging`** - Staging environment
```env
DATABASE_URL=postgresql://user:password@staging-host:5432/db
JWT_SECRET=your_staging_secret
# ... other staging variables
```

### Provider Configuration

#### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
```

#### Render

```bash
# Create render.yaml in project root
services:
  - type: web
    name: api
    buildCommand: npm install && npm run build:server
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

#### AWS

```bash
# Configure AWS CLI
aws configure

# Set environment variables
aws ssm put-parameter --name /app/DATABASE_URL --value "postgresql://..."
aws ssm put-parameter --name /app/JWT_SECRET --value "your_secret"
```

---

## 📝 Usage Examples

### Example 1: Deploy to Railway

```bash
# Setup environment
cp .env.example .env.production
# Edit .env.production with production values

# Make code changes
git add .
git commit -m "Add new feature"

# Deploy
./scripts/deploy-automated.sh production railway

# Output:
# ✅ DEPLOYMENT COMPLETED SUCCESSFULLY
# Environment: production
# Provider: railway
# Log File: logs/deploy_production_20260409_120000.log
```

### Example 2: Deploy to Vercel (Frontend Only)

```bash
# Deploy frontend to Vercel
./scripts/deploy-automated.sh production vercel

# Output:
# ✅ DEPLOYMENT COMPLETED SUCCESSFULLY
# Environment: production
# Provider: vercel
# Frontend deployed to: https://your-app.vercel.app
```

### Example 3: Rollback After Failed Deployment

```bash
# Deployment failed, rollback
./scripts/rollback-automated.sh latest

# Output:
# ✅ ROLLBACK COMPLETED SUCCESSFULLY
# Backup: backups/backup_20260409_120000.sql
# Reverted to: abc1234
```

### Example 4: Scheduled Deployment

```bash
# Add to crontab for scheduled deployments
# Deploy every night at 2 AM
0 2 * * * cd /app && ./scripts/deploy-automated.sh production railway

# Or use GitHub Actions for CI/CD
```

---

## 🔄 Rollback Process

### Automatic Rollback

If deployment fails at any step, the script exits and preserves:
- Database backup
- Previous code version
- Rollback information

### Manual Rollback

```bash
# Rollback to latest backup
./scripts/rollback-automated.sh latest

# Rollback to specific backup
./scripts/rollback-automated.sh backups/backup_20260409_120000.sql
```

### Rollback Steps

1. **Confirms rollback** - Asks for confirmation
2. **Reverts code** - Resets git to previous commit
3. **Restores database** - Restores from backup
4. **Verifies rollback** - Checks everything restored
5. **Restarts services** - Brings services back online

---

## 📊 Logging

### Log Files

All deployments are logged to `logs/` directory:

```
logs/
├── deploy_production_20260409_120000.log
├── deploy_staging_20260408_150000.log
└── rollback_20260409_121500.log
```

### Log Format

```
[INFO] Step 1/10: Running pre-deployment validation...
[SUCCESS] Environment file found: .env.production
[INFO] Step 2/10: Installing dependencies...
[SUCCESS] Backend dependencies installed
...
[SUCCESS] Deployment completed successfully!
```

### View Logs

```bash
# View latest deployment log
tail -f logs/deploy_production_*.log

# View all logs
ls -lh logs/

# Search logs for errors
grep ERROR logs/deploy_*.log
```

---

## 💾 Backups

### Backup Files

Backups are stored in `backups/` directory:

```
backups/
├── backup_20260409_120000.sql
├── backup_20260408_150000.sql
└── rollback_20260409_121500.json
```

### Backup Information

Each deployment creates a rollback info file:

```json
{
  "timestamp": "20260409_120000",
  "environment": "production",
  "backup_file": "backups/backup_20260409_120000.sql"
}
```

### Restore Backup

```bash
# Restore specific backup
psql $DATABASE_URL < backups/backup_20260409_120000.sql

# Restore latest backup
psql $DATABASE_URL < $(ls -t backups/backup_*.sql | head -1)
```

---

## 🔐 Security

### Best Practices

1. **Environment Variables** - Never commit .env files
2. **Secrets Management** - Use provider's secret storage
3. **Database Backups** - Store securely, encrypt if possible
4. **Access Control** - Limit who can deploy
5. **Audit Logs** - Keep deployment logs for compliance

### Securing Backups

```bash
# Encrypt backup
gpg --symmetric backups/backup_20260409_120000.sql

# Store backup remotely
aws s3 cp backups/backup_20260409_120000.sql s3://my-backups/

# Set backup retention
find backups/ -name "backup_*.sql" -mtime +30 -delete
```

---

## 🚨 Troubleshooting

### Deployment Fails

**Issue: Tests fail**
```bash
# Run tests locally
npm test

# Fix failing tests
# Commit changes
git add .
git commit -m "Fix failing tests"

# Retry deployment
./scripts/deploy-automated.sh production railway
```

**Issue: Build fails**
```bash
# Check build logs
cat logs/deploy_production_*.log | grep ERROR

# Fix build issues
# Rebuild locally
npm run build:server
cd client && npm run build

# Retry deployment
```

**Issue: Database migration fails**
```bash
# Check migration status
npm run prisma:status

# Review migration files
ls prisma/migrations/

# Fix migration issues
# Retry deployment
```

### Rollback Fails

**Issue: Backup file not found**
```bash
# List available backups
ls -lh backups/

# Restore from specific backup
./scripts/rollback-automated.sh backups/backup_20260408_150000.sql
```

**Issue: Database restore fails**
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Manually restore backup
psql $DATABASE_URL < backups/backup_20260409_120000.sql

# Verify restore
npm run prisma:studio
```

---

## 📈 Monitoring Deployments

### Deployment Metrics

Track these metrics for each deployment:

- **Deployment time** - How long deployment takes
- **Success rate** - Percentage of successful deployments
- **Rollback frequency** - How often rollbacks occur
- **Downtime** - Service unavailability during deployment
- **Error rate** - Errors after deployment

### Slack Notifications

Enable Slack notifications by setting `SLACK_WEBHOOK`:

```bash
# Add to .env
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Deployment will send notifications
# ✅ Deployment to production completed successfully
# ⚠️ Rollback completed
```

### GitHub Actions Integration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy
        run: ./scripts/deploy-automated.sh production railway
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## 🎯 Best Practices

### Pre-Deployment

1. **Test locally** - Run all tests before deploying
2. **Code review** - Have code reviewed
3. **Backup database** - Ensure backup exists
4. **Notify team** - Let team know deployment is happening
5. **Schedule wisely** - Deploy during low-traffic times

### During Deployment

1. **Monitor logs** - Watch deployment progress
2. **Monitor services** - Check service health
3. **Monitor errors** - Look for error spikes
4. **Be ready to rollback** - Have rollback ready
5. **Communicate status** - Update team on progress

### Post-Deployment

1. **Verify functionality** - Test key features
2. **Monitor metrics** - Check performance metrics
3. **Monitor errors** - Check error logs
4. **Gather feedback** - Ask users for feedback
5. **Document changes** - Document what was deployed

---

## 📚 Additional Resources

- [Deployment Guide](./DEPLOYMENT_PRODUCTION.md)
- [Launch Checklist](./LAUNCH_CHECKLIST.md)
- [Quick Start Guide](./QUICK_START.md)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Support

For issues or questions:

1. Check logs: `cat logs/deploy_*.log`
2. Review this guide
3. Check provider documentation
4. Ask in community channels
5. Contact support

---

**Happy deploying! 🚀**
