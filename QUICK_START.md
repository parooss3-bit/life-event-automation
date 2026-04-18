# Quick Start Guide

Get the Life Event Automation platform running in 5 minutes.

---

## ⚡ Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Git installed

---

## 🚀 Setup (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/life-event-automation.git
cd life-event-automation
```

### 2. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 3. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Minimum required:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/life_event
JWT_SECRET=your_random_secret_key_here
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# (Optional) Seed sample data
npm run prisma:seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
# Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend running on http://localhost:5173
```

---

## ✅ Verify Installation

### Test Backend

```bash
curl http://localhost:3000/health
# Should return: { "status": "ok" }
```

### Test Frontend

Open http://localhost:5173 in your browser

---

## 🎯 First Steps

### 1. Create Account

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter email and password
4. Click "Create Account"

### 2. Add Contacts

**Option A: Manual Entry**
1. Go to "Contacts"
2. Click "Add Contact"
3. Fill in name and birthday
4. Click "Add Contact"

**Option B: Import CSV**
1. Go to "Contacts"
2. Click "Import"
3. Drag CSV file
4. Review and click "Import"

### 3. Create Event

1. Go to "Events"
2. Click "Create Event"
3. Select contact and date
4. Set reminder
5. Click "Create"

### 4. Get Reminder

Wait for reminder time or manually trigger via API:
```bash
curl -X POST http://localhost:3000/api/v1/reminders/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "event_id"}'
```

---

## 🔧 Configuration

### Database

**Local PostgreSQL:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/life_event
```

**Supabase:**
```env
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

**Railway:**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Email (SendGrid)

```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@example.com
```

### SMS (Twilio)

```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### Payments (Stripe)

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Facebook OAuth

```env
FACEBOOK_APP_ID=xxxxx
FACEBOOK_APP_SECRET=xxxxx
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
```

---

## 📁 Project Structure

```
life-event-automation/
├── src/                    # Backend code
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── index.ts           # Server entry point
├── client/                # Frontend code
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── store/        # State management
│   │   └── lib/          # Utilities
│   └── vite.config.ts    # Vite configuration
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── package.json          # Dependencies
```

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

### Build for Production

```bash
# Backend
npm run build:server

# Frontend
cd client
npm run build
```

---

## 🐛 Debugging

### View Logs

```bash
# Backend logs
npm run logs

# Frontend console
Open DevTools (F12) → Console tab
```

### Database Debugging

```bash
# Open Prisma Studio
npm run prisma:studio

# Opens http://localhost:5555
```

### API Testing

```bash
# Using curl
curl -X GET http://localhost:3000/api/v1/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Using Postman
Import API collection from docs/postman.json
```

---

## 📚 Documentation

- [API Documentation](./API_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Project Specification](./PROJECT_SPECIFICATION.md)
- [Deployment Guide](./DEPLOYMENT_PRODUCTION.md)
- [Contact Import Guide](./CONTACT_IMPORT_GUIDE.md)
- [Video Generation Guide](./AI_VIDEO_GENERATION.md)

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

```bash
# Test connection
psql $DATABASE_URL

# Check .env file
cat .env | grep DATABASE_URL

# Verify database exists
psql -l
```

### Dependencies Issue

```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Frontend Not Loading

```bash
# Clear browser cache
# Ctrl+Shift+Delete (Windows/Linux)
# Cmd+Shift+Delete (Mac)

# Or hard refresh
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

---

## 🚀 Next Steps

1. **Read Documentation** - Understand the architecture
2. **Explore Code** - Familiarize with codebase
3. **Run Examples** - Test API endpoints
4. **Make Changes** - Start developing
5. **Deploy** - Follow deployment guide

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Read relevant documentation
3. Check GitHub issues
4. Ask in Discord community
5. Email support@example.com

---

## 🎉 You're Ready!

Your development environment is set up. Start building! 🚀

**Happy coding!**
