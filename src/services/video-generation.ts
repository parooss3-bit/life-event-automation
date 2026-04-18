import axios from 'axios';
import { prisma } from '../lib/prisma';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_BASE = 'https://api.heygen.com/v1';

interface VideoGenerationRequest {
  userId: string;
  contactId: string;
  eventId: string;
  recipientName: string;
  senderName: string;
  eventType: string;
  message?: string;
  avatarId?: string;
  voiceId?: string;
}

interface VideoGenerationResponse {
  videoId: string;
  status: string;
  videoUrl?: string;
  createdAt: Date;
}

/**
 * Generate personalized video message using HeyGen
 */
export async function generatePersonalizedVideo(
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    // Generate script based on event type
    const script = generateScript(
      request.recipientName,
      request.senderName,
      request.eventType,
      request.message
    );

    // Create video generation request to HeyGen
    const response = await axios.post(
      `${HEYGEN_API_BASE}/video_requests`,
      {
        test: false,
        caption: true,
        dimension: {
          width: 1280,
          height: 720,
        },
        clips: [
          {
            avatar_id: request.avatarId || 'DEFAULT_AVATAR',
            voice: {
              voice_id: request.voiceId || 'DEFAULT_VOICE',
            },
            script: script,
            background: {
              type: 'color',
              color: '#FFFFFF',
            },
          },
        ],
      },
      {
        headers: {
          'X-HEYGEN-API-KEY': HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const videoId = response.data.data.video_id;

    // Save video record to database
    const video = await prisma.aIVideo.create({
      data: {
        userId: request.userId,
        contactId: request.contactId,
        eventId: request.eventId,
        videoId: videoId,
        status: 'processing',
        script: script,
        avatarId: request.avatarId || 'DEFAULT_AVATAR',
        voiceId: request.voiceId || 'DEFAULT_VOICE',
      },
    });

    return {
      videoId: video.id,
      status: 'processing',
      createdAt: video.createdAt,
    };
  } catch (error: any) {
    console.error('Error generating video:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

/**
 * Get video generation status
 */
export async function getVideoStatus(videoId: string): Promise<{
  status: string;
  videoUrl?: string;
  error?: string;
}> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    // Get video from database
    const video = await prisma.aIVideo.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new Error('Video not found');
    }

    // Check status with HeyGen
    const response = await axios.get(
      `${HEYGEN_API_BASE}/video_requests/${video.videoId}`,
      {
        headers: {
          'X-HEYGEN-API-KEY': HEYGEN_API_KEY,
        },
      }
    );

    const status = response.data.data.status;
    const videoUrl = response.data.data.video_url;

    // Update database if status changed
    if (status !== video.status) {
      await prisma.aIVideo.update({
        where: { id: videoId },
        data: {
          status: status,
          videoUrl: videoUrl || video.videoUrl,
        },
      });
    }

    return {
      status: status,
      videoUrl: videoUrl || video.videoUrl || undefined,
    };
  } catch (error: any) {
    console.error('Error getting video status:', error);
    throw new Error(`Failed to get video status: ${error.message}`);
  }
}

/**
 * Generate video script based on event type
 */
function generateScript(
  recipientName: string,
  senderName: string,
  eventType: string,
  customMessage?: string
): string {
  const greetings: Record<string, string> = {
    birthday: `Happy Birthday, ${recipientName}! 🎉`,
    anniversary: `Happy Anniversary, ${recipientName}! 💕`,
    milestone: `Congratulations, ${recipientName}! 🌟`,
    holiday: `Happy Holidays, ${recipientName}! ✨`,
    custom: `Hello, ${recipientName}! 👋`,
  };

  const messages: Record<string, string> = {
    birthday:
      'I wanted to take a moment to celebrate you on your special day. You mean so much to me, and I hope this year brings you joy, laughter, and unforgettable memories. Wishing you the happiest of birthdays!',
    anniversary:
      'I wanted to celebrate this special day with you. Thank you for all the wonderful memories we have shared together. Here is to many more years of love, laughter, and happiness!',
    milestone:
      'I wanted to congratulate you on this amazing achievement. You have worked so hard, and you truly deserve this success. I am so proud of you!',
    holiday:
      'I wanted to send you warm wishes for a wonderful holiday season. Thank you for being such an important part of my life. Wishing you all the best!',
    custom: customMessage || 'I wanted to send you a special message.',
  };

  const closings: Record<string, string> = {
    birthday: 'Enjoy your day to the fullest!',
    anniversary: 'With all my love and appreciation!',
    milestone: 'Keep shining and achieving great things!',
    holiday: 'Warmest wishes to you and your loved ones!',
    custom: 'Take care!',
  };

  const greeting = greetings[eventType] || greetings['custom'];
  const message = messages[eventType] || messages['custom'];
  const closing = closings[eventType] || closings['custom'];

  return `${greeting} ${message} ${closing} - From ${senderName}`;
}

/**
 * Get available avatars
 */
export async function getAvailableAvatars(): Promise<
  Array<{
    id: string;
    name: string;
    preview: string;
  }>
> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    const response = await axios.get(`${HEYGEN_API_BASE}/avatars`, {
      headers: {
        'X-HEYGEN-API-KEY': HEYGEN_API_KEY,
      },
    });

    return response.data.data.avatars.map((avatar: any) => ({
      id: avatar.avatar_id,
      name: avatar.name,
      preview: avatar.preview_image_url,
    }));
  } catch (error: any) {
    console.error('Error fetching avatars:', error);
    // Return default avatars if API fails
    return [
      {
        id: 'DEFAULT_AVATAR',
        name: 'Default Avatar',
        preview: 'https://via.placeholder.com/150',
      },
    ];
  }
}

/**
 * Get available voices
 */
export async function getAvailableVoices(): Promise<
  Array<{
    id: string;
    name: string;
    language: string;
    gender: string;
  }>
> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error('HEYGEN_API_KEY not configured');
    }

    const response = await axios.get(`${HEYGEN_API_BASE}/voices`, {
      headers: {
        'X-HEYGEN-API-KEY': HEYGEN_API_KEY,
      },
    });

    return response.data.data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      language: voice.language,
      gender: voice.gender,
    }));
  } catch (error: any) {
    console.error('Error fetching voices:', error);
    // Return default voice if API fails
    return [
      {
        id: 'DEFAULT_VOICE',
        name: 'Default Voice',
        language: 'en-US',
        gender: 'female',
      },
    ];
  }
}

/**
 * Get user's generated videos
 */
export async function getUserVideos(userId: string, limit = 20) {
  try {
    const videos = await prisma.aIVideo.findMany({
      where: { userId },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        event: {
          select: {
            title: true,
            eventType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return videos;
  } catch (error: any) {
    console.error('Error fetching user videos:', error);
    throw error;
  }
}

/**
 * Delete video
 */
export async function deleteVideo(videoId: string, userId: string) {
  try {
    const video = await prisma.aIVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.userId !== userId) {
      throw new Error('Video not found or unauthorized');
    }

    // Delete from HeyGen if needed
    if (video.videoId && HEYGEN_API_KEY) {
      try {
        await axios.delete(
          `${HEYGEN_API_BASE}/video_requests/${video.videoId}`,
          {
            headers: {
              'X-HEYGEN-API-KEY': HEYGEN_API_KEY,
            },
          }
        );
      } catch (error) {
        console.warn('Failed to delete video from HeyGen:', error);
      }
    }

    // Delete from database
    await prisma.aIVideo.delete({
      where: { id: videoId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

/**
 * Get video generation stats
 */
export async function getVideoGenerationStats(userId: string) {
  try {
    const [totalVideos, processingVideos, completedVideos, failedVideos] =
      await Promise.all([
        prisma.aIVideo.count({
          where: { userId },
        }),
        prisma.aIVideo.count({
          where: { userId, status: 'processing' },
        }),
        prisma.aIVideo.count({
          where: { userId, status: 'completed' },
        }),
        prisma.aIVideo.count({
          where: { userId, status: 'failed' },
        }),
      ]);

    return {
      totalVideos,
      processingVideos,
      completedVideos,
      failedVideos,
    };
  } catch (error: any) {
    console.error('Error getting video stats:', error);
    throw error;
  }
}
