import admin from 'firebase-admin';
import { logger } from '../index';

// Initialize Firebase Admin (credentials should be set via environment)
let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_CREDENTIALS) {
    const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    firebaseInitialized = true;
    logger.info('Firebase Admin initialized');
  }
} catch (error) {
  logger.warn('Firebase Admin not initialized', {
    error: (error as Error).message,
  });
}

export interface PushNotificationOptions {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: string;
  sound?: string;
}

export class PushNotificationService {
  /**
   * Send a single push notification
   */
  async sendPushNotification(options: PushNotificationOptions): Promise<boolean> {
    try {
      if (!firebaseInitialized) {
        logger.warn('Firebase not initialized, push notification not sent', {
          deviceToken: options.deviceToken,
        });
        return false;
      }

      const message = {
        notification: {
          title: options.title,
          body: options.body,
          badge: options.badge || '1',
          sound: options.sound || 'default',
        },
        data: options.data || {},
        token: options.deviceToken,
      };

      const response = await admin.messaging().send(message);

      logger.info('Push notification sent successfully', {
        deviceToken: options.deviceToken,
        messageId: response,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send push notification', {
        error: (error as Error).message,
        deviceToken: options.deviceToken,
      });
      return false;
    }
  }

  /**
   * Send birthday reminder push notification
   */
  async sendBirthdayReminderPush(
    deviceToken: string,
    contactName: string,
    daysUntil: number
  ): Promise<boolean> {
    return this.sendPushNotification({
      deviceToken,
      title: `🎂 ${contactName}'s Birthday!`,
      body: `Don't forget! ${contactName}'s birthday is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.`,
      data: {
        type: 'birthday_reminder',
        contactName,
        daysUntil: daysUntil.toString(),
      },
      badge: '1',
      sound: 'default',
    });
  }

  /**
   * Send anniversary reminder push notification
   */
  async sendAnniversaryReminderPush(
    deviceToken: string,
    contactName: string,
    daysUntil: number
  ): Promise<boolean> {
    return this.sendPushNotification({
      deviceToken,
      title: `💕 ${contactName}'s Anniversary!`,
      body: `Celebrate! ${contactName}'s anniversary is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.`,
      data: {
        type: 'anniversary_reminder',
        contactName,
        daysUntil: daysUntil.toString(),
      },
      badge: '1',
      sound: 'default',
    });
  }

  /**
   * Send custom event reminder push notification
   */
  async sendCustomEventReminderPush(
    deviceToken: string,
    eventTitle: string,
    daysUntil: number
  ): Promise<boolean> {
    return this.sendPushNotification({
      deviceToken,
      title: `📅 ${eventTitle}`,
      body: `Reminder: ${eventTitle} is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.`,
      data: {
        type: 'event_reminder',
        eventTitle,
        daysUntil: daysUntil.toString(),
      },
      badge: '1',
      sound: 'default',
    });
  }

  /**
   * Send multi-cast push notifications (to multiple devices)
   */
  async sendMulticastPushNotification(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<{ successCount: number; failureCount: number }> {
    try {
      if (!firebaseInitialized) {
        logger.warn('Firebase not initialized, multicast push notification not sent');
        return { successCount: 0, failureCount: deviceTokens.length };
      }

      const message = {
        notification: {
          title,
          body,
          badge: '1',
          sound: 'default',
        },
        data: data || {},
      };

      const response = await admin.messaging().sendMulticast({
        ...message,
        tokens: deviceTokens,
      });

      logger.info('Multicast push notifications sent', {
        successCount: response.successCount,
        failureCount: response.failureCount,
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      logger.error('Failed to send multicast push notifications', error);
      return { successCount: 0, failureCount: deviceTokens.length };
    }
  }

  /**
   * Subscribe device to topic
   */
  async subscribeToTopic(deviceTokens: string[], topic: string): Promise<boolean> {
    try {
      if (!firebaseInitialized) {
        logger.warn('Firebase not initialized, subscription not created');
        return false;
      }

      await admin.messaging().subscribeToTopic(deviceTokens, topic);

      logger.info('Devices subscribed to topic', {
        deviceCount: deviceTokens.length,
        topic,
      });

      return true;
    } catch (error) {
      logger.error('Failed to subscribe to topic', error);
      return false;
    }
  }

  /**
   * Unsubscribe device from topic
   */
  async unsubscribeFromTopic(deviceTokens: string[], topic: string): Promise<boolean> {
    try {
      if (!firebaseInitialized) {
        logger.warn('Firebase not initialized, unsubscription failed');
        return false;
      }

      await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);

      logger.info('Devices unsubscribed from topic', {
        deviceCount: deviceTokens.length,
        topic,
      });

      return true;
    } catch (error) {
      logger.error('Failed to unsubscribe from topic', error);
      return false;
    }
  }

  /**
   * Send notification to topic
   */
  async sendNotificationToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<boolean> {
    try {
      if (!firebaseInitialized) {
        logger.warn('Firebase not initialized, topic notification not sent');
        return false;
      }

      const message = {
        notification: {
          title,
          body,
          badge: '1',
          sound: 'default',
        },
        data: data || {},
        topic,
      };

      const response = await admin.messaging().send(message);

      logger.info('Topic notification sent', {
        topic,
        messageId: response,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send topic notification', error);
      return false;
    }
  }
}

export default new PushNotificationService();
