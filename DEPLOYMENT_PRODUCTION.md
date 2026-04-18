# Production Deployment Guide

Complete guide for deploying the Life Event Automation platform to production.

---

## 📋 Pre-Deployment Checklist

### Infrastructure
- [ ] Choose hosting provider (Vercel, Railway, Render, AWS)
- [ ] Set up production database (Supabase, AWS RDS, Railway)
- [ ] Configure CDN (Cloudflare, AWS CloudFront)
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain name

### Environment Variables
- [ ] Database connection string
- [ ] JWT secret key
- [ ] SendGrid API key
- [ ] Twilio credentials
- [ ] Firebase credentials
- [ ] Stripe API keys
- [ ] HeyGen API key
- [ ] Facebook OAuth credentials
- [ ] Google Maps API key

### Code Quality
- [ ] Run tests: `npm test`
- [ ] Check linting: `npm run lint`
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build:server`
- [ ] Review security: `npm audit`

### Database
- [ ] Create production database
- [ ] Run migrations: `npm run prisma:migrate:deploy`
- [ ] Seed initial data (optional)
- [ ] Set up backups
- [ ] Configure monitoring

### Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up performance monitoring
- [ ] Configure alerts

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

**Pros:**
- Easy deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Free tier available

**Steps:**
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy

**Cost:** Free - $20/month

---

### Option 2: Railway (Recommended for Full Stack)

**Pros:**
- Full-stack hosting
- Database included
- Easy environment setup
- Pay-as-you-go pricing

**Steps:**
1. Create Railway account
2. Connect GitHub
3. Add services (Node.js, PostgreSQL)
4. Set environment variables
5. Deploy

**Cost:** $5-50/month

---

### Option 3: Render

**Pros:**
- Simple deployment
- Free tier available
- Good documentation
- Automatic deploys

**Steps:**
1. Create Render account
2. Connect GitHub
3. Create Web Service
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

**Cost:** Free - $12/month

---

### Option 4: AWS (Most Flexible)

**Pros:**
- Highly scalable
- Full control
- Many services available
- Enterprise-grade

**Services:**
- EC2 for backend
- RDS for database
- S3 for storage
- CloudFront for CDN
- Route 53 for DNS

**Cost:** $20-100+/month

---

## 📝 Environment Configuration

### Production .env File

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_EXPIRY=7d

# Email Service
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@momentremind.com

# SMS Service
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications
FIREBASE_CREDENTIALS={"type":"service_account",...}

# Payments
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AI Video Generation
HEYGEN_API_KEY=xxxxx

# OAuth
FACEBOOK_APP_ID=xxxxx
FACEBOOK_APP_SECRET=xxxxx
FACEBOOK_CALLBACK_URL=https://yourdomain.com/auth/facebook/callback

GOOGLE_MAPS_API_KEY=xxxxx

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_APP_URL=https://yourdomain.com

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Environment
NODE_ENV=production
```

---

## 🗄️ Database Setup

### Create Production Database

**Using Supabase:**
```bash
1. Go to https://supabase.com
2. Create new project
3. Copy connection string
4. Add to DATABASE_URL
```

**Using Railway:**
```bash
1. Create Railway account
2. Add PostgreSQL service
3. Copy connection string
4. Add to DATABASE_URL
```

**Using AWS RDS:**
```bash
1. Create RDS instance
2. Configure security groups
3. Copy endpoint
4. Add to DATABASE_URL
```

### Run Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:deploy

# Verify database
npm run prisma:studio
```

---

## 🔐 Security Setup

### SSL/TLS Certificates

**Using Let's Encrypt (Free):**
```bash
# Certbot for automatic renewal
sudo certbot certonly --standalone -d yourdomain.com
```

**Using Cloudflare (Free):**
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS

### Environment Variables

**Never commit secrets:**
```bash
# .gitignore
.env
.env.local
.env.production
```

**Use secure storage:**
- Vercel: Environment Variables in dashboard
- Railway: Environment Variables in dashboard
- AWS: Secrets Manager

### CORS Configuration

```typescript
// src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📦 Build & Deployment

### Build Backend

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build:server

# Start production server
npm start
```

### Build Frontend

```bash
# Install dependencies
cd client && npm install

# Build React app
npm run build

# Output: dist/ folder ready for deployment
```

### Docker Deployment (Optional)

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build:server

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and push:**
```bash
docker build -t momentremind:latest .
docker push your-registry/momentremind:latest
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Code

```bash
# Update version
npm version patch

# Run tests
npm test

# Build
npm run build:server
cd client && npm run build
```

### Step 2: Configure Environment

```bash
# Set production environment variables
# (Use provider's dashboard or CLI)
```

### Step 3: Deploy Backend

**Using Railway:**
```bash
# Connect GitHub
# Railway auto-deploys on push
git push origin main
```

**Using Vercel:**
```bash
# Deploy API routes
vercel --prod
```

**Using AWS:**
```bash
# Deploy to EC2
ssh -i key.pem ec2-user@instance
git clone repo
npm install
npm run build:server
pm2 start npm --name "api" -- start
```

### Step 4: Deploy Frontend

**Using Vercel:**
```bash
cd client
vercel --prod
```

**Using Netlify:**
```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

### Step 5: Run Migrations

```bash
npm run prisma:migrate:deploy
```

### Step 6: Verify Deployment

```bash
# Test API endpoints
curl https://api.yourdomain.com/health

# Test frontend
open https://yourdomain.com

# Check logs
npm run logs:production
```

---

## 📊 Monitoring & Logging

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Application Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info('Server started');
```

### Performance Monitoring

```bash
# Using New Relic
npm install newrelic

# Add to top of index.ts
require('newrelic');
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**Create .github/workflows/deploy.yml:**

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
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build:server
      
      - name: Deploy
        run: |
          # Deploy script here
          npm run deploy:prod
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

**Using Railway:**
- Connect GitHub repo
- Auto-deploys on push to main

**Using Vercel:**
- Connect GitHub repo
- Auto-deploys on push

**Using AWS CodePipeline:**
- Configure pipeline
- Auto-builds and deploys

---

## 📈 Scaling

### Horizontal Scaling

```bash
# Multiple server instances
# Load balancer distributes traffic
# Database connection pooling
```

### Vertical Scaling

```bash
# Upgrade server resources
# Increase CPU/RAM
# Upgrade database tier
```

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_event_date ON events(eventDate);
CREATE INDEX idx_reminder_status ON reminders(status);

-- Monitor queries
EXPLAIN ANALYZE SELECT ...;
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Database connection fails**
- Check DATABASE_URL
- Verify network access
- Check firewall rules
- Test connection: `psql $DATABASE_URL`

**Issue: API not responding**
- Check server logs
- Verify environment variables
- Check database connection
- Restart server

**Issue: Frontend not loading**
- Check CORS configuration
- Verify API URL
- Check browser console
- Clear cache

**Issue: Emails not sending**
- Verify SendGrid API key
- Check sender email
- Review SendGrid logs
- Test with sample email

---

## 📋 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Test user signup/login
- [ ] Test Facebook OAuth
- [ ] Test email notifications
- [ ] Test SMS notifications
- [ ] Test video generation
- [ ] Test payment processing
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backups working
- [ ] Test database recovery
- [ ] Document deployment process
- [ ] Create runbook for incidents

---

## 🔄 Rollback Procedure

**If deployment fails:**

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or rollback database
npm run prisma:migrate:resolve --rolled-back-to 20240409000000

# Restart services
pm2 restart all
```

---

## 📞 Support & Maintenance

### Regular Maintenance

- **Weekly:** Review logs, check performance
- **Monthly:** Update dependencies, security patches
- **Quarterly:** Database optimization, capacity planning
- **Annually:** Security audit, disaster recovery test

### Monitoring Checklist

- [ ] Server uptime
- [ ] Database performance
- [ ] API response times
- [ ] Error rates
- [ ] User growth
- [ ] Revenue metrics

---

## 🎯 Launch Checklist

- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Database migrated
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] CI/CD pipeline working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support process defined
- [ ] Launch announcement ready

---

## 📚 Resources

- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app)
- [Render Deployment](https://render.com/docs)
- [AWS Deployment](https://aws.amazon.com/getting-started)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Docker Guide](https://docs.docker.com)

---

**Next Steps:**
1. Choose hosting provider
2. Set up production database
3. Configure environment variables
4. Deploy backend
5. Deploy frontend
6. Run migrations
7. Verify deployment
8. Set up monitoring
9. Launch!
