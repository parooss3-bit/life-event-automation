# Life Event Automation Platform

**Automated birthday and event reminders with AI video generation and smart gift recommendations.**

Transform how people celebrate life's important moments with personalized video messages, intelligent reminders, and curated gift suggestions.

---

## 🎯 Overview

Life Event Automation is a comprehensive platform that helps users never miss important birthdays, anniversaries, and milestones. The platform combines:

- **Automatic Contact Sync** - Import friends from Facebook
- **Smart Reminders** - Email, SMS, and push notifications
- **AI Video Generation** - Personalized video messages via HeyGen
- **Gift Recommendations** - Curated suggestions with affiliate links
- **Subscription Tiers** - Free, Pro, and Business plans
- **Admin Dashboard** - Analytics and business management

---

## ✨ Key Features

### For Users

**Contact Management**
- Import contacts from Facebook, Gmail, Outlook, phone
- Support for CSV, Excel, PDF, and text files
- Automatic duplicate detection
- Relationship tracking (friend, family, colleague)

**Event Tracking**
- Automatic birthday reminders
- Anniversary tracking
- Custom event creation
- Recurring event support
- Event history and statistics

**Smart Reminders**
- Multi-channel delivery (email, SMS, push)
- Customizable reminder timing
- Delivery status tracking
- Reminder history

**AI Video Generation**
- Personalized video messages
- 100+ avatar options
- 200+ voices in 50+ languages
- Custom message support
- Automatic script generation

**Gift Recommendations**
- Smart gift suggestions
- Budget-based filtering
- Interest-based recommendations
- Affiliate links for purchases
- Gift tracking and history

**Subscription Management**
- Free tier (basic reminders)
- Pro tier ($9.99/month)
- Business tier ($99.99/month)
- Stripe payment processing
- Billing portal

### For Business

**Admin Dashboard**
- User analytics
- Revenue tracking
- Subscription management
- Support ticket system
- Brand partnership management

**Analytics**
- User growth metrics
- Engagement tracking
- Revenue insights
- Churn analysis
- Cohort analysis

**Integrations**
- Facebook OAuth
- Stripe payments
- SendGrid email
- Twilio SMS
- Firebase push notifications
- HeyGen video generation

---

## 🏗️ Architecture

### Technology Stack

**Backend**
- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

**Frontend**
- React 19
- Vite
- Tailwind CSS
- Zustand (state management)

**Integrations**
- Facebook OAuth
- Stripe API
- SendGrid API
- Twilio API
- Firebase Cloud Messaging
- HeyGen API
- Google Maps API

**Infrastructure**
- Vercel (frontend)
- Railway/Render (backend)
- Supabase/AWS RDS (database)
- Cloudflare (CDN)

---

## 📊 Database Schema

**Core Tables**

| Table | Purpose |
|-------|---------|
| Users | User accounts and profiles |
| Contacts | Contact information |
| Events | Birthdays, anniversaries, milestones |
| Reminders | Notification scheduling |
| Gifts | Gift recommendations and tracking |
| AIVideos | Generated video messages |
| Subscriptions | Billing and subscription management |
| Referrals | Referral program tracking |
| BrandPartnerships | Brand affiliate relationships |

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema.

---

## 🚀 Getting Started

### Quick Start (5 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/life-event-automation.git
cd life-event-automation

# Install dependencies
npm install
cd client && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Setup database
npm run prisma:migrate:dev

# Start development
npm run dev              # Backend
cd client && npm run dev # Frontend (new terminal)
```

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

---

## 📖 Documentation

### User Guides
- [Quick Start Guide](./QUICK_START.md) - Get running in 5 minutes
- [Contact Import Guide](./CONTACT_IMPORT_GUIDE.md) - Import contacts from various sources
- [AI Video Generation Guide](./AI_VIDEO_GENERATION.md) - Create personalized videos

### Developer Guides
- [API Architecture](./API_ARCHITECTURE.md) - Complete API reference
- [Database Schema](./DATABASE_SCHEMA.md) - Database design
- [Project Specification](./PROJECT_SPECIFICATION.md) - Feature specifications

### Deployment & Operations
- [Deployment Guide](./DEPLOYMENT_PRODUCTION.md) - Production deployment
- [Launch Checklist](./LAUNCH_CHECKLIST.md) - Pre-launch preparation
- [Payment Processing](./PAYMENT_PROCESSING.md) - Stripe integration

### Integration Guides
- [Facebook OAuth Guide](./FACEBOOK_OAUTH_GUIDE.md) - Facebook integration
- [Notification System](./NOTIFICATION_SYSTEM.md) - Email/SMS/push setup
- [Gift Recommendations](./GIFT_RECOMMENDATIONS.md) - Gift engine setup

---

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/facebook/login` - Facebook OAuth

### Contacts
- `GET /api/v1/contacts` - List contacts
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/:id` - Get contact
- `PUT /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact
- `POST /api/v1/contacts/bulk-import` - Bulk import

### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get event
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Reminders
- `GET /api/v1/reminders` - List reminders
- `POST /api/v1/reminders` - Create reminder
- `GET /api/v1/reminders/:id` - Get reminder
- `PUT /api/v1/reminders/:id` - Update reminder
- `DELETE /api/v1/reminders/:id` - Delete reminder

### Videos
- `POST /api/v1/videos/generate` - Generate video
- `GET /api/v1/videos/:id/status` - Check status
- `GET /api/v1/videos/avatars` - List avatars
- `GET /api/v1/videos/voices` - List voices
- `GET /api/v1/videos` - User's videos
- `DELETE /api/v1/videos/:id` - Delete video

### Gifts
- `GET /api/v1/gifts/recommendations` - Get recommendations
- `POST /api/v1/gifts/save` - Save gift
- `GET /api/v1/gifts/saved` - Get saved gifts
- `PUT /api/v1/gifts/:id` - Update gift
- `DELETE /api/v1/gifts/:id` - Delete gift

### Subscriptions
- `GET /api/v1/subscriptions/plans` - List plans
- `POST /api/v1/subscriptions/checkout` - Create checkout
- `GET /api/v1/subscriptions/current` - Current subscription
- `POST /api/v1/subscriptions/cancel` - Cancel subscription

See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) for complete API reference.

---

## 💳 Pricing

### Free Tier
- Up to 10 contacts
- Basic email reminders
- Limited features

### Pro Tier ($9.99/month)
- Unlimited contacts
- Email, SMS, push reminders
- AI video generation
- Gift recommendations
- Priority support

### Business Tier ($99.99/month)
- Everything in Pro
- Multi-user accounts
- Team management
- Advanced analytics
- API access
- Custom branding
- Dedicated support

---

## 🔐 Security

### Data Protection
- End-to-end encryption for sensitive data
- Secure password hashing (bcrypt)
- JWT token authentication
- CORS protection
- Rate limiting

### Compliance
- GDPR compliant
- CCPA compliant
- SOC 2 Type II ready
- Data processing agreements
- Privacy policy included

### Best Practices
- Environment variables for secrets
- No hardcoded credentials
- Regular security audits
- Dependency scanning
- Penetration testing

---

## 📈 Deployment

### Production Deployment

**Quick Deploy (Vercel + Railway):**
```bash
# Deploy backend to Railway
railway up

# Deploy frontend to Vercel
vercel --prod
```

**Full Setup:**
1. Choose hosting provider (Vercel, Railway, Render, AWS)
2. Configure database (Supabase, AWS RDS, Railway)
3. Set environment variables
4. Run migrations
5. Deploy

See [DEPLOYMENT_PRODUCTION.md](./DEPLOYMENT_PRODUCTION.md) for detailed instructions.

### Monitoring

- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)
- Analytics (Google Analytics)
- Logging (Winston)

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Linting
```bash
npm run lint
```

### Build
```bash
npm run build:server
cd client && npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow code style (ESLint)
- Keep commits atomic

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙋 Support

### Getting Help

- **Documentation** - Read relevant guides
- **GitHub Issues** - Report bugs or request features
- **Discord Community** - Chat with other developers
- **Email Support** - support@momentremind.com

### Reporting Issues

Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Error messages and logs

---

## 🗺️ Roadmap

### Current (Q2 2026)
- ✅ Core platform launch
- ✅ Facebook OAuth integration
- ✅ Email/SMS/push notifications
- ✅ AI video generation
- ✅ Gift recommendations

### Next (Q3 2026)
- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API webhooks
- [ ] Custom integrations

### Future (Q4 2026+)
- [ ] AI-powered gift suggestions
- [ ] Social sharing features
- [ ] Group events
- [ ] Calendar sync
- [ ] Enterprise features

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Lines of Code** | 15,000+ |
| **API Endpoints** | 30+ |
| **Database Tables** | 9 |
| **Frontend Components** | 40+ |
| **Test Coverage** | 80%+ |
| **Documentation Pages** | 15+ |

---

## 🎯 Success Metrics (Year 1)

| Metric | Target |
|--------|--------|
| **Users** | 10,000 |
| **MRR** | $50,000 |
| **Conversion Rate** | 20% |
| **Churn Rate** | <5% |
| **NPS Score** | 50+ |

---

## 👥 Team

### Founders
- [Your Name] - CEO & Product
- [Co-Founder Name] - CTO & Engineering

### Key Contributors
- [Developer Name] - Full Stack
- [Designer Name] - Product Design
- [Marketing Name] - Growth

---

## 🙏 Acknowledgments

- HeyGen for AI video generation
- Stripe for payment processing
- SendGrid for email delivery
- Twilio for SMS delivery
- Firebase for push notifications
- Facebook for OAuth integration

---

## 📞 Contact

- **Website** - https://momentremind.com
- **Email** - hello@momentremind.com
- **Twitter** - @momentremind
- **LinkedIn** - /company/moment-remind
- **Discord** - [Join Community](https://discord.gg/momentremind)

---

## 📄 Additional Resources

- [Quick Start Guide](./QUICK_START.md)
- [API Documentation](./API_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT_PRODUCTION.md)
- [Launch Checklist](./LAUNCH_CHECKLIST.md)

---

**Built with ❤️ to help people celebrate life's important moments.**

---

**Last Updated:** April 9, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
