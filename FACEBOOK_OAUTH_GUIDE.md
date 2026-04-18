# Facebook OAuth Integration Guide

**Version:** 1.0  
**Last Updated:** April 9, 2026

---

## 🎯 Overview

This guide explains how to set up and use Facebook OAuth integration for automatic contact and birthday data extraction. Users can connect their Facebook account to automatically import their friends' information and birthdays.

---

## 📋 Setup Instructions

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** as the app type
4. Fill in the app details:
   - **App Name:** MomentRemind
   - **App Contact Email:** your-email@example.com
   - **App Purpose:** Select appropriate category
5. Click **Create App**

### Step 2: Configure Facebook Login

1. In your app dashboard, click **Add Product**
2. Search for **Facebook Login** and click **Set Up**
3. Choose **Web** as your platform
4. Enter your website URL (e.g., `https://momentremind.com`)

### Step 3: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy your **App ID** and **App Secret**
3. Add to `.env`:
   ```bash
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
   ```

### Step 4: Configure OAuth Redirect URIs

1. Go to **Facebook Login** → **Settings**
2. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/auth/facebook/callback`
   - Production: `https://api.momentremind.com/auth/facebook/callback`
3. Save changes

### Step 5: Request Permissions

1. Go to **Settings** → **Basic**
2. Under **App Roles**, add yourself as a **Developer**
3. Go to **Permissions and Features**
4. Request the following permissions:
   - `public_profile` - Access public profile info
   - `email` - Access email address
   - `user_friends` - Access friend list
   - `user_birthday` - Access birthday information

**Note:** Some permissions require app review. For development, you can test with test users.

### Step 6: Create Test Users

1. Go to **Roles** → **Test Users**
2. Click **Create Test User**
3. Fill in details and click **Create**
4. You can now use this test account for development

---

## 🔌 API Endpoints

### Facebook OAuth Login

**GET** `/auth/facebook/login`

Initiates Facebook OAuth flow. Redirects user to Facebook login page.

**Permissions Requested:**
- `public_profile` - Basic profile info
- `email` - Email address
- `user_friends` - Friend list
- `user_birthday` - Birthday information

**Example:**
```html
<a href="http://localhost:3000/auth/facebook/login">
  Login with Facebook
</a>
```

### Facebook OAuth Callback

**GET** `/auth/facebook/callback`

Handles Facebook OAuth callback. Automatically redirects to frontend with JWT tokens.

**Response:**
```
Redirects to: http://localhost:5173?token=JWT&refreshToken=REFRESH&userId=USER_ID
```

### Sync Facebook Contacts

**POST** `/auth/facebook/sync-contacts`

Syncs contacts and birthdays from Facebook. Creates contacts and birthday events automatically.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "facebookAccessToken": "FACEBOOK_ACCESS_TOKEN"
}
```

**Response (200):**
```json
{
  "message": "Contacts synced successfully",
  "contactsCreated": 45,
  "contactsTotal": 150,
  "contacts": [
    {
      "id": "contact-uuid",
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "sarah@example.com"
    }
  ]
}
```

### Get Facebook Friends

**GET** `/auth/facebook/friends?facebookAccessToken=TOKEN`

Retrieves list of friends from Facebook with birthday information.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Query Parameters:**
- `facebookAccessToken` (required) - Facebook access token

**Response (200):**
```json
{
  "total": 150,
  "withBirthdays": 45,
  "friends": [
    {
      "facebookId": "123456789",
      "name": "Sarah Smith",
      "picture": "https://...",
      "birthday": "05/15/1990",
      "email": "sarah@example.com"
    }
  ]
}
```

### Disconnect Facebook Account

**POST** `/auth/facebook/disconnect`

Disconnects Facebook account from user profile.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response (200):**
```json
{
  "message": "Facebook account disconnected successfully"
}
```

---

## 🔄 Data Flow

### User Registration & Facebook Connection

```
1. User clicks "Login with Facebook"
   ↓
2. Redirected to Facebook login page
   ↓
3. User authorizes permissions
   ↓
4. Facebook redirects to callback URL
   ↓
5. Backend creates/updates user in database
   ↓
6. JWT tokens generated
   ↓
7. User redirected to frontend with tokens
   ↓
8. Frontend stores tokens in localStorage
```

### Contact & Birthday Extraction

```
1. User clicks "Sync Facebook Contacts"
   ↓
2. Frontend sends facebookAccessToken to backend
   ↓
3. Backend verifies token validity
   ↓
4. Backend fetches friends list from Facebook API
   ↓
5. Filters friends with birthday information
   ↓
6. For each friend:
   - Create Contact record
   - Extract birthday
   - Create Birthday Event (recurring yearly)
   ↓
7. Return created contacts to frontend
   ↓
8. Frontend displays success message
```

---

## 🔐 Security Considerations

### Access Token Storage

**Development:** Store in memory (acceptable for development)

**Production:** 
- Encrypt tokens before storing in database
- Use environment variables for encryption key
- Implement token rotation
- Store in secure HTTP-only cookies

### Permissions

Only request permissions you need:
- `public_profile` - Always required
- `email` - Only if you need email
- `user_friends` - Only for contact sync
- `user_birthday` - Only for birthday extraction

### Token Expiration

Facebook access tokens typically expire after 60 days. Implement token refresh:

```typescript
// Refresh token if expired
const refreshedToken = await facebookService.refreshAccessToken(oldToken);
```

### Rate Limiting

Facebook API has rate limits:
- 200 calls per hour per user
- 50 calls per hour per app

Implement caching to avoid hitting limits:
- Cache friend list for 24 hours
- Cache user profile for 1 hour

---

## 🧪 Testing

### Test with Facebook Test Users

1. Create test users in Facebook app dashboard
2. Use test user credentials to login
3. Test friend sync with multiple test users

### Test Endpoints

```bash
# Test login redirect
curl http://localhost:3000/auth/facebook/login

# Test sync contacts
curl -X POST http://localhost:3000/auth/facebook/sync-contacts \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"facebookAccessToken": "TOKEN"}'

# Test get friends
curl "http://localhost:3000/auth/facebook/friends?facebookAccessToken=TOKEN" \
  -H "Authorization: Bearer JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### "Invalid OAuth Redirect URI"

**Problem:** Facebook rejects the callback URL

**Solution:**
1. Check that redirect URI matches exactly in Facebook app settings
2. Include protocol (http:// or https://)
3. No trailing slashes

### "Invalid Access Token"

**Problem:** Token verification fails

**Solution:**
1. Verify token hasn't expired
2. Check token format (should be long string)
3. Verify app ID and secret are correct

### "Friends List is Empty"

**Problem:** No friends returned from Facebook

**Solution:**
1. Check that `user_friends` permission was granted
2. Verify test users have friend connections
3. Check that friends have birthday information

### "Birthday Not Extracted"

**Problem:** Birthday field is empty

**Solution:**
1. Verify `user_birthday` permission was granted
2. Check that friend's privacy settings allow birthday sharing
3. Birthday must be in MM/DD or MM/DD/YYYY format

---

## 📊 Birthday Data Formats

Facebook returns birthdays in different formats:

| Format | Example | Parsed As |
|--------|---------|-----------|
| MM/DD | 05/15 | Current year |
| MM/DD/YYYY | 05/15/1990 | Specific year |
| Month/Day | May 15 | Current year |

The system automatically handles all formats and creates recurring yearly events.

---

## 🚀 Production Deployment

### Environment Variables

```bash
FACEBOOK_APP_ID=your_production_app_id
FACEBOOK_APP_SECRET=your_production_app_secret
FACEBOOK_CALLBACK_URL=https://api.momentremind.com/auth/facebook/callback
```

### SSL/TLS

Facebook requires HTTPS in production. Ensure:
- Valid SSL certificate
- HTTPS redirect from HTTP
- Callback URL uses https://

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const rateLimit = require('express-rate-limit');

const facebookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many Facebook requests, please try again later'
});

app.post('/auth/facebook/sync-contacts', facebookLimiter, ...);
```

### Monitoring

Monitor Facebook API usage:
- Track API calls per user
- Alert on unusual activity
- Log all OAuth events

---

## 📈 Analytics

Track Facebook OAuth metrics:

| Metric | Purpose |
|--------|---------|
| Facebook logins | User acquisition channel |
| Contact syncs | Feature adoption |
| Contacts created | Data import volume |
| Birthday events created | Event creation rate |
| Disconnects | Churn indicator |

---

## 🔗 Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Facebook Permissions](https://developers.facebook.com/docs/permissions)
- [Facebook App Review](https://developers.facebook.com/docs/app-review)

---

## 📝 Changelog

### Version 1.0 (April 9, 2026)
- Initial Facebook OAuth integration
- Contact and birthday extraction
- Test user support
- Production deployment guide

---

**Status:** Ready for Implementation  
**Last Updated:** April 9, 2026
