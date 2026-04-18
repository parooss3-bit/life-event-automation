# AI Video Generation Guide

Complete guide for generating personalized video messages using HeyGen AI.

---

## 📋 Overview

The platform integrates with **HeyGen** to generate personalized video messages for:
- Birthdays
- Anniversaries
- Milestones
- Holidays
- Custom occasions

---

## 🚀 Getting Started

### Setup HeyGen Account

1. Go to https://www.heygen.com
2. Sign up for a free account
3. Complete email verification
4. Go to **Account Settings** → **API Keys**
5. Copy your API key
6. Add to `.env` file:

```env
HEYGEN_API_KEY=your_api_key_here
```

---

## 🎬 Video Generation Features

### Supported Avatars

- Professional avatars (male/female)
- Casual avatars
- Animated avatars
- Custom avatars (with HeyGen Pro)

### Supported Languages & Voices

- English (US, UK, Australian, Indian)
- Spanish
- French
- German
- Mandarin
- Japanese
- Korean
- And 50+ more languages

### Video Customization

- **Avatar Selection** - Choose from 100+ avatars
- **Voice Selection** - 200+ voices in 50+ languages
- **Custom Messages** - Add personal messages
- **Automatic Script Generation** - AI-generated scripts based on occasion
- **Video Resolution** - 720p, 1080p, 4K
- **Background Options** - Color, image, or transparent

---

## 📊 Video Generation API

### Generate Video

**Endpoint:**
```
POST /api/v1/videos/generate
```

**Request:**
```json
{
  "contactId": "contact_123",
  "eventId": "event_456",
  "recipientName": "John",
  "senderName": "Sarah",
  "eventType": "birthday",
  "message": "Custom message (optional)",
  "avatarId": "avatar_001",
  "voiceId": "voice_001"
}
```

**Response:**
```json
{
  "videoId": "video_789",
  "status": "processing",
  "createdAt": "2026-04-09T12:00:00Z"
}
```

### Get Video Status

**Endpoint:**
```
GET /api/v1/videos/:id/status
```

**Response:**
```json
{
  "status": "completed",
  "videoUrl": "https://cdn.heygen.com/videos/video_789.mp4"
}
```

### Get Available Avatars

**Endpoint:**
```
GET /api/v1/videos/avatars
```

**Response:**
```json
{
  "avatars": [
    {
      "id": "avatar_001",
      "name": "Professional Male",
      "preview": "https://..."
    }
  ]
}
```

### Get Available Voices

**Endpoint:**
```
GET /api/v1/videos/voices
```

**Response:**
```json
{
  "voices": [
    {
      "id": "voice_001",
      "name": "Sarah",
      "language": "en-US",
      "gender": "female"
    }
  ]
}
```

### Get User Videos

**Endpoint:**
```
GET /api/v1/videos
```

**Response:**
```json
{
  "videos": [
    {
      "id": "video_789",
      "status": "completed",
      "videoUrl": "https://...",
      "contact": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "event": {
        "title": "John's Birthday",
        "eventType": "birthday"
      },
      "createdAt": "2026-04-09T12:00:00Z"
    }
  ]
}
```

### Delete Video

**Endpoint:**
```
DELETE /api/v1/videos/:id
```

---

## 🎯 Video Generation Workflow

### Step 1: User Selects Event
```
User goes to Event → Click "Generate Video"
```

### Step 2: Choose Options
```
Select Avatar
↓
Select Voice
↓
Add Custom Message (optional)
```

### Step 3: Generate Video
```
Click "Generate Video"
↓
System sends request to HeyGen
↓
Video generation starts
```

### Step 4: Wait for Completion
```
System polls HeyGen API
↓
Shows progress (0-100%)
↓
Video ready in 2-5 minutes
```

### Step 5: Use Video
```
Preview video
↓
Download video
↓
Share via email/SMS/social media
```

---

## 📝 Script Generation

### Automatic Scripts by Event Type

#### Birthday
```
"Happy Birthday, [Name]! 🎉 I wanted to take a moment to celebrate 
you on your special day. You mean so much to me, and I hope this year 
brings you joy, laughter, and unforgettable memories. Wishing you the 
happiest of birthdays! - From [Sender]"
```

#### Anniversary
```
"Happy Anniversary, [Name]! 💕 I wanted to celebrate this special day 
with you. Thank you for all the wonderful memories we have shared 
together. Here is to many more years of love, laughter, and happiness! 
- From [Sender]"
```

#### Milestone
```
"Congratulations, [Name]! 🌟 I wanted to congratulate you on this 
amazing achievement. You have worked so hard, and you truly deserve 
this success. I am so proud of you! - From [Sender]"
```

#### Holiday
```
"Happy Holidays, [Name]! ✨ I wanted to send you warm wishes for a 
wonderful holiday season. Thank you for being such an important part 
of my life. Wishing you all the best! - From [Sender]"
```

#### Custom
```
[User's custom message]
```

---

## 🔄 Video Generation Process

### Backend Flow

```
1. User requests video generation
   ↓
2. Validate request data
   ↓
3. Generate script based on event type
   ↓
4. Send request to HeyGen API
   ↓
5. Save video record to database
   ↓
6. Return video ID and status
   ↓
7. Poll HeyGen for completion
   ↓
8. Update database with video URL
   ↓
9. Notify user (optional)
```

### Frontend Flow

```
1. User clicks "Generate Video"
   ↓
2. Show avatar/voice selection
   ↓
3. User selects options
   ↓
4. Send request to backend
   ↓
5. Show progress indicator
   ↓
6. Poll for video status
   ↓
7. Show video preview
   ↓
8. Offer download/share options
```

---

## 💾 Database Schema

### AIVideo Table

```sql
CREATE TABLE AIVideo (
  id String @id @default(cuid())
  userId String
  contactId String
  eventId String
  videoId String (HeyGen video ID)
  status String (processing, completed, failed)
  videoUrl String?
  script String
  avatarId String
  voiceId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user User @relation(fields: [userId], references: [id])
  contact Contact @relation(fields: [contactId], references: [id])
  event Event @relation(fields: [eventId], references: [id])
}
```

---

## 🎨 Frontend Component

### VideoGenerator Component

**Features:**
- Avatar selection with preview
- Voice selection with language/gender filter
- Custom message input
- Progress tracking
- Video preview
- Download option

**Usage:**
```tsx
<VideoGenerator
  contactId="contact_123"
  eventId="event_456"
  recipientName="John"
  senderName="Sarah"
  eventType="birthday"
  onClose={() => setShowGenerator(false)}
/>
```

---

## 📊 Pricing & Limits

### HeyGen Pricing

| Plan | Price | Videos/Month | Resolution |
|------|-------|--------------|-----------|
| Free | $0 | 3 | 720p |
| Pro | $10 | 100 | 1080p |
| Business | $50 | 500 | 4K |

### Platform Limits

- **Max video length:** 5 minutes
- **Max videos per user/month:** Based on subscription tier
- **Video retention:** 30 days (can be extended)
- **Concurrent generations:** 5 per user

---

## 🔒 Security

### API Key Protection
- Store API key in `.env` file
- Never expose in frontend code
- Use backend proxy for API calls
- Rotate keys regularly

### Video Privacy
- Videos stored securely
- Only user can access their videos
- Videos deleted after retention period
- No third-party access

---

## 🧪 Testing

### Test with Sample Data

```javascript
// Generate test video
const response = await fetch('/api/v1/videos/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contactId: 'test_contact',
    eventId: 'test_event',
    recipientName: 'John',
    senderName: 'Sarah',
    eventType: 'birthday',
    avatarId: 'avatar_001',
    voiceId: 'voice_001'
  })
});

// Poll status
const statusResponse = await fetch(`/api/v1/videos/${videoId}/status`);
```

---

## 🚀 Deployment

### Production Setup

1. **Get HeyGen API Key**
   - Sign up for HeyGen Pro account
   - Go to API settings
   - Generate API key

2. **Configure Environment**
   ```env
   HEYGEN_API_KEY=your_production_key
   NODE_ENV=production
   ```

3. **Test Video Generation**
   - Create test event
   - Generate video
   - Verify video quality

4. **Monitor Usage**
   - Track videos generated per user
   - Monitor API usage
   - Set up alerts for quota limits

---

## 📈 Analytics

### Video Generation Stats

```
Total Videos Generated: 1,234
├─ Birthdays: 567 (46%)
├─ Anniversaries: 234 (19%)
├─ Milestones: 189 (15%)
├─ Holidays: 156 (13%)
└─ Custom: 88 (7%)

Average Generation Time: 3.2 minutes
Success Rate: 98.5%
User Satisfaction: 4.8/5
```

---

## 🔗 Integration Points

✅ **Events**
- Auto-generate video option for events
- Video linked to event
- Video reminder notifications

✅ **Reminders**
- Send video reminder before event
- Share video via email/SMS
- Track video opens

✅ **Gifts**
- Pair video with gift recommendation
- Include video in gift package
- Track video + gift engagement

✅ **Analytics**
- Track video generation
- Monitor usage trends
- Measure user engagement

---

## 📞 Support

### Common Issues

**Q: Video generation takes too long**
- A: Normal processing time is 2-5 minutes
- Check HeyGen API status
- Verify API key is valid

**Q: Video quality is poor**
- A: Try different avatar/voice combination
- Use 1080p resolution
- Check internet connection

**Q: API key not working**
- A: Verify key is correct in .env
- Check API key hasn't expired
- Ensure account has credits

---

## 📚 Resources

- [HeyGen Documentation](https://docs.heygen.com)
- [HeyGen API Reference](https://docs.heygen.com/reference)
- [Available Avatars](https://www.heygen.com/avatars)
- [Available Voices](https://www.heygen.com/voices)

---

## 🎯 Future Enhancements

- [ ] Custom avatar creation
- [ ] Multi-language support
- [ ] Video templates
- [ ] Batch video generation
- [ ] Video analytics
- [ ] Social media sharing
- [ ] Video editing tools
- [ ] AI script generation with GPT

---

**Next Steps:**
1. Set up HeyGen account
2. Get API key
3. Add to .env file
4. Test video generation
5. Deploy to production
