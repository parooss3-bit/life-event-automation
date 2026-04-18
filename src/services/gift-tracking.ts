import { prisma, logger } from '../index';

export interface SavedGift {
  id: string;
  userId: string;
  eventId: string;
  giftId: string;
  giftTitle: string;
  giftPrice: number;
  giftUrl: string;
  status: 'saved' | 'purchased' | 'gifted' | 'cancelled';
  purchaseDate?: Date;
  purchasePrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GiftTrackingService {
  /**
   * Save a gift for later
   */
  async saveGift(
    userId: string,
    eventId: string,
    giftId: string,
    giftTitle: string,
    giftPrice: number,
    giftUrl: string,
    notes?: string
  ): Promise<SavedGift | null> {
    try {
      // Check if gift already saved
      const existing = await prisma.savedGift.findFirst({
        where: {
          userId,
          eventId,
          giftId,
        },
      });

      if (existing) {
        logger.info('Gift already saved', {
          userId,
          eventId,
          giftId,
        });
        return existing;
      }

      const saved = await prisma.savedGift.create({
        data: {
          userId,
          eventId,
          giftId,
          giftTitle,
          giftPrice,
          giftUrl,
          notes,
          status: 'saved',
        },
      });

      logger.info('Gift saved', {
        userId,
        eventId,
        giftId,
      });

      return saved;
    } catch (error) {
      logger.error('Error saving gift', error);
      return null;
    }
  }

  /**
   * Mark gift as purchased
   */
  async markAsPurchased(
    giftId: string,
    userId: string,
    purchasePrice?: number,
    purchaseDate?: Date
  ): Promise<SavedGift | null> {
    try {
      const updated = await prisma.savedGift.update({
        where: {
          id: giftId,
        },
        data: {
          status: 'purchased',
          purchasePrice: purchasePrice,
          purchaseDate: purchaseDate || new Date(),
        },
      });

      logger.info('Gift marked as purchased', {
        userId,
        giftId,
        purchasePrice,
      });

      return updated;
    } catch (error) {
      logger.error('Error marking gift as purchased', error);
      return null;
    }
  }

  /**
   * Mark gift as gifted
   */
  async markAsGifted(giftId: string, userId: string): Promise<SavedGift | null> {
    try {
      const updated = await prisma.savedGift.update({
        where: {
          id: giftId,
        },
        data: {
          status: 'gifted',
        },
      });

      logger.info('Gift marked as gifted', {
        userId,
        giftId,
      });

      return updated;
    } catch (error) {
      logger.error('Error marking gift as gifted', error);
      return null;
    }
  }

  /**
   * Get saved gifts for an event
   */
  async getSavedGiftsForEvent(userId: string, eventId: string): Promise<SavedGift[]> {
    try {
      const gifts = await prisma.savedGift.findMany({
        where: {
          userId,
          eventId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Saved gifts retrieved', {
        userId,
        eventId,
        count: gifts.length,
      });

      return gifts;
    } catch (error) {
      logger.error('Error getting saved gifts', error);
      return [];
    }
  }

  /**
   * Get all saved gifts for user
   */
  async getAllSavedGifts(userId: string, status?: string): Promise<SavedGift[]> {
    try {
      const where: any = {
        userId,
      };

      if (status) {
        where.status = status;
      }

      const gifts = await prisma.savedGift.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('All saved gifts retrieved', {
        userId,
        count: gifts.length,
        status: status || 'all',
      });

      return gifts;
    } catch (error) {
      logger.error('Error getting all saved gifts', error);
      return [];
    }
  }

  /**
   * Get gift budget summary for event
   */
  async getGiftBudgetSummary(userId: string, eventId: string): Promise<{
    totalSaved: number;
    totalPurchased: number;
    totalSpent: number;
    remainingBudget: number;
    savedCount: number;
    purchasedCount: number;
  }> {
    try {
      const gifts = await prisma.savedGift.findMany({
        where: {
          userId,
          eventId,
        },
      });

      const totalSaved = gifts.reduce((sum, gift) => sum + gift.giftPrice, 0);
      const purchasedGifts = gifts.filter((g) => g.status === 'purchased');
      const totalSpent = purchasedGifts.reduce((sum, gift) => sum + (gift.purchasePrice || 0), 0);

      return {
        totalSaved,
        totalPurchased: purchasedGifts.length,
        totalSpent,
        remainingBudget: totalSaved - totalSpent,
        savedCount: gifts.length,
        purchasedCount: purchasedGifts.length,
      };
    } catch (error) {
      logger.error('Error getting gift budget summary', error);
      return {
        totalSaved: 0,
        totalPurchased: 0,
        totalSpent: 0,
        remainingBudget: 0,
        savedCount: 0,
        purchasedCount: 0,
      };
    }
  }

  /**
   * Remove saved gift
   */
  async removeSavedGift(giftId: string, userId: string): Promise<boolean> {
    try {
      await prisma.savedGift.delete({
        where: {
          id: giftId,
        },
      });

      logger.info('Saved gift removed', {
        userId,
        giftId,
      });

      return true;
    } catch (error) {
      logger.error('Error removing saved gift', error);
      return false;
    }
  }

  /**
   * Get gift purchase history
   */
  async getGiftPurchaseHistory(userId: string, limit: number = 20): Promise<SavedGift[]> {
    try {
      const gifts = await prisma.savedGift.findMany({
        where: {
          userId,
          status: 'purchased',
        },
        orderBy: {
          purchaseDate: 'desc',
        },
        take: limit,
      });

      logger.info('Gift purchase history retrieved', {
        userId,
        count: gifts.length,
      });

      return gifts;
    } catch (error) {
      logger.error('Error getting gift purchase history', error);
      return [];
    }
  }

  /**
   * Get gift statistics for user
   */
  async getGiftStats(userId: string): Promise<{
    totalGiftsSaved: number;
    totalGiftsPurchased: number;
    totalSpent: number;
    averageGiftPrice: number;
    mostExpensiveGift: number;
    cheapestGift: number;
  }> {
    try {
      const gifts = await prisma.savedGift.findMany({
        where: {
          userId,
        },
      });

      const purchasedGifts = gifts.filter((g) => g.status === 'purchased');
      const prices = gifts.map((g) => g.giftPrice);
      const purchasedPrices = purchasedGifts.map((g) => g.purchasePrice || 0);

      const totalSpent = purchasedPrices.reduce((sum, price) => sum + price, 0);
      const averageGiftPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

      return {
        totalGiftsSaved: gifts.length,
        totalGiftsPurchased: purchasedGifts.length,
        totalSpent,
        averageGiftPrice,
        mostExpensiveGift: prices.length > 0 ? Math.max(...prices) : 0,
        cheapestGift: prices.length > 0 ? Math.min(...prices) : 0,
      };
    } catch (error) {
      logger.error('Error getting gift stats', error);
      return {
        totalGiftsSaved: 0,
        totalGiftsPurchased: 0,
        totalSpent: 0,
        averageGiftPrice: 0,
        mostExpensiveGift: 0,
        cheapestGift: 0,
      };
    }
  }
}

export default new GiftTrackingService();
