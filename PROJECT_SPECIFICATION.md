# Life Event Automation Platform - Project Specification

**Project Name:** MomentRemind (or similar)  
**Version:** 1.0 MVP  
**Status:** Planning Phase  
**Last Updated:** April 2026

---

## 📋 Executive Summary

**MomentRemind** is a subscription-based Personal CRM platform that automates the entire lifecycle of remembering and celebrating important life events (birthdays, anniversaries, milestones). The platform combines AI-powered personalization, smart gift recommendations, and multi-channel delivery (email, SMS, video, physical cards) to create an "emotional utility" that users never want to turn off.

**Target Market:**
- **B2C:** Individuals aged 25-55 who frequently forget important dates (early adopters: $9/mo)
- **B2B:** Property managers seeking tenant retention solutions ($99-299/mo)
- **B2B2C:** Brands seeking featured placements in curated deal emails ($500-2,000)

**Revenue Model:**
- Freemium subscription (Free → Pro $9/mo)
- B2B tenant management tier ($99-299/mo)
- Brand partnership placements ($500-2,000)
- Affiliate commissions (5-10% from gift purchases)

**Launch Timeline:** 7 weeks to MVP

---

## 🎯 Core Features (MVP)

### **Tier 1: Essential (Weeks 1-2)**
- [ ] User authentication (email/password, OAuth)
- [ ] Contact management (add/edit/delete people)
- [ ] Event tracking (birthdays, anniversaries, custom dates)
- [ ] Email reminders (14 days before event)
- [ ] Dashboard (upcoming events, quick stats)
- [ ] Subscription management (free → pro upgrade)

### **Tier 2: Personalization (Weeks 3-4)**
- [ ] AI video generation (personalized video messages)
- [ ] Smart gift recommendations (curated by occasion)
- [ ] Gift tracking (what you gave, to whom)
- [ ] Referral system (invite friends, earn credits)
- [ ] Brand partnership integration (featured deals)

### **Tier 3: Advanced (Weeks 5-6)**
- [ ] Admin dashboard (analytics, brand management)
- [ ] B2B tenant management (property manager tier)
- [ ] Physical card ordering (Printify integration)
- [ ] SMS reminders (optional)
- [ ] Group video compilation (VidDay feature)
- [ ] AR gift tags (QR code scanning)

### **Tier 4: Launch (Week 7)**
- [ ] Deployment guides
- [ ] Marketing materials
- [ ] Launch checklist

---

## 🏗️ Technical Architecture

### **System Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  React 19 + TypeScript + Tailwind CSS (Vercel Deployment)   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  API GATEWAY & MIDDLEWARE                    │
│  Express.js + Node.js (Railway Deployment)                  │
│  - Authentication (JWT)                                      │
│  - Rate limiting                                             │
│  - Error handling                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DATABASE   │ │   AI LAYER   │ │ INTEGRATIONS │
│ PostgreSQL   │ │ - HeyGen API │ │ - SendGrid   │
│ + Supabase   │ │ - Gemini LLM │ │ - Stripe     │
│              │ │ - Pinecone   │ │ - Twilio     │
└──────────────┘ └──────────────┘ │ - AWS S3     │
                                  │ - Printify   │
                                  └──────────────┘
```

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Shadcn/UI | Modern, responsive UI |
| **Backend** | Node.js, Express, TypeScript | API server, business logic |
| **Database** | PostgreSQL 14+, Supabase | Relational data, real-time |
| **Authentication** | JWT, OAuth 2.0 (Google, Apple) | Secure user sessions |
| **Email** | SendGrid API | Transactional emails, campaigns |
| **SMS** | Twilio API | SMS reminders (optional) |
| **Video AI** | HeyGen API or Elai.io | Personalized video generation |
| **LLM** | Google Gemini API | Gift recommendations, content generation |
| **Payments** | Stripe API | Subscription billing |
| **File Storage** | AWS S3 | Video, image, document storage |
| **Physical Products** | Printify API | Card/sticker ordering |
| **Automation** | Node.js cron jobs, Bull queue | Scheduled reminders, background tasks |
| **Hosting** | Vercel (frontend), Railway (backend) | Scalable deployment |
| **Monitoring** | Sentry, LogRocket | Error tracking, performance |
| **Analytics** | Mixpanel, Segment | User behavior, conversion tracking |

---

## 📊 Database Schema

### **Core Tables**

#### **Users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, business
  subscription_status VARCHAR(50), -- active, cancelled, paused
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

#### **Contacts**
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  relationship VARCHAR(50), -- friend, family, colleague, etc.
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Events**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  event_type VARCHAR(50) NOT NULL, -- birthday, anniversary, graduation, new_home, etc.
  event_date DATE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50), -- yearly, monthly, etc.
  reminder_days_before INTEGER DEFAULT 14,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

#### **Reminders**
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id),
  user_id UUID NOT NULL REFERENCES users(id),
  reminder_date TIMESTAMP NOT NULL,
  reminder_type VARCHAR(50), -- email, sms, push, video
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Gifts**
```sql
CREATE TABLE gifts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  gift_name VARCHAR(255),
  gift_description TEXT,
  gift_url TEXT,
  gift_price DECIMAL(10, 2),
  gift_source VARCHAR(100), -- amazon, etsy, local_store, etc.
  purchased_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

#### **AI_Videos**
```sql
CREATE TABLE ai_videos (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  video_url TEXT,
  video_script TEXT,
  avatar_style VARCHAR(50), -- realistic, animated, etc.
  heyGen_video_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, ready, failed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

#### **Brand_Partnerships**
```sql
CREATE TABLE brand_partnerships (
  id UUID PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  brand_email VARCHAR(255),
  contact_person VARCHAR(255),
  deal_description TEXT,
  discount_percentage INTEGER,
  deal_url TEXT,
  featured_placement_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(50), -- free, pro, business
  status VARCHAR(50), -- active, cancelled, paused
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **Referrals**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_email VARCHAR(255),
  referred_user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, expired
  credit_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔄 Key Workflows

### **Workflow 1: Event Reminder Automation**

```
1. User creates event (e.g., "Sarah's Birthday - May 15")
2. System stores event in database with reminder_days_before = 14
3. Cron job runs daily at 2 AM UTC
4. For each event with reminder_date = today:
   a. Create reminder record (status = pending)
   b. Generate email content (with gift recommendations)
   c. Send via SendGrid API
   d. Update reminder status = sent
5. User receives email 14 days before event
6. Email includes:
   - Personalized greeting
   - Gift recommendations (AI-curated)
   - Brand partnership deals
   - "Create video message" CTA
```

### **Workflow 2: AI Video Generation**

```
1. User clicks "Create Video Message" in reminder email
2. User selects:
   - Avatar style (realistic, animated, etc.)
   - Message tone (funny, sentimental, etc.)
3. System calls Gemini API to generate script
4. System calls HeyGen API to generate video
5. Video is stored in AWS S3
6. User receives email with video link
7. Video can be:
   - Sent to recipient via email
   - Embedded in physical card (QR code)
   - Shared on social media
```

### **Workflow 3: Smart Gift Recommendation**

```
1. Event reminder is triggered
2. System queries gift database by:
   - Event type (birthday, anniversary, etc.)
   - Contact relationship (friend, family, etc.)
   - User's gift history
   - Contact's interests (if available)
3. System calls Gemini API to rank gifts by:
   - Price range
   - Relevance
   - Availability
4. Top 5 gifts displayed in email
5. Each gift includes:
   - Product image
   - Description
   - Price
   - Affiliate link (if available)
6. User can purchase directly or save for later
```

### **Workflow 4: Subscription Management**

```
1. User upgrades from Free to Pro ($9/mo)
2. System creates Stripe checkout session
3. User completes payment
4. Stripe webhook triggers:
   a. Create subscription record
   b. Update user subscription_tier = 'pro'
   c. Send confirmation email
   d. Unlock premium features
5. Monthly billing continues until cancelled
6. On cancellation:
   a. Update subscription status = 'cancelled'
   b. Send retention email
   c. Downgrade to free tier
```

---

## 💰 Pricing & Revenue Model

### **B2C Subscription Tiers**

| Feature | Free | Pro ($9/mo) | Business ($99/mo) |
|---------|------|-------------|-------------------|
| Contacts | 10 | Unlimited | Unlimited |
| Events | 10 | Unlimited | Unlimited |
| Email Reminders | ✓ | ✓ | ✓ |
| SMS Reminders | ✗ | ✓ | ✓ |
| AI Video Messages | 0/year | 5/year | 50/year |
| Gift Recommendations | Basic | Smart AI | Concierge |
| Referral Credits | ✗ | ✓ | ✓ |
| Brand Partnerships | ✗ | ✓ | ✓ |
| Admin Dashboard | ✗ | ✗ | ✓ |
| API Access | ✗ | ✗ | ✓ |
| Support | Email | Email | Priority |

### **B2B Pricing**

**Property Manager Tier:** $99-299/mo
- Manage up to 500 tenant events
- Automated birthday/move-in anniversary reminders
- Tenant retention analytics
- Custom branding
- Bulk video generation

### **Revenue Streams**

1. **Subscription Revenue**
   - Free → Pro conversion: 5-10% of users
   - Average revenue per user: $3-5/mo
   - Target: 10,000 users by month 12 = $30-50K/mo

2. **Brand Partnerships**
   - Featured placement: $500-2,000 per brand
   - Target: 10-20 brands = $5-40K/mo

3. **Affiliate Commissions**
   - 5-10% commission on gift purchases
   - Target: $2-5K/mo (scaling with user base)

4. **B2B Tenant Management**
   - 50 property managers × $150/mo = $7.5K/mo

**Total Year 1 Revenue Projection:** $200-400K

---

## 🚀 Go-to-Market Strategy

### **Phase 1: Organic Growth (Months 1-2)**
- Launch with 100 beta users (friends, family, real estate contacts)
- Referral incentives (free month for successful referral)
- Content marketing (blog posts on "never forget a birthday again")
- Social media (TikTok, Instagram showing AI video feature)

### **Phase 2: Paid Acquisition (Months 3-4)**
- Meta Ads targeting "people with birthdays in [next month]"
- Google Ads for "birthday reminder app" keywords
- Influencer partnerships (lifestyle, productivity)
- Budget: $2-5K/month

### **Phase 3: B2B Expansion (Months 5-6)**
- Outreach to property managers (your real estate network)
- Case studies from early B2C users
- Enterprise sales team (1 person)
- Budget: $1-2K/month

### **Phase 4: Scale (Months 7-12)**
- Expand to 10,000+ users
- Launch B2B tenant management tier
- Partner with brands (Starbucks, local restaurants, etc.)
- Explore international markets

---

## 📈 Success Metrics

### **Key Performance Indicators (KPIs)**

| Metric | Target (Month 6) | Target (Month 12) |
|--------|-----------------|------------------|
| Total Users | 1,000 | 10,000 |
| Pro Subscribers | 50 | 1,000 |
| Monthly Active Users (MAU) | 500 | 6,000 |
| Free → Pro Conversion | 5% | 10% |
| Churn Rate | <5% | <3% |
| Average Revenue Per User | $2/mo | $5/mo |
| Customer Acquisition Cost | $10 | $8 |
| Lifetime Value | $180 | $600 |
| Brand Partnerships | 2 | 15 |
| B2B Customers | 0 | 10 |

---

## 🔐 Security & Compliance

### **Data Protection**
- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens with 24-hour expiration
- [ ] SSL/TLS encryption for all data in transit
- [ ] AWS S3 encryption at rest
- [ ] Regular security audits

### **Compliance**
- [ ] CAN-SPAM compliance (email marketing)
- [ ] GDPR compliance (EU users)
- [ ] CCPA compliance (California users)
- [ ] Privacy policy and terms of service
- [ ] Double opt-in for email lists
- [ ] User data export on request

### **API Security**
- [ ] Rate limiting (100 requests/minute per user)
- [ ] API key authentication
- [ ] CORS restrictions
- [ ] Input validation and sanitization
- [ ] SQL injection prevention

---

## 📅 Development Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Planning & Design** | Week 1 | Project spec, architecture, database schema |
| **Phase 2: MVP Backend** | Weeks 2-3 | Auth, contact mgmt, event system, email |
| **Phase 3: MVP Frontend** | Weeks 3-4 | Dashboard, contact forms, event management |
| **Phase 4: AI Integration** | Weeks 5-6 | Video generation, gift recommendations |
| **Phase 5: Payments & Admin** | Week 6 | Stripe integration, admin dashboard |
| **Phase 6: Testing & Polish** | Week 7 | E2E tests, bug fixes, performance optimization |
| **Phase 7: Launch** | Week 7 | Deployment, marketing, launch checklist |

**Total: 7 weeks to MVP**

---

## 🎯 Success Criteria

The MVP will be considered successful when:

- ✅ Users can sign up and create accounts
- ✅ Users can add contacts and events
- ✅ Email reminders are sent 14 days before events
- ✅ Users can upgrade to Pro tier
- ✅ AI video generation works (at least 1 video per user)
- ✅ Gift recommendations are displayed in reminders
- ✅ Admin dashboard shows basic analytics
- ✅ No critical bugs in production
- ✅ 100+ beta users with positive feedback
- ✅ Churn rate < 5%

---

## 📚 Next Steps

1. **Review this specification** - Confirm all features and timeline
2. **Design database schema** - Create detailed ER diagram
3. **Create architecture diagrams** - System design, API endpoints
4. **Set up development environment** - GitHub repo, CI/CD pipeline
5. **Begin Phase 1 development** - Backend scaffolding

---

**Document Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Ready for Review
