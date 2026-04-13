import express, { Request, Response } from 'express';
import passport from 'passport';
import { prisma, logger } from '../index';
import { generateTokens } from '../utils/auth';
import facebookService from '../services/facebook';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * POST /auth/facebook/login
 * Initiate Facebook OAuth login
 */
router.get(
  '/login',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends', 'user_birthday'],
  })
);

/**
 * GET /auth/facebook/callback
 * Facebook OAuth callback
 */
router.get(
  '/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect('/login?error=auth_failed');
      }

      // Generate JWT tokens
      const { accessToken, refreshToken } = generateTokens(
        user.id,
        user.email,
        'free'
      );

      // Redirect to frontend with tokens
      const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:5173');
      redirectUrl.searchParams.append('token', accessToken);
      redirectUrl.searchParams.append('refreshToken', refreshToken);
      redirectUrl.searchParams.append('userId', user.id);

      res.redirect(redirectUrl.toString());
    } catch (error) {
      logger.error('Facebook callback error', error);
      res.redirect('/login?error=callback_failed');
    }
  }
);

/**
 * POST /auth/facebook/sync-contacts
 * Sync contacts and birthdays from Facebook
 */
router.post('/sync-contacts', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { facebookAccessToken } = req.body;

    if (!facebookAccessToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Facebook access token is required',
        },
      });
    }

    // Verify token is valid
    const isValid = await facebookService.verifyAccessToken(facebookAccessToken);
    if (!isValid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid Facebook access token',
        },
      });
    }

    // Extract contacts from Facebook
    const extractedContacts = await facebookService.extractContacts(facebookAccessToken);

    logger.info('Syncing Facebook contacts', {
      userId,
      contactCount: extractedContacts.length,
    });

    // Create or update contacts in database
    const createdContacts = [];

    for (const extractedContact of extractedContacts) {
      // Check if contact already exists
      let contact = await prisma.contact.findFirst({
        where: {
          userId,
          firstName: extractedContact.firstName,
          lastName: extractedContact.lastName || '',
        },
      });

      if (!contact) {
        // Create new contact
        contact = await prisma.contact.create({
          data: {
            userId,
            firstName: extractedContact.firstName,
            lastName: extractedContact.lastName || '',
            email: extractedContact.email,
            avatarUrl: extractedContact.avatarUrl,
            relationship: extractedContact.relationship,
          },
        });

        createdContacts.push(contact);

        // Create birthday event if birthday exists
        if (extractedContact.birthday) {
          const eventDate = new Date(
            new Date().getFullYear(),
            extractedContact.birthday.getMonth(),
            extractedContact.birthday.getDate()
          );

          await prisma.event.create({
            data: {
              userId,
              contactId: contact.id,
              eventType: 'birthday',
              title: `${extractedContact.firstName}'s Birthday`,
              eventDate,
              isRecurring: true,
              recurrencePattern: 'yearly',
              reminderDaysBefore: 14,
            },
          });

          logger.info('Birthday event created', {
            contactId: contact.id,
            eventDate,
          });
        }
      }
    }

    logger.info('Facebook contacts synced', {
      userId,
      created: createdContacts.length,
      total: extractedContacts.length,
    });

    res.json({
      message: 'Contacts synced successfully',
      contactsCreated: createdContacts.length,
      contactsTotal: extractedContacts.length,
      contacts: createdContacts.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
      })),
    });
  } catch (error) {
    logger.error('Facebook sync contacts error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to sync Facebook contacts',
      },
    });
  }
});

/**
 * GET /auth/facebook/friends
 * Get list of friends from Facebook
 */
router.get('/friends', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { facebookAccessToken } = req.query;

    if (!facebookAccessToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Facebook access token is required',
        },
      });
    }

    // Get friends from Facebook
    const friends = await facebookService.getFriendsWithBirthdays(
      facebookAccessToken as string
    );

    // Filter friends with birthdays
    const friendsWithBirthdays = friends.filter((f) => f.birthday);

    res.json({
      total: friends.length,
      withBirthdays: friendsWithBirthdays.length,
      friends: friendsWithBirthdays.map((f) => ({
        facebookId: f.id,
        name: f.name,
        picture: f.picture?.data?.url,
        birthday: f.birthday,
        email: f.email,
      })),
    });
  } catch (error) {
    logger.error('Get Facebook friends error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get Facebook friends',
      },
    });
  }
});

/**
 * POST /auth/facebook/disconnect
 * Disconnect Facebook account from user
 */
router.post('/disconnect', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        facebookId: null,
      },
    });

    logger.info('Facebook account disconnected', { userId });

    res.json({
      message: 'Facebook account disconnected successfully',
    });
  } catch (error) {
    logger.error('Facebook disconnect error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to disconnect Facebook account',
      },
    });
  }
});

export default router;
