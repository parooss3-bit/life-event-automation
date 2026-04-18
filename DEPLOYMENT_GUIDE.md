# Life Event Automation Platform - Deployment Guide

**Version:** 1.0  
**Last Updated:** April 8, 2026

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USERS (INTERNET)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ Vercel  │      │ Vercel  │      │  CDN    │
   │Frontend │      │ Edge    │      │ (Cached)│
   │ (React) │      │Functions│      │         │
   └────┬────┘      └────┬────┘      └─────────┘
        │                │
        └────────────────┼────────────────┐
                         │                │
                    ┌────▼────┐      ┌────▼────┐
                    │ Railway  │      │ Stripe  │
                    │ Backend  │      │ Webhooks│
                    │(Node.js) │      │         │
                    └────┬────┘      └─────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐   ┌─────────┐
   │Supabase │      │SendGrid │      │HeyGen   │   │AWS S3   │
   │(Postgres│      │(Email)  │      │(Video)  │   │(Storage)│
   │+ Real-  │      │         │      │         │   │         │
   │time)    │      │         │      │         │   │         │
   └─────────┘      └─────────┘      └─────────┘   └─────────┘
```

---

## 📋 Pre-Deployment Checklist

### **Infrastructure Setup**

- [ ] Create Vercel account (https://vercel.com)
- [ ] Create Railway account (https://railway.app)
- [ ] Create Supabase account (https://supabase.com)
- [ ] Create Stripe account (https://stripe.com)
- [ ] Create SendGrid account (https://sendgrid.com)
- [ ] Create HeyGen account (https://heyGen.ai)
- [ ] Create AWS account (https://aws.amazon.com)
- [ ] Create GitHub account (https://github.com)
- [ ] Create Sentry account (https://sentry.io)

### **Domain Setup**

- [ ] Purchase domain (e.g., momentremind.com)
- [ ] Configure DNS records
- [ ] Set up SSL certificate (automatic with Vercel)

### **API Keys & Secrets**

- [ ] Stripe API keys (publishable + secret)
- [ ] SendGrid API key
- [ ] HeyGen API key
- [ ] AWS S3 credentials
- [ ] Google OAuth credentials
- [ ] Sentry DSN

---

## 🔧 Phase 1: Backend Deployment (Railway)

### **Step 1: Create Railway Project**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select your repository
6. Click "Deploy"

### **Step 2: Configure Environment Variables**

In Railway dashboard, go to **Variables** and add:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=24h

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM_EMAIL=noreply@momentremind.com

# HeyGen
HEYGEN_API_KEY=xxx...

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx...
AWS_REGION=us-east-1
AWS_S3_BUCKET=momentremind-uploads

# Google OAuth
GOOGLE_CLIENT_ID=xxx...
GOOGLE_CLIENT_SECRET=xxx...

# Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Environment
NODE_ENV=production
API_URL=https://api.momentremind.com
FRONTEND_URL=https://momentremind.com
```

### **Step 3: Configure Database**

1. In Railway, click "Add Service"
2. Select "PostgreSQL"
3. Click "Create"
4. Copy the `DATABASE_URL` from the PostgreSQL service
5. Paste into your environment variables

### **Step 4: Run Database Migrations**

In Railway terminal:

```bash
npm run migrate:prod
npm run seed:prod
```

### **Step 5: Deploy**

Railway automatically deploys when you push to main branch.

Monitor deployment:
```bash
railway logs
```

---

## 🎨 Phase 2: Frontend Deployment (Vercel)

### **Step 1: Create Vercel Project**

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### **Step 2: Configure Environment Variables**

In Vercel dashboard, go to **Settings** → **Environment Variables**:

```bash
# API
VITE_API_URL=https://api.momentremind.com

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

# Analytics
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_ANALYTICS_ID=G-XXXXXXXXXX

# Environment
VITE_ENVIRONMENT=production
```

### **Step 3: Configure Build Settings**

- **Framework Preset:** Next.js (or Vite)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **Step 4: Deploy**

Vercel automatically deploys when you push to main branch.

Monitor deployment in Vercel dashboard.

---

## 🗄️ Phase 3: Database Setup (Supabase)

### **Step 1: Create Supabase Project**

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project name: `momentremind`
4. Select region (closest to your users)
5. Click "Create new project"

### **Step 2: Get Connection String**

1. Go to **Settings** → **Database**
2. Copy the **Connection String** (URI)
3. Add to Railway environment variables as `DATABASE_URL`

### **Step 3: Run Migrations**

In your local environment:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Run migrations
supabase migration up

# Seed database
npm run seed
```

### **Step 4: Enable Real-time**

In Supabase dashboard:

1. Go to **Replication** → **Publication**
2. Enable replication for tables:
   - `reminders`
   - `events`
   - `ai_videos`

---

## 💳 Phase 4: Stripe Integration

### **Step 1: Create Stripe Products**

In Stripe dashboard:

1. Go to **Products**
2. Create product "Pro Subscription"
   - Price: $9/month
   - Billing period: Monthly
   - ID: `price_pro_monthly`

3. Create product "Business Subscription"
   - Price: $99/month
   - Billing period: Monthly
   - ID: `price_business_monthly`

### **Step 2: Configure Webhooks**

1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://api.momentremind.com/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy signing secret
7. Add to Railway environment as `STRIPE_WEBHOOK_SECRET`

### **Step 3: Test Webhooks**

```bash
# In development
stripe listen --forward-to localhost:3000/webhooks/stripe

# Get webhook signing secret
stripe listen
```

---

## 📧 Phase 5: SendGrid Integration

### **Step 1: Create SendGrid Account**

1. Go to https://sendgrid.com
2. Sign up and verify email
3. Go to **Settings** → **API Keys**
4. Create API Key
5. Copy and add to environment as `SENDGRID_API_KEY`

### **Step 2: Verify Sender Email**

1. Go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Enter your business email
4. Verify via email link

### **Step 3: Create Email Templates**

In SendGrid dashboard, create templates for:

- Welcome email
- Event reminder
- Video ready notification
- Subscription confirmation
- Password reset

### **Step 4: Test Email Sending**

```bash
npm run test:email
```

---

## 🎥 Phase 6: HeyGen Integration

### **Step 1: Create HeyGen Account**

1. Go to https://heyGen.ai
2. Sign up and verify email
3. Go to **API** → **API Keys**
4. Create API key
5. Copy and add to environment as `HEYGEN_API_KEY`

### **Step 2: Create Avatar**

1. Go to **Avatars**
2. Create custom avatar (or use preset)
3. Get avatar ID
4. Add to backend configuration

### **Step 3: Test Video Generation**

```bash
npm run test:video-generation
```

---

## 🪣 Phase 7: AWS S3 Setup

### **Step 1: Create S3 Bucket**

1. Go to AWS Console
2. Search for S3
3. Click "Create bucket"
4. Bucket name: `momentremind-uploads`
5. Region: `us-east-1`
6. Uncheck "Block all public access"
7. Click "Create bucket"

### **Step 2: Create IAM User**

1. Go to **IAM** → **Users**
2. Click "Create user"
3. Username: `momentremind-app`
4. Click "Next"
5. Click "Attach policies directly"
6. Search for `AmazonS3FullAccess`
7. Check the box
8. Click "Next" → "Create user"

### **Step 3: Create Access Keys**

1. Click on user
2. Go to **Security credentials**
3. Click "Create access key"
4. Select "Application running outside AWS"
5. Click "Next"
6. Copy Access Key ID and Secret Access Key
7. Add to environment:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### **Step 4: Configure CORS**

In S3 bucket:

1. Go to **Permissions** → **CORS**
2. Add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://momentremind.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🔐 Phase 8: Security & Monitoring

### **Step 1: Enable HTTPS**

- Vercel: Automatic
- Railway: Automatic

### **Step 2: Configure Sentry**

1. Go to https://sentry.io
2. Create project (Node.js)
3. Copy DSN
4. Add to environment variables:
   - Railway: `SENTRY_DSN`
   - Vercel: `VITE_SENTRY_DSN`

### **Step 3: Set Up Monitoring**

```bash
# Backend monitoring
npm install @sentry/node @sentry/tracing

# Frontend monitoring
npm install @sentry/react @sentry/tracing
```

### **Step 4: Configure Alerts**

In Sentry:

1. Go to **Alerts**
2. Create alert for:
   - Error rate > 5%
   - Performance degradation
   - New issues

---

## 📊 Phase 9: Analytics & Logging

### **Step 1: Set Up Logging**

```bash
# Backend logging
npm install winston

# Frontend logging
npm install @sentry/react
```

### **Step 2: Configure Google Analytics**

1. Go to https://analytics.google.com
2. Create property
3. Copy Measurement ID
4. Add to frontend environment

### **Step 3: Set Up Dashboards**

Create dashboards for:

- User growth
- Subscription metrics
- API performance
- Error rates
- Conversion funnel

---

## 🚀 Phase 10: Launch Checklist

### **Pre-Launch**

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Email templates created
- [ ] Stripe webhooks configured
- [ ] S3 bucket configured
- [ ] SSL certificate active
- [ ] DNS records configured
- [ ] Error monitoring enabled
- [ ] Analytics configured
- [ ] Backup strategy in place

### **Launch Day**

- [ ] Monitor error logs
- [ ] Monitor API performance
- [ ] Monitor user signups
- [ ] Test payment flow
- [ ] Test email reminders
- [ ] Test video generation
- [ ] Monitor server resources

### **Post-Launch**

- [ ] Monitor churn rate
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Plan next features

---

## 🔄 Continuous Deployment

### **GitHub Actions Workflow**

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
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - name: Deploy to Railway
        run: railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📈 Scaling Strategy

### **Phase 1: MVP (0-1,000 users)**
- Single Railway dyno (standard)
- Single Supabase instance
- Vercel free tier

### **Phase 2: Growth (1,000-10,000 users)**
- Railway: Scale to 2-3 dynos
- Supabase: Upgrade to Pro
- Vercel: Upgrade to Pro
- Add Redis for caching

### **Phase 3: Scale (10,000+ users)**
- Railway: Kubernetes cluster
- Supabase: Enterprise
- Vercel: Enterprise
- Add CDN for static assets
- Add message queue (Bull, RabbitMQ)

---

## 🆘 Troubleshooting

### **Backend won't start**

```bash
# Check logs
railway logs

# Check environment variables
railway env

# Restart service
railway restart
```

### **Database connection issues**

```bash
# Test connection
psql $DATABASE_URL

# Check Supabase status
# Go to Supabase dashboard → Status
```

### **Email not sending**

```bash
# Check SendGrid API key
echo $SENDGRID_API_KEY

# Test email
npm run test:email

# Check SendGrid activity log
# Go to SendGrid dashboard → Activity
```

### **Video generation failing**

```bash
# Check HeyGen API key
echo $HEYGEN_API_KEY

# Check HeyGen status
# Go to HeyGen dashboard → Status

# Check logs
railway logs | grep heyGen
```

---

## 📞 Support

- **Vercel Support:** https://vercel.com/support
- **Railway Support:** https://railway.app/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://stripe.com/support
- **SendGrid Support:** https://sendgrid.com/support

---

**Deployment Guide Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Ready for Implementation
