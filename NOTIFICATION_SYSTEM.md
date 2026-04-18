# Notification & Reminder System Documentation

**Version:** 1.0  
**Last Updated:** April 9, 2026

---

## 🎯 Overview

The Life Event Automation platform includes a comprehensive multi-channel notification system that automatically sends reminders via email, SMS, and push notifications. The system uses scheduled jobs to check for upcoming events and deliver timely reminders.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Reminder Scheduler (Node Cron)                  │
│  ├─ Runs daily at 8 AM                                  │
│  ├─ Checks for upcoming events                          │
│  └─ Triggers reminder delivery                          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │  Email  │      │   SMS   │      │  Push   │
    │ Service │      │ Service │      │ Service │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                │
    SendGrid           Twilio          Firebase
```

---

## 🔧 Services

### 1. Email Service (SendGrid)

**File:** `src/services/email.ts`

**Features:**
- Birthday reminders with personalized templates
- Anniversary reminders with milestone tracking
- Custom event reminders
- Welcome emails for new users
- Batch email sending
- HTML and text email formats

**Setup:**
1. Create SendGrid account at https://sendgrid.com/
2. Generate API key
3. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=noreply@yourapp.com
   ```

**Email Templates:**
- Birthday reminder (with emoji and CTA)
- Anniversary reminder (with years tracking)
- Custom event reminder
- Welcome email

---

### 2. SMS Service (Twilio)

**File:** `src/services/sms.ts`

**Features:**
- Birthday reminder SMS
- Anniversary reminder SMS
- Custom event reminder SMS
- Batch SMS sending
- SMS delivery status tracking

**Setup:**
1. Create Twilio account at https://www.twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**SMS Format:**
```
🎂 Reminder: Sarah's birthday is in 14 days! Don't forget to reach out. 🎉
```

---

### 3. Push Notification Service (Firebase)

**File:** `src/services/push.ts`

**Features:**
- Birthday reminder notifications
- Anniversary reminder notifications
- Custom event reminder notifications
- Multicast notifications (send to multiple devices)
- Topic-based subscriptions
- Delivery tracking

**Setup:**
1. Create Firebase project at https://console.firebase.google.com/
2. Generate service account credentials
3. Add to `.env`:
   ```
   FIREBASE_CREDENTIALS={"type":"service_account",...}
   ```

**Notification Format:**
```
Title: 🎂 Sarah's Birthday!
Body: Don't forget! Sarah's birthday is in 14 days.
```

---

### 4. Reminder Scheduler

**File:** `src/services/reminder-scheduler.ts`

**Features:**
- Automated daily reminder checks (8 AM)
- Multi-channel delivery (email, SMS, push)
- Reminder status tracking
- Immediate reminder sending
- Scheduler status monitoring

**How It Works:**
1. Runs daily at 8 AM
2. Queries all events where `daysUntilEvent === reminderDaysBefore`
3. For each matching event:
   - Gets user's notification preferences
   - Sends email (if enabled)
   - Sends SMS (if enabled)
   - Sends push notification (if enabled)
4. Creates reminder record for tracking

---

## 📋 Reminder API Endpoints

### GET /api/v1/reminders
Get all reminders for the user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `status` | string | Filter by status (pending, sent, failed, dismissed) |
| `eventId` | string | Filter by event ID |
| `sortBy` | string | Sort field (default: reminderDate) |
| `sortOrder` | string | Sort order (asc/desc, default: desc) |

**Response:**
```json
{
  "data": [
    {
      "id": "reminder-uuid",
      "eventId": "event-uuid",
      "userId": "user-uuid",
      "reminderDate": "2026-04-09T08:00:00Z",
      "status": "sent",
      "sentViaEmail": true,
      "sentViaSMS": false,
      "sentViaPush": true,
      "event": {
        "id": "event-uuid",
        "title": "Sarah's Birthday",
        "eventType": "birthday",
        "eventDate": "2026-05-15T00:00:00Z",
        "contact": {
          "firstName": "Sarah",
          "lastName": "Smith"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### GET /api/v1/reminders/:id
Get a specific reminder.

**Response:**
```json
{
  "id": "reminder-uuid",
  "eventId": "event-uuid",
  "userId": "user-uuid",
  "reminderDate": "2026-04-09T08:00:00Z",
  "status": "sent",
  "sentViaEmail": true,
  "sentViaSMS": false,
  "sentViaPush": true,
  "event": {
    "id": "event-uuid",
    "title": "Sarah's Birthday",
    "eventType": "birthday",
    "eventDate": "2026-05-15T00:00:00Z",
    "contact": {
      "firstName": "Sarah",
      "lastName": "Smith"
    }
  }
}
```

---

### PUT /api/v1/reminders/:id
Update reminder status.

**Request Body:**
```json
{
  "status": "dismissed"
}
```

**Valid Statuses:**
- `pending` - Waiting to be sent
- `sent` - Successfully sent
- `failed` - Failed to send
- `dismissed` - User dismissed the reminder

---

### DELETE /api/v1/reminders/:id
Soft delete a reminder.

**Response:**
```json
{
  "message": "Reminder deleted successfully",
  "id": "reminder-uuid"
}
```

---

### POST /api/v1/reminders/send-immediate/:eventId
Send an immediate reminder for an event (bypasses schedule).

**Response:**
```json
{
  "message": "Reminder sent successfully",
  "eventId": "event-uuid"
}
```

---

### GET /api/v1/reminders/stats/summary
Get reminder statistics.

**Response:**
```json
{
  "totalReminders": 150,
  "sentReminders": 145,
  "failedReminders": 2,
  "pendingReminders": 3,
  "byChannel": {
    "email": 145,
    "sms": 120,
    "push": 135
  }
}
```

---

### GET /api/v1/reminders/scheduler/status
Get reminder scheduler status.

**Response:**
```json
{
  "scheduler": {
    "isRunning": true,
    "jobs": ["daily-reminder-check"]
  }
}
```

---

## 🔐 User Notification Preferences

Users can control which channels they receive reminders on:

```typescript
{
  emailNotifications: boolean;    // Email reminders enabled
  smsNotifications: boolean;      // SMS reminders enabled
  pushNotifications: boolean;     // Push notifications enabled
}
```

**API Endpoint to Update:**
```bash
PUT /api/v1/users/me
{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true
}
```

---

## 📊 Reminder Data Model

```typescript
{
  id: string;              // UUID
  userId: string;          // User who owns this reminder
  eventId: string;         // Associated event
  reminderDate: Date;      // When reminder was sent
  status: string;          // pending, sent, failed, dismissed
  sentViaEmail: boolean;   // Email delivery status
  sentViaSMS: boolean;     // SMS delivery status
  sentViaPush: boolean;    // Push notification status
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;        // Soft delete timestamp
}
```

---

## 🔄 Reminder Flow

### Automatic Reminder Flow

```
1. Event created with reminderDaysBefore = 14
   ↓
2. Daily scheduler runs at 8 AM
   ↓
3. Checks if daysUntilEvent === 14
   ↓
4. Gets user's notification preferences
   ↓
5. Sends email (if enabled)
   ↓
6. Sends SMS (if enabled)
   ↓
7. Sends push notification (if enabled)
   ↓
8. Creates reminder record with status = "sent"
   ↓
9. User receives notification on preferred channels
```

### Immediate Reminder Flow

```
1. User clicks "Send Reminder Now"
   ↓
2. POST /reminders/send-immediate/:eventId
   ↓
3. Scheduler sends reminder immediately
   ↓
4. Bypasses scheduled time
   ↓
5. Respects user's notification preferences
```

---

## 🧪 Testing

### Test Email Reminder
```bash
curl -X POST http://localhost:3000/api/v1/reminders/send-immediate/EVENT_ID \
  -H "Authorization: Bearer JWT_TOKEN"
```

### Test SMS Reminder
Ensure Twilio credentials are configured and user has phone number set.

### Test Push Notification
Ensure Firebase is configured and user has device tokens registered.

---

## 📈 Monitoring & Analytics

### Key Metrics to Track

| Metric | Purpose |
|--------|---------|
| Total reminders sent | Volume of notifications |
| Email delivery rate | Email success rate |
| SMS delivery rate | SMS success rate |
| Push delivery rate | Push notification success rate |
| Failed reminders | Identify delivery issues |
| User preferences | Which channels users prefer |

### Query Examples

```sql
-- Get reminders sent today
SELECT COUNT(*) FROM reminders 
WHERE DATE(reminderDate) = CURRENT_DATE;

-- Get delivery rate by channel
SELECT 
  SUM(CASE WHEN sentViaEmail THEN 1 ELSE 0 END) as email_count,
  SUM(CASE WHEN sentViaSMS THEN 1 ELSE 0 END) as sms_count,
  SUM(CASE WHEN sentViaPush THEN 1 ELSE 0 END) as push_count
FROM reminders;

-- Get failed reminders
SELECT * FROM reminders 
WHERE status = 'failed' 
ORDER BY reminderDate DESC;
```

---

## 🚀 Production Deployment

### Environment Variables

```bash
# SendGrid
SENDGRID_API_KEY=sg_xxxxx
SENDGRID_FROM_EMAIL=noreply@momentremind.com

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Firebase
FIREBASE_CREDENTIALS={"type":"service_account",...}

# Frontend
FRONTEND_URL=https://momentremind.com
```

### Scaling Considerations

**Email:**
- SendGrid handles up to 100K emails/day on free tier
- Consider dedicated IP for higher volume
- Monitor bounce rates

**SMS:**
- Twilio charges per SMS (~$0.01 each)
- Set SMS budget limits
- Monitor delivery rates

**Push:**
- Firebase handles unlimited push notifications
- Monitor device token churn
- Clean up inactive tokens

---

## 🔧 Troubleshooting

### Reminders Not Sending

**Check:**
1. Scheduler is running: `GET /reminders/scheduler/status`
2. User has notification preferences enabled
3. Event has correct `reminderDaysBefore` value
4. API credentials are configured correctly

**Debug:**
```bash
# Check reminder logs
tail -f logs/combined.log | grep reminder

# Check event details
GET /api/v1/events/:eventId

# Send immediate reminder
POST /api/v1/reminders/send-immediate/:eventId
```

### Email Not Received

**Check:**
1. SendGrid API key is valid
2. From email is verified in SendGrid
3. User email is correct
4. Check spam folder
5. Check SendGrid activity log

### SMS Not Received

**Check:**
1. Twilio credentials are correct
2. Phone number is in E.164 format (+1234567890)
3. Twilio account has credits
4. Check Twilio logs

### Push Notifications Not Received

**Check:**
1. Firebase credentials are correct
2. Device tokens are registered
3. App has notification permissions
4. Device is online
5. Check Firebase Console logs

---

## 📚 References

- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Node Cron Documentation](https://github.com/kelektiv/node-cron)

---

**Status:** Ready for Implementation  
**Last Updated:** April 9, 2026
