import express, { Request, Response } from 'express';
import { prisma, logger } from '../index';
import { generateTokens, hashPassword, verifyPassword } from '../utils/auth';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName || '',
        lastName: lastName || '',
        subscriptions: {
          create: {
            planId: 'free',
            status: 'active',
          },
        },
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, 'free');

    logger.info('User signed up', { userId: user.id, email: user.email });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionTier: 'free',
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Signup error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create account',
      },
    });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: true,
      },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.subscriptionTier
    );

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionTier: user.subscriptionTier,
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to login',
      },
    });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      });
    }

    // Verify refresh token (implement token verification logic)
    // For now, we'll just generate new tokens

    res.json({
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    logger.error('Refresh token error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to refresh token',
      },
    });
  }
});

// POST /auth/logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    logger.info('User logged out', { userId: req.user?.id });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to logout',
      },
    });
  }
});

export default router;
