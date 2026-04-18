# Contact Import Guide

Complete guide for importing contacts via CSV, Excel, PDF, and manual entry.

---

## 📋 Overview

The platform provides multiple ways to add contacts:

1. **Drag & Drop Import** - Upload CSV, Excel, or text files
2. **Quick Add Form** - Manually add one contact at a time
3. **Facebook OAuth** - Auto-import friends and birthdays
4. **Bulk Import API** - Programmatic import

---

## 🚀 Getting Started

### Method 1: Drag & Drop Import (Easiest!)

1. Go to **Contacts** page
2. Click **Import** button
3. **Drag and drop** your file or click to browse
4. Review the preview
5. Click **Import** to add contacts

**Supported files:** CSV, Excel, PDF, Text

**Export from:**
- Gmail Contacts → Export as CSV
- Outlook → Export as CSV/Excel
- Apple Contacts → Export as VCard (convert to CSV)
- Google Contacts → Export as CSV
- Your phone → Export contacts as CSV
- Any spreadsheet → Save as CSV/Excel

### Method 2: Quick Add Form

1. Go to **Contacts** page
2. Click **Add Contact** button
3. Fill in the form
4. Click **Add Contact**

### Method 3: Facebook OAuth

1. Go to **Settings**
2. Click **Connect Facebook**
3. Authorize the app
4. Friends and birthdays auto-imported

---

## 📁 Supported File Formats

### PDF (Portable Document Format)

**File extension:** `.pdf`

**Supported formats:**
- Tables/spreadsheets in PDF
- Text-based contact lists
- Exported contacts from other apps

**How it works:**
- Extracts text from PDF
- Automatically detects table format
- Parses columns like CSV

### CSV (Comma-Separated Values)

**File extension:** `.csv`

**Example:**
```csv
First Name,Last Name,Email,Phone,Birthday,Relationship,Notes
John,Doe,john@example.com,555-1234,1990-05-15,Friend,College friend
Jane,Smith,jane@example.com,555-5678,1992-03-20,Family,Sister
```

### Excel (XLSX/XLS)

**File extensions:** `.xlsx`, `.xls`

**Example:**
| First Name | Last Name | Email | Phone | Birthday | Relationship | Notes |
|---|---|---|---|---|---|---|
| John | Doe | john@example.com | 555-1234 | 1990-05-15 | Friend | College friend |
| Jane | Smith | jane@example.com | 555-5678 | 1992-03-20 | Family | Sister |

### Text (TXT)

**File extension:** `.txt`

**Format:** Tab-separated or comma-separated

```
First Name	Last Name	Email	Phone	Birthday	Relationship	Notes
John	Doe	john@example.com	555-1234	1990-05-15	Friend	College friend
Jane	Smith	jane@example.com	555-5678	1992-03-20	Family	Sister
```

---

## 📝 Column Names

The system automatically detects column names (case-insensitive):

### Required
- **First Name** (or: firstname, first_name, fname)
- **Last Name** (or: lastname, last_name, lname)

### Optional
- **Email** (or: e-mail, email address)
- **Phone** (or: phone number, mobile, cell)
- **Birthday** (or: birth date, dob, date of birth, birthdate)
- **Relationship** (or: relation, type, category)
- **Notes** (or: note, comments, comment)

---

## 📅 Date Formats

Birthday dates are automatically converted to YYYY-MM-DD format:

| Format | Example | Result |
|--------|---------|--------|
| YYYY-MM-DD | 1990-05-15 | 1990-05-15 |
| MM/DD/YYYY | 05/15/1990 | 1990-05-15 |
| MM-DD-YYYY | 05-15-1990 | 1990-05-15 |
| MM/DD | 05/15 | 2026-05-15 |
| MM-DD | 05-15 | 2026-05-15 |

---

## ✅ Validation Rules

### First & Last Name
- At least one is required
- Maximum 100 characters each

### Email
- Must be valid email format
- Optional field

### Phone
- Must contain at least 10 digits
- Accepts various formats: (555) 123-4567, 555.123.4567, etc.
- Optional field

### Birthday
- Must be valid date
- Optional field

### Relationship
- Any text accepted
- Common values: Friend, Family, Colleague, Other
- Optional field

---

## 🎯 Import Workflow

### Step 1: Upload File
```
Drag & drop file or click to browse
↓
File selected
```

### Step 2: Parse & Validate
```
File parsed
↓
Contacts extracted
↓
Validation performed
↓
Valid/Invalid contacts identified
```

### Step 3: Preview
```
Show summary:
- Total contacts
- Valid contacts
- Invalid contacts

Show each contact:
- Name, email, birthday
- Validation errors (if any)
```

### Step 4: Import
```
User confirms
↓
Valid contacts imported
↓
Success message
↓
Contacts available in dashboard
```

---

## 📊 Example Files

### CSV Template

Save as `contacts.csv`:

```csv
First Name,Last Name,Email,Phone,Birthday,Relationship,Notes
John,Doe,john@example.com,555-1234,1990-05-15,Friend,College friend
Jane,Smith,jane@example.com,555-5678,1992-03-20,Family,Sister
Bob,Johnson,bob@example.com,555-9012,1988-08-10,Colleague,Work buddy
Alice,Williams,alice@example.com,555-3456,1995-12-25,Friend,Gym partner
```

### Excel Template

Save as `contacts.xlsx`:

| First Name | Last Name | Email | Phone | Birthday | Relationship | Notes |
|---|---|---|---|---|---|---|
| John | Doe | john@example.com | 555-1234 | 1990-05-15 | Friend | College friend |
| Jane | Smith | jane@example.com | 555-5678 | 1992-03-20 | Family | Sister |
| Bob | Johnson | bob@example.com | 555-9012 | 1988-08-10 | Colleague | Work buddy |
| Alice | Williams | alice@example.com | 555-3456 | 1995-12-25 | Friend | Gym partner |

### Text Template

Save as `contacts.txt`:

```
First Name	Last Name	Email	Phone	Birthday	Relationship	Notes
John	Doe	john@example.com	555-1234	1990-05-15	Friend	College friend
Jane	Smith	jane@example.com	555-5678	1992-03-20	Family	Sister
Bob	Johnson	bob@example.com	555-9012	1988-08-10	Colleague	Work buddy
Alice	Williams	alice@example.com	555-3456	1995-12-25	Friend	Gym partner
```

---

## 🔄 Bulk Import API

### Endpoint

```
POST /api/v1/contacts/bulk-import
```

### Request

```json
{
  "contacts": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "birthday": "1990-05-15",
      "relationship": "friend",
      "notes": "College friend"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "imported": 1,
  "failed": 0,
  "errors": []
}
```

---

## 🛠️ Troubleshooting

### Issue: File not recognized

**Solution:**
- Check file extension (.csv, .xlsx, .txt)
- Ensure file is not corrupted
- Try opening in Excel/Numbers to verify

### Issue: Contacts not importing

**Solution:**
- Check validation errors in preview
- Ensure at least first or last name is present
- Verify email format if provided
- Check birthday date format

### Issue: Birthday dates incorrect

**Solution:**
- Use standard formats: YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY
- Avoid ambiguous formats like DD/MM/YYYY
- If no year provided, current year is used

### Issue: Phone numbers not recognized

**Solution:**
- Ensure at least 10 digits
- Remove special characters or keep them consistent
- Examples: 5551234567, 555-123-4567, (555) 123-4567

### Issue: Special characters in names

**Solution:**
- Accented characters are supported: é, ñ, ü, etc.
- Apostrophes are supported: O'Brien, D'Angelo
- Hyphens are supported: Mary-Jane, Jean-Pierre

---

## 📈 Batch Import Limits

- **Maximum contacts per import:** 1,000
- **Maximum file size:** 10 MB
- **Maximum columns:** 50
- **Maximum characters per field:** 1,000

---

## 🔒 Data Privacy

- Imported data is encrypted
- Only you can access your contacts
- Data is never shared with third parties
- You can export or delete data anytime

---

## 🔗 Integration Points

✅ **Facebook OAuth**
- Auto-import friends
- Extract birthdays
- Link to existing contacts

✅ **Event Creation**
- Auto-create birthday events
- Set reminders
- Track anniversaries

✅ **Reminders**
- Send notifications
- Multi-channel delivery
- Customizable timing

✅ **Gift Recommendations**
- Get suggestions based on relationship
- Track gift budget
- View purchase history

---

## 📚 Sample Workflows

### Workflow 1: Import Friends from Excel

1. Export contacts from your phone/email
2. Save as Excel file
3. Go to Contacts → Import
4. Drag and drop file
5. Review preview
6. Click Import
7. Contacts added to dashboard

### Workflow 2: Add Family Members Manually

1. Go to Contacts → Add Contact
2. Fill in form (first name, last name, birthday)
3. Click Add Contact
4. Repeat for each family member
5. View all contacts in dashboard

### Workflow 3: Import & Create Events

1. Import contacts from CSV
2. Go to Events
3. Create birthday events for imported contacts
4. Set reminders
5. Receive notifications on event dates

---

## 🚀 Advanced Features

### Duplicate Detection
- System checks for existing contacts
- Prevents duplicate imports
- Suggests merging similar contacts

### Data Validation
- Real-time validation
- Clear error messages
- Suggestions for fixes

### Preview & Confirm
- See exactly what will be imported
- Review validation errors
- Confirm before proceeding

### Bulk Operations
- Import up to 1,000 contacts at once
- Fast processing
- Real-time progress updates

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Download sample template
3. Contact support team
4. Email: support@momentremind.com

---

## 📚 Resources

- [Download Sample CSV](https://momentremind.com/sample-contacts.csv)
- [Download Sample Excel](https://momentremind.com/sample-contacts.xlsx)
- [API Documentation](./API_ARCHITECTURE.md)
- [Contact Management Guide](./CONTACT_EVENT_API.md)

---

**Next Steps:**
1. Download sample template
2. Prepare your contact list
3. Import contacts
4. Create events
5. Set up reminders
