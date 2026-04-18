import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma, logger } from '../index';
import reminderScheduler from '../services/reminder-scheduler';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /reminders
 * Get all reminders for the authenticated user
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      page = '1',
      limit = '20',
      status = '',
      eventId = '',
      sortBy = 'reminderDate',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    // Get total count
    const total = await prisma.reminder.count({ where });

    // Get reminders
    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventType: true,
            eventDate: true,
            contact: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
      },
      skip,
      take: limitNum,
    });

    logger.info('Reminders retrieved', {
      userId,
      count: reminders.length,
      total,
    });

    res.json({
      data: reminders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Get reminders error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get reminders',
      },
    });
  }
});

/**
 * GET /reminders/:id
 * Get a specific reminder by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        event: {
          include: {
            contact: true,
          },
        },
      },
    });

    if (!reminder) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reminder not found',
        },
      });
    }

    logger.info('Reminder retrieved', { userId, reminderId: id });

    res.json(reminder);
  } catch (error) {
    logger.error('Get reminder error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get reminder',
      },
    });
  }
});

/**
 * PUT /reminders/:id
 * Update a reminder status
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'sent', 'failed', 'dismissed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        },
      });
    }

    // Check if reminder exists
    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!reminder) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reminder not found',
        },
      });
    }

    // Update reminder
    const updated = await prisma.reminder.update({
      where: { id },
      data: {
        status: status || reminder.status,
      },
    });

    logger.info('Reminder updated', {
      userId,
      reminderId: id,
      status: updated.status,
    });

    res.json({
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    logger.error('Update reminder error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update reminder',
      },
    });
  }
});

/**
 * DELETE /reminders/:id
 * Soft delete a reminder
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check if reminder exists
    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!reminder) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reminder not found',
        },
      });
    }

    // Soft delete reminder
    await prisma.reminder.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info('Reminder deleted', {
      userId,
      reminderId: id,
    });

    res.json({
      message: 'Reminder deleted successfully',
      id,
    });
  } catch (error) {
    logger.error('Delete reminder error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete reminder',
      },
    });
  }
});

/**
 * POST /reminders/send-immediate/:eventId
 * Send immediate reminder for an event
 */
router.post('/send-immediate/:eventId', async (req: AuthRequest, res: Response) => {
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

    // Send immediate reminder
    const success = await reminderScheduler.sendImmediateReminder(eventId);

    if (!success) {
      return res.status(500).json({
        error: {
          code: 'SEND_FAILED',
          message: 'Failed to send reminder',
        },
      });
    }

    logger.info('Immediate reminder sent', { userId, eventId });

    res.json({
      message: 'Reminder sent successfully',
      eventId,
    });
  } catch (error) {
    logger.error('Send immediate reminder error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send reminder',
      },
    });
  }
});

/**
 * GET /reminders/stats/summary
 * Get reminder statistics
 */
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [
      totalReminders,
      sentReminders,
      failedReminders,
      pendingReminders,
      emailReminders,
      smsReminders,
      pushReminders,
    ] = await Promise.all([
      prisma.reminder.count({
        where: { userId, deletedAt: null },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, status: 'sent' },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, status: 'failed' },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, status: 'pending' },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, sentViaEmail: true },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, sentViaSMS: true },
      }),
      prisma.reminder.count({
        where: { userId, deletedAt: null, sentViaPush: true },
      }),
    ]);

    logger.info('Reminder stats retrieved', { userId, totalReminders });

    res.json({
      totalReminders,
      sentReminders,
      failedReminders,
      pendingReminders,
      byChannel: {
        email: emailReminders,
        sms: smsReminders,
        push: pushReminders,
      },
    });
  } catch (error) {
    logger.error('Get reminder stats error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get reminder statistics',
      },
    });
  }
});

/**
 * GET /reminders/scheduler/status
 * Get reminder scheduler status
 */
router.get('/scheduler/status', async (req: AuthRequest, res: Response) => {
  try {
    const status = reminderScheduler.getStatus();

    res.json({
      scheduler: status,
    });
  } catch (error) {
    logger.error('Get scheduler status error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get scheduler status',
      },
    });
  }
});

export default router;
