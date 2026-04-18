import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  generatePersonalizedVideo,
  getVideoStatus,
  getAvailableAvatars,
  getAvailableVoices,
  getUserVideos,
  deleteVideo,
  getVideoGenerationStats,
} from '../services/video-generation';

const router = Router();

/**
 * POST /api/v1/videos/generate
 * Generate a personalized video message
 */
router.post('/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      contactId,
      eventId,
      recipientName,
      senderName,
      eventType,
      message,
      avatarId,
      voiceId,
    } = req.body;

    if (!contactId || !eventId || !recipientName || !senderName || !eventType) {
      return res.status(400).json({
        error: {
          message: 'Missing required fields',
        },
      });
    }

    const video = await generatePersonalizedVideo({
      userId: req.user!.id,
      contactId,
      eventId,
      recipientName,
      senderName,
      eventType,
      message,
      avatarId,
      voiceId,
    });

    res.json(video);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to generate video',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/videos/:id/status
 * Get video generation status
 */
router.get('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const status = await getVideoStatus(req.params.id);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to get video status',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/videos/avatars
 * Get available avatars
 */
router.get('/avatars', authenticateToken, async (req: Request, res: Response) => {
  try {
    const avatars = await getAvailableAvatars();
    res.json({ avatars });
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch avatars',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/videos/voices
 * Get available voices
 */
router.get('/voices', authenticateToken, async (req: Request, res: Response) => {
  try {
    const voices = await getAvailableVoices();
    res.json({ voices });
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch voices',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/videos
 * Get user's generated videos
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const videos = await getUserVideos(req.user!.id, limit);
    res.json({ videos });
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch videos',
        details: error.message,
      },
    });
  }
});

/**
 * DELETE /api/v1/videos/:id
 * Delete a video
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    await deleteVideo(req.params.id, req.user!.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to delete video',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/v1/videos/stats
 * Get video generation statistics
 */
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const stats = await getVideoGenerationStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch stats',
        details: error.message,
      },
    });
  }
});

export default router;
