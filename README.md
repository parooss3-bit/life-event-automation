# Life Event Automation Platform

A production-ready platform for automating birthday and life event reminders with AI-powered personalization, smart gift recommendations, and multi-channel delivery.

## 🎯 Features

### Core Features (MVP)
- **User Authentication** - Email/password, OAuth (Google, Apple)
- **Contact Management** - Add and manage people whose events you want to track
- **Event Tracking** - Birthdays, anniversaries, milestones, custom dates
- **Email Reminders** - Automated reminders 14 days before events
- **Dashboard** - Overview of upcoming events and statistics
- **Subscription Management** - Free tier and Pro tier ($9/mo)

### Advanced Features
- **AI Video Generation** - Personalized video messages using HeyGen
- **Smart Gift Recommendations** - AI-powered gift suggestions based on occasion and interests
- **Brand Partnerships** - Curated deals from partner brands
- **Referral System** - Invite friends and earn credits
- **B2B Tenant Management** - Property managers can manage tenant events for retention

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS (separate repo)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Email**: SendGrid API
- **Video AI**: HeyGen API
- **Payments**: Stripe
- **Storage**: AWS S3
- **Hosting**: Vercel (frontend), Railway (backend), Supabase (database)

## 📋 Project Structure

```
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── users.ts             # User profile routes
│   │   ├── contacts.ts          # Contact management routes
│   │   ├── events.ts            # Event management routes
│   │   ├── reminders.ts         # Reminder routes
│   │   ├── gifts.ts             # Gift management routes
│   │   ├── videos.ts            # AI video routes
│   │   ├── subscriptions.ts     # Subscription routes
│   │   ├── referrals.ts         # Referral routes
│   │   ├── partnerships.ts      # Brand partnership routes
│   │   └── admin.ts             # Admin routes
│   ├── controllers/             # Business logic (to be implemented)
│   ├── services/                # External service integrations
│   ├── utils/
│   │   └── auth.ts              # Authentication utilities
│   └── config/                  # Configuration files
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── .env.example                 # Environment variables template
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd life-event-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/signup`
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "subscriptionTier": "free",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/v1/auth/login`
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Endpoints

#### GET `/api/v1/users/me`
Get current user profile (requires authentication)

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "subscriptionTier": "pro",
  "subscriptionStatus": "active"
}
```

#### GET `/api/v1/users/me/dashboard`
Get user dashboard statistics

**Response:**
```json
{
  "totalContacts": 45,
  "totalEvents": 78,
  "upcomingEvents": 5,
  "totalGifts": 120,
  "totalVideos": 8,
  "subscriptionTier": "pro"
}
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `SENDGRID_API_KEY` - SendGrid API key
- `HEYGEN_API_KEY` - HeyGen API key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

## 🗄️ Database Schema

The database includes the following main tables:

- **Users** - User accounts and subscription information
- **Contacts** - People whose events are tracked
- **Events** - Birthdays, anniversaries, and other life events
- **Reminders** - Notification records
- **Gifts** - Gift ideas and tracking
- **AIVideos** - Generated personalized videos
- **Subscriptions** - User subscription details
- **Referrals** - Referral program tracking
- **BrandPartnerships** - Partner brand deals

See `prisma/schema.prisma` for complete schema definition.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Database Management

```bash
# Open Prisma Studio
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

## 🚀 Deployment

### Deploy to Railway

1. Push code to GitHub
2. Connect Railway to GitHub
3. Set environment variables in Railway dashboard
4. Railway will automatically deploy on push

### Deploy to Vercel (Frontend)

1. Connect Vercel to GitHub
2. Set environment variables
3. Vercel will automatically deploy on push

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📊 Project Status

**Current Phase:** Phase 2 - Backend Scaffolding

**Completed:**
- ✅ Project specification and planning
- ✅ Database schema design
- ✅ API architecture design
- ✅ Backend scaffolding
- ✅ Authentication system
- ✅ User management endpoints

**In Progress:**
- 🔄 Contact management endpoints
- 🔄 Event management endpoints
- 🔄 Email reminder system

**Next Steps:**
- Gift recommendations engine
- AI video generation integration
- Subscription management with Stripe
- Admin dashboard

## 📚 Documentation

- `PROJECT_SPECIFICATION.md` - Complete project specification
- `DATABASE_SCHEMA.md` - Detailed database schema
- `API_ARCHITECTURE.md` - API endpoint specifications
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

## 🎯 Roadmap

### Phase 1: MVP (Weeks 1-4)
- User authentication
- Contact management
- Event tracking
- Email reminders
- Basic dashboard

### Phase 2: Personalization (Weeks 5-6)
- AI video generation
- Smart gift recommendations
- Brand partnerships

### Phase 3: Monetization (Week 7)
- Stripe integration
- Subscription tiers
- Admin dashboard

### Phase 4: Scaling (Months 2-3)
- B2B tenant management
- Advanced analytics
- Mobile app

---

**Version:** 1.0.0  
**Last Updated:** April 8, 2026  
**Status:** In Development
# Rebuild trigger
