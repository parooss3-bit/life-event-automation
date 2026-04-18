import axios from 'axios';
import { logger } from '../index';

export interface GiftRecommendation {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  source: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

export interface RecommendationRequest {
  contactName: string;
  relationship: string;
  eventType: string;
  age?: number;
  interests?: string[];
  budget: number;
  gender?: string;
  occasion?: string;
}

export class GiftRecommendationService {
  private giftDatabase: Map<string, GiftRecommendation[]> = new Map();
  private amazonAffiliateId = process.env.AMAZON_AFFILIATE_ID || '';
  private etsy = 'https://www.etsy.com';
  private amazon = 'https://www.amazon.com';

  constructor() {
    this.initializeGiftDatabase();
  }

  /**
   * Initialize gift database with curated recommendations
   */
  private initializeGiftDatabase(): void {
    // Birthday gifts
    this.giftDatabase.set('birthday_low', [
      {
        id: 'gift_001',
        title: 'Personalized Coffee Mug',
        description: 'Custom coffee mug with name or photo',
        price: 15,
        category: 'drinkware',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500',
        affiliateUrl: `${this.amazon}/s?k=personalized+coffee+mug`,
        source: 'amazon',
        rating: 4.5,
        reviews: 1200,
      },
      {
        id: 'gift_002',
        title: 'Cozy Socks Set',
        description: 'Comfortable and fun socks set (3-6 pairs)',
        price: 18,
        category: 'apparel',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        affiliateUrl: `${this.amazon}/s?k=cozy+socks+set`,
        source: 'amazon',
        rating: 4.3,
        reviews: 890,
      },
      {
        id: 'gift_003',
        title: 'Scented Candle',
        description: 'Premium scented candle (various scents)',
        price: 20,
        category: 'home',
        imageUrl: 'https://images.unsplash.com/photo-1602591437281-8ac36604a889?w=500',
        affiliateUrl: `${this.amazon}/s?k=scented+candle+premium`,
        source: 'amazon',
        rating: 4.6,
        reviews: 2100,
      },
    ]);

    this.giftDatabase.set('birthday_medium', [
      {
        id: 'gift_004',
        title: 'Wireless Earbuds',
        description: 'High-quality wireless earbuds with noise cancellation',
        price: 50,
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        affiliateUrl: `${this.amazon}/s?k=wireless+earbuds+noise+cancellation`,
        source: 'amazon',
        rating: 4.4,
        reviews: 3500,
      },
      {
        id: 'gift_005',
        title: 'Portable Phone Charger',
        description: '20000mAh portable power bank',
        price: 35,
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
        affiliateUrl: `${this.amazon}/s?k=20000mah+power+bank`,
        source: 'amazon',
        rating: 4.5,
        reviews: 2800,
      },
      {
        id: 'gift_006',
        title: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        price: 80,
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        affiliateUrl: `${this.amazon}/s?k=fitness+smartwatch`,
        source: 'amazon',
        rating: 4.3,
        reviews: 4200,
      },
    ]);

    this.giftDatabase.set('birthday_high', [
      {
        id: 'gift_007',
        title: 'Premium Headphones',
        description: 'High-end wireless headphones with premium sound',
        price: 250,
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500',
        affiliateUrl: `${this.amazon}/s?k=premium+wireless+headphones`,
        source: 'amazon',
        rating: 4.7,
        reviews: 5600,
      },
      {
        id: 'gift_008',
        title: 'Drone with Camera',
        description: '4K camera drone with extended flight time',
        price: 400,
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
        affiliateUrl: `${this.amazon}/s?k=4k+camera+drone`,
        source: 'amazon',
        rating: 4.5,
        reviews: 2900,
      },
    ]);

    // Anniversary gifts
    this.giftDatabase.set('anniversary_low', [
      {
        id: 'gift_009',
        title: 'Romantic Candle Set',
        description: 'Set of romantic scented candles',
        price: 25,
        category: 'home',
        imageUrl: 'https://images.unsplash.com/photo-1602591437281-8ac36604a889?w=500',
        affiliateUrl: `${this.amazon}/s?k=romantic+candle+set`,
        source: 'amazon',
        rating: 4.6,
        reviews: 1800,
      },
      {
        id: 'gift_010',
        title: 'Personalized Photo Frame',
        description: 'Custom photo frame with your favorite memory',
        price: 30,
        category: 'decor',
        imageUrl: 'https://images.unsplash.com/photo-1609033227505-5876f6aa4e90?w=500',
        affiliateUrl: `${this.amazon}/s?k=personalized+photo+frame`,
        source: 'amazon',
        rating: 4.4,
        reviews: 1200,
      },
    ]);

    this.giftDatabase.set('anniversary_medium', [
      {
        id: 'gift_011',
        title: 'Couples Massage Kit',
        description: 'Professional massage kit for couples',
        price: 60,
        category: 'wellness',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-81205f8abecc?w=500',
        affiliateUrl: `${this.amazon}/s?k=couples+massage+kit`,
        source: 'amazon',
        rating: 4.5,
        reviews: 980,
      },
      {
        id: 'gift_012',
        title: 'Luxury Bath Bombs',
        description: 'Set of premium bath bombs with essential oils',
        price: 45,
        category: 'wellness',
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
        affiliateUrl: `${this.amazon}/s?k=luxury+bath+bombs`,
        source: 'amazon',
        rating: 4.7,
        reviews: 2200,
      },
    ]);

    this.giftDatabase.set('anniversary_high', [
      {
        id: 'gift_013',
        title: 'Luxury Watch',
        description: 'Premium luxury watch for special occasions',
        price: 500,
        category: 'jewelry',
        imageUrl: 'https://images.unsplash.com/photo-1523170335684-f1b5aef169d7?w=500',
        affiliateUrl: `${this.amazon}/s?k=luxury+watch`,
        source: 'amazon',
        rating: 4.8,
        reviews: 3400,
      },
    ]);

    // Holiday gifts
    this.giftDatabase.set('holiday_low', [
      {
        id: 'gift_014',
        title: 'Holiday Ornament',
        description: 'Personalized holiday ornament',
        price: 12,
        category: 'decor',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbdf26cecbb1?w=500',
        affiliateUrl: `${this.amazon}/s?k=personalized+holiday+ornament`,
        source: 'amazon',
        rating: 4.5,
        reviews: 1500,
      },
    ]);

    logger.info('Gift database initialized with recommendations');
  }

  /**
   * Get gift recommendations based on criteria
   */
  async getRecommendations(request: RecommendationRequest): Promise<GiftRecommendation[]> {
    try {
      logger.info('Getting gift recommendations', {
        contactName: request.contactName,
        eventType: request.eventType,
        budget: request.budget,
      });

      // Determine budget tier
      const budgetTier = this.getBudgetTier(request.budget);

      // Build database key
      const dbKey = `${request.eventType}_${budgetTier}`;

      // Get recommendations from database
      let recommendations = this.giftDatabase.get(dbKey) || [];

      // Filter by interests if provided
      if (request.interests && request.interests.length > 0) {
        recommendations = this.filterByInterests(recommendations, request.interests);
      }

      // Sort by relevance and rating
      recommendations = recommendations.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      });

      // Limit to top 10
      recommendations = recommendations.slice(0, 10);

      logger.info('Recommendations retrieved', {
        contactName: request.contactName,
        count: recommendations.length,
      });

      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations', error);
      return [];
    }
  }

  /**
   * Get personalized recommendations based on AI analysis
   */
  async getPersonalizedRecommendations(
    contactName: string,
    relationship: string,
    eventType: string,
    budget: number,
    interests?: string[]
  ): Promise<GiftRecommendation[]> {
    try {
      const request: RecommendationRequest = {
        contactName,
        relationship,
        eventType,
        budget,
        interests,
      };

      return await this.getRecommendations(request);
    } catch (error) {
      logger.error('Error getting personalized recommendations', error);
      return [];
    }
  }

  /**
   * Determine budget tier
   */
  private getBudgetTier(budget: number): string {
    if (budget <= 30) return 'low';
    if (budget <= 100) return 'medium';
    return 'high';
  }

  /**
   * Filter recommendations by interests
   */
  private filterByInterests(
    recommendations: GiftRecommendation[],
    interests: string[]
  ): GiftRecommendation[] {
    const interestKeywords = interests.map((i) => i.toLowerCase());

    return recommendations.filter((gift) => {
      const giftText = `${gift.title} ${gift.description} ${gift.category}`.toLowerCase();
      return interestKeywords.some((keyword) => giftText.includes(keyword));
    });
  }

  /**
   * Get trending gifts
   */
  async getTrendingGifts(eventType: string, limit: number = 5): Promise<GiftRecommendation[]> {
    try {
      const allGifts: GiftRecommendation[] = [];

      // Collect all gifts for event type
      for (const [key, gifts] of this.giftDatabase) {
        if (key.includes(eventType)) {
          allGifts.push(...gifts);
        }
      }

      // Sort by rating and reviews
      allGifts.sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.reviews || 0);
        const scoreB = (b.rating || 0) * (b.reviews || 0);
        return scoreB - scoreA;
      });

      return allGifts.slice(0, limit);
    } catch (error) {
      logger.error('Error getting trending gifts', error);
      return [];
    }
  }

  /**
   * Get gifts by category
   */
  async getGiftsByCategory(category: string, limit: number = 10): Promise<GiftRecommendation[]> {
    try {
      const gifts: GiftRecommendation[] = [];

      // Collect all gifts
      for (const giftList of this.giftDatabase.values()) {
        gifts.push(...giftList);
      }

      // Filter by category
      const filtered = gifts.filter((gift) => gift.category === category);

      // Sort by rating
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      return filtered.slice(0, limit);
    } catch (error) {
      logger.error('Error getting gifts by category', error);
      return [];
    }
  }

  /**
   * Search gifts by keyword
   */
  async searchGifts(keyword: string, limit: number = 10): Promise<GiftRecommendation[]> {
    try {
      const searchTerm = keyword.toLowerCase();
      const gifts: GiftRecommendation[] = [];

      // Collect all gifts
      for (const giftList of this.giftDatabase.values()) {
        gifts.push(...giftList);
      }

      // Filter by keyword
      const filtered = gifts.filter((gift) => {
        const giftText = `${gift.title} ${gift.description}`.toLowerCase();
        return giftText.includes(searchTerm);
      });

      // Sort by rating
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      return filtered.slice(0, limit);
    } catch (error) {
      logger.error('Error searching gifts', error);
      return [];
    }
  }

  /**
   * Get gift by ID
   */
  async getGiftById(giftId: string): Promise<GiftRecommendation | null> {
    try {
      for (const giftList of this.giftDatabase.values()) {
        const gift = giftList.find((g) => g.id === giftId);
        if (gift) {
          return gift;
        }
      }
      return null;
    } catch (error) {
      logger.error('Error getting gift by ID', error);
      return null;
    }
  }

  /**
   * Add gift to database (for admin)
   */
  async addGift(category: string, gift: GiftRecommendation): Promise<boolean> {
    try {
      const key = category;
      const gifts = this.giftDatabase.get(key) || [];
      gifts.push(gift);
      this.giftDatabase.set(key, gifts);

      logger.info('Gift added to database', {
        giftId: gift.id,
        category,
      });

      return true;
    } catch (error) {
      logger.error('Error adding gift', error);
      return false;
    }
  }

  /**
   * Get gift statistics
   */
  async getGiftStats(): Promise<{
    totalGifts: number;
    categories: Record<string, number>;
    averageRating: number;
  }> {
    try {
      const gifts: GiftRecommendation[] = [];
      const categories: Record<string, number> = {};

      for (const giftList of this.giftDatabase.values()) {
        gifts.push(...giftList);
      }

      // Count by category
      for (const gift of gifts) {
        categories[gift.category] = (categories[gift.category] || 0) + 1;
      }

      // Calculate average rating
      const totalRating = gifts.reduce((sum, gift) => sum + (gift.rating || 0), 0);
      const averageRating = gifts.length > 0 ? totalRating / gifts.length : 0;

      return {
        totalGifts: gifts.length,
        categories,
        averageRating,
      };
    } catch (error) {
      logger.error('Error getting gift stats', error);
      return {
        totalGifts: 0,
        categories: {},
        averageRating: 0,
      };
    }
  }
}

export default new GiftRecommendationService();
