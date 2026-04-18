import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

export interface ParsedContact {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  relationship?: string;
  notes?: string;
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<ParsedContact[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const contacts = normalizeContacts(results.data as any[]);
          resolve(contacts);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

/**
 * Parse Excel file (XLSX)
 */
export function parseExcel(file: File): Promise<ParsedContact[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const contacts = normalizeContacts(jsonData as any[]);
        resolve(contacts);
      } catch (error) {
        reject(new Error(`Excel parsing error: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse text file (tab-separated or comma-separated)
 */
export function parseText(file: File): Promise<ParsedContact[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Try to detect delimiter
        const delimiter = text.includes('\t') ? '\t' : ',';

        Papa.parse(text, {
          header: true,
          delimiter,
          skipEmptyLines: true,
          complete: (results) => {
            const contacts = normalizeContacts(results.data as any[]);
            resolve(contacts);
          },
          error: (error) => {
            reject(new Error(`Text parsing error: ${error.message}`));
          },
        });
      } catch (error) {
        reject(new Error(`Failed to parse text file: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Normalize contacts from various formats
 */
function normalizeContacts(data: any[]): ParsedContact[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data found in file');
  }

  return data
    .map((row) => {
      // Try to find matching columns (case-insensitive)
      const firstName = findColumn(row, [
        'first name',
        'firstname',
        'first_name',
        'fname',
      ]);
      const lastName = findColumn(row, ['last name', 'lastname', 'last_name', 'lname']);
      const email = findColumn(row, ['email', 'e-mail', 'email address']);
      const phone = findColumn(row, ['phone', 'phone number', 'mobile', 'cell']);
      const birthday = findColumn(row, [
        'birthday',
        'birth date',
        'dob',
        'date of birth',
        'birthdate',
      ]);
      const relationship = findColumn(row, [
        'relationship',
        'relation',
        'type',
        'category',
      ]);
      const notes = findColumn(row, ['notes', 'note', 'comments', 'comment']);

      return {
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
        email: email ? (email as string).trim() : undefined,
        phone: phone ? (phone as string).trim() : undefined,
        birthday: birthday ? normalizeBirthday(birthday as string) : undefined,
        relationship: relationship ? (relationship as string).trim() : undefined,
        notes: notes ? (notes as string).trim() : undefined,
      };
    })
    .filter((contact) => contact.firstName || contact.lastName);
}

/**
 * Find column value by possible column names
 */
function findColumn(row: any, possibleNames: string[]): any {
  const keys = Object.keys(row);

  for (const possibleName of possibleNames) {
    const key = keys.find(
      (k) => k.toLowerCase().replace(/[_\s-]/g, '') === possibleName.toLowerCase().replace(/[_\s-]/g, '')
    );
    if (key && row[key]) {
      return row[key];
    }
  }

  return null;
}

/**
 * Normalize birthday to YYYY-MM-DD format
 */
function normalizeBirthday(birthday: string): string | undefined {
  if (!birthday) return undefined;

  // Try various date formats
  const formats = [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY
    /^(\d{1,2})\/(\d{1,2})$/, // MM/DD (no year)
    /^(\d{1,2})-(\d{1,2})$/, // MM-DD (no year)
  ];

  for (const format of formats) {
    const match = birthday.trim().match(format);
    if (match) {
      if (format === formats[0]) {
        // YYYY-MM-DD
        return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
      } else if (format === formats[1]) {
        // MM/DD/YYYY
        return `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
      } else if (format === formats[2]) {
        // MM-DD-YYYY
        return `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
      } else if (format === formats[3] || format === formats[4]) {
        // MM/DD or MM-DD (no year)
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
      }
    }
  }

  return undefined;
}

/**
 * Validate contact data
 */
export function validateContact(contact: ParsedContact): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!contact.firstName && !contact.lastName) {
    errors.push('First name or last name is required');
  }

  if (contact.firstName && contact.firstName.length > 100) {
    errors.push('First name is too long (max 100 characters)');
  }

  if (contact.lastName && contact.lastName.length > 100) {
    errors.push('Last name is too long (max 100 characters)');
  }

  if (contact.email && !isValidEmail(contact.email)) {
    errors.push('Invalid email format');
  }

  if (contact.phone && !isValidPhone(contact.phone)) {
    errors.push('Invalid phone format');
  }

  if (contact.birthday && !isValidDate(contact.birthday)) {
    errors.push('Invalid birthday format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
function isValidPhone(phone: string): boolean {
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate date format
 */
function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/**
 * Parse PDF file
 */
export async function parsePDF(file: File): Promise<ParsedContact[]> {
  try {
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    // Try to parse as CSV/table format
    const lines = fullText.split('\n').filter((line) => line.trim());

    // Try to detect if it's a table format
    if (lines.length > 1) {
      // Try parsing as CSV
      const csvText = lines.join('\n');
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const contacts = normalizeContacts(results.data as any[]);
              resolve(contacts);
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            reject(new Error(`PDF parsing error: ${error.message}`));
          },
        });
      });
    }

    throw new Error('No contact data found in PDF');
  } catch (error) {
    throw new Error(`PDF parsing error: ${(error as Error).message}`);
  }
}

/**
 * Get file type from file
 */
export function getFileType(file: File): 'csv' | 'excel' | 'text' | 'pdf' | 'unknown' {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (name.endsWith('.csv') || type === 'text/csv') {
    return 'csv';
  }

  if (
    name.endsWith('.xlsx') ||
    name.endsWith('.xls') ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.ms-excel'
  ) {
    return 'excel';
  }

  if (name.endsWith('.txt') || type === 'text/plain') {
    return 'text';
  }

  if (name.endsWith('.pdf') || type === 'application/pdf') {
    return 'pdf';
  }

  return 'unknown';
}

/**
 * Parse file based on type
 */
export async function parseFile(file: File): Promise<ParsedContact[]> {
  const fileType = getFileType(file);

  switch (fileType) {
    case 'csv':
      return parseCSV(file);
    case 'excel':
      return parseExcel(file);
    case 'text':
      return parseText(file);
    case 'pdf':
      return parsePDF(file);
    default:
      throw new Error(
        'Unsupported file type. Please use CSV, Excel, PDF, or text files.'
      );
  }
}

/**
 * Create sample CSV template
 */
export function downloadSampleCSV() {
  const sampleData = [
    {
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Phone: '555-1234',
      Birthday: '1990-05-15',
      Relationship: 'Friend',
      Notes: 'College friend',
    },
    {
      'First Name': 'Jane',
      'Last Name': 'Smith',
      Email: 'jane@example.com',
      Phone: '555-5678',
      Birthday: '1992-03-20',
      Relationship: 'Family',
      Notes: 'Sister',
    },
  ];

  const csv = Papa.unparse(sampleData);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts_template.csv';
  link.click();
  URL.revokeObjectURL(url);
}
