# Payment Processing & Subscription Tiers

Complete guide for Stripe integration, subscription management, and billing.

---

## 📋 Overview

The platform uses **Stripe** for payment processing with three subscription tiers:

| Tier | Price | Billing | Features |
|------|-------|---------|----------|
| **Free** | $0 | N/A | 10 contacts, basic reminders |
| **Pro** | $9.99 | Monthly | Unlimited contacts, AI videos, gift recommendations |
| **Business** | $99.99 | Monthly | Everything + multi-user, API access, dedicated support |

---

## 🔧 Setup Instructions

### 1. Create Stripe Account

1. Go to https://stripe.com
2. Sign up for a free account
3. Complete identity verification
4. Go to Dashboard → Developers → API Keys
5. Copy your keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 2. Create Products & Prices

#### Pro Plan (Monthly)
```bash
# In Stripe Dashboard:
1. Products → Create product
2. Name: "Pro Plan"
3. Price: $9.99/month
4. Copy Price ID (starts with price_)
```

#### Business Plan (Monthly)
```bash
# In Stripe Dashboard:
1. Products → Create product
2. Name: "Business Plan"
3. Price: $99.99/month
4. Copy Price ID (starts with price_)
```

### 3. Configure Environment Variables

Create `.env` file in root directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_PRICE_ID_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_ID_BUSINESS_MONTHLY=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4. Set Up Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy Webhook Secret to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## 🏗️ Architecture

### Backend Services

#### Stripe Service (`src/services/stripe.ts`)

**Key Functions:**

```typescript
// Create Stripe customer
createStripeCustomer(userId, email, name)

// Create checkout session
createCheckoutSession(userId, tierId, successUrl, cancelUrl)

// Handle webhook events
handleStripeWebhook(event)

// Get user subscription
getUserSubscription(userId)

// Cancel subscription
cancelSubscription(userId)

// Reactivate subscription
reactivateSubscription(userId)

// Get billing portal URL
getBillingPortalUrl(userId, returnUrl)
```

#### Subscription Routes (`src/routes/subscriptions.ts`)

**Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/subscriptions/tiers` | Get all subscription tiers |
| GET | `/api/v1/subscriptions/current` | Get user's current subscription |
| POST | `/api/v1/subscriptions/checkout` | Create checkout session |
| POST | `/api/v1/subscriptions/cancel` | Cancel subscription |
| POST | `/api/v1/subscriptions/reactivate` | Reactivate subscription |
| GET | `/api/v1/subscriptions/billing-portal` | Get billing portal URL |

#### Webhook Handler (`src/routes/webhooks.ts`)

Handles all Stripe webhook events:
- Subscription created/updated
- Subscription cancelled
- Payment succeeded/failed

### Frontend Components

#### Pricing Page (`client/src/pages/PricingPage.tsx`)

- Display all subscription tiers
- Show current plan
- Upgrade/downgrade buttons
- FAQ section

#### Subscription Manager (`client/src/components/SubscriptionManager.tsx`)

- View current subscription
- Manage billing
- Cancel/reactivate subscription
- View billing period

---

## 📊 Subscription Tiers

### Free Tier

```json
{
  "id": "free",
  "name": "Free",
  "price": 0,
  "features": [
    "Up to 10 contacts",
    "Basic event reminders",
    "Email notifications",
    "Mobile app access"
  ],
  "maxContacts": 10,
  "maxEvents": 50,
  "aiVideoGeneration": false,
  "giftRecommendations": false
}
```

### Pro Tier

```json
{
  "id": "pro",
  "name": "Pro",
  "price": 9.99,
  "features": [
    "Unlimited contacts",
    "Advanced reminders (email, SMS, push)",
    "AI video generation",
    "Smart gift recommendations",
    "Gift budget tracking",
    "Priority support"
  ],
  "maxContacts": 10000,
  "maxEvents": 100000,
  "aiVideoGeneration": true,
  "giftRecommendations": true
}
```

### Business Tier

```json
{
  "id": "business",
  "name": "Business",
  "price": 99.99,
  "features": [
    "Everything in Pro",
    "Multi-user accounts",
    "Team management",
    "Advanced analytics",
    "API access",
    "Custom branding",
    "Dedicated support"
  ],
  "maxContacts": 100000,
  "maxEvents": 1000000,
  "aiVideoGeneration": true,
  "giftRecommendations": true
}
```

---

## 🔄 Subscription Flow

### Upgrade Flow

```
1. User clicks "Upgrade Now" on pricing page
2. Frontend calls POST /api/v1/subscriptions/checkout
3. Backend creates Stripe checkout session
4. User redirected to Stripe Checkout
5. User enters payment details
6. Stripe processes payment
7. Webhook: customer.subscription.created
8. Backend updates subscription in database
9. User redirected to success page
10. Dashboard shows new tier
```

### Cancellation Flow

```
1. User clicks "Cancel Subscription"
2. Frontend calls POST /api/v1/subscriptions/cancel
3. Backend calls Stripe to cancel at period end
4. Subscription marked as cancel_at_period_end
5. User can still use Pro features until period end
6. At period end, Stripe sends webhook
7. Backend downgrades to Free tier
8. User loses Pro features
```

### Webhook Flow

```
1. Stripe sends webhook event
2. Backend verifies webhook signature
3. Backend processes event:
   - subscription.created → Create subscription record
   - subscription.updated → Update subscription record
   - subscription.deleted → Mark as cancelled
   - payment_succeeded → Update status
   - payment_failed → Log error
4. Database updated
5. Frontend reflects changes on next load
```

---

## 💳 Payment Methods

### Supported Cards

- Visa
- Mastercard
- American Express
- Discover
- Diners Club
- JCB

### Test Cards

Use these in test mode:

| Card | Number | Exp | CVC |
|------|--------|-----|-----|
| Visa | 4242 4242 4242 4242 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| Amex | 3782 822463 10005 | 12/25 | 1234 |

---

## 🔒 Security

### Best Practices

✅ **Never expose Secret Key**
- Only use in backend
- Never commit to Git
- Use environment variables

✅ **Verify Webhooks**
- Always verify webhook signature
- Use webhook secret
- Reject unverified events

✅ **PCI Compliance**
- Use Stripe Checkout (hosted)
- Never handle raw card data
- Use Stripe Elements for custom forms

✅ **Rate Limiting**
- Implement rate limiting on checkout endpoint
- Prevent subscription spam

---

## 📈 Analytics & Monitoring

### Key Metrics

```typescript
// Track these metrics
- Total subscriptions by tier
- Monthly Recurring Revenue (MRR)
- Churn rate
- Upgrade/downgrade rates
- Failed payment rate
- Customer lifetime value (CLV)
```

### Monitoring

```bash
# Check Stripe Dashboard for:
1. Failed payments
2. Subscription churn
3. Revenue trends
4. Customer disputes
5. Webhook failures
```

---

## 🧪 Testing

### Local Testing

```bash
# 1. Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# 2. Login to Stripe
stripe login

# 3. Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhooks/stripe

# 4. Use test card in checkout
# 4242 4242 4242 4242

# 5. Check webhook events
stripe events list
```

### Testing Scenarios

```typescript
// Successful subscription
Card: 4242 4242 4242 4242

// Declined card
Card: 4000 0000 0000 0002

// Requires authentication
Card: 4000 0025 0000 3155

// 3D Secure required
Card: 4000 0027 6000 3184
```

---

## 🚀 Deployment

### Production Setup

1. **Stripe Account**
   - Upgrade to live mode
   - Complete business verification
   - Set up payout schedule

2. **Environment Variables**
   - Update to live API keys
   - Update to live webhook secret
   - Update to live price IDs

3. **Webhook Configuration**
   - Update webhook endpoint to production URL
   - Test webhook delivery

4. **Email Notifications**
   - Configure payment failure emails
   - Set up receipt emails

5. **Monitoring**
   - Set up Stripe alerts
   - Monitor failed payments
   - Track revenue metrics

---

## 📞 Support

### Common Issues

**Q: Webhook not receiving events**
- Verify webhook URL is accessible
- Check webhook secret is correct
- Verify event types are selected

**Q: Checkout session fails**
- Verify price ID is correct
- Check customer has valid email
- Verify API keys are correct

**Q: Payment declined**
- Check card is valid
- Verify 3D Secure if required
- Check for fraud alerts

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🔗 Integration Points

✅ **Backend**
- Stripe service for payment processing
- Subscription routes for API endpoints
- Webhook handler for events
- Prisma schema with subscription table

✅ **Frontend**
- Pricing page for tier selection
- Subscription manager for account management
- API client for checkout/cancellation
- Protected routes based on subscription tier

✅ **Database**
- User.stripeCustomerId
- Subscription table with tier, status, dates
- Audit logs for payment events

---

**Next Steps:**
1. Set up Stripe account
2. Create products and prices
3. Configure webhooks
4. Test with test cards
5. Deploy to production
