import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma, logger } from '../index';

const router = express.Router();

// GET /users/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        phone: true,
        timezone: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get user error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get user',
      },
    });
  }
});

// PUT /users/me
router.put('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, timezone, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        timezone: timezone || undefined,
        avatarUrl: avatarUrl || undefined,
      },
    });

    logger.info('User updated', { userId: user.id });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      timezone: user.timezone,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    logger.error('Update user error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update user',
      },
    });
  }
});

// GET /users/me/dashboard
router.get('/me/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [totalContacts, totalEvents, upcomingEvents, totalGifts, totalVideos] = await Promise.all([
      prisma.contact.count({ where: { userId, deletedAt: null } }),
      prisma.event.count({ where: { userId, deletedAt: null } }),
      prisma.event.count({
        where: {
          userId,
          eventDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          deletedAt: null,
        },
      }),
      prisma.gift.count({ where: { userId, deletedAt: null } }),
      prisma.aIVideo.count({ where: { userId, deletedAt: null } }),
    ]);

    res.json({
      totalContacts,
      totalEvents,
      upcomingEvents,
      totalGifts,
      totalVideos,
      subscriptionTier: req.user?.tier,
    });
  } catch (error) {
    logger.error('Get dashboard error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get dashboard data',
      },
    });
  }
});

export default router;
