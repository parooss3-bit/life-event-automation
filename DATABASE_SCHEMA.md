# Life Event Automation Platform - Database Schema

**Database:** PostgreSQL 14+  
**ORM:** Prisma or TypeORM  
**Hosting:** Supabase (PostgreSQL + Real-time)

---

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐   ┌──────────────┐   │
│  │    USERS     │◄────────┤  CONTACTS    │───┤   EVENTS     │   │
│  │              │         │              │   │              │   │
│  │ • id (PK)    │         │ • id (PK)    │   │ • id (PK)    │   │
│  │ • email      │         │ • user_id    │   │ • user_id    │   │
│  │ • password   │         │ • first_name │   │ • contact_id │   │
│  │ • tier       │         │ • email      │   │ • event_type │   │
│  │ • stripe_id  │         │ • phone      │   │ • event_date │   │
│  └──────────────┘         └──────────────┘   └──────────────┘   │
│        │                         │                    │           │
│        │                         │                    │           │
│        ├────────────┬────────────┼────────────┬───────┴─────┐    │
│        │            │            │            │             │    │
│        ▼            ▼            ▼            ▼             ▼    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  │SUBSCRIPTIONS │ │  REFERRALS   │ │  REMINDERS   │ │    GIFTS     │
│  │              │ │              │ │              │ │              │
│  │ • id (PK)    │ │ • id (PK)    │ │ • id (PK)    │ │ • id (PK)    │
│  │ • user_id    │ │ • referrer_id│ │ • event_id   │ │ • user_id    │
│  │ • stripe_sub │ │ • referred_id│ │ • user_id    │ │ • event_id   │
│  │ • status     │ │ • status     │ │ • reminder_dt│ │ • contact_id │
│  └──────────────┘ │ • credit_amt │ │ • type       │ │ • gift_name  │
│                   │ • created_at │ │ • status     │ │ • price      │
│                   └──────────────┘ │ • sent_at    │ │ • url        │
│                                    └──────────────┘ └──────────────┘
│
│  ┌──────────────────┐         ┌──────────────────┐
│  │   AI_VIDEOS      │         │BRAND_PARTNERSHIPS│
│  │                  │         │                  │
│  │ • id (PK)        │         │ • id (PK)        │
│  │ • user_id        │         │ • brand_name     │
│  │ • event_id       │         │ • contact_person │
│  │ • contact_id     │         │ • deal_desc      │
│  │ • video_url      │         │ • discount_pct   │
│  │ • heyGen_id      │         │ • featured_price │
│  │ • status         │         │ • is_active      │
│  └──────────────────┘         └──────────────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Detailed Table Definitions

### **1. USERS Table**

**Purpose:** Store user account information and subscription details

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Subscription info
  subscription_tier VARCHAR(50) DEFAULT 'free',
  -- free, pro, business
  subscription_status VARCHAR(50),
  -- active, cancelled, paused, expired
  stripe_customer_id VARCHAR(255),
  
  -- OAuth
  google_id VARCHAR(255),
  apple_id VARCHAR(255),
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  UNIQUE(email),
  UNIQUE(stripe_customer_id),
  INDEX(subscription_tier),
  INDEX(created_at)
);
```

**Relationships:**
- Has many: Contacts, Events, Reminders, Gifts, AI_Videos, Subscriptions, Referrals

**Key Queries:**
```sql
-- Get all active pro users
SELECT * FROM users WHERE subscription_tier = 'pro' AND subscription_status = 'active';

-- Get users with upcoming events
SELECT DISTINCT u.* FROM users u
JOIN events e ON u.id = e.user_id
WHERE e.event_date BETWEEN NOW() AND NOW() + INTERVAL '30 days';
```

---

### **2. CONTACTS Table**

**Purpose:** Store information about people whose events user wants to track

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- Relationship
  relationship VARCHAR(50),
  -- friend, family, colleague, partner, child, parent, sibling, etc.
  
  -- Additional info
  interests TEXT,
  -- Comma-separated: pizza, yoga, tech, etc.
  notes TEXT,
  favorite_gift_type VARCHAR(100),
  -- e.g., "experiences", "food", "tech", etc.
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(created_at)
);
```

**Relationships:**
- Belongs to: User
- Has many: Events, Gifts, AI_Videos

**Key Queries:**
```sql
-- Get all contacts for a user
SELECT * FROM contacts WHERE user_id = $1 ORDER BY first_name;

-- Get contacts with upcoming events
SELECT DISTINCT c.* FROM contacts c
JOIN events e ON c.id = e.contact_id
WHERE c.user_id = $1 AND e.event_date BETWEEN NOW() AND NOW() + INTERVAL '7 days';
```

---

### **3. EVENTS Table**

**Purpose:** Store life events (birthdays, anniversaries, milestones)

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Event details
  event_type VARCHAR(50) NOT NULL,
  -- birthday, anniversary, graduation, new_home, new_job, promotion, engagement, wedding, baby, retirement, etc.
  
  title VARCHAR(255),
  -- e.g., "Sarah's 30th Birthday"
  
  description TEXT,
  event_date DATE NOT NULL,
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  -- yearly, monthly, weekly, etc.
  recurrence_end_date DATE,
  
  -- Reminders
  reminder_days_before INTEGER DEFAULT 14,
  reminder_time TIME DEFAULT '09:00:00',
  
  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(event_date),
  INDEX(event_type),
  INDEX(is_recurring)
);
```

**Relationships:**
- Belongs to: User, Contact
- Has many: Reminders, Gifts, AI_Videos

**Key Queries:**
```sql
-- Get upcoming events for a user (next 30 days)
SELECT * FROM events 
WHERE user_id = $1 
AND event_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY event_date;

-- Get all recurring events
SELECT * FROM events WHERE user_id = $1 AND is_recurring = TRUE;

-- Get events that need reminders today
SELECT * FROM events 
WHERE user_id = $1 
AND event_date = (NOW() + INTERVAL '1 day' * reminder_days_before)::DATE;
```

---

### **4. REMINDERS Table**

**Purpose:** Track reminder notifications sent to users

```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reminder details
  reminder_type VARCHAR(50) NOT NULL,
  -- email, sms, push, in_app
  
  reminder_date TIMESTAMP NOT NULL,
  reminder_number INTEGER DEFAULT 1,
  -- 1st reminder, 2nd reminder, etc.
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, sent, failed, bounced, unsubscribed
  
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  
  -- Error tracking
  error_message TEXT,
  error_code VARCHAR(50),
  
  -- Email-specific
  email_id VARCHAR(255),
  -- SendGrid message ID
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(reminder_date),
  INDEX(status),
  INDEX(created_at)
);
```

**Relationships:**
- Belongs to: Event, User

**Key Queries:**
```sql
-- Get reminders to send today
SELECT * FROM reminders 
WHERE status = 'pending' 
AND reminder_date <= NOW()
ORDER BY reminder_date;

-- Get sent reminders for a user
SELECT * FROM reminders 
WHERE user_id = $1 AND status = 'sent'
ORDER BY sent_at DESC;

-- Get failed reminders
SELECT * FROM reminders 
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

### **5. GIFTS Table**

**Purpose:** Track gifts given and recommendations for future events

```sql
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Gift details
  gift_name VARCHAR(255) NOT NULL,
  gift_description TEXT,
  gift_category VARCHAR(100),
  -- food, tech, experience, jewelry, etc.
  
  -- Purchase info
  gift_price DECIMAL(10, 2),
  gift_currency VARCHAR(3) DEFAULT 'USD',
  gift_url TEXT,
  gift_source VARCHAR(100),
  -- amazon, etsy, local_store, brand_website, etc.
  
  -- Affiliate tracking
  affiliate_url TEXT,
  affiliate_source VARCHAR(50),
  -- amazon, shareasale, etc.
  
  -- Status
  status VARCHAR(50) DEFAULT 'idea',
  -- idea, purchased, shipped, delivered, returned
  
  purchased_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Notes
  notes TEXT,
  recipient_feedback TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(event_id),
  INDEX(status),
  INDEX(created_at)
);
```

**Relationships:**
- Belongs to: User, Event, Contact

**Key Queries:**
```sql
-- Get gift ideas for an upcoming event
SELECT * FROM gifts 
WHERE event_id = $1 AND status = 'idea'
ORDER BY created_at DESC;

-- Get all purchased gifts
SELECT * FROM gifts 
WHERE user_id = $1 AND status = 'purchased'
ORDER BY purchased_at DESC;

-- Get gift history for a contact
SELECT * FROM gifts 
WHERE contact_id = $1 AND status = 'delivered'
ORDER BY delivered_at DESC;
```

---

### **6. AI_VIDEOS Table**

**Purpose:** Store AI-generated personalized video messages

```sql
CREATE TABLE ai_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Video details
  video_title VARCHAR(255),
  video_description TEXT,
  
  -- Generation info
  video_script TEXT,
  avatar_style VARCHAR(50),
  -- realistic, animated, cartoon, etc.
  
  -- HeyGen API
  heyGen_video_id VARCHAR(255),
  heyGen_status VARCHAR(50),
  -- pending, processing, ready, failed
  
  -- Storage
  video_url TEXT,
  video_duration_seconds INTEGER,
  video_size_mb DECIMAL(10, 2),
  
  -- Delivery
  delivery_method VARCHAR(50),
  -- email, physical_card, social_media, qr_code
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, processing, ready, sent, failed
  
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  
  -- Error tracking
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(status),
  INDEX(created_at)
);
```

**Relationships:**
- Belongs to: User, Event, Contact

**Key Queries:**
```sql
-- Get ready videos for a user
SELECT * FROM ai_videos 
WHERE user_id = $1 AND status = 'ready'
ORDER BY created_at DESC;

-- Get videos pending processing
SELECT * FROM ai_videos 
WHERE status = 'processing'
AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at;
```

---

### **7. SUBSCRIPTIONS Table**

**Purpose:** Track user subscription status and billing

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Stripe info
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  -- Plan details
  plan_id VARCHAR(50) NOT NULL,
  -- free, pro, business
  
  status VARCHAR(50) NOT NULL,
  -- active, cancelled, paused, expired
  
  -- Billing cycle
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  
  -- Cancellation
  cancel_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(status),
  INDEX(current_period_end)
);
```

**Relationships:**
- Belongs to: User

**Key Queries:**
```sql
-- Get active subscriptions expiring soon
SELECT * FROM subscriptions 
WHERE status = 'active' 
AND current_period_end BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY current_period_end;

-- Get cancelled subscriptions
SELECT * FROM subscriptions 
WHERE status = 'cancelled'
AND cancelled_at > NOW() - INTERVAL '30 days'
ORDER BY cancelled_at DESC;
```

---

### **8. REFERRALS Table**

**Purpose:** Track referral program and user acquisition

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_email VARCHAR(255) NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, completed, expired
  
  -- Reward
  credit_amount DECIMAL(10, 2) DEFAULT 0,
  credit_applied_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expired_at TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(referrer_id),
  INDEX(referred_email),
  INDEX(status),
  INDEX(created_at)
);
```

**Relationships:**
- Belongs to: User (referrer), User (referred)

**Key Queries:**
```sql
-- Get pending referrals for a user
SELECT * FROM referrals 
WHERE referrer_id = $1 AND status = 'pending'
ORDER BY created_at DESC;

-- Get completed referrals
SELECT * FROM referrals 
WHERE referrer_id = $1 AND status = 'completed'
ORDER BY completed_at DESC;
```

---

### **9. BRAND_PARTNERSHIPS Table**

**Purpose:** Store brand partnership deals featured in reminders

```sql
CREATE TABLE brand_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Brand info
  brand_name VARCHAR(255) NOT NULL,
  brand_logo_url TEXT,
  brand_website VARCHAR(255),
  brand_email VARCHAR(255),
  contact_person VARCHAR(255),
  
  -- Deal details
  deal_title VARCHAR(255),
  deal_description TEXT,
  deal_category VARCHAR(100),
  -- birthday, anniversary, new_home, etc.
  
  discount_percentage INTEGER,
  discount_amount DECIMAL(10, 2),
  discount_code VARCHAR(50),
  
  deal_url TEXT,
  deal_start_date DATE,
  deal_end_date DATE,
  
  -- Featured placement
  featured_placement_price DECIMAL(10, 2),
  featured_placement_start_date DATE,
  featured_placement_end_date DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX(brand_name),
  INDEX(deal_category),
  INDEX(is_active),
  INDEX(is_featured),
  INDEX(created_at)
);
```

**Relationships:**
- None (standalone)

**Key Queries:**
```sql
-- Get active deals for a category
SELECT * FROM brand_partnerships 
WHERE is_active = TRUE 
AND deal_category = $1
AND deal_start_date <= NOW() 
AND deal_end_date >= NOW()
ORDER BY is_featured DESC, created_at DESC;

-- Get featured placements
SELECT * FROM brand_partnerships 
WHERE is_featured = TRUE 
AND featured_placement_start_date <= NOW()
AND featured_placement_end_date >= NOW()
ORDER BY created_at DESC;
```

---

## 🔑 Indexes & Performance

### **Critical Indexes**

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- Contact lookups
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_user_relationship ON contacts(user_id, relationship);

-- Event lookups
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_upcoming ON events(user_id, event_date) WHERE event_date > NOW();

-- Reminder lookups
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_pending ON reminders(reminder_date) WHERE status = 'pending';
CREATE INDEX idx_reminders_user_date ON reminders(user_id, reminder_date);

-- Gift lookups
CREATE INDEX idx_gifts_event_id ON gifts(event_id);
CREATE INDEX idx_gifts_status ON gifts(status);

-- Video lookups
CREATE INDEX idx_ai_videos_status ON ai_videos(status);
CREATE INDEX idx_ai_videos_user_id ON ai_videos(user_id);

-- Subscription lookups
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Referral lookups
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
```

---

## 🔄 Database Migrations

### **Migration 1: Initial Schema**
- Create all 9 core tables
- Create all indexes
- Add constraints and foreign keys

### **Migration 2: Add Audit Trail**
- Add `created_by`, `updated_by` columns to key tables
- Add audit log table for tracking changes

### **Migration 3: Add Analytics**
- Add `analytics_events` table for tracking user actions
- Add `analytics_conversions` table for tracking conversions

---

## 📊 Sample Queries

### **Query 1: Get Reminders to Send Today**

```sql
SELECT 
  r.id,
  r.reminder_type,
  u.email,
  u.phone,
  e.title,
  c.first_name,
  c.last_name
FROM reminders r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
JOIN contacts c ON e.contact_id = c.id
WHERE r.status = 'pending'
  AND DATE(r.reminder_date) = CURRENT_DATE
  AND u.subscription_status = 'active'
ORDER BY r.reminder_date;
```

### **Query 2: Get User Dashboard Stats**

```sql
SELECT 
  u.id,
  u.email,
  COUNT(DISTINCT c.id) as total_contacts,
  COUNT(DISTINCT e.id) as total_events,
  COUNT(DISTINCT CASE WHEN e.event_date BETWEEN NOW() AND NOW() + INTERVAL '30 days' THEN e.id END) as upcoming_events,
  COUNT(DISTINCT g.id) as total_gifts,
  COUNT(DISTINCT v.id) as total_videos
FROM users u
LEFT JOIN contacts c ON u.id = c.user_id AND c.deleted_at IS NULL
LEFT JOIN events e ON u.id = e.user_id AND e.deleted_at IS NULL
LEFT JOIN gifts g ON u.id = g.user_id AND g.deleted_at IS NULL
LEFT JOIN ai_videos v ON u.id = v.user_id AND v.deleted_at IS NULL
WHERE u.id = $1
GROUP BY u.id;
```

### **Query 3: Get Revenue Analytics**

```sql
SELECT 
  DATE_TRUNC('month', s.created_at) as month,
  COUNT(DISTINCT s.user_id) as new_subscriptions,
  COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.user_id END) as active_subscriptions,
  SUM(CASE WHEN s.plan_id = 'pro' THEN 9 ELSE 0 END) as monthly_recurring_revenue
FROM subscriptions s
WHERE s.created_at > NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', s.created_at)
ORDER BY month DESC;
```

---

**Database Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Ready for Implementation
