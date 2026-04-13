/*
 * Mock Business Data
 * In production, this would come from an API
 */

export interface Business {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  email: string;
  rating: number;
  review_count: number;
  category: string;
  description: string;
  hours: string;
  image_url?: string;
}

export const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Roofing",
  "Landscaping",
  "Cleaning",
  "Painting",
  "Carpentry",
  "Dentistry",
  "Healthcare",
  "Legal",
  "Accounting",
  "Real Estate",
  "Restaurants",
  "Fitness",
  "Beauty & Wellness",
];

export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "ABC Plumbing",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    phone: "(415) 555-1234",
    website: "https://abcplumbing.com",
    email: "contact@abcplumbing.com",
    rating: 4.8,
    review_count: 120,
    category: "Plumbing",
    description: "Professional plumbing services for residential and commercial properties. 24/7 emergency service available.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-3pm, Sun Closed",
  },
  {
    id: "2",
    name: "XYZ Electrical",
    address: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    phone: "(415) 555-5678",
    website: "https://xyzelectrical.com",
    email: "info@xyzelectrical.com",
    rating: 4.6,
    review_count: 95,
    category: "Electrical",
    description: "Licensed electricians providing residential and commercial electrical services.",
    hours: "Mon-Fri 7am-6pm, Sat 8am-4pm, Sun Closed",
  },
  {
    id: "3",
    name: "Bay Area HVAC",
    address: "789 Pine Road",
    city: "San Francisco",
    state: "CA",
    zip: "94104",
    phone: "(415) 555-9012",
    website: "https://bayareahvac.com",
    email: "service@bayareahvac.com",
    rating: 4.7,
    review_count: 110,
    category: "HVAC",
    description: "Expert heating, cooling, and ventilation services for homes and businesses.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-3pm, Sun Closed",
  },
  {
    id: "4",
    name: "Pro Roofing Solutions",
    address: "321 Elm Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "(415) 555-3456",
    website: "https://proroofing.com",
    email: "quotes@proroofing.com",
    rating: 4.9,
    review_count: 145,
    category: "Roofing",
    description: "Quality roofing installation, repair, and maintenance services.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-2pm, Sun Closed",
  },
  {
    id: "5",
    name: "Green Landscaping",
    address: "654 Maple Drive",
    city: "San Francisco",
    state: "CA",
    zip: "94106",
    phone: "(415) 555-7890",
    website: "https://greenlandscaping.com",
    email: "info@greenlandscaping.com",
    rating: 4.5,
    review_count: 78,
    category: "Landscaping",
    description: "Professional landscaping design and maintenance services.",
    hours: "Mon-Fri 8am-6pm, Sat 9am-4pm, Sun Closed",
  },
  {
    id: "6",
    name: "Sparkle Clean Services",
    address: "987 Cedar Lane",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    phone: "(415) 555-2468",
    website: "https://sparkleclean.com",
    email: "bookings@sparkleclean.com",
    rating: 4.7,
    review_count: 132,
    category: "Cleaning",
    description: "Residential and commercial cleaning services. Eco-friendly products used.",
    hours: "Mon-Fri 8am-6pm, Sat 9am-5pm, Sun 10am-4pm",
  },
  {
    id: "7",
    name: "Bright Painting Co.",
    address: "147 Birch Street",
    city: "San Francisco",
    state: "CA",
    zip: "94108",
    phone: "(415) 555-1357",
    website: "https://brightpainting.com",
    email: "estimate@brightpainting.com",
    rating: 4.6,
    review_count: 89,
    category: "Painting",
    description: "Interior and exterior painting services with quality finishes.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-3pm, Sun Closed",
  },
  {
    id: "8",
    name: "Expert Carpentry",
    address: "258 Walnut Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94109",
    phone: "(415) 555-2468",
    website: "https://expertcarpentry.com",
    email: "info@expertcarpentry.com",
    rating: 4.8,
    review_count: 104,
    category: "Carpentry",
    description: "Custom woodworking and carpentry for residential projects.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-3pm, Sun Closed",
  },
  {
    id: "9",
    name: "Smile Dental Studio",
    address: "369 Spruce Road",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    phone: "(415) 555-3579",
    website: "https://smiledentalstudio.com",
    email: "appointments@smiledentalstudio.com",
    rating: 4.9,
    review_count: 156,
    category: "Dentistry",
    description: "Comprehensive dental services including cleanings, implants, and cosmetic dentistry.",
    hours: "Mon-Fri 8am-6pm, Sat 9am-2pm, Sun Closed",
  },
  {
    id: "10",
    name: "Wellness Medical Center",
    address: "741 Ash Drive",
    city: "San Francisco",
    state: "CA",
    zip: "94111",
    phone: "(415) 555-4680",
    website: "https://wellnessmedical.com",
    email: "info@wellnessmedical.com",
    rating: 4.7,
    review_count: 118,
    category: "Healthcare",
    description: "Primary care and preventive health services for the whole family.",
    hours: "Mon-Fri 8am-5pm, Sat 9am-1pm, Sun Closed",
  },
  {
    id: "11",
    name: "Legal Associates LLC",
    address: "852 Oak Street",
    city: "San Francisco",
    state: "CA",
    zip: "94112",
    phone: "(415) 555-5791",
    website: "https://legalassociates.com",
    email: "consultation@legalassociates.com",
    rating: 4.8,
    review_count: 67,
    category: "Legal",
    description: "Business law, real estate law, and personal injury legal services.",
    hours: "Mon-Fri 9am-5pm, Sat By Appointment, Sun Closed",
  },
  {
    id: "12",
    name: "Tax Pro Accounting",
    address: "963 Maple Street",
    city: "San Francisco",
    state: "CA",
    zip: "94113",
    phone: "(415) 555-6802",
    website: "https://taxproaccounting.com",
    email: "info@taxproaccounting.com",
    rating: 4.6,
    review_count: 82,
    category: "Accounting",
    description: "Tax preparation, bookkeeping, and financial planning services.",
    hours: "Mon-Fri 9am-5pm, Sat By Appointment, Sun Closed",
  },
  {
    id: "13",
    name: "Bay View Realty",
    address: "159 Pine Street",
    city: "San Francisco",
    state: "CA",
    zip: "94114",
    phone: "(415) 555-7913",
    website: "https://bayviewrealty.com",
    email: "agents@bayviewrealty.com",
    rating: 4.7,
    review_count: 201,
    category: "Real Estate",
    description: "Full-service real estate brokerage for residential and commercial properties.",
    hours: "Mon-Fri 9am-6pm, Sat 10am-5pm, Sun 11am-4pm",
  },
  {
    id: "14",
    name: "The Golden Fork",
    address: "357 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94115",
    phone: "(415) 555-8024",
    website: "https://thegoldenfork.com",
    email: "reservations@thegoldenfork.com",
    rating: 4.8,
    review_count: 287,
    category: "Restaurants",
    description: "Fine dining restaurant featuring California cuisine and extensive wine selection.",
    hours: "Mon-Thu 5pm-10pm, Fri-Sat 5pm-11pm, Sun 5pm-9pm",
  },
  {
    id: "15",
    name: "FitLife Gym",
    address: "468 Valencia Street",
    city: "San Francisco",
    state: "CA",
    zip: "94116",
    phone: "(415) 555-9135",
    website: "https://fitlifegym.com",
    email: "membership@fitlifegym.com",
    rating: 4.6,
    review_count: 143,
    category: "Fitness",
    description: "State-of-the-art fitness facility with classes, personal training, and equipment.",
    hours: "Mon-Fri 5am-10pm, Sat-Sun 7am-8pm",
  },
  {
    id: "16",
    name: "Glow Spa & Wellness",
    address: "579 Geary Boulevard",
    city: "San Francisco",
    state: "CA",
    zip: "94117",
    phone: "(415) 555-0246",
    website: "https://glowspa.com",
    email: "bookings@glowspa.com",
    rating: 4.9,
    review_count: 198,
    category: "Beauty & Wellness",
    description: "Full-service spa offering massages, facials, and wellness treatments.",
    hours: "Mon-Fri 10am-8pm, Sat-Sun 10am-6pm",
  },
];

export function searchBusinesses(query: string, category?: string): Business[] {
  let results = mockBusinesses;

  // Filter by category if provided
  if (category && category !== "All") {
    results = results.filter((b) => b.category === category);
  }

  // Filter by search query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery) ||
        b.city.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort by rating (highest first)
  results.sort((a, b) => b.rating - a.rating);

  return results;
}
