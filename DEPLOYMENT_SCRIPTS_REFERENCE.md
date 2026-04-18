# Deployment Scripts Reference

Quick reference for using the automated deployment and rollback scripts.

---

## 🚀 Deployment Script

### Command Syntax

```bash
./scripts/deploy-automated.sh [environment] [provider]
```

### Parameters

| Parameter | Required | Options | Default |
|-----------|----------|---------|---------|
| `environment` | No | production, staging, development | production |
| `provider` | No | railway, render, vercel, aws | railway |

### Examples

```bash
# Deploy to production on Railway
./scripts/deploy-automated.sh production railway

# Deploy to staging on Render
./scripts/deploy-automated.sh staging render

# Deploy frontend to Vercel
./scripts/deploy-automated.sh production vercel

# Deploy to AWS
./scripts/deploy-automated.sh production aws

# Use defaults (production on Railway)
./scripts/deploy-automated.sh
```

### What It Does

1. ✅ Validates environment configuration
2. ✅ Installs dependencies
3. ✅ Runs tests
4. ✅ Lints code
5. ✅ Runs security audit
6. ✅ Builds backend
7. ✅ Builds frontend
8. ✅ Creates database backup
9. ✅ Prepares migrations
10. ✅ Deploys to provider
11. ✅ Runs database migrations
12. ✅ Verifies deployment

### Output

```
╔════════════════════════════════════════════════════════════╗
║     Life Event Automation - Automated Deployment          ║
║                                                            ║
║  Environment: production                                  ║
║  Provider: railway                                        ║
║  Timestamp: 20260409_120000                               ║
╚════════════════════════════════════════════════════════════╝

[INFO] Step 1/10: Running pre-deployment validation...
[SUCCESS] Environment file found: .env.production
[INFO] Step 2/10: Installing dependencies...
[SUCCESS] Backend dependencies installed
...
[SUCCESS] Deployment completed successfully!

╔════════════════════════════════════════════════════════════╗
║           ✅ DEPLOYMENT COMPLETED SUCCESSFULLY             ║
║                                                            ║
║  Environment: production                                  ║
║  Provider: railway                                        ║
║  Timestamp: 20260409_120000                               ║
║  Log File: logs/deploy_production_20260409_120000.log     ║
║  Backup: backups/backup_20260409_120000.sql               ║
╚════════════════════════════════════════════════════════════╝
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Deployment successful |
| 1 | Deployment failed |

---

## 🔄 Rollback Script

### Command Syntax

```bash
./scripts/rollback-automated.sh [backup-file]
```

### Parameters

| Parameter | Required | Options | Default |
|-----------|----------|---------|---------|
| `backup-file` | No | path/to/backup.sql or "latest" | latest |

### Examples

```bash
# Rollback to latest backup
./scripts/rollback-automated.sh latest

# Rollback to specific backup
./scripts/rollback-automated.sh backups/backup_20260409_120000.sql

# Use default (latest)
./scripts/rollback-automated.sh
```

### What It Does

1. ✅ Finds backup file
2. ✅ Asks for confirmation
3. ✅ Reverts code changes
4. ✅ Restores database
5. ✅ Verifies rollback
6. ✅ Restarts services

### Output

```
╔════════════════════════════════════════════════════════════╗
║     Life Event Automation - Automated Rollback             ║
║                                                            ║
║  ⚠️  WARNING: This will revert your deployment!            ║
║                                                            ║
║  Backup: backups/backup_20260409_120000.sql               ║
║  Timestamp: 20260409_121500                               ║
╚════════════════════════════════════════════════════════════╝

Are you sure you want to rollback? (yes/no): yes

[INFO] Step 1/5: Finding backup file...
[SUCCESS] Found latest backup: backups/backup_20260409_120000.sql
[INFO] Step 2/5: Reverting code changes...
[SUCCESS] Code reverted to: abc1234
...
[SUCCESS] Rollback completed successfully!

╔════════════════════════════════════════════════════════════╗
║            ✅ ROLLBACK COMPLETED SUCCESSFULLY              ║
║                                                            ║
║  Backup: backups/backup_20260409_120000.sql               ║
║  Reverted to: abc1234                                     ║
║  Log File: logs/rollback_20260409_121500.log              ║
╚════════════════════════════════════════════════════════════╝
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Rollback successful |
| 1 | Rollback failed |

---

## 📁 Files Created

### Deployment Script

**Location:** `scripts/deploy-automated.sh`

**Size:** ~15 KB

**Permissions:** Executable (755)

**Language:** Bash

### Rollback Script

**Location:** `scripts/rollback-automated.sh`

**Size:** ~12 KB

**Permissions:** Executable (755)

**Language:** Bash

---

## 📊 Logs & Backups

### Log Files

**Location:** `logs/`

**Format:** `deploy_[environment]_[timestamp].log`

**Examples:**
- `logs/deploy_production_20260409_120000.log`
- `logs/deploy_staging_20260408_150000.log`
- `logs/rollback_20260409_121500.log`

### Backup Files

**Location:** `backups/`

**Format:** `backup_[timestamp].sql`

**Examples:**
- `backups/backup_20260409_120000.sql`
- `backups/backup_20260408_150000.sql`

### Rollback Info Files

**Location:** `backups/`

**Format:** `rollback_[timestamp].json`

**Examples:**
- `backups/rollback_20260409_120000.json`

---

## 🔧 Prerequisites

### Required

- Bash shell
- Node.js 18+
- npm
- Git
- PostgreSQL client (psql)

### Optional (Provider-Specific)

- Railway CLI - for Railway deployments
- Vercel CLI - for Vercel deployments
- AWS CLI - for AWS deployments

### Install CLIs

```bash
# Railway
npm install -g @railway/cli

# Vercel
npm install -g vercel

# AWS
pip install awscli
```

---

## ⚙️ Configuration

### Environment Files

Create `.env.[environment]` files:

```bash
# Production
cp .env.example .env.production
# Edit with production values

# Staging
cp .env.example .env.staging
# Edit with staging values
```

### Required Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=SG.xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
HEYGEN_API_KEY=xxxxx
```

---

## 🚨 Error Handling

### Common Errors

**Error: Environment file not found**
```
ERROR: .env.production file not found
Please create .env.production with required variables
```

**Solution:** Create the environment file
```bash
cp .env.example .env.production
nano .env.production
```

---

**Error: Tests failed**
```
ERROR: Tests failed
Fix failing tests before deploying
```

**Solution:** Fix tests locally
```bash
npm test
# Fix issues
git add .
git commit -m "Fix failing tests"
./scripts/deploy-automated.sh production railway
```

---

**Error: Build failed**
```
ERROR: Backend build failed
```

**Solution:** Check build logs
```bash
cat logs/deploy_production_*.log | grep ERROR
npm run build:server
# Fix issues
```

---

### Rollback on Error

If deployment fails, rollback automatically:

```bash
./scripts/rollback-automated.sh latest
```

---

## 📈 Monitoring

### Check Deployment Status

```bash
# View latest log
tail -f logs/deploy_production_*.log

# View all logs
ls -lh logs/

# Search for errors
grep ERROR logs/deploy_*.log
```

### Check Backups

```bash
# List all backups
ls -lh backups/

# Check backup size
du -sh backups/backup_*.sql

# Verify backup integrity
file backups/backup_*.sql
```

---

## 🔐 Security

### Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use provider secrets** - Store in provider dashboard
3. **Encrypt backups** - Use GPG or provider encryption
4. **Limit access** - Only authorized users can deploy
5. **Audit logs** - Keep logs for compliance

### Secure Backups

```bash
# Encrypt backup
gpg --symmetric backups/backup_20260409_120000.sql

# Upload to S3
aws s3 cp backups/backup_20260409_120000.sql s3://my-backups/

# Delete old backups
find backups/ -name "backup_*.sql" -mtime +30 -delete
```

---

## 📞 Support

### Getting Help

1. **Check logs** - Review deployment logs
2. **Read guides** - See DEPLOYMENT_PRODUCTION.md
3. **Check provider docs** - Review provider documentation
4. **Ask community** - Ask in Discord/forums
5. **Contact support** - Email support@example.com

### Reporting Issues

Include:
- Deployment command used
- Error message
- Log file (logs/deploy_*.log)
- Environment (production/staging)
- Provider (railway/render/vercel)

---

## 🎯 Quick Commands

```bash
# Deploy to production
./scripts/deploy-automated.sh production railway

# Deploy to staging
./scripts/deploy-automated.sh staging render

# Rollback latest
./scripts/rollback-automated.sh latest

# View logs
tail -f logs/deploy_production_*.log

# List backups
ls -lh backups/

# Check git status
git status

# View recent commits
git log --oneline -5
```

---

## 📚 Related Documentation

- [Deployment Guide](./DEPLOYMENT_PRODUCTION.md)
- [Deployment Automation Guide](./DEPLOYMENT_AUTOMATION.md)
- [Launch Checklist](./LAUNCH_CHECKLIST.md)
- [Quick Start Guide](./QUICK_START.md)

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
