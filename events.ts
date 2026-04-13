import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma, logger } from '../index';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /events
 * Get all events for the authenticated user with filtering
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      page = '1',
      limit = '20',
      eventType = '',
      status = '',
      startDate,
      endDate,
      contactId = '',
      sortBy = 'eventDate',
      sortOrder = 'asc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (eventType) {
      where.eventType = eventType;
    }

    if (status) {
      where.status = status;
    }

    if (contactId) {
      where.contactId = contactId;
    }

    if (startDate || endDate) {
      where.eventDate = {};
      if (startDate) {
        where.eventDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.eventDate.lte = new Date(endDate as string);
      }
    }

    // Get total count
    const total = await prisma.event.count({ where });

    // Get events
    const events = await prisma.event.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        reminders: {
          where: { deletedAt: null },
          select: {
            id: true,
            reminderDate: true,
            status: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
      },
      skip,
      take: limitNum,
    });

    logger.info('Events retrieved', {
      userId,
      count: events.length,
      total,
    });

    res.json({
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Get events error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get events',
      },
    });
  }
});

/**
 * POST /events
 * Create a new event
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      contactId,
      eventType,
      title,
      eventDate,
      description,
      isRecurring,
      recurrencePattern,
      reminderDaysBefore,
      giftIdeas,
      notes,
    } = req.body;

    // Validation
    if (!contactId || !eventType || !title || !eventDate) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'contactId, eventType, title, and eventDate are required',
        },
      });
    }

    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
        deletedAt: null,
      },
    });

    if (!contact) {
      return res.status(404).json({
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        userId,
        contactId,
        eventType,
        title,
        eventDate: new Date(eventDate),
        description: description || null,
        isRecurring: isRecurring || false,
        recurrencePattern: recurrencePattern || null,
        reminderDaysBefore: reminderDaysBefore || 14,
        giftIdeas: giftIdeas || null,
        notes: notes || null,
        status: 'upcoming',
      },
    });

    logger.info('Event created', {
      userId,
      eventId: event.id,
      eventType: event.eventType,
      contactId: event.contactId,
    });

    res.status(201).json({
      id: event.id,
      contactId: event.contactId,
      eventType: event.eventType,
      title: event.title,
      eventDate: event.eventDate,
      description: event.description,
      isRecurring: event.isRecurring,
      recurrencePattern: event.recurrencePattern,
      reminderDaysBefore: event.reminderDaysBefore,
      status: event.status,
      createdAt: event.createdAt,
    });
  } catch (error) {
    logger.error('Create event error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create event',
      },
    });
  }
});

/**
 * GET /events/:id
 * Get a specific event by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        contact: true,
        reminders: {
          where: { deletedAt: null },
        },
        gifts: {
          where: { deletedAt: null },
        },
        videos: {
          where: { deletedAt: null },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    logger.info('Event retrieved', { userId, eventId: id });

    res.json(event);
  } catch (error) {
    logger.error('Get event error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get event',
      },
    });
  }
});

/**
 * PUT /events/:id
 * Update an event
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      title,
      eventDate,
      description,
      isRecurring,
      recurrencePattern,
      reminderDaysBefore,
      giftIdeas,
      notes,
      status,
    } = req.body;

    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Update event
    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title || event.title,
        eventDate: eventDate ? new Date(eventDate) : event.eventDate,
        description: description !== undefined ? description : event.description,
        isRecurring: isRecurring !== undefined ? isRecurring : event.isRecurring,
        recurrencePattern:
          recurrencePattern !== undefined ? recurrencePattern : event.recurrencePattern,
        reminderDaysBefore:
          reminderDaysBefore !== undefined ? reminderDaysBefore : event.reminderDaysBefore,
        giftIdeas: giftIdeas !== undefined ? giftIdeas : event.giftIdeas,
        notes: notes !== undefined ? notes : event.notes,
        status: status || event.status,
      },
    });

    logger.info('Event updated', {
      userId,
      eventId: id,
      title: updated.title,
    });

    res.json({
      id: updated.id,
      title: updated.title,
      eventDate: updated.eventDate,
      description: updated.description,
      isRecurring: updated.isRecurring,
      recurrencePattern: updated.recurrencePattern,
      reminderDaysBefore: updated.reminderDaysBefore,
      status: updated.status,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    logger.error('Update event error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update event',
      },
    });
  }
});

/**
 * DELETE /events/:id
 * Soft delete an event
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check if event exists
    const event = await prisma.event.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!event) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found',
        },
      });
    }

    // Soft delete event
    await prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info('Event deleted', {
      userId,
      eventId: id,
      title: event.title,
    });

    res.json({
      message: 'Event deleted successfully',
      id,
    });
  } catch (error) {
    logger.error('Delete event error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete event',
      },
    });
  }
});

/**
 * GET /events/upcoming/list
 * Get upcoming events (next 30 days)
 */
router.get('/upcoming/list', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { days = '30' } = req.query;

    const daysNum = parseInt(days as string, 10);
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysNum * 24 * 60 * 60 * 1000);

    const events = await prisma.event.findMany({
      where: {
        userId,
        deletedAt: null,
        eventDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    });

    logger.info('Upcoming events retrieved', {
      userId,
      count: events.length,
      days: daysNum,
    });

    res.json({
      upcomingDays: daysNum,
      count: events.length,
      events,
    });
  } catch (error) {
    logger.error('Get upcoming events error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get upcoming events',
      },
    });
  }
});

/**
 * GET /events/stats/summary
 * Get event statistics
 */
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      eventsByType,
      recurringEvents,
    ] = await Promise.all([
      prisma.event.count({
        where: { userId, deletedAt: null },
      }),
      prisma.event.count({
        where: {
          userId,
          deletedAt: null,
          eventDate: { gte: now },
        },
      }),
      prisma.event.count({
        where: {
          userId,
          deletedAt: null,
          eventDate: { lt: now },
        },
      }),
      prisma.event.groupBy({
        by: ['eventType'],
        where: { userId, deletedAt: null },
        _count: true,
      }),
      prisma.event.count({
        where: {
          userId,
          deletedAt: null,
          isRecurring: true,
        },
      }),
    ]);

    logger.info('Event stats retrieved', { userId, totalEvents });

    res.json({
      totalEvents,
      upcomingEvents,
      pastEvents,
      recurringEvents,
      byType: eventsByType.map((t) => ({
        eventType: t.eventType,
        count: t._count,
      })),
    });
  } catch (error) {
    logger.error('Get event stats error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get event statistics',
      },
    });
  }
});

export default router;outer;
