/**
 * Business Analytics System
 * Tracks views, reviews, leads, and engagement metrics
 */

export interface BusinessMetrics {
  businessId: string;
  profileViews: number;
  phoneClicks: number;
  websiteClicks: number;
  messagesSent: number;
  reviewsReceived: number;
  averageRating: number;
  leadsGenerated: number;
  leadsConverted: number;
  conversionRate: number;
  topSearchKeywords: { keyword: string; count: number }[];
  viewsByDay: { date: string; views: number }[];
  lastUpdated: Date;
}

export interface AnalyticsEvent {
  id: string;
  businessId: string;
  eventType: 'view' | 'phone_click' | 'website_click' | 'message' | 'review' | 'lead';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Mock data storage
const metricsMap: Map<string, BusinessMetrics> = new Map();
const eventsLog: AnalyticsEvent[] = [];

/**
 * Initialize metrics for a business
 */
export function initializeBusinessMetrics(businessId: string): BusinessMetrics {
  if (metricsMap.has(businessId)) {
    return metricsMap.get(businessId)!;
  }

  const metrics: BusinessMetrics = {
    businessId,
    profileViews: Math.floor(Math.random() * 500) + 50,
    phoneClicks: Math.floor(Math.random() * 100) + 10,
    websiteClicks: Math.floor(Math.random() * 80) + 5,
    messagesSent: Math.floor(Math.random() * 50) + 5,
    reviewsReceived: Math.floor(Math.random() * 30) + 5,
    averageRating: Math.random() * 2 + 3.5,
    leadsGenerated: Math.floor(Math.random() * 100) + 20,
    leadsConverted: Math.floor(Math.random() * 50) + 5,
    conversionRate: Math.random() * 0.3 + 0.15,
    topSearchKeywords: [
      { keyword: 'plumbing services', count: 45 },
      { keyword: 'emergency plumber', count: 38 },
      { keyword: 'residential plumbing', count: 32 },
      { keyword: 'plumbing repair', count: 28 },
      { keyword: 'water heater repair', count: 22 },
    ],
    viewsByDay: generateViewsByDay(),
    lastUpdated: new Date(),
  };

  metricsMap.set(businessId, metrics);
  return metrics;
}

/**
 * Generate mock daily view data
 */
function generateViewsByDay() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10,
    });
  }
  return days;
}

/**
 * Get business metrics
 */
export function getBusinessMetrics(businessId: string): BusinessMetrics {
  return initializeBusinessMetrics(businessId);
}

/**
 * Track an analytics event
 */
export function trackEvent(
  businessId: string,
  eventType: AnalyticsEvent['eventType'],
  metadata?: Record<string, any>
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: `event_${Date.now()}`,
    businessId,
    eventType,
    timestamp: new Date(),
    metadata,
  };

  eventsLog.push(event);

  // Update metrics
  const metrics = initializeBusinessMetrics(businessId);
  switch (eventType) {
    case 'view':
      metrics.profileViews++;
      break;
    case 'phone_click':
      metrics.phoneClicks++;
      break;
    case 'website_click':
      metrics.websiteClicks++;
      break;
    case 'message':
      metrics.messagesSent++;
      break;
    case 'review':
      metrics.reviewsReceived++;
      break;
    case 'lead':
      metrics.leadsGenerated++;
      break;
  }

  metrics.lastUpdated = new Date();
  return event;
}

/**
 * Get analytics events for a business
 */
export function getBusinessEvents(
  businessId: string,
  limit: number = 50
): AnalyticsEvent[] {
  return eventsLog
    .filter((e) => e.businessId === businessId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Calculate ROI for a business
 */
export function calculateROI(businessId: string): {
  roi: number;
  estimatedRevenue: number;
  estimatedCost: number;
} {
  const metrics = getBusinessMetrics(businessId);
  const estimatedCost = 49; // Monthly subscription cost
  const revenuePerLead = 150; // Average revenue per converted lead
  const estimatedRevenue = metrics.leadsConverted * revenuePerLead;
  const roi = ((estimatedRevenue - estimatedCost) / estimatedCost) * 100;

  return {
    roi,
    estimatedRevenue,
    estimatedCost,
  };
}

/**
 * Get top performing businesses
 */
export function getTopPerformingBusinesses(limit: number = 10) {
  return Array.from(metricsMap.values())
    .sort((a, b) => b.profileViews - a.profileViews)
    .slice(0, limit);
}

/**
 * Get analytics summary for dashboard
 */
export function getAnalyticsSummary(businessId: string) {
  const metrics = getBusinessMetrics(businessId);
  const roi = calculateROI(businessId);

  return {
    metrics,
    roi,
    summary: {
      totalEngagement: metrics.profileViews + metrics.phoneClicks + metrics.websiteClicks + metrics.messagesSent,
      conversionRate: `${(metrics.conversionRate * 100).toFixed(1)}%`,
      leadValue: `$${(metrics.leadsConverted * 150).toLocaleString()}`,
      roi: `${roi.roi.toFixed(1)}%`,
    },
  };
}
