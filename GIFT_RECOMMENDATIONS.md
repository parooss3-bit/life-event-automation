# Gift Recommendations Engine Documentation

**Version:** 1.0  
**Last Updated:** April 9, 2026

---

## 🎁 Overview

The Gift Recommendations Engine is an intelligent system that provides personalized gift suggestions based on:
- **Contact information** (name, relationship, age)
- **Event type** (birthday, anniversary, holiday)
- **Budget** (low, medium, high)
- **Interests** (hobbies, preferences)
- **Occasion** (milestone, celebration)

The system includes gift tracking, purchase history, and budget management features.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│     Gift Recommendations Engine                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Recommendation  │      │  Gift Tracking   │        │
│  │    Service       │      │    Service       │        │
│  └──────────────────┘      └──────────────────┘        │
│           │                         │                   │
│  ┌────────┴─────────────────────────┴────────┐         │
│  │                                           │         │
│  │  Gift Database (Curated Catalog)         │         │
│  │  - Birthday gifts (low/med/high)         │         │
│  │  - Anniversary gifts                     │         │
│  │  - Holiday gifts                         │         │
│  │  - Custom events                         │         │
│  │                                           │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### **1. Personalized Recommendations**
- Analyzes event type and budget
- Filters by interests
- Sorts by rating and relevance
- Returns top 10 recommendations

### **2. Gift Discovery**
- Browse by category
- Search by keyword
- View trending gifts
- Filter by price range

### **3. Gift Tracking**
- Save gifts for later
- Mark as purchased
- Track spending
- Budget management

### **4. Purchase History**
- Track all purchases
- View spending analytics
- Compare prices
- Identify patterns

---

## 📊 Gift Database Structure

### **Budget Tiers**

| Tier | Price Range | Use Case |
|------|-------------|----------|
| **Low** | $0-30 | Quick gifts, stocking stuffers |
| **Medium** | $31-100 | Standard gifts, mid-tier items |
| **High** | $100+ | Premium gifts, luxury items |

### **Event Types**

| Type | Examples |
|------|----------|
| **birthday** | Annual birthday celebrations |
| **anniversary** | Wedding/relationship anniversaries |
| **holiday** | Christmas, Hanukkah, Diwali |
| **milestone** | Graduation, promotion, retirement |
| **custom** | Any other special occasion |

### **Gift Categories**

| Category | Examples |
|----------|----------|
| **electronics** | Headphones, smartwatch, drone |
| **apparel** | Socks, t-shirt, jacket |
| **drinkware** | Coffee mug, water bottle |
| **home** | Candles, decor, organizers |
| **wellness** | Bath bombs, massage kit |
| **jewelry** | Watch, bracelet, necklace |
| **decor** | Photo frame, ornament |

---

## 📋 API Endpoints

### **GET /api/v1/gifts/recommendations**
Get personalized gift recommendations for an event.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | string | Yes | Event ID |
| `budget` | number | No | Budget in dollars (default: 50) |
| `interests` | string | No | Comma-separated interests |

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/recommendations?eventId=EVENT_ID&budget=50&interests=tech,gadgets" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response:**
```json
{
  "eventId": "event-uuid",
  "eventType": "birthday",
  "contactName": "Sarah Smith",
  "budget": 50,
  "recommendations": [
    {
      "id": "gift_001",
      "title": "Wireless Earbuds",
      "description": "High-quality wireless earbuds with noise cancellation",
      "price": 50,
      "category": "electronics",
      "imageUrl": "https://...",
      "affiliateUrl": "https://amazon.com/...",
      "source": "amazon",
      "rating": 4.5,
      "reviews": 3500
    }
  ]
}
```

---

### **GET /api/v1/gifts/trending**
Get trending gifts for a specific event type.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `eventType` | string | birthday | Event type |
| `limit` | number | 5 | Number of results |

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/trending?eventType=birthday&limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response:**
```json
{
  "eventType": "birthday",
  "trending": [
    {
      "id": "gift_001",
      "title": "Wireless Earbuds",
      "price": 50,
      "rating": 4.5,
      "reviews": 3500
    }
  ]
}
```

---

### **GET /api/v1/gifts/category/:category**
Get gifts by category.

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `category` | Gift category (electronics, apparel, etc.) |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of results |

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/category/electronics?limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

---

### **GET /api/v1/gifts/search**
Search gifts by keyword.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `limit` | number | No | Number of results (default: 10) |

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/search?q=wireless+headphones&limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

---

### **GET /api/v1/gifts/:giftId**
Get specific gift details.

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/gift_001" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response:**
```json
{
  "id": "gift_001",
  "title": "Wireless Earbuds",
  "description": "High-quality wireless earbuds with noise cancellation",
  "price": 50,
  "category": "electronics",
  "imageUrl": "https://...",
  "affiliateUrl": "https://amazon.com/...",
  "source": "amazon",
  "rating": 4.5,
  "reviews": 3500,
  "inStock": true
}
```

---

### **POST /api/v1/gifts/save**
Save a gift for later.

**Request Body:**
```json
{
  "eventId": "event-uuid",
  "giftId": "gift_001",
  "giftTitle": "Wireless Earbuds",
  "giftPrice": 50,
  "giftUrl": "https://amazon.com/...",
  "notes": "Great reviews, good price"
}
```

**Response (201):**
```json
{
  "message": "Gift saved successfully",
  "gift": {
    "id": "saved-gift-uuid",
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "giftId": "gift_001",
    "giftTitle": "Wireless Earbuds",
    "giftPrice": 50,
    "giftUrl": "https://amazon.com/...",
    "status": "saved",
    "createdAt": "2026-04-09T10:00:00Z"
  }
}
```

---

### **GET /api/v1/gifts/saved/:eventId**
Get all saved gifts for an event.

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/gifts/saved/EVENT_ID" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Response:**
```json
{
  "eventId": "event-uuid",
  "gifts": [
    {
      "id": "saved-gift-uuid",
      "giftId": "gift_001",
      "giftTitle": "Wireless Earbuds",
      "giftPrice": 50,
      "status": "saved",
      "createdAt": "2026-04-09T10:00:00Z"
    }
  ]
}
```

---

### **PUT /api/v1/gifts/:giftId/mark-purchased**
Mark a gift as purchased.

**Request Body:**
```json
{
  "purchasePrice": 45.99,
  "purchaseDate": "2026-04-09T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Gift marked as purchased",
  "gift": {
    "id": "saved-gift-uuid",
    "status": "purchased",
    "purchasePrice": 45.99,
    "purchaseDate": "2026-04-09T10:00:00Z"
  }
}
```

---

### **PUT /api/v1/gifts/:giftId/mark-gifted**
Mark a gift as gifted (delivered to recipient).

**Response:**
```json
{
  "message": "Gift marked as gifted",
  "gift": {
    "id": "saved-gift-uuid",
    "status": "gifted"
  }
}
```

---

### **DELETE /api/v1/gifts/:giftId**
Remove a saved gift.

**Response:**
```json
{
  "message": "Gift removed successfully",
  "giftId": "saved-gift-uuid"
}
```

---

### **GET /api/v1/gifts/budget/:eventId**
Get gift budget summary for an event.

**Response:**
```json
{
  "eventId": "event-uuid",
  "budget": {
    "totalSaved": 150,
    "totalPurchased": 2,
    "totalSpent": 95.99,
    "remainingBudget": 54.01,
    "savedCount": 3,
    "purchasedCount": 2
  }
}
```

---

### **GET /api/v1/gifts/stats/summary**
Get gift statistics for the user.

**Response:**
```json
{
  "totalGiftsSaved": 25,
  "totalGiftsPurchased": 18,
  "totalSpent": 450.50,
  "averageGiftPrice": 25.03,
  "mostExpensiveGift": 150,
  "cheapestGift": 5
}
```

---

## 🔄 Gift Workflow

### **Discovery & Saving**
```
1. User views event
   ↓
2. Clicks "Get Gift Ideas"
   ↓
3. System shows personalized recommendations
   ↓
4. User browses and saves favorites
   ↓
5. Gifts stored in "Saved" list
```

### **Purchase Tracking**
```
1. User decides to purchase a gift
   ↓
2. Clicks "Mark as Purchased"
   ↓
3. Enters purchase price and date
   ↓
4. System updates budget tracking
   ↓
5. Gift status changes to "purchased"
```

### **Budget Management**
```
1. User sets budget for event
   ↓
2. Saves multiple gift options
   ↓
3. System tracks total saved price
   ↓
4. Shows remaining budget
   ↓
5. Alerts if over budget
```

---

## 💡 Recommendation Algorithm

### **Step 1: Budget Tier**
```
if budget <= $30:
  tier = "low"
else if budget <= $100:
  tier = "medium"
else:
  tier = "high"
```

### **Step 2: Event Matching**
```
key = "{eventType}_{tier}"
candidates = database[key]
```

### **Step 3: Interest Filtering**
```
if interests provided:
  filtered = candidates.filter(gift => 
    gift.title.includes(interest) OR
    gift.description.includes(interest)
  )
else:
  filtered = candidates
```

### **Step 4: Ranking**
```
ranked = filtered.sortBy(rating DESC)
top10 = ranked.slice(0, 10)
return top10
```

---

## 📊 Sample Gift Database

### **Birthday - Low Budget ($0-30)**
| Gift | Price | Category | Rating |
|------|-------|----------|--------|
| Personalized Coffee Mug | $15 | Drinkware | 4.5 ⭐ |
| Cozy Socks Set | $18 | Apparel | 4.3 ⭐ |
| Scented Candle | $20 | Home | 4.6 ⭐ |

### **Birthday - Medium Budget ($31-100)**
| Gift | Price | Category | Rating |
|------|-------|----------|--------|
| Wireless Earbuds | $50 | Electronics | 4.4 ⭐ |
| Portable Phone Charger | $35 | Electronics | 4.5 ⭐ |
| Smart Watch | $80 | Electronics | 4.3 ⭐ |

### **Birthday - High Budget ($100+)**
| Gift | Price | Category | Rating |
|------|-------|----------|--------|
| Premium Headphones | $250 | Electronics | 4.7 ⭐ |
| Drone with Camera | $400 | Electronics | 4.5 ⭐ |

---

## 🛍️ Integration with E-Commerce

### **Affiliate Links**
All gifts include affiliate links to:
- **Amazon** - Primary e-commerce partner
- **Etsy** - Handmade and unique items
- **Target** - Retail items
- **Walmart** - Budget-friendly options

### **Affiliate Commission Structure**
- Amazon: 3-5% commission
- Etsy: 2-4% commission
- Other: Varies by partner

### **Tracking Affiliate Sales**
```
1. User clicks gift link
2. Affiliate tracking code activated
3. Purchase recorded
4. Commission tracked
5. Revenue shared with platform
```

---

## 📈 Analytics & Insights

### **User Metrics**
- Total gifts saved
- Total gifts purchased
- Average spending per gift
- Most popular categories
- Preferred price range

### **Gift Metrics**
- Most recommended gifts
- Highest rated gifts
- Most purchased gifts
- Category popularity
- Seasonal trends

### **Business Metrics**
- Affiliate revenue
- Conversion rate
- Average order value
- Customer lifetime value

---

## 🔐 Security & Privacy

✅ **Data Protection**
- User gift preferences encrypted
- Purchase history private
- No sharing of personal data

✅ **Affiliate Compliance**
- Transparent affiliate links
- Disclosure of affiliate relationships
- FTC compliance

---

## 🚀 Future Enhancements

### **Phase 2**
- AI-powered personalization
- Machine learning recommendations
- User preference learning
- Seasonal gift suggestions

### **Phase 3**
- Integration with more retailers
- Price comparison engine
- Stock availability tracking
- Price drop alerts

### **Phase 4**
- Gift registry features
- Group gifting
- Gift wishlists
- Recipient preferences

---

## 🧪 Testing

### **Test Recommendations**
```bash
curl "http://localhost:3000/api/v1/gifts/recommendations?eventId=EVENT_ID&budget=50" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### **Test Trending**
```bash
curl "http://localhost:3000/api/v1/gifts/trending?eventType=birthday" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### **Test Search**
```bash
curl "http://localhost:3000/api/v1/gifts/search?q=wireless+headphones" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### **Test Save Gift**
```bash
curl -X POST http://localhost:3000/api/v1/gifts/save \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID",
    "giftId": "gift_001",
    "giftTitle": "Wireless Earbuds",
    "giftPrice": 50,
    "giftUrl": "https://amazon.com/...",
    "notes": "Great reviews"
  }'
```

---

## 📚 References

- [Amazon Affiliate Program](https://affiliate-program.amazon.com/)
- [Etsy Affiliate Program](https://www.etsy.com/sell)
- [Gift Recommendation Best Practices](https://example.com)

---

**Status:** Ready for Implementation  
**Last Updated:** April 9, 2026
