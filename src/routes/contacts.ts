import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma, logger } from '../index';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /contacts
 * Get all contacts for the authenticated user with filtering and pagination
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      page = '1',
      limit = '20',
      search = '',
      relationship = '',
      sortBy = 'firstName',
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

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (relationship) {
      where.relationship = relationship;
    }

    // Get total count
    const total = await prisma.contact.count({ where });

    // Get contacts
    const contacts = await prisma.contact.findMany({
      where,
      include: {
        events: {
          where: { deletedAt: null },
          select: {
            id: true,
            eventType: true,
            title: true,
            eventDate: true,
            isRecurring: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
      },
      skip,
      take: limitNum,
    });

    logger.info('Contacts retrieved', {
      userId,
      count: contacts.length,
      total,
    });

    res.json({
      data: contacts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Get contacts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get contacts',
      },
    });
  }
});

/**
 * POST /contacts
 * Create a new contact
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      firstName,
      lastName,
      email,
      phone,
      relationship,
      avatarUrl,
      notes,
    } = req.body;

    // Validation
    if (!firstName) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'First name is required',
        },
      });
    }

    // Check for duplicates
    const existing = await prisma.contact.findFirst({
      where: {
        userId,
        firstName,
        lastName: lastName || '',
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: {
          code: 'CONTACT_EXISTS',
          message: 'Contact with this name already exists',
        },
      });
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        userId,
        firstName,
        lastName: lastName || '',
        email: email || null,
        phone: phone || null,
        relationship: relationship || 'friend',
        avatarUrl: avatarUrl || null,
        notes: notes || null,
      },
    });

    logger.info('Contact created', {
      userId,
      contactId: contact.id,
      firstName: contact.firstName,
    });

    res.status(201).json({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      relationship: contact.relationship,
      avatarUrl: contact.avatarUrl,
      notes: contact.notes,
      createdAt: contact.createdAt,
    });
  } catch (error) {
    logger.error('Create contact error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create contact',
      },
    });
  }
});

/**
 * GET /contacts/:id
 * Get a specific contact by ID
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        events: {
          where: { deletedAt: null },
          orderBy: { eventDate: 'asc' },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    logger.info('Contact retrieved', { userId, contactId: id });

    res.json(contact);
  } catch (error) {
    logger.error('Get contact error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get contact',
      },
    });
  }
});

/**
 * PUT /contacts/:id
 * Update a contact
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      relationship,
      avatarUrl,
      notes,
    } = req.body;

    // Check if contact exists
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!contact) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    // Update contact
    const updated = await prisma.contact.update({
      where: { id },
      data: {
        firstName: firstName || contact.firstName,
        lastName: lastName !== undefined ? lastName : contact.lastName,
        email: email !== undefined ? email : contact.email,
        phone: phone !== undefined ? phone : contact.phone,
        relationship: relationship || contact.relationship,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : contact.avatarUrl,
        notes: notes !== undefined ? notes : contact.notes,
      },
    });

    logger.info('Contact updated', {
      userId,
      contactId: id,
      firstName: updated.firstName,
    });

    res.json({
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      relationship: updated.relationship,
      avatarUrl: updated.avatarUrl,
      notes: updated.notes,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    logger.error('Update contact error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update contact',
      },
    });
  }
});

/**
 * DELETE /contacts/:id
 * Soft delete a contact (marks as deleted, doesn't remove from DB)
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check if contact exists
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!contact) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    // Soft delete contact
    await prisma.contact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info('Contact deleted', {
      userId,
      contactId: id,
      firstName: contact.firstName,
    });

    res.json({
      message: 'Contact deleted successfully',
      id,
    });
  } catch (error) {
    logger.error('Delete contact error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete contact',
      },
    });
  }
});

/**
 * POST /contacts/bulk/import
 * Import multiple contacts at once
 */
router.post('/bulk/import', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { contacts: contactsToImport } = req.body;

    if (!Array.isArray(contactsToImport) || contactsToImport.length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Contacts array is required and must not be empty',
        },
      });
    }

    if (contactsToImport.length > 1000) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Maximum 1000 contacts can be imported at once',
        },
      });
    }

    // Get existing contacts to avoid duplicates
    const existingContacts = await prisma.contact.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const existingNames = new Set(
      existingContacts.map((c) => `${c.firstName}${c.lastName}`)
    );

    // Filter out duplicates
    const newContacts = contactsToImport.filter((c) => {
      const key = `${c.firstName}${c.lastName || ''}`;
      return !existingNames.has(key);
    });

    // Create contacts
    const created = await Promise.all(
      newContacts.map((c) =>
        prisma.contact.create({
          data: {
            userId,
            firstName: c.firstName,
            lastName: c.lastName || '',
            email: c.email || null,
            phone: c.phone || null,
            relationship: c.relationship || 'friend',
            avatarUrl: c.avatarUrl || null,
            notes: c.notes || null,
          },
        })
      )
    );

    logger.info('Contacts bulk imported', {
      userId,
      imported: created.length,
      duplicates: contactsToImport.length - created.length,
    });

    res.status(201).json({
      message: 'Contacts imported successfully',
      imported: created.length,
      duplicates: contactsToImport.length - created.length,
      contacts: created.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
      })),
    });
  } catch (error) {
    logger.error('Bulk import contacts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to import contacts',
      },
    });
  }
});

/**
 * GET /contacts/stats/summary
 * Get contact statistics
 */
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [
      totalContacts,
      contactsByRelationship,
      contactsWithEmail,
      contactsWithPhone,
      contactsWithBirthday,
    ] = await Promise.all([
      prisma.contact.count({
        where: { userId, deletedAt: null },
      }),
      prisma.contact.groupBy({
        by: ['relationship'],
        where: { userId, deletedAt: null },
        _count: true,
      }),
      prisma.contact.count({
        where: {
          userId,
          deletedAt: null,
          email: { not: null },
        },
      }),
      prisma.contact.count({
        where: {
          userId,
          deletedAt: null,
          phone: { not: null },
        },
      }),
      prisma.contact.count({
        where: {
          userId,
          deletedAt: null,
          events: {
            some: {
              eventType: 'birthday',
              deletedAt: null,
            },
          },
        },
      }),
    ]);

    logger.info('Contact stats retrieved', { userId, totalContacts });

    res.json({
      totalContacts,
      contactsWithEmail,
      contactsWithPhone,
      contactsWithBirthday,
      byRelationship: contactsByRelationship.map((r) => ({
        relationship: r.relationship,
        count: r._count,
      })),
    });
  } catch (error) {
    logger.error('Get contact stats error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get contact statistics',
      },
    });
  }
});

export default router;
