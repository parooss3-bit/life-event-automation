# Life Event Automation Platform - API Architecture

**API Version:** 1.0  
**Base URL:** `https://api.momentremind.com/v1`  
**Authentication:** JWT Bearer Token  
**Rate Limit:** 100 requests/minute per user

---

## 🏗️ API Structure

```
API Gateway (Express.js)
├── Authentication Routes
│   ├── POST /auth/signup
│   ├── POST /auth/login
│   ├── POST /auth/logout
│   ├── POST /auth/refresh
│   ├── POST /auth/google
│   └── POST /auth/apple
│
├── User Routes
│   ├── GET /users/me
│   ├── PUT /users/me
│   ├── GET /users/me/dashboard
│   ├── PUT /users/me/preferences
│   └── DELETE /users/me
│
├── Contacts Routes
│   ├── GET /contacts
│   ├── POST /contacts
│   ├── GET /contacts/:id
│   ├── PUT /contacts/:id
│   ├── DELETE /contacts/:id
│   └── GET /contacts/:id/events
│
├── Events Routes
│   ├── GET /events
│   ├── POST /events
│   ├── GET /events/:id
│   ├── PUT /events/:id
│   ├── DELETE /events/:id
│   └── GET /events/upcoming
│
├── Reminders Routes
│   ├── GET /reminders
│   ├── GET /reminders/:id
│   ├── PUT /reminders/:id/mark-sent
│   └── GET /reminders/pending
│
├── Gifts Routes
│   ├── GET /gifts
│   ├── POST /gifts
│   ├── GET /gifts/:id
│   ├── PUT /gifts/:id
│   ├── DELETE /gifts/:id
│   └── GET /gifts/recommendations/:eventId
│
├── AI Videos Routes
│   ├── GET /videos
│   ├── POST /videos/generate
│   ├── GET /videos/:id
│   ├── GET /videos/:id/status
│   ├── PUT /videos/:id/send
│   └── DELETE /videos/:id
│
├── Subscriptions Routes
│   ├── GET /subscriptions/me
│   ├── POST /subscriptions/upgrade
│   ├── POST /subscriptions/downgrade
│   ├── POST /subscriptions/cancel
│   └── POST /subscriptions/webhook
│
├── Referrals Routes
│   ├── GET /referrals/me
│   ├── POST /referrals/invite
│   ├── GET /referrals/:id
│   └── POST /referrals/:id/complete
│
├── Brand Partnerships Routes
│   ├── GET /partnerships
│   ├── GET /partnerships/:id
│   ├── GET /partnerships/category/:category
│   └── POST /partnerships/featured
│
└── Admin Routes
    ├── GET /admin/analytics
    ├── GET /admin/users
    ├── GET /admin/partnerships
    ├── POST /admin/partnerships
    └── PUT /admin/partnerships/:id
```

---

## 🔐 Authentication

### **JWT Token Structure**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "tier": "pro",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

### **Token Expiration**
- Access Token: 24 hours
- Refresh Token: 30 days

### **Request Headers**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 📝 Core Endpoints

### **Authentication Endpoints**

#### **POST /auth/signup**
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "subscription_tier": "free",
  "created_at": "2026-04-08T10:00:00Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **POST /auth/login**
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "subscription_tier": "pro",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **User Endpoints**

#### **GET /users/me**
Get current user profile

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://...",
  "phone": "+1-555-0123",
  "timezone": "America/Los_Angeles",
  "subscription_tier": "pro",
  "subscription_status": "active",
  "email_notifications": true,
  "sms_notifications": true,
  "created_at": "2026-04-08T10:00:00Z"
}
```

#### **GET /users/me/dashboard**
Get user dashboard stats

**Response (200):**
```json
{
  "total_contacts": 45,
  "total_events": 78,
  "upcoming_events": 5,
  "total_gifts": 120,
  "total_videos": 8,
  "subscription_tier": "pro",
  "subscription_expires_at": "2026-05-08T10:00:00Z",
  "referral_credits": 2,
  "stats": {
    "events_this_month": 3,
    "reminders_sent": 45,
    "videos_created": 2,
    "gifts_purchased": 5
  }
}
```

---

### **Contacts Endpoints**

#### **GET /contacts**
Get all contacts for current user

**Query Parameters:**
- `limit`: 10 (default: 20)
- `offset`: 0 (default: 0)
- `sort`: first_name (default: created_at)
- `relationship`: friend (optional filter)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "Sarah",
      "last_name": "Smith",
      "email": "sarah@example.com",
      "phone": "+1-555-0123",
      "relationship": "friend",
      "interests": "pizza, yoga, tech",
      "avatar_url": "https://...",
      "created_at": "2026-04-08T10:00:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### **POST /contacts**
Create a new contact

**Request:**
```json
{
  "first_name": "Sarah",
  "last_name": "Smith",
  "email": "sarah@example.com",
  "phone": "+1-555-0123",
  "relationship": "friend",
  "interests": "pizza, yoga, tech",
  "favorite_gift_type": "experiences"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "first_name": "Sarah",
  "last_name": "Smith",
  "email": "sarah@example.com",
  "relationship": "friend",
  "created_at": "2026-04-08T10:00:00Z"
}
```

---

### **Events Endpoints**

#### **GET /events**
Get all events for current user

**Query Parameters:**
- `status`: upcoming (default: all)
- `event_type`: birthday (optional filter)
- `limit`: 20 (default)
- `offset`: 0 (default)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "contact_id": "uuid",
      "contact_name": "Sarah Smith",
      "event_type": "birthday",
      "title": "Sarah's 30th Birthday",
      "event_date": "2026-05-15",
      "days_until": 37,
      "is_recurring": true,
      "reminder_days_before": 14,
      "is_completed": false,
      "created_at": "2026-04-08T10:00:00Z"
    }
  ],
  "total": 78,
  "limit": 20,
  "offset": 0
}
```

#### **POST /events**
Create a new event

**Request:**
```json
{
  "contact_id": "uuid",
  "event_type": "birthday",
  "title": "Sarah's 30th Birthday",
  "event_date": "2026-05-15",
  "is_recurring": true,
  "recurrence_pattern": "yearly",
  "reminder_days_before": 14,
  "reminder_time": "09:00:00"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "contact_id": "uuid",
  "event_type": "birthday",
  "title": "Sarah's 30th Birthday",
  "event_date": "2026-05-15",
  "created_at": "2026-04-08T10:00:00Z"
}
```

#### **GET /events/upcoming**
Get upcoming events (next 30 days)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "contact_name": "Sarah Smith",
      "event_type": "birthday",
      "title": "Sarah's 30th Birthday",
      "event_date": "2026-05-15",
      "days_until": 37,
      "reminder_sent": false,
      "gift_ideas": 3,
      "video_created": false
    }
  ],
  "total": 5
}
```

---

### **Gifts Endpoints**

#### **GET /gifts/recommendations/:eventId**
Get AI-powered gift recommendations for an event

**Response (200):**
```json
{
  "event_id": "uuid",
  "contact_name": "Sarah Smith",
  "event_type": "birthday",
  "recommendations": [
    {
      "id": "uuid",
      "gift_name": "Yoga Mat",
      "gift_description": "Premium eco-friendly yoga mat",
      "gift_category": "fitness",
      "gift_price": 49.99,
      "gift_url": "https://amazon.com/...",
      "gift_source": "amazon",
      "affiliate_url": "https://amazon.com/...?tag=momentremind",
      "relevance_score": 0.95,
      "reason": "Based on Sarah's interest in yoga"
    },
    {
      "id": "uuid",
      "gift_name": "Pizza Making Kit",
      "gift_description": "Complete home pizza oven kit",
      "gift_category": "food",
      "gift_price": 299.99,
      "gift_url": "https://wayfair.com/...",
      "gift_source": "wayfair",
      "relevance_score": 0.88,
      "reason": "Sarah loves pizza"
    }
  ]
}
```

#### **POST /gifts**
Create a gift idea

**Request:**
```json
{
  "event_id": "uuid",
  "contact_id": "uuid",
  "gift_name": "Yoga Mat",
  "gift_description": "Premium eco-friendly yoga mat",
  "gift_category": "fitness",
  "gift_price": 49.99,
  "gift_url": "https://amazon.com/...",
  "gift_source": "amazon",
  "status": "idea"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "gift_name": "Yoga Mat",
  "status": "idea",
  "created_at": "2026-04-08T10:00:00Z"
}
```

---

### **AI Videos Endpoints**

#### **POST /videos/generate**
Generate a personalized AI video message

**Request:**
```json
{
  "event_id": "uuid",
  "contact_id": "uuid",
  "video_script": "Happy 30th Birthday, Sarah! Can't wait to celebrate with you!",
  "avatar_style": "realistic",
  "delivery_method": "email"
}
```

**Response (202):**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "status": "processing",
  "heyGen_video_id": "video-uuid",
  "estimated_completion": "2026-04-08T11:00:00Z",
  "message": "Your video is being generated. We'll notify you when it's ready."
}
```

#### **GET /videos/:id/status**
Check video generation status

**Response (200):**
```json
{
  "id": "uuid",
  "status": "ready",
  "video_url": "https://s3.amazonaws.com/...",
  "video_duration_seconds": 15,
  "created_at": "2026-04-08T10:00:00Z"
}
```

#### **PUT /videos/:id/send**
Send video to recipient

**Request:**
```json
{
  "delivery_method": "email",
  "recipient_email": "sarah@example.com",
  "message": "Check out this special birthday message!"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "sent",
  "sent_at": "2026-04-08T10:30:00Z",
  "delivery_method": "email",
  "recipient_email": "sarah@example.com"
}
```

---

### **Subscriptions Endpoints**

#### **POST /subscriptions/upgrade**
Upgrade to Pro tier

**Request:**
```json
{
  "plan_id": "pro",
  "payment_method_id": "pm_1234567890"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "plan_id": "pro",
  "status": "active",
  "current_period_start": "2026-04-08T10:00:00Z",
  "current_period_end": "2026-05-08T10:00:00Z",
  "stripe_subscription_id": "sub_1234567890"
}
```

#### **POST /subscriptions/webhook**
Stripe webhook for subscription events

**Request (from Stripe):**
```json
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_1234567890",
      "customer": "cus_1234567890",
      "status": "active"
    }
  }
}
```

**Response (200):**
```json
{
  "received": true
}
```

---

### **Referrals Endpoints**

#### **POST /referrals/invite**
Send referral invitation

**Request:**
```json
{
  "friend_email": "friend@example.com",
  "friend_name": "John Smith"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "referrer_id": "uuid",
  "referred_email": "friend@example.com",
  "status": "pending",
  "referral_link": "https://momentremind.com/join?ref=abc123",
  "created_at": "2026-04-08T10:00:00Z"
}
```

#### **GET /referrals/me**
Get referral stats

**Response (200):**
```json
{
  "total_referrals": 5,
  "pending": 3,
  "completed": 2,
  "total_credits": 2,
  "referral_link": "https://momentremind.com/join?ref=abc123",
  "referrals": [
    {
      "id": "uuid",
      "referred_email": "friend@example.com",
      "status": "completed",
      "credit_amount": 1,
      "completed_at": "2026-04-08T10:00:00Z"
    }
  ]
}
```

---

### **Brand Partnerships Endpoints**

#### **GET /partnerships**
Get active brand partnerships

**Query Parameters:**
- `category`: birthday (optional)
- `limit`: 20
- `offset`: 0

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "brand_name": "Starbucks",
      "brand_logo_url": "https://...",
      "deal_title": "Free Birthday Drink",
      "deal_description": "Get a free drink on your birthday",
      "discount_percentage": 100,
      "deal_url": "https://starbucks.com/...",
      "deal_category": "birthday",
      "is_featured": true
    }
  ],
  "total": 45
}
```

#### **GET /partnerships/category/:category**
Get partnerships for specific event category

**Response (200):**
```json
{
  "category": "birthday",
  "total": 12,
  "data": [
    {
      "id": "uuid",
      "brand_name": "Starbucks",
      "deal_title": "Free Birthday Drink",
      "discount_percentage": 100
    }
  ]
}
```

---

### **Admin Endpoints**

#### **GET /admin/analytics**
Get platform analytics (admin only)

**Response (200):**
```json
{
  "total_users": 1250,
  "active_users": 890,
  "pro_subscribers": 150,
  "monthly_recurring_revenue": 1350,
  "churn_rate": 0.03,
  "average_lifetime_value": 180,
  "events_created": 5420,
  "reminders_sent": 12340,
  "videos_generated": 450,
  "total_gifts_purchased": 2100,
  "affiliate_revenue": 5200
}
```

#### **POST /admin/partnerships**
Create brand partnership (admin only)

**Request:**
```json
{
  "brand_name": "Starbucks",
  "brand_email": "partnerships@starbucks.com",
  "contact_person": "John Doe",
  "deal_title": "Free Birthday Drink",
  "deal_description": "Get a free drink on your birthday",
  "discount_percentage": 100,
  "deal_url": "https://starbucks.com/...",
  "deal_category": "birthday",
  "featured_placement_price": 1000
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "brand_name": "Starbucks",
  "deal_title": "Free Birthday Drink",
  "is_active": true,
  "created_at": "2026-04-08T10:00:00Z"
}
```

---

## 🔄 Webhook Events

### **Stripe Webhooks**

```
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
charge.refunded
```

### **HeyGen Webhooks**

```
video.generation.completed
video.generation.failed
```

---

## ⚠️ Error Handling

### **Standard Error Response**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

### **Common Error Codes**

| Code | Status | Message |
|------|--------|---------|
| INVALID_TOKEN | 401 | Invalid or expired token |
| INSUFFICIENT_PERMISSIONS | 403 | You don't have permission to access this resource |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request parameters |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_SERVER_ERROR | 500 | Internal server error |

---

## 📊 Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

---

**API Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Ready for Implementation
