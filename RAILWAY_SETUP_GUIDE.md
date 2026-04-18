# Railway Setup Guide

Complete step-by-step guide to deploy your Life Event Automation platform on Railway.

---

## 📋 Overview

This guide will help you deploy your full-stack application (backend, frontend, and database) to Railway in approximately 15-20 minutes.

**What you'll deploy:**
- ✅ Node.js backend API
- ✅ React frontend
- ✅ PostgreSQL database
- ✅ All services and integrations

**Final result:**
- Backend API: `https://your-app-api.railway.app`
- Frontend: `https://your-app.railway.app`
- Database: PostgreSQL on Railway

---

## ⏱️ Time Estimate

| Step | Time |
|------|------|
| Create Railway account | 2 min |
| Connect GitHub | 3 min |
| Create services | 5 min |
| Configure environment | 3 min |
| Deploy | 2 min |
| Verify deployment | 2 min |
| **Total** | **17 min** |

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ GitHub account with your code pushed
- ✅ `.env.production` file created locally (don't commit!)
- ✅ All API keys ready:
  - SendGrid API key
  - Stripe keys (publishable + secret)
  - AWS S3 credentials
  - Google Maps API key
  - HeyGen API key
  - Twilio credentials
  - Firebase credentials
  - Facebook OAuth credentials

**Don't have API keys?** See [GET_API_KEYS_GUIDE.md](./GET_API_KEYS_GUIDE.md)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Railway Account (2 minutes)

1. **Go to Railway website**
   - Open https://railway.app
   - Click "Start Free" button

2. **Sign up with GitHub**
   - Click "Continue with GitHub"
   - Authorize Railway to access your GitHub account
   - Accept terms and conditions

3. **Verify email**
   - Check your email for verification link
   - Click link to verify

4. **Complete profile**
   - Enter your name
   - Select your use case (Personal project)
   - Click "Continue"

**Result:** You now have a Railway account!

---

### Step 2: Create New Project (3 minutes)

1. **Go to Railway dashboard**
   - You should be on the dashboard automatically
   - If not, go to https://railway.app/dashboard

2. **Create new project**
   - Click "New Project" button (top right)
   - Select "Deploy from GitHub repo"

3. **Connect GitHub**
   - Click "Connect GitHub"
   - Select your GitHub account
   - Authorize Railway to access repositories

4. **Select repository**
   - Search for "life-event-automation"
   - Click to select it
   - Click "Deploy Now"

**Result:** Railway is now connected to your GitHub repo!

---

### Step 3: Create Services (5 minutes)

Railway will automatically create services based on your `package.json` files. Let's configure them:

#### 3a. Backend Service

1. **Wait for auto-detection**
   - Railway detects Node.js backend automatically
   - You'll see "Node.js" service created

2. **Configure backend**
   - Click on the Node.js service
   - Go to "Settings" tab
   - Set start command: `npm start`
   - Set build command: `npm run build:server`

3. **Add environment variables**
   - Go to "Variables" tab
   - Click "Add Variable"
   - Add all backend variables (see Step 4)

#### 3b. Frontend Service

1. **Add frontend service**
   - Click "Add Service"
   - Select "GitHub"
   - Select your repository again
   - Click "Deploy"

2. **Configure frontend**
   - Click on the new service
   - Go to "Settings" tab
   - Set start command: `npm run dev --prefix client`
   - Set build command: `npm run build --prefix client`

3. **Add environment variables**
   - Go to "Variables" tab
   - Add `VITE_API_URL=https://your-app-api.railway.app`

#### 3c. Database Service

1. **Add PostgreSQL database**
   - Click "Add Service"
   - Select "Database"
   - Choose "PostgreSQL"
   - Click "Create"

2. **Configure database**
   - Railway creates database automatically
   - You'll see connection string in Variables

3. **Link to backend**
   - Go to backend service
   - Go to "Variables" tab
   - Add `DATABASE_URL` from PostgreSQL service

**Result:** All three services created and linked!

---

### Step 4: Configure Environment Variables (3 minutes)

Now you need to add all your API keys and secrets to Railway.

#### 4a. Backend Environment Variables

Go to backend service → Variables tab → Add each variable:

**Database & Auth:**
```
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_jwt_secret_key_here
```

**SendGrid (Email):**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourapp.com
```

**Stripe (Payments):**
```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**AWS S3 (File Storage):**
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**Google Maps:**
```
GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxx
```

**HeyGen (AI Video):**
```
HEYGEN_API_KEY=xxxxxxxxxxxxx
```

**Twilio (SMS):**
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**Firebase (Push Notifications):**
```
FIREBASE_CREDENTIALS={"type":"service_account",...}
```

**Facebook OAuth:**
```
FACEBOOK_APP_ID=xxxxxxxxxxxxx
FACEBOOK_APP_SECRET=xxxxxxxxxxxxx
FACEBOOK_CALLBACK_URL=https://your-app-api.railway.app/auth/facebook/callback
```

**App Configuration:**
```
NODE_ENV=production
PORT=3000
APP_URL=https://your-app.railway.app
API_URL=https://your-app-api.railway.app
```

#### 4b. Frontend Environment Variables

Go to frontend service → Variables tab → Add:

```
VITE_API_URL=https://your-app-api.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxx
```

**How to add variables in Railway:**

1. Click "Variables" tab
2. Click "Add Variable" button
3. Enter variable name (e.g., `DATABASE_URL`)
4. Enter variable value
5. Click "Add"
6. Repeat for all variables

**Pro tip:** Use Railway's "Raw Editor" to paste multiple variables at once:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
SENDGRID_API_KEY=SG.xxx
```

---

### Step 5: Deploy (2 minutes)

#### 5a. Automatic Deployment

Railway automatically deploys when you push to GitHub:

1. **Make a commit**
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```

2. **Watch deployment**
   - Go to Railway dashboard
   - Click on your project
   - Watch services deploy
   - Green checkmark = deployed!

#### 5b. Manual Deployment

If you want to deploy without pushing to GitHub:

1. **Go to service**
   - Click on backend service
   - Click "Deployments" tab

2. **Trigger deployment**
   - Click "Deploy" button
   - Select branch to deploy
   - Click "Deploy"

3. **Monitor progress**
   - Watch logs in real-time
   - Green checkmark = success!

**Result:** Your app is now deployed to Railway!

---

### Step 6: Verify Deployment (2 minutes)

#### 6a. Check Backend

1. **Get backend URL**
   - Go to backend service
   - Click "Settings" tab
   - Copy "Railway Domain" URL
   - Example: `https://your-app-api.railway.app`

2. **Test API**
   - Open in browser: `https://your-app-api.railway.app/health`
   - Should see: `{"status":"ok"}`

3. **Check logs**
   - Go to "Logs" tab
   - Look for "Server running on port 3000"

#### 6b. Check Frontend

1. **Get frontend URL**
   - Go to frontend service
   - Click "Settings" tab
   - Copy "Railway Domain" URL
   - Example: `https://your-app.railway.app`

2. **Open in browser**
   - Visit the URL
   - Should see login page

3. **Test login**
   - Create account
   - Login
   - Should work!

#### 6c. Check Database

1. **Verify connection**
   - Go to backend service
   - Go to "Logs" tab
   - Look for "Database connected"

2. **Check tables**
   - Go to PostgreSQL service
   - Go to "Logs" tab
   - Should see database running

**Result:** Everything is deployed and working!

---

## 🔗 Custom Domain Setup (Optional)

If you want a custom domain instead of `railway.app`:

### Option 1: Use Railway Domain (Free)

Railway provides free subdomains:
- Backend: `your-app-api.railway.app`
- Frontend: `your-app.railway.app`

No setup needed! These work automatically.

### Option 2: Use Custom Domain (Paid)

If you have your own domain:

1. **Purchase domain**
   - Buy domain from GoDaddy, Namecheap, etc.
   - Or use existing domain

2. **Add domain to Railway**
   - Go to service
   - Click "Settings" tab
   - Scroll to "Domains"
   - Click "Add Domain"
   - Enter your domain

3. **Update DNS**
   - Railway shows DNS records to add
   - Add records to your domain registrar
   - Wait 24 hours for DNS to propagate

4. **Verify domain**
   - Railway automatically verifies
   - Green checkmark = ready!

---

## 🔧 Post-Deployment Configuration

### 1. Database Migrations

Run migrations on Railway:

1. **Connect to Railway PostgreSQL**
   ```bash
   # Get connection string from Railway dashboard
   psql postgresql://user:password@host:5432/db
   ```

2. **Run migrations**
   ```bash
   npm run prisma:migrate deploy
   ```

3. **Seed data (optional)**
   ```bash
   npm run prisma:seed
   ```

### 2. Environment Variables Update

Update frontend environment variables with actual URLs:

1. **Get backend URL**
   - From Railway dashboard
   - Example: `https://your-app-api.railway.app`

2. **Update frontend variables**
   - Go to frontend service
   - Go to "Variables" tab
   - Update `VITE_API_URL` with backend URL

3. **Redeploy frontend**
   - Push to GitHub or click "Deploy"
   - Frontend will use correct API URL

### 3. SSL/HTTPS

Railway automatically provides HTTPS:
- ✅ SSL certificate included
- ✅ Auto-renews
- ✅ No configuration needed

### 4. Monitoring & Logs

Monitor your deployment:

1. **View logs**
   - Go to service
   - Click "Logs" tab
   - Real-time logs displayed

2. **Set up alerts**
   - Go to service
   - Click "Alerts" tab
   - Configure error notifications

3. **Monitor metrics**
   - Go to service
   - Click "Metrics" tab
   - View CPU, memory, requests

---

## 📊 Monitoring & Maintenance

### Daily Monitoring

1. **Check logs**
   ```bash
   # SSH into Railway (optional)
   railway shell
   ```

2. **Monitor errors**
   - Go to backend service
   - Check "Logs" tab for errors
   - Fix and redeploy

3. **Check uptime**
   - Go to service
   - View "Metrics" tab
   - Should see 99%+ uptime

### Weekly Maintenance

1. **Update dependencies**
   ```bash
   npm update
   git push
   # Railway auto-deploys
   ```

2. **Backup database**
   - Go to PostgreSQL service
   - Download backup (optional)
   - Railway auto-backs up daily

3. **Review metrics**
   - Check CPU usage
   - Check memory usage
   - Check request count

### Monthly Maintenance

1. **Review costs**
   - Go to Railway dashboard
   - Check "Billing" tab
   - Review monthly charges

2. **Optimize performance**
   - Review slow queries
   - Add indexes if needed
   - Optimize code

3. **Security updates**
   - Update npm packages
   - Review security alerts
   - Deploy updates

---

## 🚨 Troubleshooting

### Problem: Deployment Failed

**Error: "Build failed"**

1. Check build logs
   ```bash
   # View logs in Railway dashboard
   # Click service → Logs tab
   ```

2. Common causes:
   - Missing dependencies
   - TypeScript errors
   - Environment variables not set

3. Fix:
   ```bash
   npm install
   npm run build:server
   git push
   ```

**Error: "Service crashed"**

1. Check logs for errors
2. Verify environment variables
3. Check database connection
4. Restart service

### Problem: Database Connection Failed

**Error: "Cannot connect to database"**

1. Verify DATABASE_URL variable
2. Check PostgreSQL service is running
3. Verify credentials

**Fix:**
1. Go to PostgreSQL service
2. Copy connection string
3. Update DATABASE_URL variable
4. Restart backend service

### Problem: Frontend Can't Connect to API

**Error: "API connection failed"**

1. Check VITE_API_URL variable
2. Verify backend URL is correct
3. Check CORS configuration

**Fix:**
1. Get backend URL from Railway
2. Update frontend VITE_API_URL
3. Redeploy frontend

### Problem: Slow Performance

**Issue: App is slow**

1. Check CPU/memory usage
2. Review database queries
3. Check network latency

**Fix:**
1. Upgrade service plan
2. Optimize queries
3. Add caching

### Problem: Out of Memory

**Error: "Out of memory"**

1. Check memory usage in Metrics
2. Identify memory leaks
3. Upgrade service

**Fix:**
1. Go to service Settings
2. Increase RAM allocation
3. Redeploy

---

## 💰 Cost Optimization

### Monitor Costs

1. **View billing**
   - Go to Railway dashboard
   - Click "Billing" tab
   - See monthly charges

2. **Typical costs**
   - Backend: $5-20/mo
   - Frontend: $5-10/mo
   - Database: $10-30/mo
   - **Total: $20-60/mo**

### Reduce Costs

1. **Use free tier**
   - Start with free tier
   - Upgrade when needed

2. **Right-size services**
   - Don't over-provision
   - Scale based on usage

3. **Optimize database**
   - Remove unused indexes
   - Archive old data
   - Use connection pooling

4. **Use CDN**
   - Railway includes CDN
   - No extra cost
   - Speeds up frontend

---

## 🔐 Security Best Practices

### Protect Your Secrets

1. **Never commit .env files**
   ```bash
   # Add to .gitignore
   .env
   .env.production
   .env.local
   ```

2. **Use Railway secrets**
   - Store all secrets in Railway
   - Never put in code
   - Never commit to GitHub

3. **Rotate secrets regularly**
   - Change API keys monthly
   - Update passwords quarterly
   - Review access logs

### Enable Security Features

1. **Enable HTTPS**
   - Railway auto-enables
   - No configuration needed

2. **Set up firewall rules**
   - Restrict database access
   - Only allow API calls
   - Block suspicious IPs

3. **Monitor access logs**
   - Review who accesses what
   - Look for suspicious activity
   - Set up alerts

---

## 📈 Scaling Your App

### When to Scale

1. **Monitor metrics**
   - CPU > 80% → Scale up
   - Memory > 80% → Scale up
   - Response time > 1s → Scale up

2. **Add more resources**
   - Go to service Settings
   - Increase CPU/RAM
   - Redeploy

3. **Add more instances**
   - Go to service Settings
   - Increase replica count
   - Railway load balances

### Scaling Strategy

**Phase 1: MVP (0-1K users)**
- Backend: 0.5 CPU, 512 MB RAM
- Frontend: 0.5 CPU, 512 MB RAM
- Database: Shared PostgreSQL

**Phase 2: Growth (1K-10K users)**
- Backend: 1 CPU, 1 GB RAM
- Frontend: 1 CPU, 1 GB RAM
- Database: Dedicated PostgreSQL

**Phase 3: Scale (10K+ users)**
- Backend: 2+ CPU, 2+ GB RAM
- Frontend: 2+ CPU, 2+ GB RAM
- Database: High-performance PostgreSQL
- Add caching layer (Redis)

---

## 🎯 Next Steps

### After Deployment

1. **Test everything**
   - Create account
   - Add contacts
   - Create events
   - Generate videos
   - Make payments

2. **Set up monitoring**
   - Enable error tracking
   - Set up alerts
   - Monitor metrics

3. **Configure domain**
   - Add custom domain (optional)
   - Update DNS records
   - Verify SSL certificate

4. **Launch marketing**
   - Tell people about your app
   - Share on social media
   - Get early users
   - Gather feedback

5. **Iterate and improve**
   - Fix bugs
   - Add features
   - Optimize performance
   - Scale as needed

---

## 📚 Additional Resources

### Railway Documentation
- [Railway Docs](https://docs.railway.app)
- [Railway Community](https://railway.app/community)
- [Railway Support](https://railway.app/support)

### Related Guides
- [Deployment Automation](./DEPLOYMENT_AUTOMATION.md)
- [Deployment Scripts Reference](./DEPLOYMENT_SCRIPTS_REFERENCE.md)
- [Launch Checklist](./LAUNCH_CHECKLIST.md)
- [Quick Start Guide](./QUICK_START.md)

### Troubleshooting
- [Railway Status](https://status.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub Issues](https://github.com/railwayapp/railway/issues)

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] API keys collected
- [ ] `.env.production` file created
- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] Backend service created
- [ ] Frontend service created
- [ ] PostgreSQL database created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Backend API working
- [ ] Frontend loading
- [ ] Database connected
- [ ] Login working
- [ ] Can create contacts
- [ ] Can create events
- [ ] Reminders sending
- [ ] Payments processing
- [ ] Videos generating
- [ ] Monitoring set up
- [ ] Domain configured (optional)
- [ ] Backup configured
- [ ] Team notified

---

## 🎉 Congratulations!

Your Life Event Automation platform is now live on Railway! 🚀

**Your app is available at:**
- Frontend: `https://your-app.railway.app`
- Backend API: `https://your-app-api.railway.app`
- Database: PostgreSQL on Railway

**Next steps:**
1. Share with friends and family
2. Gather feedback
3. Fix bugs and improve
4. Add new features
5. Scale as you grow

---

**Need help? Check the troubleshooting section or contact Railway support!**

**Last Updated:** April 9, 2026
**Version:** 1.0.0
