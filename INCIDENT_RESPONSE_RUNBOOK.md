# Incident Response Runbook

Complete guide for responding to and resolving incidents in your Life Event Automation platform.

---

## 📋 Overview

This runbook covers:

- ✅ Incident classification
- ✅ Response procedures
- ✅ Escalation paths
- ✅ Communication templates
- ✅ Troubleshooting steps
- ✅ Recovery procedures
- ✅ Post-incident review
- ✅ Prevention measures

**Result:** Fast, organized response to any incident!

---

## 🎯 Incident Severity Levels

### Level 1: Critical (Red)

**Definition:** Service is completely down or severely degraded

**Examples:**
- App is offline
- Database is down
- Payment processing is down
- Data loss occurring
- Security breach

**Response Time:** < 5 minutes
**Escalation:** Immediate
**Communication:** Slack + SMS + Phone

### Level 2: High (Orange)

**Definition:** Major functionality is impaired

**Examples:**
- Login not working
- Reminders not sending
- Videos not generating
- Error rate > 5%
- Performance severely degraded

**Response Time:** < 15 minutes
**Escalation:** 10 minutes if not resolved
**Communication:** Slack + Email

### Level 3: Medium (Yellow)

**Definition:** Minor functionality is impaired

**Examples:**
- Some features slow
- Error rate 1-5%
- Performance degraded
- Some users affected
- Partial feature outage

**Response Time:** < 1 hour
**Escalation:** 30 minutes if not resolved
**Communication:** Slack

### Level 4: Low (Blue)

**Definition:** Minimal impact

**Examples:**
- Cosmetic issues
- Minor bugs
- Error rate < 1%
- Single user affected
- Documentation issues

**Response Time:** < 1 day
**Escalation:** None
**Communication:** Email

---

## 🚨 Incident Response Procedures

### Step 1: Alert & Detection (0-5 min)

**When incident occurs:**

1. **Receive alert**
   - Slack notification
   - SMS notification
   - Email notification
   - Manual report

2. **Acknowledge receipt**
   - React to Slack message
   - Reply with acknowledgment
   - Start timer

3. **Assess severity**
   - Is service down?
   - How many users affected?
   - What's the impact?
   - Assign severity level

**Action:**
```
🚨 INCIDENT DETECTED
Severity: [LEVEL]
Time: [TIMESTAMP]
Affected: [USERS/SERVICES]
Assigned to: [PERSON]
```

---

### Step 2: Initial Response (5-15 min)

**Immediate actions:**

1. **Create incident channel**
   - Slack: #incident-[timestamp]
   - Invite relevant team members
   - Pin incident details

2. **Gather information**
   - Check monitoring dashboards
   - Review recent logs
   - Check recent deployments
   - Check infrastructure status

3. **Notify stakeholders**
   - Post to #incidents channel
   - Email affected users (if needed)
   - Update status page

4. **Start investigation**
   - Check error logs in Sentry
   - Check Railway logs
   - Check database status
   - Check external services

**Incident Template:**
```
🚨 INCIDENT REPORT

Severity: [LEVEL]
Service: [SERVICE]
Start Time: [TIME]
Status: INVESTIGATING

Description:
[What's happening]

Affected:
- [What's not working]

Impact:
- [How many users]
- [What can't they do]

Investigation:
- [What we're checking]
- [What we found so far]

Updates:
[Will update every 15 minutes]
```

---

### Step 3: Investigation & Diagnosis (15-45 min)

**Find the root cause:**

1. **Check application logs**
   ```bash
   # SSH into Railway
   railway shell
   
   # View logs
   tail -f /var/log/app.log
   
   # Search for errors
   grep ERROR /var/log/app.log | tail -20
   ```

2. **Check database**
   ```bash
   # Connect to database
   psql $DATABASE_URL
   
   # Check connections
   SELECT count(*) FROM pg_stat_activity;
   
   # Check slow queries
   SELECT query, calls, mean_time 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC LIMIT 10;
   ```

3. **Check infrastructure**
   - CPU usage in Railway
   - Memory usage in Railway
   - Disk usage in Railway
   - Network connectivity

4. **Check external services**
   - SendGrid status
   - Stripe status
   - AWS status
   - Google status

5. **Review recent changes**
   - Recent deployments
   - Recent code changes
   - Recent configuration changes
   - Recent database migrations

**Diagnosis Checklist:**
```
[ ] Checked application logs
[ ] Checked error tracking (Sentry)
[ ] Checked database status
[ ] Checked infrastructure metrics
[ ] Checked external services
[ ] Reviewed recent changes
[ ] Identified root cause
```

---

### Step 4: Mitigation (45-90 min)

**Stop the bleeding:**

1. **Immediate mitigation**
   - Scale up services if needed
   - Clear cache if needed
   - Disable problematic feature if needed
   - Redirect traffic if needed

2. **Temporary fix**
   - Restart service
   - Restart database
   - Clear connections
   - Rollback recent changes

3. **Permanent fix**
   - Fix code issue
   - Fix configuration
   - Fix database
   - Fix infrastructure

**Mitigation Options:**

**Option A: Restart Service**
```bash
# SSH into Railway
railway shell

# Restart app
systemctl restart app

# Check status
systemctl status app
```

**Option B: Rollback Deployment**
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Pipeline will auto-deploy
# Check Railway dashboard
```

**Option C: Scale Up**
```bash
# Go to Railway dashboard
# Click service
# Click Settings
# Increase CPU/RAM
# Click Save
# Service will restart with new resources
```

**Option D: Fix Code**
```bash
# Fix the issue
git add .
git commit -m "Fix [issue]"
git push origin main

# Pipeline will auto-deploy
```

---

### Step 5: Verification (90-120 min)

**Confirm the fix works:**

1. **Test functionality**
   - Can users login?
   - Can users create events?
   - Can users receive reminders?
   - Can users make payments?

2. **Monitor metrics**
   - Error rate back to normal?
   - Response time back to normal?
   - CPU/memory normal?
   - No new errors?

3. **Check user reports**
   - Are users reporting issues?
   - Are users happy?
   - Any new problems?

4. **Health check**
   ```bash
   # Test API
   curl https://api.example.com/health
   
   # Should return:
   # {"status":"ok"}
   ```

**Verification Checklist:**
```
[ ] Tested login
[ ] Tested core features
[ ] Tested payments
[ ] Checked error rate
[ ] Checked response time
[ ] Checked CPU/memory
[ ] Checked user reports
[ ] Health check passed
```

---

### Step 6: Communication (Throughout)

**Keep everyone informed:**

1. **Update incident channel**
   - Every 15 minutes
   - Include status
   - Include ETA if known
   - Include next steps

2. **Update status page**
   - Set status to "Investigating"
   - Provide updates
   - Set ETA for resolution
   - Update when resolved

3. **Notify users** (if needed)
   - Email affected users
   - Post to social media
   - Update help documentation
   - Provide workaround if possible

**Update Template:**
```
🔄 UPDATE [TIME]

Status: [INVESTIGATING/FIXING/TESTING/RESOLVED]
Progress: [%]
ETA: [TIME]

What we've done:
- [Action 1]
- [Action 2]

What we're doing next:
- [Action 3]
- [Action 4]

Thank you for your patience!
```

---

### Step 7: Resolution & Closure (120+ min)

**Close the incident:**

1. **Confirm resolution**
   - All systems normal
   - All tests passing
   - Users reporting success
   - Monitoring shows healthy

2. **Update incident channel**
   ```
   ✅ INCIDENT RESOLVED
   
   Duration: [TIME]
   Root Cause: [CAUSE]
   Resolution: [WHAT WE DID]
   
   Post-incident review scheduled for [TIME]
   ```

3. **Update status page**
   - Set status to "Resolved"
   - Post incident summary
   - Thank users for patience

4. **Close incident channel**
   - Archive channel
   - Save logs
   - Document resolution

---

### Step 8: Post-Incident Review (24-48 hours)

**Learn from the incident:**

1. **Schedule review meeting**
   - Invite all involved
   - Set 30-minute meeting
   - Review incident timeline

2. **Document incident**
   - What happened?
   - Why did it happen?
   - How did we respond?
   - What did we learn?

3. **Identify action items**
   - What could we improve?
   - What should we prevent?
   - What should we automate?
   - What should we monitor?

4. **Create prevention measures**
   - Add monitoring
   - Add alerts
   - Add tests
   - Add documentation
   - Update runbooks

**Post-Incident Review Template:**
```
# Incident Review

**Incident:** [NAME]
**Date:** [DATE]
**Duration:** [TIME]
**Severity:** [LEVEL]

## Timeline
- [TIME]: Incident started
- [TIME]: Alert received
- [TIME]: Investigation started
- [TIME]: Root cause identified
- [TIME]: Fix deployed
- [TIME]: Incident resolved

## Root Cause
[What caused the incident]

## Impact
- Users affected: [NUMBER]
- Revenue lost: $[AMOUNT]
- Downtime: [TIME]

## Response
- Time to detect: [TIME]
- Time to respond: [TIME]
- Time to resolve: [TIME]

## What Went Well
- [POSITIVE 1]
- [POSITIVE 2]

## What Could Improve
- [IMPROVEMENT 1]
- [IMPROVEMENT 2]

## Action Items
- [ ] [ACTION 1]
- [ ] [ACTION 2]
- [ ] [ACTION 3]

## Prevention
- [PREVENTION 1]
- [PREVENTION 2]
```

---

## 🔧 Common Incidents & Solutions

### Incident 1: Database Connection Failed

**Symptoms:**
- App can't connect to database
- Error: "Connection refused"
- Users can't login

**Diagnosis:**
```bash
# Check database status
psql $DATABASE_URL -c "SELECT 1"

# Check connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"

# Check if database is running
railway shell
systemctl status postgres
```

**Solutions:**

**Option A: Restart Database**
```bash
# SSH into Railway
railway shell

# Restart database
systemctl restart postgres

# Verify
psql $DATABASE_URL -c "SELECT 1"
```

**Option B: Increase Connections**
```bash
# Edit postgresql.conf
nano /etc/postgresql/15/main/postgresql.conf

# Find: max_connections = 100
# Change to: max_connections = 200

# Restart
systemctl restart postgres
```

**Option C: Clear Idle Connections**
```bash
# Connect to database
psql $DATABASE_URL

# Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND query_start < now() - interval '30 minutes';
```

---

### Incident 2: High Error Rate

**Symptoms:**
- Error rate > 5%
- Users reporting errors
- Sentry showing errors

**Diagnosis:**
```bash
# Check Sentry
# Go to Sentry dashboard
# View top errors
# Check error traces

# Check logs
railway shell
tail -f /var/log/app.log | grep ERROR
```

**Solutions:**

**Option A: Identify Error Pattern**
```bash
# Search logs for error
grep "specific error" /var/log/app.log

# Count occurrences
grep "specific error" /var/log/app.log | wc -l

# Get context
grep -B5 -A5 "specific error" /var/log/app.log
```

**Option B: Fix Code Issue**
```bash
# Find problematic code
# Review recent changes
# Fix the issue
git add .
git commit -m "Fix error"
git push origin main

# Pipeline will deploy
```

**Option C: Disable Feature**
```bash
# If feature is causing errors
# Disable it temporarily
# Set feature flag to false
# Deploy
# Fix issue
# Re-enable feature
```

---

### Incident 3: App is Down

**Symptoms:**
- App returns 502 Bad Gateway
- App doesn't respond
- Pingdom shows down

**Diagnosis:**
```bash
# Check if service is running
railway shell
systemctl status app

# Check logs
tail -f /var/log/app.log

# Check CPU/memory
top

# Check disk space
df -h
```

**Solutions:**

**Option A: Restart Service**
```bash
# SSH into Railway
railway shell

# Restart app
systemctl restart app

# Check status
systemctl status app

# View logs
tail -f /var/log/app.log
```

**Option B: Scale Up**
```bash
# Go to Railway dashboard
# Click service
# Click Settings
# Increase CPU/RAM
# Click Save

# Service will restart with more resources
```

**Option C: Rollback**
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Pipeline will auto-deploy
```

---

### Incident 4: Slow Performance

**Symptoms:**
- Response time > 2 seconds
- Users reporting slowness
- CPU/memory high

**Diagnosis:**
```bash
# Check CPU/memory
top

# Check slow queries
psql $DATABASE_URL
SELECT query, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

# Check network latency
ping 8.8.8.8
```

**Solutions:**

**Option A: Optimize Queries**
```bash
# Find slow queries
# Add indexes
# Optimize code
# Deploy fix
```

**Option B: Scale Up**
```bash
# Increase CPU/RAM
# Railway dashboard → Settings
# Increase resources
# Restart service
```

**Option C: Add Caching**
```bash
# Add Redis cache
# Cache frequently accessed data
# Deploy
# Monitor performance
```

---

### Incident 5: Payment Processing Failed

**Symptoms:**
- Users can't pay
- Stripe errors
- Payment webhooks not received

**Diagnosis:**
```bash
# Check Stripe status
# Go to https://status.stripe.com

# Check webhook logs
# Go to Stripe dashboard
# View webhook deliveries

# Check app logs
grep "stripe" /var/log/app.log
```

**Solutions:**

**Option A: Check Stripe Connection**
```bash
# Verify Stripe API key
# Check environment variables
# Verify webhook URL
# Test webhook
```

**Option B: Resend Webhook**
```bash
# Go to Stripe dashboard
# Find failed webhook
# Click "Resend"
# Verify it's received
```

**Option C: Manual Payment**
```bash
# Create payment manually in Stripe
# Update user's subscription
# Send confirmation email
# Investigate root cause
```

---

## 📋 Incident Checklist

### During Incident

- [ ] Received alert
- [ ] Acknowledged receipt
- [ ] Assessed severity
- [ ] Created incident channel
- [ ] Gathered information
- [ ] Notified stakeholders
- [ ] Started investigation
- [ ] Identified root cause
- [ ] Implemented mitigation
- [ ] Verified fix
- [ ] Updated status page
- [ ] Communicated with users

### After Incident

- [ ] Closed incident channel
- [ ] Documented incident
- [ ] Scheduled review meeting
- [ ] Held review meeting
- [ ] Identified action items
- [ ] Created prevention measures
- [ ] Updated runbooks
- [ ] Shared learnings with team
- [ ] Monitored for recurrence

---

## 🎯 Response Time Targets

| Severity | Detection | Response | Resolution | Target |
|----------|-----------|----------|-----------|--------|
| Level 1 | < 5 min | < 5 min | < 1 hour | 99.9% uptime |
| Level 2 | < 15 min | < 15 min | < 4 hours | 99.5% uptime |
| Level 3 | < 1 hour | < 1 hour | < 1 day | 99% uptime |
| Level 4 | < 1 day | < 1 day | < 1 week | 95% uptime |

---

## 📞 Escalation Path

### Level 1 (Critical)

1. **0-5 min:** On-call engineer
2. **5-10 min:** Engineering lead
3. **10-15 min:** CTO
4. **15+ min:** CEO + Investors

### Level 2 (High)

1. **0-15 min:** On-call engineer
2. **15-30 min:** Engineering lead
3. **30+ min:** CTO

### Level 3 (Medium)

1. **0-1 hour:** On-call engineer
2. **1+ hour:** Engineering lead

### Level 4 (Low)

1. **Anytime:** On-call engineer

---

## 📚 Resources

### Tools
- Sentry: Error tracking
- Railway: Infrastructure
- Pingdom: Uptime monitoring
- Slack: Communication

### Documentation
- Monitoring Guide
- Troubleshooting Guide
- Architecture Documentation
- API Documentation

### Contacts
- On-call engineer: [PHONE]
- Engineering lead: [PHONE]
- CTO: [PHONE]
- CEO: [PHONE]

---

## ✅ Setup Checklist

- [ ] Runbook distributed to team
- [ ] Team trained on procedures
- [ ] On-call rotation set up
- [ ] Escalation contacts added
- [ ] Incident channel template created
- [ ] Status page configured
- [ ] Monitoring alerts configured
- [ ] Communication templates prepared
- [ ] Post-incident review process defined
- [ ] Prevention measures identified

---

## 🎉 You're Ready!

Your team is now prepared to handle incidents!

**What you have:**
- ✅ Clear procedures
- ✅ Severity levels
- ✅ Response times
- ✅ Troubleshooting steps
- ✅ Communication templates
- ✅ Escalation paths

**Next steps:**
1. Train team on runbook
2. Set up on-call rotation
3. Test incident response
4. Monitor for incidents
5. Review and improve

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
