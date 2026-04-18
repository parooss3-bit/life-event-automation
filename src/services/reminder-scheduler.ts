import cron from 'node-cron';
import { prisma, logger } from '../index';
import emailService from './email';
import smsService from './sms';
import pushService from './push';

export class ReminderSchedulerService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Initialize the reminder scheduler
   * Runs daily at 8 AM to check for upcoming events
   */
  async initialize(): Promise<void> {
    logger.info('Initializing reminder scheduler');

    // Schedule daily reminder check at 8 AM
    const dailyJob = cron.schedule('0 8 * * *', async () => {
      logger.info('Running daily reminder check');
      await this.checkAndSendReminders();
    });

    this.cronJobs.set('daily-reminder-check', dailyJob);

    // Also run on startup to catch any missed reminders
    await this.checkAndSendReminders();

    logger.info('Reminder scheduler initialized');
  }

  /**
   * Check for upcoming events and send reminders
   */
  async checkAndSendReminders(): Promise<void> {
    try {
      const now = new Date();

      // Get all events that need reminders
      const events = await prisma.event.findMany({
        where: {
          deletedAt: null,
          status: { not: 'completed' },
        },
        include: {
          contact: true,
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              emailNotifications: true,
              smsNotifications: true,
              pushNotifications: true,
            },
          },
        },
      });

      for (const event of events) {
        // Calculate days until event
        const daysUntilEvent = Math.ceil(
          (event.eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if reminder should be sent
        if (daysUntilEvent === event.reminderDaysBefore) {
          await this.sendEventReminders(event);
        }
      }

      logger.info('Daily reminder check completed', {
        eventsChecked: events.length,
      });
    } catch (error) {
      logger.error('Error checking reminders', error);
    }
  }

  /**
   * Send reminders for a specific event
   */
  private async sendEventReminders(event: any): Promise<void> {
    try {
      const user = event.user;
      const contact = event.contact;
      const daysUntil = event.reminderDaysBefore;

      logger.info('Sending reminders for event', {
        eventId: event.id,
        eventType: event.eventType,
        userId: user.id,
      });

      // Prepare reminder data
      const reminderData = {
        eventId: event.id,
        userId: user.id,
        contactName: `${contact.firstName} ${contact.lastName}`,
        eventType: event.eventType,
        daysUntil,
      };

      // Send email reminder
      if (user.emailNotifications && user.email) {
        await this.sendEmailReminder(user.email, event, reminderData);
      }

      // Send SMS reminder
      if (user.smsNotifications && user.phone) {
        await this.sendSMSReminder(user.phone, event, reminderData);
      }

      // Send push notification
      if (user.pushNotifications) {
        await this.sendPushReminder(user.id, event, reminderData);
      }

      // Create reminder record
      await prisma.reminder.create({
        data: {
          eventId: event.id,
          userId: user.id,
          reminderDate: new Date(),
          status: 'sent',
          sentViaEmail: user.emailNotifications && user.email ? true : false,
          sentViaSMS: user.smsNotifications && user.phone ? true : false,
          sentViaPush: user.pushNotifications ? true : false,
        },
      });

      logger.info('Reminders sent successfully', reminderData);
    } catch (error) {
      logger.error('Error sending event reminders', error);
    }
  }

  /**
   * Send email reminder
   */
  private async sendEmailReminder(
    email: string,
    event: any,
    data: any
  ): Promise<void> {
    try {
      let success = false;

      if (event.eventType === 'birthday') {
        success = await emailService.sendBirthdayReminder(
          email,
          data.contactName,
          event.eventDate,
          data.daysUntil
        );
      } else if (event.eventType === 'anniversary') {
        success = await emailService.sendAnniversaryReminder(
          email,
          data.contactName,
          event.eventDate,
          data.daysUntil
        );
      } else {
        success = await emailService.sendCustomEventReminder(
          email,
          event.title,
          event.eventDate,
          data.daysUntil
        );
      }

      if (success) {
        logger.info('Email reminder sent', { email, eventId: event.id });
      }
    } catch (error) {
      logger.error('Error sending email reminder', error);
    }
  }

  /**
   * Send SMS reminder
   */
  private async sendSMSReminder(
    phone: string,
    event: any,
    data: any
  ): Promise<void> {
    try {
      let success = false;

      if (event.eventType === 'birthday') {
        success = await smsService.sendBirthdayReminderSMS(
          phone,
          data.contactName,
          data.daysUntil
        );
      } else if (event.eventType === 'anniversary') {
        success = await smsService.sendAnniversaryReminderSMS(
          phone,
          data.contactName,
          data.daysUntil
        );
      } else {
        success = await smsService.sendCustomEventReminderSMS(
          phone,
          event.title,
          data.daysUntil
        );
      }

      if (success) {
        logger.info('SMS reminder sent', { phone, eventId: event.id });
      }
    } catch (error) {
      logger.error('Error sending SMS reminder', error);
    }
  }

  /**
   * Send push notification reminder
   */
  private async sendPushReminder(
    userId: string,
    event: any,
    data: any
  ): Promise<void> {
    try {
      // Get user's device tokens
      const devices = await prisma.userDevice.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          deviceToken: true,
        },
      });

      if (devices.length === 0) {
        logger.info('No active devices for push notification', { userId });
        return;
      }

      for (const device of devices) {
        let success = false;

        if (event.eventType === 'birthday') {
          success = await pushService.sendBirthdayReminderPush(
            device.deviceToken,
            data.contactName,
            data.daysUntil
          );
        } else if (event.eventType === 'anniversary') {
          success = await pushService.sendAnniversaryReminderPush(
            device.deviceToken,
            data.contactName,
            data.daysUntil
          );
        } else {
          success = await pushService.sendCustomEventReminderPush(
            device.deviceToken,
            event.title,
            data.daysUntil
          );
        }

        if (success) {
          logger.info('Push reminder sent', { userId, eventId: event.id });
        }
      }
    } catch (error) {
      logger.error('Error sending push reminder', error);
    }
  }

  /**
   * Send immediate reminder for an event
   */
  async sendImmediateReminder(eventId: string): Promise<boolean> {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          contact: true,
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              emailNotifications: true,
              smsNotifications: true,
              pushNotifications: true,
            },
          },
        },
      });

      if (!event) {
        logger.warn('Event not found for immediate reminder', { eventId });
        return false;
      }

      const now = new Date();
      const daysUntil = Math.ceil(
        (event.eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const reminderData = {
        eventId: event.id,
        userId: event.user.id,
        contactName: `${event.contact.firstName} ${event.contact.lastName}`,
        eventType: event.eventType,
        daysUntil,
      };

      await this.sendEventReminders(event);

      return true;
    } catch (error) {
      logger.error('Error sending immediate reminder', error);
      return false;
    }
  }

  /**
   * Stop the reminder scheduler
   */
  async stop(): Promise<void> {
    for (const [name, job] of this.cronJobs) {
      job.stop();
      logger.info('Stopped cron job', { name });
    }
    this.cronJobs.clear();
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    isRunning: boolean;
    jobs: string[];
  } {
    return {
      isRunning: this.cronJobs.size > 0,
      jobs: Array.from(this.cronJobs.keys()),
    };
  }
}

export default new ReminderSchedulerService();
