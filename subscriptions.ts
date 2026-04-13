import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createCheckoutSession,
  getUserSubscription,
  cancelSubscription,
  reactivateSubscription,
  getBillingPortalUrl,
  SUBSCRIPTION_TIERS,
} from '../services/stripe';

const router = Router();

/**
 * GET /api/v1/subscriptions/tiers
 * Get all available subscription tiers
 */
router.get('/tiers', (req: Request, res: Response) => {
  try {
    const tiers = Object.values(SUBSCRIPTION_TIERS).map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      billingCycle: tier.billingCycle,
      features: tier.features,
      maxContacts: tier.maxContacts,
      maxEvents: tier.maxEvents,
      aiVideoGeneration: tier.aiVideoGeneration,
      giftRecommendations: tier.giftRecommendations,
    }));

    res.json({ tiers });
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch subscription tiers',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/subscriptions/current
 * Get current user's subscription
 */
router.get('/current', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    const subscription = await getUserSubscription(userId);

    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch subscription',
        details: error.message,
      },
    });
  }
});

/**
 * POST /api/v1/subscriptions/checkout
 * Create a checkout session for subscription upgrade
 */
router.post(
  '/checkout',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { tierId, successUrl, cancelUrl } = req.body;

      if (!tierId || !successUrl || !cancelUrl) {
        return res.status(400).json({
          error: {
            message: 'Missing required fields: tierId, successUrl, cancelUrl',
          },
        });
      }

      const session = await createCheckoutSession(
        userId,
        tierId,
        successUrl,
        cancelUrl
      );

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to create checkout session',
          details: error.message,
        },
      });
    }
  }
);

/**
 * POST /api/v1/subscriptions/cancel
 * Cancel user's subscription
 */
router.post(
  '/cancel',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      await cancelSubscription(userId);

      res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to cancel subscription',
          details: error.message,
        },
      });
    }
  }
);

/**
 * POST /api/v1/subscriptions/reactivate
 * Reactivate cancelled subscription
 */
router.post(
  '/reactivate',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      await reactivateSubscription(userId);

      res.json({ success: true, message: 'Subscription reactivated' });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to reactivate subscription',
          details: error.message,
        },
      });
    }
  }
);

/**
 * GET /api/v1/subscriptions/billing-portal
 * Get billing portal URL
 */
router.get(
  '/billing-portal',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
      }

      const { returnUrl } = req.query;
      if (!returnUrl) {
        return res.status(400).json({
          error: { message: 'Missing required query parameter: returnUrl' },
        });
      }

      const url = await getBillingPortalUrl(userId, returnUrl as string);

      res.json({ url });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to get billing portal URL',
          details: error.message,
        },
      });
    }
  }
);

export default router;outer;
