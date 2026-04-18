import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma, logger } from '../index';
import giftRecommendationService from '../services/gift-recommendations';
import giftTrackingService from '../services/gift-tracking';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /gifts/recommendations
 * Get personalized gift recommendations
 */
router.get('/recommendations', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId, budget, interests } = req.query;

    if (!eventId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'eventId is required',
        },
      });
    }

    // Get event details
    const event = await prisma.event.findFirst({
      where: {
        id: eventId as string,
        userId,
        deletedAt: null,
      },
      include: {
        contact: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Get recommendations
    const interestList = interests ? (typeof interests === 'string' ? interests.split(',') : interests) : [];
    const budgetAmount = budget ? parseInt(budget as string, 10) : 50;

    const recommendations = await giftRecommendationService.getPersonalizedRecommendations(
      `${event.contact.firstName} ${event.contact.lastName}`,
      event.contact.relationship,
      event.eventType,
      budgetAmount,
      interestList
    );

    logger.info('Gift recommendations retrieved', {
      userId,
      eventId,
      count: recommendations.length,
    });

    res.json({
      eventId,
      eventType: event.eventType,
      contactName: `${event.contact.firstName} ${event.contact.lastName}`,
      budget: budgetAmount,
      recommendations,
    });
  } catch (error) {
    logger.error('Get recommendations error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get recommendations',
      },
    });
  }
});

/**
 * GET /gifts/trending
 * Get trending gifts
 */
router.get('/trending', async (req: AuthRequest, res: Response) => {
  try {
    const { eventType = 'birthday', limit = '5' } = req.query;

    const trending = await giftRecommendationService.getTrendingGifts(
      eventType as string,
      parseInt(limit as string, 10)
    );

    logger.info('Trending gifts retrieved', {
      eventType,
      count: trending.length,
    });

    res.json({
      eventType,
      trending,
    });
  } catch (error) {
    logger.error('Get trending gifts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get trending gifts',
      },
    });
  }
});

/**
 * GET /gifts/category/:category
 * Get gifts by category
 */
router.get('/category/:category', async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const { limit = '10' } = req.query;

    const gifts = await giftRecommendationService.getGiftsByCategory(
      category,
      parseInt(limit as string, 10)
    );

    logger.info('Gifts by category retrieved', {
      category,
      count: gifts.length,
    });

    res.json({
      category,
      gifts,
    });
  } catch (error) {
    logger.error('Get gifts by category error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get gifts by category',
      },
    });
  }
});

/**
 * GET /gifts/search
 * Search gifts
 */
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const { q, limit = '10' } = req.query;

    if (!q) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query (q) is required',
        },
      });
    }

    const results = await giftRecommendationService.searchGifts(
      q as string,
      parseInt(limit as string, 10)
    );

    logger.info('Gifts searched', {
      query: q,
      count: results.length,
    });

    res.json({
      query: q,
      results,
    });
  } catch (error) {
    logger.error('Search gifts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to search gifts',
      },
    });
  }
});

/**
 * GET /gifts/:giftId
 * Get specific gift details
 */
router.get('/:giftId', async (req: AuthRequest, res: Response) => {
  try {
    const { giftId } = req.params;

    const gift = await giftRecommendationService.getGiftById(giftId);

    if (!gift) {
      return res.status(404).json({
        error: {
          code: 'GIFT_NOT_FOUND',
          message: 'Gift not found',
        },
      });
    }

    logger.info('Gift details retrieved', { giftId });

    res.json(gift);
  } catch (error) {
    logger.error('Get gift details error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get gift details',
      },
    });
  }
});

/**
 * POST /gifts/save
 * Save a gift for later
 */
router.post('/save', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId, giftId, giftTitle, giftPrice, giftUrl, notes } = req.body;

    // Validate required fields
    if (!eventId || !giftId || !giftTitle || !giftPrice || !giftUrl) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'eventId, giftId, giftTitle, giftPrice, and giftUrl are required',
        },
      });
    }

    // Verify event belongs to user
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
        deletedAt: null,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Save gift
    const saved = await giftTrackingService.saveGift(
      userId,
      eventId,
      giftId,
      giftTitle,
      giftPrice,
      giftUrl,
      notes
    );

    if (!saved) {
      return res.status(500).json({
        error: {
          code: 'SAVE_FAILED',
          message: 'Failed to save gift',
        },
      });
    }

    logger.info('Gift saved', { userId, eventId, giftId });

    res.status(201).json({
      message: 'Gift saved successfully',
      gift: saved,
    });
  } catch (error) {
    logger.error('Save gift error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to save gift',
      },
    });
  }
});

/**
 * GET /gifts/saved/:eventId
 * Get saved gifts for an event
 */
router.get('/saved/:eventId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    // Verify event belongs to user
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
        deletedAt: null,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    const saved = await giftTrackingService.getSavedGiftsForEvent(userId, eventId);

    logger.info('Saved gifts retrieved', {
      userId,
      eventId,
      count: saved.length,
    });

    res.json({
      eventId,
      gifts: saved,
    });
  } catch (error) {
    logger.error('Get saved gifts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get saved gifts',
      },
    });
  }
});

/**
 * PUT /gifts/:giftId/mark-purchased
 * Mark gift as purchased
 */
router.put('/:giftId/mark-purchased', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { giftId } = req.params;
    const { purchasePrice, purchaseDate } = req.body;

    const updated = await giftTrackingService.markAsPurchased(
      giftId,
      userId,
      purchasePrice,
      purchaseDate ? new Date(purchaseDate) : undefined
    );

    if (!updated) {
      return res.status(404).json({
        error: {
          code: 'GIFT_NOT_FOUND',
          message: 'Gift not found',
        },
      });
    }

    logger.info('Gift marked as purchased', {
      userId,
      giftId,
      purchasePrice,
    });

    res.json({
      message: 'Gift marked as purchased',
      gift: updated,
    });
  } catch (error) {
    logger.error('Mark gift purchased error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark gift as purchased',
      },
    });
  }
});

/**
 * PUT /gifts/:giftId/mark-gifted
 * Mark gift as gifted
 */
router.put('/:giftId/mark-gifted', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { giftId } = req.params;

    const updated = await giftTrackingService.markAsGifted(giftId, userId);

    if (!updated) {
      return res.status(404).json({
        error: {
          code: 'GIFT_NOT_FOUND',
          message: 'Gift not found',
        },
      });
    }

    logger.info('Gift marked as gifted', { userId, giftId });

    res.json({
      message: 'Gift marked as gifted',
      gift: updated,
    });
  } catch (error) {
    logger.error('Mark gift gifted error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark gift as gifted',
      },
    });
  }
});

/**
 * DELETE /gifts/:giftId
 * Remove saved gift
 */
router.delete('/:giftId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { giftId } = req.params;

    const success = await giftTrackingService.removeSavedGift(giftId, userId);

    if (!success) {
      return res.status(404).json({
        error: {
          code: 'GIFT_NOT_FOUND',
          message: 'Gift not found',
        },
      });
    }

    logger.info('Gift removed', { userId, giftId });

    res.json({
      message: 'Gift removed successfully',
      giftId,
    });
  } catch (error) {
    logger.error('Remove gift error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove gift',
      },
    });
  }
});

/**
 * GET /gifts/stats/summary
 * Get gift statistics
 */
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const stats = await giftTrackingService.getGiftStats(userId);

    logger.info('Gift stats retrieved', { userId });

    res.json(stats);
  } catch (error) {
    logger.error('Get gift stats error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get gift statistics',
      },
    });
  }
});

/**
 * GET /gifts/budget/:eventId
 * Get gift budget summary for event
 */
router.get('/budget/:eventId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    // Verify event belongs to user
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
        deletedAt: null,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    const budget = await giftTrackingService.getGiftBudgetSummary(userId, eventId);

    logger.info('Gift budget summary retrieved', { userId, eventId });

    res.json({
      eventId,
      budget,
    });
  } catch (error) {
    logger.error('Get gift budget error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get gift budget',
      },
    });
  }
});

export default router;
