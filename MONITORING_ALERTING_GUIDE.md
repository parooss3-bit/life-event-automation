# Monitoring & Alerting Guide

Complete guide to monitoring your Life Event Automation platform and setting up alerts for issues.

---

## 📋 Overview

This guide covers:

- ✅ Application monitoring (errors, performance)
- ✅ Infrastructure monitoring (CPU, memory, disk)
- ✅ Database monitoring (queries, connections)
- ✅ Uptime monitoring (availability)
- ✅ Alert configuration (Slack, email, SMS)
- ✅ Dashboards and metrics
- ✅ Log aggregation
- ✅ Performance tracking

**Result:** You'll know immediately if something goes wrong!

---

## 🎯 Monitoring Stack

### Application Monitoring
- **Sentry** - Error tracking and performance monitoring
- **LogRocket** - Session replay and debugging
- **Datadog** - Infrastructure and application monitoring

### Infrastructure Monitoring
- **Railway Dashboard** - Built-in monitoring
- **Grafana** - Custom dashboards
- **Prometheus** - Metrics collection

### Uptime Monitoring
- **Pingdom** - Uptime checks
- **StatusPage** - Status page for users
- **Healthchecks.io** - Cron job monitoring

### Log Aggregation
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Splunk** - Log analysis
- **Papertrail** - Cloud logging

---

## 🔧 Setup Instructions

### Step 1: Set Up Sentry (Error Tracking)

Sentry tracks errors and performance issues in real-time.

#### 1a. Create Sentry Account

1. Go to https://sentry.io
2. Click "Sign Up"
3. Create account with email
4. Verify email

#### 1b. Create Project

1. Click "Create Project"
2. Select "Node.js" for backend
3. Select "React" for frontend
4. Name project "Life Event Automation"
5. Click "Create Project"

#### 1c. Install Sentry SDK

**Backend:**
```bash
npm install @sentry/node @sentry/tracing
```

**Frontend:**
```bash
cd client
npm install @sentry/react @sentry/tracing
```

#### 1d. Configure Sentry

**Backend** (`src/index.ts`):
```typescript
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app: true,
      request: true,
    }),
  ],
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... your routes ...

app.use(Sentry.Handlers.errorHandler());
```

**Frontend** (`client/src/main.tsx`):
```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### 1e. Add Environment Variables

```env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

### Step 2: Set Up Railway Monitoring

Railway has built-in monitoring for your services.

#### 2a. View Metrics

1. Go to Railway dashboard
2. Click on your service
3. Click "Metrics" tab
4. View CPU, memory, requests

#### 2b. View Logs

1. Go to Railway dashboard
2. Click on your service
3. Click "Logs" tab
4. See real-time logs

#### 2c. Set Up Alerts

1. Go to service
2. Click "Alerts" tab
3. Click "New Alert"
4. Select alert type:
   - CPU > 80%
   - Memory > 80%
   - Errors > 10/min
5. Set notification (email)
6. Click "Create"

---

### Step 3: Set Up Uptime Monitoring

Monitor if your app is online.

#### 3a. Create Pingdom Account

1. Go to https://www.pingdom.com
2. Click "Sign Up"
3. Create account
4. Verify email

#### 3b. Create Uptime Check

1. Click "Add Check"
2. Enter your app URL: `https://your-app.railway.app`
3. Set check interval: 1 minute
4. Click "Create"

#### 3c. Set Up Alerts

1. Click on check
2. Go to "Alert Policies"
3. Click "New Alert"
4. Select notification type:
   - Email
   - SMS
   - Slack
5. Enter contact info
6. Click "Create"

---

### Step 4: Set Up Slack Alerts

Get alerts in Slack.

#### 4a. Create Slack Webhook

1. Go to your Slack workspace
2. Go to https://api.slack.com/apps
3. Click "Create New App"
4. Select "From scratch"
5. Name: "Monitoring Alerts"
6. Select workspace
7. Click "Create App"

#### 4b. Enable Webhooks

1. Click "Incoming Webhooks"
2. Toggle "Activate Incoming Webhooks"
3. Click "Add New Webhook to Workspace"
4. Select channel: #alerts
5. Click "Allow"

#### 4c. Copy Webhook URL

1. Copy the webhook URL
2. Add to GitHub Secrets as `SLACK_WEBHOOK_URL`
3. Use in monitoring tools

#### 4d. Configure Sentry Slack Integration

1. Go to Sentry project
2. Click "Integrations"
3. Search "Slack"
4. Click "Install"
5. Select channel: #alerts
6. Click "Authorize"

---

### Step 5: Set Up Custom Dashboard

Create a dashboard to monitor everything.

#### 5a. Using Railway Dashboard

1. Go to Railway dashboard
2. View all services
3. See metrics for each
4. Click on service for details

#### 5b. Using Grafana (Optional)

1. Install Grafana: https://grafana.com/grafana/download
2. Create data source (Prometheus)
3. Create dashboard
4. Add panels for:
   - CPU usage
   - Memory usage
   - Request rate
   - Error rate
   - Response time

---

## 📊 Key Metrics to Monitor

### Application Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 1% | Alert |
| Response Time | > 1s | Investigate |
| CPU Usage | > 80% | Scale up |
| Memory Usage | > 80% | Scale up |
| Request Rate | > 1000/min | Monitor |
| Database Connections | > 90% | Optimize |

### Business Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Active Users | Track growth | Daily |
| Signup Rate | > 10/day | Daily |
| Subscription Rate | > 5% | Daily |
| Revenue | Track growth | Daily |
| Churn Rate | < 5% | Weekly |
| Feature Usage | Track adoption | Weekly |

### Infrastructure Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| Uptime | > 99.9% | Alert if down |
| Disk Usage | > 80% | Clean up |
| Network Latency | > 100ms | Investigate |
| Database Size | > 80% quota | Archive data |

---

## 🚨 Alert Configuration

### Critical Alerts (Immediate)

**When to alert:**
- Application down
- Error rate > 5%
- Database down
- Payment processing failed

**How to alert:**
- Slack (immediate)
- SMS (urgent)
- Phone call (critical)

**Response time:** < 5 minutes

### Warning Alerts (Soon)

**When to alert:**
- CPU > 80%
- Memory > 80%
- Error rate > 1%
- Response time > 2s

**How to alert:**
- Slack (warning)
- Email (follow-up)

**Response time:** < 30 minutes

### Info Alerts (Later)

**When to alert:**
- Daily summary
- Weekly report
- Monthly metrics
- Feature usage

**How to alert:**
- Email (digest)
- Dashboard (view)

**Response time:** No urgency

---

## 📈 Dashboards

### Real-Time Dashboard

**What to display:**
- Current error rate
- Current response time
- Current CPU usage
- Current memory usage
- Current request rate
- Active users
- Recent errors
- Recent deployments

**Update frequency:** Every 10 seconds

### Daily Dashboard

**What to display:**
- Daily error count
- Daily user signups
- Daily revenue
- Daily feature usage
- Top errors
- Top pages
- Performance trends

**Update frequency:** Every hour

### Weekly Dashboard

**What to display:**
- Weekly active users
- Weekly signups
- Weekly revenue
- Weekly feature adoption
- Performance trends
- Error trends
- Uptime percentage

**Update frequency:** Every day

### Monthly Dashboard

**What to display:**
- Monthly active users
- Monthly revenue
- Monthly churn rate
- Feature adoption
- Performance trends
- Error trends
- Uptime percentage
- Cost breakdown

**Update frequency:** Every week

---

## 🔔 Notification Channels

### Slack

**Best for:** Real-time alerts, team notifications

**Setup:**
1. Create incoming webhook
2. Configure in monitoring tools
3. Test with test alert

**Example:**
```
🚨 Error Alert
App: Life Event Automation
Error: Database connection failed
Time: 2026-04-09 12:34:56
Count: 5 errors in last 5 minutes
Action: Check database connection
```

### Email

**Best for:** Important alerts, daily summaries

**Setup:**
1. Configure email in monitoring tools
2. Set email address
3. Test with test email

**Example:**
```
Subject: 🚨 Critical Alert: App Down

Your app is down!

Status: Offline
Last Check: 2026-04-09 12:34:56
Uptime: 99.8%

Action: Check app immediately
```

### SMS

**Best for:** Critical alerts only

**Setup:**
1. Add phone number to monitoring tool
2. Configure SMS provider (Twilio)
3. Test with test SMS

**Example:**
```
🚨 CRITICAL: App down
Check: https://dashboard.example.com
```

### PagerDuty

**Best for:** On-call rotation, escalation

**Setup:**
1. Create PagerDuty account
2. Create service
3. Add escalation policy
4. Integrate with monitoring tools

---

## 📋 Monitoring Checklist

### Daily Checks

- [ ] Check error rate in Sentry
- [ ] Check uptime in Pingdom
- [ ] Check CPU/memory in Railway
- [ ] Review error logs
- [ ] Check user signups
- [ ] Check revenue

### Weekly Checks

- [ ] Review weekly metrics
- [ ] Check performance trends
- [ ] Review error patterns
- [ ] Check database size
- [ ] Review feature usage
- [ ] Plan optimizations

### Monthly Checks

- [ ] Review monthly metrics
- [ ] Check cost breakdown
- [ ] Review churn rate
- [ ] Plan scaling
- [ ] Update monitoring rules
- [ ] Review alert thresholds

---

## 🔧 Troubleshooting

### Not Receiving Alerts

**Issue:** Alerts not appearing in Slack

**Fix:**
1. Check Slack webhook URL
2. Verify webhook is active
3. Check channel permissions
4. Test webhook manually
5. Check monitoring tool logs

### Too Many Alerts

**Issue:** Getting too many alerts

**Fix:**
1. Increase alert thresholds
2. Add alert deduplication
3. Set quiet hours
4. Group similar alerts
5. Review alert rules

### Missing Metrics

**Issue:** Metrics not showing in dashboard

**Fix:**
1. Check data source connection
2. Verify metrics are being collected
3. Check time range
4. Verify permissions
5. Restart monitoring service

---

## 📊 Sample Alerts

### Alert 1: High Error Rate

**Condition:** Error rate > 1%

**Message:**
```
🚨 High Error Rate Alert

App: Life Event Automation
Error Rate: 2.5%
Threshold: 1%
Time: 2026-04-09 12:34:56
Errors: 50 in last 5 minutes

Top Errors:
1. Database connection failed (20)
2. Authentication failed (15)
3. Payment processing failed (15)

Action: Check error logs and investigate
```

### Alert 2: High CPU Usage

**Condition:** CPU > 80%

**Message:**
```
⚠️ High CPU Usage Alert

App: Life Event Automation
CPU: 85%
Threshold: 80%
Time: 2026-04-09 12:34:56
Duration: 5 minutes

Action: Monitor and consider scaling up
```

### Alert 3: App Down

**Condition:** No response for 5 minutes

**Message:**
```
🚨 CRITICAL: App Down

App: Life Event Automation
Status: Offline
Last Check: 2026-04-09 12:34:56
Downtime: 5 minutes

Action: Investigate immediately!
```

---

## 🎯 Best Practices

### Alert Fatigue

**Problem:** Too many alerts → ignored alerts

**Solution:**
1. Set appropriate thresholds
2. Group related alerts
3. Use alert deduplication
4. Set quiet hours
5. Review and adjust regularly

### Alert Accuracy

**Problem:** False alarms

**Solution:**
1. Test alerts thoroughly
2. Use multiple conditions
3. Add context to alerts
4. Review alert history
5. Adjust thresholds based on data

### Alert Response

**Problem:** Alerts not acted on

**Solution:**
1. Define response procedures
2. Assign on-call rotation
3. Set response time SLAs
4. Track response metrics
5. Review incident reports

---

## 📚 Tools & Resources

### Monitoring Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Sentry | Error tracking | Free-$99/mo |
| Railway | Infrastructure | Included |
| Pingdom | Uptime monitoring | $10-100/mo |
| Grafana | Dashboards | Free |
| Datadog | Full monitoring | $15-100+/mo |

### Alert Channels

| Channel | Best For | Cost |
|---------|----------|------|
| Slack | Real-time | Free |
| Email | Important | Free |
| SMS | Critical | $0.01-0.10 |
| PagerDuty | On-call | $15-50/mo |
| Phone | Emergency | $0.10-1.00 |

---

## ✅ Setup Checklist

- [ ] Sentry account created
- [ ] Sentry SDK installed (backend)
- [ ] Sentry SDK installed (frontend)
- [ ] Sentry configured
- [ ] Railway alerts configured
- [ ] Pingdom account created
- [ ] Uptime checks configured
- [ ] Slack webhook created
- [ ] Sentry Slack integration enabled
- [ ] Dashboard created
- [ ] Alert rules configured
- [ ] Test alerts sent
- [ ] Team trained on alerts
- [ ] On-call rotation set up
- [ ] Response procedures documented

---

## 🎉 You're Monitoring!

Your app is now fully monitored with real-time alerts!

**What you get:**
- ✅ Real-time error tracking
- ✅ Performance monitoring
- ✅ Uptime monitoring
- ✅ Slack alerts
- ✅ Custom dashboards
- ✅ Metrics and analytics

**Next steps:**
1. Set up monitoring tools
2. Configure alerts
3. Test alerts
4. Train team
5. Monitor and optimize

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
