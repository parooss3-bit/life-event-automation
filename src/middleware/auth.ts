import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../index';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tier: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('No token provided', { path: req.path });
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'No authentication token provided',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      tier: decoded.tier,
    };
    next();
  } catch (error) {
    logger.warn('Invalid token', { error: (error as Error).message });
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
};

export const requireTier = (tier: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Authentication required',
        },
      });
    }

    if (req.user.tier !== tier && req.user.tier !== 'business') {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `This feature requires ${tier} tier or higher`,
        },
      });
    }

    next();
  };
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication required',
      },
    });
  }

  // Check if user is admin (you can add admin flag to User model later)
  // For now, we'll just check if they have business tier
  if (req.user.tier !== 'business') {
    return res.status(403).json({
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Admin access required',
      },
    });
  }

  next();
};
