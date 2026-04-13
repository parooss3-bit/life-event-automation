/*
 * Monetization Configuration
 * Affiliate links, email service settings, and revenue strategy configuration
 */

export const AFFILIATE_LINKS = {
  brightlocal: "https://www.brightlocal.com?ref=servicedirectory",
  moz: "https://moz.com/local?ref=servicedirectory",
  podium: "https://www.podium.com?ref=servicedirectory",
  yext: "https://www.yext.com?ref=servicedirectory",
  manta: "https://www.manta.com?ref=servicedirectory",
};

export const EMAIL_SERVICE = {
  // Configure your email service provider (Mailchimp, ConvertKit, Zapier, etc.)
  provider: "zapier", // Change to your provider
  webhookUrl: process.env.REACT_APP_EMAIL_WEBHOOK || "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID",
  listId: process.env.REACT_APP_EMAIL_LIST_ID || "service-directory-leads",
};

export const CONSULTATION_BOOKING = {
  // Calendly, Acuity Scheduling, or similar
  calendarLink: "https://calendly.com/your-username/free-consultation",
  bookingProvider: "calendly", // calendly, acuity, or custom
};

export const PREMIUM_FEATURES = {
  enabled: true,
  features: [
    {
      id: "advanced-calculator",
      name: "Advanced Revenue Calculator",
      description: "Real-time market data with competitor pricing analysis",
      locked: true,
      tier: "premium",
    },
    {
      id: "competitor-analysis",
      name: "Detailed Competitor Analysis",
      description: "See how many directories exist in each niche and their pricing",
      locked: true,
      tier: "premium",
    },
    {
      id: "quarterly-reports",
      name: "Quarterly Market Trend Reports",
      description: "Get updated market data every 3 months",
      locked: true,
      tier: "premium",
    },
    {
      id: "api-access",
      name: "API Access",
      description: "Integrate our data into your own platform",
      locked: true,
      tier: "enterprise",
    },
    {
      id: "custom-reports",
      name: "Custom Report Generation",
      description: "Generate reports for specific markets or regions",
      locked: true,
      tier: "premium",
    },
  ],
};

export const PRICING = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "12 service categories",
      "Basic revenue calculator",
      "Interactive charts",
      "PDF report download",
      "Quick presets",
    ],
  },
  premium: {
    name: "Premium",
    price: 49,
    billingCycle: "monthly",
    features: [
      "Everything in Free, plus:",
      "Advanced revenue calculator",
      "Competitor analysis",
      "Quarterly trend reports",
      "Custom report generation",
      "Priority email support",
    ],
    cta: "Upgrade to Premium",
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    billingCycle: "monthly",
    features: [
      "Everything in Premium, plus:",
      "API access",
      "White-label reports",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited custom reports",
    ],
    cta: "Contact Sales",
  },
};

export const LEAD_MAGNET = {
  title: "Get the Complete Directory Playbook",
  description: "Join 5,000+ entrepreneurs receiving weekly insights on launching profitable directories",
  cta: "Get Free Access",
  benefits: [
    "✓ Market sizing spreadsheet for all 12 niches",
    "✓ Revenue projection templates",
    "✓ Competitor analysis checklist",
    "✓ Weekly market updates",
  ],
};

export const EMAIL_SEQUENCES = {
  welcome: {
    subject: "Welcome! Here's your free directory playbook",
    delay: 0,
  },
  day3: {
    subject: "The #1 mistake entrepreneurs make when choosing a niche",
    delay: 3,
  },
  day7: {
    subject: "How much money can you really make? (Real numbers inside)",
    delay: 7,
  },
  day14: {
    subject: "Ready to launch? Here's exactly how to get started",
    delay: 14,
    includeConsultationOffer: true,
  },
};

export const CTA_MESSAGES = {
  beforePdfDownload: {
    title: "Get Your Free Report",
    description: "Enter your email to download the full PDF comparison report and receive weekly directory insights.",
    buttonText: "Send Me the Report",
  },
  afterPdfDownload: {
    title: "Want to Launch Your Directory?",
    description: "Book a free 20-minute consultation to discuss your niche and get a personalized action plan.",
    buttonText: "Book Free Consultation",
    subtext: "No credit card required • 20 minutes • Personalized strategy",
  },
  premiumUpsell: {
    title: "Unlock Advanced Insights",
    description: "Get real-time competitor data, advanced revenue projections, and quarterly market reports.",
    buttonText: "Upgrade to Premium ($49/mo)",
    savings: "Save 3 months with annual billing",
  },
  affiliateRecommendation: {
    title: "Ready to Build Your Directory?",
    description: "We recommend these trusted platforms to get started:",
    platforms: [
      {
        name: "BrightLocal",
        description: "Complete local directory solution",
        link: AFFILIATE_LINKS.brightlocal,
      },
      {
        name: "Moz Local",
        description: "Enterprise-grade directory platform",
        link: AFFILIATE_LINKS.moz,
      },
      {
        name: "Podium",
        description: "Customer communication platform",
        link: AFFILIATE_LINKS.podium,
      },
    ],
  },
};

export const TRACKING = {
  // Google Analytics, Mixpanel, or custom tracking
  enabled: true,
  events: {
    emailCaptured: "email_captured",
    pdfDownloaded: "pdf_downloaded",
    consultationBooked: "consultation_booked",
    affiliateLinkClicked: "affiliate_link_clicked",
    premiumUpgradeViewed: "premium_upgrade_viewed",
    premiumUpgradeClicked: "premium_upgrade_clicked",
  },
};
