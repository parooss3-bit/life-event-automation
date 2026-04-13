/**
 * Lead Marketplace System
 * Handles lead generation, buying, selling, and ratings
 */

export interface Lead {
  id: string;
  sellerId: string;
  buyerId?: string;
  category: string;
  location: string;
  description: string;
  price: number;
  status: 'available' | 'sold' | 'expired';
  quality: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  expiresAt: Date;
  soldAt?: Date;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface LeadBundle {
  id: string;
  sellerId: string;
  category: string;
  location: string;
  leadCount: number;
  pricePerLead: number;
  totalPrice: number;
  quality: 'bronze' | 'silver' | 'gold' | 'platinum';
  description: string;
  status: 'available' | 'sold' | 'expired';
  createdAt: Date;
}

export interface Buyer {
  id: string;
  businessId: string;
  businessName: string;
  email: string;
  rating: number;
  reviewCount: number;
  leadsConverted: number;
  totalSpent: number;
}

export interface Seller {
  id: string;
  businessId: string;
  businessName: string;
  email: string;
  rating: number;
  reviewCount: number;
  leadsSold: number;
  totalRevenue: number;
}

export interface MarketplaceRating {
  id: string;
  ratedById: string;
  ratedUserId: string;
  rating: number;
  review: string;
  leadId: string;
  createdAt: Date;
}

// Mock data storage
const leadsMap: Map<string, Lead> = new Map();
const bundlesMap: Map<string, LeadBundle> = new Map();
const buyersMap: Map<string, Buyer> = new Map();
const sellersMap: Map<string, Seller> = new Map();
const ratingsMap: Map<string, MarketplaceRating> = new Map();

/**
 * Create a lead for sale
 */
export function createLead(
  sellerId: string,
  category: string,
  location: string,
  description: string,
  price: number,
  quality: Lead['quality'],
  contactInfo: Lead['contactInfo']
): Lead {
  const lead: Lead = {
    id: `lead_${Date.now()}`,
    sellerId,
    category,
    location,
    description,
    price,
    quality,
    status: 'available',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    contactInfo,
  };

  leadsMap.set(lead.id, lead);
  return lead;
}

/**
 * Create a lead bundle
 */
export function createLeadBundle(
  sellerId: string,
  category: string,
  location: string,
  leadCount: number,
  pricePerLead: number,
  quality: LeadBundle['quality'],
  description: string
): LeadBundle {
  const bundle: LeadBundle = {
    id: `bundle_${Date.now()}`,
    sellerId,
    category,
    location,
    leadCount,
    pricePerLead,
    totalPrice: leadCount * pricePerLead,
    quality,
    description,
    status: 'available',
    createdAt: new Date(),
  };

  bundlesMap.set(bundle.id, bundle);
  return bundle;
}

/**
 * Purchase a lead
 */
export function purchaseLead(
  leadId: string,
  buyerId: string
): { success: boolean; message: string; lead?: Lead } {
  const lead = leadsMap.get(leadId);

  if (!lead) {
    return { success: false, message: 'Lead not found' };
  }

  if (lead.status !== 'available') {
    return { success: false, message: 'Lead is no longer available' };
  }

  if (new Date() > lead.expiresAt) {
    lead.status = 'expired';
    return { success: false, message: 'Lead has expired' };
  }

  lead.buyerId = buyerId;
  lead.status = 'sold';
  lead.soldAt = new Date();

  // Update seller stats
  const seller = sellersMap.get(lead.sellerId);
  if (seller) {
    seller.leadsSold++;
    seller.totalRevenue += lead.price;
  }

  // Update buyer stats
  const buyer = buyersMap.get(buyerId);
  if (buyer) {
    buyer.totalSpent += lead.price;
  }

  return { success: true, message: 'Lead purchased successfully', lead };
}

/**
 * Get available leads
 */
export function getAvailableLeads(
  category?: string,
  location?: string,
  quality?: Lead['quality']
): Lead[] {
  return Array.from(leadsMap.values()).filter((lead) => {
    if (lead.status !== 'available') return false;
    if (new Date() > lead.expiresAt) return false;
    if (category && lead.category !== category) return false;
    if (location && lead.location !== location) return false;
    if (quality && lead.quality !== quality) return false;
    return true;
  });
}

/**
 * Get available bundles
 */
export function getAvailableBundles(
  category?: string,
  location?: string
): LeadBundle[] {
  return Array.from(bundlesMap.values()).filter((bundle) => {
    if (bundle.status !== 'available') return false;
    if (category && bundle.category !== category) return false;
    if (location && bundle.location !== location) return false;
    return true;
  });
}

/**
 * Rate a buyer or seller
 */
export function rateUser(
  ratedById: string,
  ratedUserId: string,
  rating: number,
  review: string,
  leadId: string
): MarketplaceRating {
  const marketplaceRating: MarketplaceRating = {
    id: `rating_${Date.now()}`,
    ratedById,
    ratedUserId,
    rating: Math.min(5, Math.max(1, rating)),
    review,
    leadId,
    createdAt: new Date(),
  };

  ratingsMap.set(marketplaceRating.id, marketplaceRating);

  // Update user rating
  const buyer = buyersMap.get(ratedUserId);
  if (buyer) {
    const userRatings = Array.from(ratingsMap.values()).filter(
      (r) => r.ratedUserId === ratedUserId
    );
    buyer.rating =
      userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    buyer.reviewCount = userRatings.length;
  }

  const seller = sellersMap.get(ratedUserId);
  if (seller) {
    const userRatings = Array.from(ratingsMap.values()).filter(
      (r) => r.ratedUserId === ratedUserId
    );
    seller.rating =
      userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    seller.reviewCount = userRatings.length;
  }

  return marketplaceRating;
}

/**
 * Get ratings for a user
 */
export function getUserRatings(userId: string): MarketplaceRating[] {
  return Array.from(ratingsMap.values()).filter((r) => r.ratedUserId === userId);
}

/**
 * Get buyer profile
 */
export function getBuyerProfile(buyerId: string): Buyer | null {
  return buyersMap.get(buyerId) || null;
}

/**
 * Get seller profile
 */
export function getSellerProfile(sellerId: string): Seller | null {
  return sellersMap.get(sellerId) || null;
}

/**
 * Create or update buyer profile
 */
export function createBuyerProfile(
  buyerId: string,
  businessId: string,
  businessName: string,
  email: string
): Buyer {
  const buyer: Buyer = {
    id: buyerId,
    businessId,
    businessName,
    email,
    rating: 5,
    reviewCount: 0,
    leadsConverted: 0,
    totalSpent: 0,
  };

  buyersMap.set(buyerId, buyer);
  return buyer;
}

/**
 * Create or update seller profile
 */
export function createSellerProfile(
  sellerId: string,
  businessId: string,
  businessName: string,
  email: string
): Seller {
  const seller: Seller = {
    id: sellerId,
    businessId,
    businessName,
    email,
    rating: 5,
    reviewCount: 0,
    leadsSold: 0,
    totalRevenue: 0,
  };

  sellersMap.set(sellerId, seller);
  return seller;
}

/**
 * Get marketplace statistics
 */
export function getMarketplaceStats() {
  const availableLeads = Array.from(leadsMap.values()).filter(
    (l) => l.status === 'available'
  );
  const soldLeads = Array.from(leadsMap.values()).filter(
    (l) => l.status === 'sold'
  );
  const totalRevenue = soldLeads.reduce((sum, l) => sum + l.price, 0);
  const averageLeadPrice =
    soldLeads.length > 0
      ? totalRevenue / soldLeads.length
      : 0;

  return {
    totalLeads: leadsMap.size,
    availableLeads: availableLeads.length,
    soldLeads: soldLeads.length,
    totalRevenue,
    averageLeadPrice,
    totalBuyers: buyersMap.size,
    totalSellers: sellersMap.size,
  };
}
