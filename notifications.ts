/**
 * Real-time Notification System
 * Handles alerts for messages, reviews, and leads
 */

export type NotificationType = "message" | "review" | "lead" | "payout" | "referral";
export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  relatedId: string; // ID of the related item (message, review, lead, etc.)
  relatedType: string; // Type of related item
  status: NotificationStatus;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageAlerts: boolean;
  reviewAlerts: boolean;
  leadAlerts: boolean;
  payoutAlerts: boolean;
  referralAlerts: boolean;
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string; // HH:mm format
}

// Mock data
const notifications: Map<string, Notification> = new Map();
const preferences: Map<string, NotificationPreferences> = new Map();

/**
 * Create a new notification
 */
export function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  description: string,
  relatedId: string,
  relatedType: string,
  actionUrl?: string
): Notification {
  const notification: Notification = {
    id: `notif_${Date.now()}`,
    userId,
    type,
    title,
    description,
    relatedId,
    relatedType,
    status: "unread",
    actionUrl,
    createdAt: new Date(),
  };

  notifications.set(notification.id, notification);

  // Trigger delivery based on preferences
  deliverNotification(notification);

  return notification;
}

/**
 * Create message notification
 */
export function notifyNewMessage(
  userId: string,
  senderId: string,
  senderName: string,
  messagePreview: string
): Notification {
  return createNotification(
    userId,
    "message",
    `New message from ${senderName}`,
    messagePreview,
    senderId,
    "user",
    `/messages/${senderId}`
  );
}

/**
 * Create review notification
 */
export function notifyNewReview(
  userId: string,
  businessId: string,
  businessName: string,
  rating: number,
  reviewText: string
): Notification {
  return createNotification(
    userId,
    "review",
    `New ${rating}-star review on ${businessName}`,
    reviewText.substring(0, 100),
    businessId,
    "business",
    `/business/${businessId}#reviews`
  );
}

/**
 * Create lead notification
 */
export function notifyNewLead(
  userId: string,
  leadId: string,
  category: string,
  location: string,
  leadValue: number
): Notification {
  return createNotification(
    userId,
    "lead",
    `New ${category} lead in ${location}`,
    `Potential value: $${leadValue}`,
    leadId,
    "lead",
    `/leads/${leadId}`
  );
}

/**
 * Create payout notification
 */
export function notifyPayoutProcessed(
  userId: string,
  payoutId: string,
  amount: number
): Notification {
  return createNotification(
    userId,
    "payout",
    `Payout processed: $${amount}`,
    `Your payout has been sent to your bank account.`,
    payoutId,
    "payout",
    `/dashboard/payouts/${payoutId}`
  );
}

/**
 * Create referral notification
 */
export function notifyReferralEarning(
  userId: string,
  referralId: string,
  referredUserName: string,
  commission: number
): Notification {
  return createNotification(
    userId,
    "referral",
    `Referral commission earned: $${commission}`,
    `${referredUserName} joined through your referral link.`,
    referralId,
    "referral",
    `/dashboard/referrals`
  );
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(notificationId: string): Notification | null {
  const notification = notifications.get(notificationId);
  if (!notification) return null;

  notification.status = "read";
  notification.readAt = new Date();
  notifications.set(notificationId, notification);

  return notification;
}

/**
 * Archive notification
 */
export function archiveNotification(notificationId: string): Notification | null {
  const notification = notifications.get(notificationId);
  if (!notification) return null;

  notification.status = "archived";
  notifications.set(notificationId, notification);

  return notification;
}

/**
 * Get user notifications
 */
export function getUserNotifications(
  userId: string,
  status?: NotificationStatus,
  limit = 20
): Notification[] {
  return Array.from(notifications.values())
    .filter((n) => n.userId === userId && (!status || n.status === status))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

/**
 * Get unread notification count
 */
export function getUnreadCount(userId: string): number {
  return Array.from(notifications.values()).filter(
    (n) => n.userId === userId && n.status === "unread"
  ).length;
}

/**
 * Get or create notification preferences
 */
export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (!preferences.has(userId)) {
    preferences.set(userId, {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      messageAlerts: true,
      reviewAlerts: true,
      leadAlerts: true,
      payoutAlerts: true,
      referralAlerts: true,
    });
  }
  return preferences.get(userId)!;
}

/**
 * Update notification preferences
 */
export function updateNotificationPreferences(
  userId: string,
  updates: Partial<NotificationPreferences>
): NotificationPreferences {
  const prefs = getNotificationPreferences(userId);
  const updated = { ...prefs, ...updates, userId };
  preferences.set(userId, updated);
  return updated;
}

/**
 * Deliver notification based on preferences and quiet hours
 */
function deliverNotification(notification: Notification): void {
  const prefs = getNotificationPreferences(notification.userId);

  // Check if notifications are enabled
  if (!prefs.emailNotifications && !prefs.pushNotifications) {
    return;
  }

  // Check type-specific preferences
  const typeEnabled = {
    message: prefs.messageAlerts,
    review: prefs.reviewAlerts,
    lead: prefs.leadAlerts,
    payout: prefs.payoutAlerts,
    referral: prefs.referralAlerts,
  }[notification.type];

  if (!typeEnabled) {
    return;
  }

  // Check quiet hours
  if (prefs.quietHoursStart && prefs.quietHoursEnd) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    if (currentTime >= prefs.quietHoursStart && currentTime <= prefs.quietHoursEnd) {
      // During quiet hours - only store, don't send
      return;
    }
  }

  // Send notifications (in production, integrate with email/push services)
  if (prefs.emailNotifications) {
    sendEmailNotification(notification);
  }

  if (prefs.pushNotifications) {
    sendPushNotification(notification);
  }
}

/**
 * Send email notification (mock)
 */
function sendEmailNotification(notification: Notification): void {
  console.log(`[EMAIL] Sending to user ${notification.userId}: ${notification.title}`);
  // In production: integrate with SendGrid, Mailgun, etc.
}

/**
 * Send push notification (mock)
 */
function sendPushNotification(notification: Notification): void {
  console.log(`[PUSH] Sending to user ${notification.userId}: ${notification.title}`);
  // In production: integrate with Firebase Cloud Messaging, OneSignal, etc.
}

/**
 * Get notification statistics
 */
export function getNotificationStats(userId: string): {
  unreadCount: number;
  totalCount: number;
  byType: Record<NotificationType, number>;
} {
  const userNotifications = Array.from(notifications.values()).filter(
    (n) => n.userId === userId
  );

  const byType: Record<NotificationType, number> = {
    message: 0,
    review: 0,
    lead: 0,
    payout: 0,
    referral: 0,
  };

  userNotifications.forEach((n) => {
    byType[n.type]++;
  });

  return {
    unreadCount: userNotifications.filter((n) => n.status === "unread").length,
    totalCount: userNotifications.length,
    byType,
  };
}
