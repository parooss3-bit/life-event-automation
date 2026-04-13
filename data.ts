/*
 * Research Data: Service Businesses That Benefit from Directory Websites
 * Sources: Ideal Directories, RadiusTheme, Jasmine Directory, BrightLocal
 */

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  type: "local" | "professional" | "health" | "lifestyle" | "specialty";
  directoryBenefitScore: number; // 1-100
  marketSize: string;
  avgMonthlySearches: string;
  revenuePerListing: string;
  customerLTV: number; // Customer Lifetime Value in thousands (e.g., 5 = $5k)
  keyBenefit: string;
  description: string;
  subServices: string[];
  whyItWorks: string;
  stats: { label: string; value: string }[];
}

export const categories: ServiceCategory[] = [
  {
    id: "restaurants",
    name: "Restaurants & Food",
    icon: "🍽️",
    color: "#D4470A",
    bgColor: "#FFF3EE",
    borderColor: "#D4470A",
    type: "local",
    directoryBenefitScore: 95,
    marketSize: "$997B",
    avgMonthlySearches: "2.4M+",
    revenuePerListing: "$50–$200/mo",
    customerLTV: 2,
    keyBenefit: "24/7 menu & coupon exposure",
    description:
      "Restaurants invest heavily in local advertising and have a 'copycat' mentality — once one lists, competitors follow. With thousands of options in any market, directories help diners discover the right spot at the right moment.",
    subServices: [
      "Italian Restaurants",
      "Chinese Restaurants",
      "Indian Restaurants",
      "BBQ & Grills",
      "Sushi Bars",
      "Bakeries",
      "Delis & Diners",
      "Ice Cream Shops",
      "Food Trucks",
      "Catering Services",
    ],
    whyItWorks:
      "80% of consumers search online for restaurants before visiting. Directory listings provide 24/7 exposure with photos, menus, and coupons at a fraction of traditional ad costs.",
    stats: [
      { label: "Consumer search rate", value: "80%" },
      { label: "Avg. listing ROI", value: "12x" },
      { label: "Market competition", value: "High" },
    ],
  },
  {
    id: "home-improvement",
    name: "Home Improvement",
    icon: "🔧",
    color: "#1A6B3C",
    bgColor: "#EDFAF3",
    borderColor: "#1A6B3C",
    type: "local",
    directoryBenefitScore: 92,
    marketSize: "$600B",
    avgMonthlySearches: "1.8M+",
    revenuePerListing: "$75–$300/mo",
    customerLTV: 15,
    keyBenefit: "Lead gen for high-ticket jobs",
    description:
      "Home improvement providers lack physical storefronts, making directories their primary discovery channel. Even one new customer from a listing can generate $10,000+ in revenue, making the ROI exceptional.",
    subServices: [
      "Plumbers",
      "Electricians",
      "Roofers",
      "Painters",
      "Landscapers",
      "HVAC Services",
      "Interior Designers",
      "Solar Panel Companies",
      "Garage Door Repair",
      "Chimney Cleaning",
    ],
    whyItWorks:
      "No storefronts means no walk-in traffic. Directories are the primary way homeowners discover and vet contractors. High-ticket services justify premium listing fees.",
    stats: [
      { label: "Avg. job value", value: "$10K+" },
      { label: "Leads per listing/mo", value: "8–15" },
      { label: "Customer lifetime", value: "5+ yrs" },
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: "💼",
    color: "#1E4D8C",
    bgColor: "#EEF4FF",
    borderColor: "#1E4D8C",
    type: "professional",
    directoryBenefitScore: 90,
    marketSize: "$2.1T",
    avgMonthlySearches: "3.2M+",
    revenuePerListing: "$100–$500/mo",
    customerLTV: 25,
    keyBenefit: "Targeted visibility for solo practitioners",
    description:
      "Lawyers, accountants, consultants, and financial planners often operate from small offices with no street traffic. Directory listings offer a 'hands-off' advertising approach that generates leads 24/7 without demanding their time.",
    subServices: [
      "Lawyers",
      "Accountants",
      "Tax Preparers",
      "Business Consultants",
      "Financial Planners",
      "Insurance Agents",
      "Mortgage Brokers",
      "IT Services",
      "Life Coaches",
      "Private Investigators",
    ],
    whyItWorks:
      "Professional services rely on trust and credentials. Directories allow them to showcase qualifications, testimonials, and specializations — converting searchers into clients.",
    stats: [
      { label: "Revenue per listing", value: "$100–500/mo" },
      { label: "Client LTV", value: "$5K–50K" },
      { label: "Search intent", value: "High" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare Providers",
    icon: "🏥",
    color: "#0D7A6B",
    bgColor: "#EDFAF8",
    borderColor: "#0D7A6B",
    type: "health",
    directoryBenefitScore: 94,
    marketSize: "$4.5T",
    avgMonthlySearches: "5.1M+",
    revenuePerListing: "$150–$500/mo",
    customerLTV: 30,
    keyBenefit: "Patient discovery & trust-building",
    description:
      "Healthcare directories represent the most lucrative niche. With 40% of patients researching providers online before booking, and high customer lifetime value, specialized healthcare directories generate 340% higher revenue per listing than general directories.",
    subServices: [
      "General Physicians",
      "Dentists",
      "Chiropractors",
      "Physical Therapists",
      "Dermatologists",
      "Veterinarians",
      "Acupuncturists",
      "Nutritionists",
      "Medical Spas",
      "Urgent Care Centers",
    ],
    whyItWorks:
      "Patients research providers extensively before booking. Directories with reviews, specialties, and insurance info dramatically reduce friction in the patient acquisition funnel.",
    stats: [
      { label: "Online research rate", value: "40%" },
      { label: "Avg. listing revenue", value: "340% higher" },
      { label: "Provider retention", value: "3–5 yrs" },
    ],
  },
  {
    id: "automotive",
    name: "Automotive Services",
    icon: "🚗",
    color: "#7A3B0D",
    bgColor: "#FFF7F0",
    borderColor: "#7A3B0D",
    type: "local",
    directoryBenefitScore: 88,
    marketSize: "$880B",
    avgMonthlySearches: "1.5M+",
    revenuePerListing: "$60–$250/mo",
    customerLTV: 8,
    keyBenefit: "Local trust & review credibility",
    description:
      "Auto service businesses are highly localized — customers rarely travel far for repairs. Trust is paramount, and directories with reviews and photos help shops build credibility before a customer even calls.",
    subServices: [
      "Auto Mechanics",
      "Body Shops",
      "Tire & Wheel Repair",
      "Oil Change Services",
      "Towing Companies",
      "Auto Detailing",
      "Battery Replacement",
      "Automotive Locksmiths",
      "Car Washes",
      "Transmission Repair",
    ],
    whyItWorks:
      "Customers search 'mechanic near me' in moments of need. High review visibility and proximity in directories directly drives foot traffic and phone calls.",
    stats: [
      { label: "Search radius", value: "< 5 miles" },
      { label: "Review influence", value: "73%" },
      { label: "Repeat customer rate", value: "65%" },
    ],
  },
  {
    id: "beauty-wellness",
    name: "Beauty & Wellness",
    icon: "✂️",
    color: "#8B1A6B",
    bgColor: "#FFF0FB",
    borderColor: "#8B1A6B",
    type: "lifestyle",
    directoryBenefitScore: 87,
    marketSize: "$532B",
    avgMonthlySearches: "2.1M+",
    revenuePerListing: "$40–$150/mo",
    customerLTV: 4,
    keyBenefit: "Portfolio showcase & booking",
    description:
      "Salons, spas, and wellness providers thrive when they can showcase their work visually. Directories with photo galleries and booking integrations convert browsers into booked appointments.",
    subServices: [
      "Hair Salons",
      "Barbershops",
      "Nail Salons",
      "Day Spas",
      "Massage Therapists",
      "Tattoo Studios",
      "Makeup Artists",
      "Eyebrow Threading",
      "Waxing Studios",
      "Tanning Salons",
    ],
    whyItWorks:
      "Visual services need visual proof. Directories with photo galleries and customer reviews let salons demonstrate quality and attract new clients without expensive advertising.",
    stats: [
      { label: "Photo impact on bookings", value: "+45%" },
      { label: "Repeat client rate", value: "70%" },
      { label: "Avg. booking value", value: "$80–$200" },
    ],
  },
  {
    id: "childcare-education",
    name: "Childcare & Education",
    icon: "📚",
    color: "#1A5C8C",
    bgColor: "#EEF6FF",
    borderColor: "#1A5C8C",
    type: "lifestyle",
    directoryBenefitScore: 85,
    marketSize: "$280B",
    avgMonthlySearches: "900K+",
    revenuePerListing: "$75–$200/mo",
    customerLTV: 12,
    keyBenefit: "Trust signals for parents",
    description:
      "Parents are willing to pay a premium for quality childcare and education. Directories that showcase safety measures, staff credentials, and facility photos help providers build the trust needed to convert anxious parents into enrolled families.",
    subServices: [
      "Day Care Centers",
      "Tutoring Services",
      "Dance Studios",
      "Music Lessons",
      "After-School Programs",
      "Language Schools",
      "Early Learning Centers",
      "Children's Fitness Studios",
      "Nanny Services",
      "Summer Camps",
    ],
    whyItWorks:
      "Trust is the #1 factor in childcare decisions. Directories with verified reviews, safety certifications, and facility photos dramatically accelerate the parent decision-making process.",
    stats: [
      { label: "Parent research time", value: "3–6 weeks" },
      { label: "Review influence", value: "89%" },
      { label: "Avg. enrollment value", value: "$800–$2K/mo" },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate Services",
    icon: "🏠",
    color: "#2D5A1B",
    bgColor: "#F0F9EB",
    borderColor: "#2D5A1B",
    type: "professional",
    directoryBenefitScore: 89,
    marketSize: "$3.8T",
    avgMonthlySearches: "4.2M+",
    revenuePerListing: "$100–$400/mo",
    customerLTV: 20,
    keyBenefit: "Agent visibility & lead generation",
    description:
      "Real estate agents depend on local visibility and personal branding. Directories help agents showcase listings, testimonials, and specializations, generating high-value leads in a market where a single transaction can mean $10,000+ in commission.",
    subServices: [
      "Real Estate Agents",
      "Property Managers",
      "Mortgage Brokers",
      "Home Inspectors",
      "Real Estate Attorneys",
      "Appraisers",
      "Moving Companies",
      "Storage Facilities",
      "Interior Stagers",
      "Title Companies",
    ],
    whyItWorks:
      "Buyers and sellers research agents extensively online. Directories with reviews, past sales data, and neighborhood specializations help agents stand out in competitive markets.",
    stats: [
      { label: "Avg. commission", value: "$12K+" },
      { label: "Online research rate", value: "97%" },
      { label: "Listing ROI", value: "Very High" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness & Recreation",
    icon: "💪",
    color: "#6B1A0D",
    bgColor: "#FFF3F0",
    borderColor: "#6B1A0D",
    type: "lifestyle",
    directoryBenefitScore: 82,
    marketSize: "$96B",
    avgMonthlySearches: "1.1M+",
    revenuePerListing: "$50–$175/mo",
    customerLTV: 6,
    keyBenefit: "Class discovery & membership growth",
    description:
      "Gyms, yoga studios, personal trainers, and sports facilities benefit from directories that help fitness seekers discover options nearby. The recurring membership model makes each acquired customer extremely valuable.",
    subServices: [
      "Gyms & Fitness Centers",
      "Yoga Studios",
      "Personal Trainers",
      "Martial Arts Schools",
      "CrossFit Boxes",
      "Swimming Pools",
      "Rock Climbing Gyms",
      "Pilates Studios",
      "Sports Leagues",
      "Golf Courses",
    ],
    whyItWorks:
      "Fitness decisions are often spontaneous and location-driven. Directories with class schedules, pricing, and trial offer coupons convert searchers into members.",
    stats: [
      { label: "Avg. membership value", value: "$600/yr" },
      { label: "Trial conversion rate", value: "35%" },
      { label: "Member retention", value: "12–18 mo" },
    ],
  },
  {
    id: "pet-services",
    name: "Pet Services",
    icon: "🐾",
    color: "#5C3A1A",
    bgColor: "#FFF8F0",
    borderColor: "#5C3A1A",
    type: "local",
    directoryBenefitScore: 83,
    marketSize: "$150B",
    avgMonthlySearches: "780K+",
    revenuePerListing: "$40–$150/mo",
    customerLTV: 5,
    keyBenefit: "Trust-based discovery for pet owners",
    description:
      "Pet owners treat their animals like family and are highly selective about service providers. Directories with reviews, certifications, and photos help pet groomers, trainers, and vets build the trust needed to win new clients.",
    subServices: [
      "Veterinarians",
      "Pet Groomers",
      "Dog Trainers",
      "Pet Boarding",
      "Dog Walkers",
      "Pet Sitters",
      "Pet Stores",
      "Animal Hospitals",
      "Pet Photography",
      "Aquarium Services",
    ],
    whyItWorks:
      "Pet owners are emotionally invested and research providers carefully. Directories with verified reviews and certifications reduce anxiety and accelerate trust-building.",
    stats: [
      { label: "US pet ownership", value: "67%" },
      { label: "Annual pet spending", value: "$1,400/pet" },
      { label: "Online research rate", value: "78%" },
    ],
  },
  {
    id: "event-services",
    name: "Event & Hospitality",
    icon: "🎉",
    color: "#1A1A6B",
    bgColor: "#F0F0FF",
    borderColor: "#1A1A6B",
    type: "specialty",
    directoryBenefitScore: 86,
    marketSize: "$1.5T",
    avgMonthlySearches: "1.3M+",
    revenuePerListing: "$75–$350/mo",
    customerLTV: 10,
    keyBenefit: "Venue & vendor discovery",
    description:
      "Event planners, wedding vendors, and hospitality businesses face intense competition. Directories with photo galleries, availability calendars, and package pricing help venues and vendors stand out during the critical planning phase.",
    subServices: [
      "Wedding Venues",
      "Event Planners",
      "Caterers",
      "Photographers",
      "Videographers",
      "DJs & Bands",
      "Florists",
      "Party Rental Companies",
      "Limousine Services",
      "Photo Booth Rentals",
    ],
    whyItWorks:
      "Event planning involves extensive vendor research. Directories with portfolios, pricing, and reviews are the primary discovery channel for couples and corporate planners.",
    stats: [
      { label: "Avg. wedding spend", value: "$30K+" },
      { label: "Vendor research time", value: "6–12 mo" },
      { label: "Directory usage rate", value: "82%" },
    ],
  },
  {
    id: "senior-care",
    name: "Senior Care Services",
    icon: "❤️",
    color: "#6B0D3A",
    bgColor: "#FFF0F5",
    borderColor: "#6B0D3A",
    type: "health",
    directoryBenefitScore: 91,
    marketSize: "$450B",
    avgMonthlySearches: "650K+",
    revenuePerListing: "$100–$400/mo",
    customerLTV: 18,
    keyBenefit: "Family trust & provider verification",
    description:
      "Families searching for senior care face one of the most emotionally charged decisions of their lives. Directories that provide verified credentials, detailed service descriptions, and authentic reviews help families make confident choices.",
    subServices: [
      "Assisted Living Facilities",
      "Home Health Aides",
      "Memory Care Centers",
      "Adult Day Programs",
      "Hospice Services",
      "Senior Transportation",
      "Meal Delivery Services",
      "Physical Therapists",
      "Occupational Therapists",
      "Companion Services",
    ],
    whyItWorks:
      "High emotional stakes mean families research extensively. Directories with verified credentials, facility tours, and family reviews dramatically reduce the anxiety of this decision.",
    stats: [
      { label: "Avg. monthly cost", value: "$4,500+" },
      { label: "Research duration", value: "2–4 months" },
      { label: "Family referral rate", value: "60%" },
    ],
  },
];

export const keyStats = [
  {
    value: "80%",
    label: "of US consumers search online for local businesses weekly",
    source: "BrightLocal 2024",
  },
  {
    value: "75%",
    label: "of new business is influenced by business review sites & directories",
    source: "InMoment Research",
  },
  {
    value: "340%",
    label: "higher revenue per listing for specialized vs. general directories",
    source: "Jasmine Directory Analysis",
  },
  {
    value: "$34B",
    label: "global directory & publisher market size in 2025",
    source: "Business Research Company",
  },
];

export const categoryTypes = [
  { id: "all", label: "All Categories" },
  { id: "local", label: "Local Services" },
  { id: "professional", label: "Professional" },
  { id: "health", label: "Health & Care" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "specialty", label: "Specialty" },
];

export const benefitFactors = [
  {
    title: "No Physical Storefront",
    description:
      "Businesses without walk-in locations depend entirely on online discovery. Directories become their virtual storefront.",
    icon: "🏪",
    impact: "Very High",
  },
  {
    title: "High-Ticket Services",
    description:
      "When a single customer is worth $1,000–$50,000+, even one directory-sourced lead justifies months of listing fees.",
    icon: "💰",
    impact: "Very High",
  },
  {
    title: "Trust-Dependent Decisions",
    description:
      "Services involving health, finances, or family require extensive research. Directories with reviews accelerate trust-building.",
    icon: "🤝",
    impact: "High",
  },
  {
    title: "Local Search Intent",
    description:
      "\"Near me\" searches have grown 500%+ in recent years. Directories with location data capture this high-intent traffic.",
    icon: "📍",
    impact: "High",
  },
  {
    title: "Fragmented Markets",
    description:
      "Industries with thousands of small providers benefit most — directories aggregate options that would otherwise be invisible.",
    icon: "🗺️",
    impact: "High",
  },
  {
    title: "Recurring Revenue Model",
    description:
      "Businesses with repeat customers (salons, gyms, healthcare) have high LTV, making directory advertising a smart long-term investment.",
    icon: "🔄",
    impact: "Medium-High",
  },
];
