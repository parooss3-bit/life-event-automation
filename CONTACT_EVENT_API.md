# Contact & Event Management API Documentation

**Version:** 1.0  
**Last Updated:** April 9, 2026

---

## 📋 Overview

This document describes the complete API for managing contacts and events in the Life Event Automation platform.

---

## 🔐 Authentication

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📇 Contact Management Endpoints

### GET /api/v1/contacts
Get all contacts for the authenticated user with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Items per page (max 100) |
| `search` | string | - | Search by name, email, or phone |
| `relationship` | string | - | Filter by relationship type |
| `sortBy` | string | firstName | Sort field |
| `sortOrder` | string | asc | Sort order (asc/desc) |

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/contacts?page=1&limit=20&search=Sarah&relationship=friend"
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "contact-uuid",
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "sarah@example.com",
      "phone": "+1234567890",
      "relationship": "friend",
      "avatarUrl": "https://...",
      "notes": "College friend",
      "createdAt": "2026-04-09T10:00:00Z",
      "events": [
        {
          "id": "event-uuid",
          "eventType": "birthday",
          "title": "Sarah's Birthday",
          "eventDate": "2026-05-15T00:00:00Z",
          "isRecurring": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### POST /api/v1/contacts
Create a new contact.

**Request Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Smith",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "relationship": "friend",
  "avatarUrl": "https://...",
  "notes": "College friend"
}
```

**Response (201):**
```json
{
  "id": "contact-uuid",
  "firstName": "Sarah",
  "lastName": "Smith",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "relationship": "friend",
  "avatarUrl": "https://...",
  "notes": "College friend",
  "createdAt": "2026-04-09T10:00:00Z"
}
```

---

### GET /api/v1/contacts/:id
Get a specific contact by ID.

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/contacts/contact-uuid"
```

**Response (200):**
```json
{
  "id": "contact-uuid",
  "firstName": "Sarah",
  "lastName": "Smith",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "relationship": "friend",
  "avatarUrl": "https://...",
  "notes": "College friend",
  "createdAt": "2026-04-09T10:00:00Z",
  "events": [
    {
      "id": "event-uuid",
      "eventType": "birthday",
      "title": "Sarah's Birthday",
      "eventDate": "2026-05-15T00:00:00Z",
      "isRecurring": true
    }
  ]
}
```

---

### PUT /api/v1/contacts/:id
Update a contact.

**Request Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+1234567890",
  "relationship": "close friend",
  "notes": "Updated notes"
}
```

**Response (200):**
```json
{
  "id": "contact-uuid",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+1234567890",
  "relationship": "close friend",
  "notes": "Updated notes",
  "updatedAt": "2026-04-09T11:00:00Z"
}
```

---

### DELETE /api/v1/contacts/:id
Soft delete a contact (marks as deleted, doesn't remove from database).

**Example Request:**
```bash
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/contacts/contact-uuid"
```

**Response (200):**
```json
{
  "message": "Contact deleted successfully",
  "id": "contact-uuid"
}
```

---

### POST /api/v1/contacts/bulk/import
Import multiple contacts at once (max 1000).

**Request Body:**
```json
{
  "contacts": [
    {
      "firstName": "Sarah",
      "lastName": "Smith",
      "email": "sarah@example.com",
      "phone": "+1234567890",
      "relationship": "friend",
      "avatarUrl": "https://...",
      "notes": "College friend"
    },
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "relationship": "colleague"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Contacts imported successfully",
  "imported": 2,
  "duplicates": 0,
  "contacts": [
    {
      "id": "contact-uuid-1",
      "firstName": "Sarah",
      "lastName": "Smith"
    },
    {
      "id": "contact-uuid-2",
      "firstName": "John",
      "lastName": "Doe"
    }
  ]
}
```

---

### GET /api/v1/contacts/stats/summary
Get contact statistics.

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/contacts/stats/summary"
```

**Response (200):**
```json
{
  "totalContacts": 45,
  "contactsWithEmail": 42,
  "contactsWithPhone": 38,
  "contactsWithBirthday": 40,
  "byRelationship": [
    {
      "relationship": "friend",
      "count": 25
    },
    {
      "relationship": "family",
      "count": 15
    },
    {
      "relationship": "colleague",
      "count": 5
    }
  ]
}
```

---

## 📅 Event Management Endpoints

### GET /api/v1/events
Get all events for the authenticated user with filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `eventType` | string | - | Filter by event type (birthday, anniversary, etc.) |
| `status` | string | - | Filter by status (upcoming, past, completed) |
| `startDate` | string | - | Filter events after this date (ISO 8601) |
| `endDate` | string | - | Filter events before this date (ISO 8601) |
| `contactId` | string | - | Filter by contact ID |
| `sortBy` | string | eventDate | Sort field |
| `sortOrder` | string | asc | Sort order (asc/desc) |

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/events?eventType=birthday&status=upcoming&page=1"
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "event-uuid",
      "contactId": "contact-uuid",
      "eventType": "birthday",
      "title": "Sarah's Birthday",
      "eventDate": "2026-05-15T00:00:00Z",
      "description": "Sarah's 35th birthday",
      "isRecurring": true,
      "recurrencePattern": "yearly",
      "reminderDaysBefore": 14,
      "status": "upcoming",
      "contact": {
        "id": "contact-uuid",
        "firstName": "Sarah",
        "lastName": "Smith",
        "email": "sarah@example.com",
        "avatarUrl": "https://..."
      },
      "reminders": [
        {
          "id": "reminder-uuid",
          "reminderDate": "2026-05-01T00:00:00Z",
          "status": "pending"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

---

### POST /api/v1/events
Create a new event.

**Request Body:**
```json
{
  "contactId": "contact-uuid",
  "eventType": "birthday",
  "title": "Sarah's Birthday",
  "eventDate": "2026-05-15",
  "description": "Sarah's 35th birthday",
  "isRecurring": true,
  "recurrencePattern": "yearly",
  "reminderDaysBefore": 14,
  "giftIdeas": "Jewelry, Books, Coffee",
  "notes": "Loves coffee and reading"
}
```

**Response (201):**
```json
{
  "id": "event-uuid",
  "contactId": "contact-uuid",
  "eventType": "birthday",
  "title": "Sarah's Birthday",
  "eventDate": "2026-05-15T00:00:00Z",
  "description": "Sarah's 35th birthday",
  "isRecurring": true,
  "recurrencePattern": "yearly",
  "reminderDaysBefore": 14,
  "status": "upcoming",
  "createdAt": "2026-04-09T10:00:00Z"
}
```

---

### GET /api/v1/events/:id
Get a specific event by ID.

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/events/event-uuid"
```

**Response (200):**
```json
{
  "id": "event-uuid",
  "contactId": "contact-uuid",
  "eventType": "birthday",
  "title": "Sarah's Birthday",
  "eventDate": "2026-05-15T00:00:00Z",
  "description": "Sarah's 35th birthday",
  "isRecurring": true,
  "recurrencePattern": "yearly",
  "reminderDaysBefore": 14,
  "status": "upcoming",
  "contact": { ... },
  "reminders": [ ... ],
  "gifts": [ ... ],
  "videos": [ ... ]
}
```

---

### PUT /api/v1/events/:id
Update an event.

**Request Body:**
```json
{
  "title": "Sarah's 35th Birthday",
  "eventDate": "2026-05-15",
  "reminderDaysBefore": 21,
  "giftIdeas": "Jewelry, Books, Coffee, Plants",
  "status": "upcoming"
}
```

**Response (200):**
```json
{
  "id": "event-uuid",
  "title": "Sarah's 35th Birthday",
  "eventDate": "2026-05-15T00:00:00Z",
  "reminderDaysBefore": 21,
  "status": "upcoming",
  "updatedAt": "2026-04-09T11:00:00Z"
}
```

---

### DELETE /api/v1/events/:id
Soft delete an event.

**Example Request:**
```bash
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/events/event-uuid"
```

**Response (200):**
```json
{
  "message": "Event deleted successfully",
  "id": "event-uuid"
}
```

---

### GET /api/v1/events/upcoming/list
Get upcoming events (next 30 days by default).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `days` | number | 30 | Number of days to look ahead |

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/events/upcoming/list?days=30"
```

**Response (200):**
```json
{
  "upcomingDays": 30,
  "count": 5,
  "events": [
    {
      "id": "event-uuid",
      "eventType": "birthday",
      "title": "Sarah's Birthday",
      "eventDate": "2026-05-15T00:00:00Z",
      "contact": {
        "firstName": "Sarah",
        "lastName": "Smith",
        "email": "sarah@example.com",
        "avatarUrl": "https://..."
      }
    }
  ]
}
```

---

### GET /api/v1/events/stats/summary
Get event statistics.

**Example Request:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/v1/events/stats/summary"
```

**Response (200):**
```json
{
  "totalEvents": 45,
  "upcomingEvents": 5,
  "pastEvents": 40,
  "recurringEvents": 30,
  "byType": [
    {
      "eventType": "birthday",
      "count": 40
    },
    {
      "eventType": "anniversary",
      "count": 5
    }
  ]
}
```

---

## 🔄 Common Workflows

### Import Contacts from Facebook

1. User logs in with Facebook OAuth
2. Backend extracts friends with birthdays
3. Bulk import contacts via `POST /contacts/bulk/import`
4. Birthday events created automatically

### Create Event for Contact

1. Get contact ID from `GET /contacts`
2. Create event with `POST /events`
3. Event reminders created automatically

### Get Upcoming Reminders

1. Call `GET /events/upcoming/list?days=14`
2. Returns events in next 14 days
3. Frontend displays reminders to user

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `INVALID_TOKEN` | 401 | Missing or invalid JWT token |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONTACT_EXISTS` | 409 | Contact with same name already exists |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## 📊 Data Models

### Contact
```typescript
{
  id: string;              // UUID
  userId: string;          // User who owns this contact
  firstName: string;       // Required
  lastName: string;        // Optional
  email?: string;          // Optional
  phone?: string;          // Optional
  relationship: string;    // friend, family, colleague, etc.
  avatarUrl?: string;      // Profile picture URL
  notes?: string;          // User notes
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;        // Soft delete timestamp
}
```

### Event
```typescript
{
  id: string;              // UUID
  userId: string;          // User who owns this event
  contactId: string;       // Associated contact
  eventType: string;       // birthday, anniversary, milestone, custom
  title: string;           // Event title
  eventDate: Date;         // When the event occurs
  description?: string;    // Event description
  isRecurring: boolean;    // Whether event repeats
  recurrencePattern?: string; // yearly, monthly, etc.
  reminderDaysBefore: number; // Days before to send reminder
  giftIdeas?: string;      // Gift suggestions
  notes?: string;          // User notes
  status: string;          // upcoming, past, completed
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;        // Soft delete timestamp
}
```

---

## 🧪 Testing

### Test Contact Creation
```bash
curl -X POST http://localhost:3000/api/v1/contacts \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Smith",
    "email": "sarah@example.com",
    "relationship": "friend"
  }'
```

### Test Event Creation
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "CONTACT_ID",
    "eventType": "birthday",
    "title": "Sarah'\''s Birthday",
    "eventDate": "2026-05-15",
    "reminderDaysBefore": 14
  }'
```

---

## 📈 Performance Considerations

- **Pagination:** Use `limit` and `page` for large datasets
- **Filtering:** Use specific filters to reduce query size
- **Sorting:** Sort by indexed fields (firstName, eventDate)
- **Bulk Import:** Max 1000 contacts per request
- **Caching:** Consider caching contact stats

---

**Status:** Ready for Implementation  
**Last Updated:** April 9, 2026
