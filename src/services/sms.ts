import twilio from 'twilio';
import { logger } from '../index';

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_PLACEHOLDER';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'auth_placeholder';
const fromPhone = process.env.TWILIO_PHONE_NUMBER || '';

let client: any = null;
try {
  if (accountSid !== 'AC_PLACEHOLDER' && authToken !== 'auth_placeholder') {
    client = twilio(accountSid, authToken);
  }
} catch (error) {
  console.warn('Twilio client initialization failed, SMS features disabled');
}

export interface SMSOptions {
  to: string;
  message: string;
}

export class SMSService {
  /**
   * Send a single SMS
   */
  async sendSMS(options: SMSOptions): Promise<boolean> {
    try {
      if (!accountSid || !authToken || !fromPhone) {
        logger.warn('Twilio credentials not configured, SMS not sent', {
          to: options.to,
        });
        return false;
      }

      const message = await client.messages.create({
        body: options.message,
        from: fromPhone,
        to: options.to,
      });

      logger.info('SMS sent successfully', {
        to: options.to,
        messageId: message.sid,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send SMS', {
        error: (error as Error).message,
        to: options.to,
      });
      return false;
    }
  }

  /**
   * Send birthday reminder SMS
   */
  async sendBirthdayReminderSMS(
    phoneNumber: string,
    contactName: string,
    daysUntil: number
  ): Promise<boolean> {
    const message = `🎂 Reminder: ${contactName}'s birthday is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}! Don't forget to reach out. 🎉`;

    return this.sendSMS({
      to: phoneNumber,
      message,
    });
  }

  /**
   * Send anniversary reminder SMS
   */
  async sendAnniversaryReminderSMS(
    phoneNumber: string,
    contactName: string,
    daysUntil: number
  ): Promise<boolean> {
    const message = `💕 Reminder: ${contactName}'s anniversary is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}! Celebrate this special milestone. 🎉`;

    return this.sendSMS({
      to: phoneNumber,
      message,
    });
  }

  /**
   * Send custom event reminder SMS
   */
  async sendCustomEventReminderSMS(
    phoneNumber: string,
    eventTitle: string,
    daysUntil: number
  ): Promise<boolean> {
    const message = `📅 Reminder: ${eventTitle} is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`;

    return this.sendSMS({
      to: phoneNumber,
      message,
    });
  }

  /**
   * Send batch SMS
   */
  async sendBatchSMS(messages: SMSOptions[]): Promise<number> {
    let successCount = 0;

    for (const msg of messages) {
      const success = await this.sendSMS(msg);
      if (success) {
        successCount++;
      }
    }

    logger.info('Batch SMS sent', {
      total: messages.length,
      successful: successCount,
      failed: messages.length - successCount,
    });

    return successCount;
  }

  /**
   * Check SMS delivery status
   */
  async checkSMSStatus(messageSid: string): Promise<string | null> {
    try {
      const message = await client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      logger.error('Failed to check SMS status', error);
      return null;
    }
  }
}

export default new SMSService();
