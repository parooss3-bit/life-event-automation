import sgMail from '@sendgrid/mail';
import { logger } from '../index';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export class EmailService {
  private fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@momentremind.com';

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const msg = {
        to: options.to,
        from: options.from || this.fromEmail,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      };

      await sgMail.send(msg);

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send email', {
        error: (error as Error).message,
        to: options.to,
      });
      return false;
    }
  }

  /**
   * Send birthday reminder email
   */
  async sendBirthdayReminder(
    userEmail: string,
    contactName: string,
    eventDate: Date,
    daysUntil: number
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">🎂 Birthday Reminder</h1>
        </div>

        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px;">
          <p style="font-size: 16px; color: #333;">Hi there!</p>
          
          <p style="font-size: 16px; color: #333;">
            <strong>${contactName}'s birthday</strong> is coming up in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong>!
          </p>

          <p style="font-size: 14px; color: #666;">
            <strong>Date:</strong> ${eventDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #333;">
              Don't forget to reach out and make their day special! 🎉
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <a href="${process.env.FRONTEND_URL}/events" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Event Details
            </a>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 10px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            © 2026 MomentRemind. All rights reserved.
          </p>
          <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
            <a href="${process.env.FRONTEND_URL}/settings/notifications" style="color: #999; text-decoration: none;">
              Manage notification preferences
            </a>
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🎂 ${contactName}'s birthday is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`,
      html,
      text: `${contactName}'s birthday is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}! Don't forget to reach out.`,
    });
  }

  /**
   * Send anniversary reminder email
   */
  async sendAnniversaryReminder(
    userEmail: string,
    contactName: string,
    eventDate: Date,
    daysUntil: number,
    years?: number
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">💕 Anniversary Reminder</h1>
        </div>

        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px;">
          <p style="font-size: 16px; color: #333;">Hi there!</p>
          
          <p style="font-size: 16px; color: #333;">
            <strong>${contactName}'s anniversary</strong> is coming up in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong>!
          </p>

          <p style="font-size: 14px; color: #666;">
            <strong>Date:</strong> ${eventDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            ${years ? `<br/><strong>Years:</strong> ${years}` : ''}
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #dc3545; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #333;">
              Celebrate this special milestone! 🎉
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <a href="${process.env.FRONTEND_URL}/events" style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Event Details
            </a>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 10px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            © 2026 MomentRemind. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `💕 ${contactName}'s anniversary is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`,
      html,
      text: `${contactName}'s anniversary is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}! Celebrate this special milestone.`,
    });
  }

  /**
   * Send custom event reminder email
   */
  async sendCustomEventReminder(
    userEmail: string,
    eventTitle: string,
    eventDate: Date,
    daysUntil: number
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">📅 Event Reminder</h1>
        </div>

        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px;">
          <p style="font-size: 16px; color: #333;">Hi there!</p>
          
          <p style="font-size: 16px; color: #333;">
            <strong>${eventTitle}</strong> is coming up in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong>!
          </p>

          <p style="font-size: 14px; color: #666;">
            <strong>Date:</strong> ${eventDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <a href="${process.env.FRONTEND_URL}/events" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Event Details
            </a>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 10px; text-align: center;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            © 2026 MomentRemind. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `📅 ${eventTitle} is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`,
      html,
      text: `${eventTitle} is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail: string, firstName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #007bff; padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to MomentRemind! 🎉</h1>
        </div>

        <div style="padding: 30px 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for joining MomentRemind! We're excited to help you never miss an important moment with the people you care about.
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #333;">Getting Started:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>Connect your Facebook account to import friends and birthdays</li>
              <li>Add custom events for important dates</li>
              <li>Receive reminders via email, SMS, or push notifications</li>
              <li>Explore gift recommendations for special occasions</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 32px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Get Started
            </a>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 10px; text-align: center;">
            <p style="font-size: 12px; color: #666; margin: 0;">
              Questions? Visit our <a href="${process.env.FRONTEND_URL}/help" style="color: #007bff; text-decoration: none;">Help Center</a>
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to MomentRemind! 🎉',
      html,
      text: 'Welcome to MomentRemind! We are excited to help you never miss an important moment.',
    });
  }

  /**
   * Send batch emails
   */
  async sendBatchEmails(emails: EmailOptions[]): Promise<number> {
    let successCount = 0;

    for (const email of emails) {
      const success = await this.sendEmail(email);
      if (success) {
        successCount++;
      }
    }

    logger.info('Batch emails sent', {
      total: emails.length,
      successful: successCount,
      failed: emails.length - successCount,
    });

    return successCount;
  }
}

export default new EmailService();
