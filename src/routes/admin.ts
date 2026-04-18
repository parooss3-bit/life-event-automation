import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDashboardAnalytics,
  getAllUsers,
  getUserDetails,
  getRevenueAnalytics,
  getFeatureUsageAnalytics,
  getSystemHealth,
  exportUserData,
  deleteUserAccount,
} from '../services/admin';

const router = Router();

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
  next();
};

/**
 * GET /api/v1/admin/dashboard
 * Get dashboard analytics
 */
router.get('/dashboard', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const analytics = await getDashboardAnalytics();
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch dashboard analytics',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/users
 * Get all users with pagination
 */
router.get('/users', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await getAllUsers(page, limit, search);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch users',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/users/:id
 * Get user details
 */
router.get('/users/:id', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const user = await getUserDetails(req.params.id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch user details',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/revenue
 * Get revenue analytics
 */
router.get('/revenue', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const analytics = await getRevenueAnalytics();
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch revenue analytics',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/features
 * Get feature usage analytics
 */
router.get('/features', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const analytics = await getFeatureUsageAnalytics();
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch feature usage analytics',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/health
 * Get system health
 */
router.get('/health', authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const health = await getSystemHealth();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch system health',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/admin/users/:id/export
 * Export user data (GDPR)
 */
router.get(
  '/users/:id/export',
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const data = await exportUserData(req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to export user data',
          details: error.message,
        },
      });
    }
  }
);

/**
 * DELETE /api/v1/admin/users/:id
 * Delete user account (GDPR)
 */
router.delete(
  '/users/:id',
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      if (req.user?.id === req.params.id) {
        return res.status(400).json({
          error: { message: 'Cannot delete your own account' },
        });
      }

      await deleteUserAccount(req.params.id);
      res.json({ success: true, message: 'User account deleted' });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: 'Failed to delete user account',
          details: error.message,
        },
      });
    }
  }
);

export default router;
