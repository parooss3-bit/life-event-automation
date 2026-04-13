import { prisma } from '../lib/prisma';

/**
 * Get dashboard analytics
 */
export async function getDashboardAnalytics() {
  try {
    const [totalUsers, activeUsers, totalSubscriptions, totalRevenue, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
        prisma.subscription.count({
          where: {
            status: { in: ['active', 'trialing'] },
          },
        }),
        getMonthlyRevenue(),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        }),
      ]);

    const subscriptionBreakdown = await getSubscriptionBreakdown();

    return {
      totalUsers,
      activeUsers,
      totalSubscriptions,
      totalRevenue,
      subscriptionBreakdown,
      recentUsers,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw error;
  }
}

/**
 * Get monthly revenue
 */
export async function getMonthlyRevenue() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trialing'] },
      },
      select: {
        tierId: true,
      },
    });

    const TIER_PRICES: Record<string, number> = {
      free: 0,
      pro: 9.99,
      business: 99.99,
    };

    const revenue = subscriptions.reduce((total, sub) => {
      return total + (TIER_PRICES[sub.tierId] || 0);
    }, 0);

    return Math.round(revenue * 100) / 100;
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    throw error;
  }
}

/**
 * Get subscription breakdown
 */
export async function getSubscriptionBreakdown() {
  try {
    const breakdown = await prisma.subscription.groupBy({
      by: ['tierId'],
      _count: true,
    });

    return breakdown.map((item) => ({
      tier: item.tierId,
      count: item._count,
    }));
  } catch (error) {
    console.error('Error getting subscription breakdown:', error);
    throw error;
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics() {
  try {
    const [totalUsers, usersThisMonth, usersThisWeek, churnRate] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        calculateChurnRate(),
      ]);

    return {
      totalUsers,
      usersThisMonth,
      usersThisWeek,
      churnRate,
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw error;
  }
}

/**
 * Calculate churn rate
 */
async function calculateChurnRate() {
  try {
    const cancelledThisMonth = await prisma.subscription.count({
      where: {
        status: 'cancelled',
        cancelledAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const activeAtMonthStart = await prisma.subscription.count({
      where: {
        status: { in: ['active', 'trialing'] },
        createdAt: {
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (activeAtMonthStart === 0) return 0;
    return Math.round((cancelledThisMonth / activeAtMonthStart) * 100);
  } catch (error) {
    console.error('Error calculating churn rate:', error);
    return 0;
  }
}

/**
 * Get all users with pagination
 */
export async function getAllUsers(page = 1, limit = 20, search?: string) {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          lastLoginAt: true,
          subscription: {
            select: {
              tierId: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * Get user details
 */
export async function getUserDetails(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contacts: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            birthday: true,
          },
        },
        events: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            eventType: true,
          },
        },
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trialing'] },
      },
      select: {
        tierId: true,
        createdAt: true,
      },
    });

    const TIER_PRICES: Record<string, number> = {
      free: 0,
      pro: 9.99,
      business: 99.99,
    };

    // Calculate MRR by tier
    const mrrByTier: Record<string, number> = {
      free: 0,
      pro: 0,
      business: 0,
    };

    subscriptions.forEach((sub) => {
      mrrByTier[sub.tierId] += TIER_PRICES[sub.tierId] || 0;
    });

    const totalMRR = Object.values(mrrByTier).reduce((a, b) => a + b, 0);
    const totalARR = totalMRR * 12;

    // Calculate growth rate
    const lastMonthSubscriptions = await prisma.subscription.count({
      where: {
        status: { in: ['active', 'trialing'] },
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const currentSubscriptions = await prisma.subscription.count({
      where: {
        status: { in: ['active', 'trialing'] },
      },
    });

    const growthRate =
      lastMonthSubscriptions > 0
        ? Math.round(
            ((currentSubscriptions - lastMonthSubscriptions) /
              lastMonthSubscriptions) *
              100
          )
        : 0;

    return {
      totalMRR: Math.round(totalMRR * 100) / 100,
      totalARR: Math.round(totalARR * 100) / 100,
      mrrByTier: {
        free: Math.round(mrrByTier.free * 100) / 100,
        pro: Math.round(mrrByTier.pro * 100) / 100,
        business: Math.round(mrrByTier.business * 100) / 100,
      },
      growthRate,
      totalSubscriptions: currentSubscriptions,
    };
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
}

/**
 * Get feature usage analytics
 */
export async function getFeatureUsageAnalytics() {
  try {
    const [totalContacts, totalEvents, totalReminders, totalGiftsSaved] =
      await Promise.all([
        prisma.contact.count(),
        prisma.event.count(),
        prisma.reminder.count(),
        prisma.gift.count({
          where: {
            status: 'saved',
          },
        }),
      ]);

    const avgContactsPerUser = await prisma.contact.groupBy({
      by: ['userId'],
      _count: true,
    });

    const avgContacts =
      avgContactsPerUser.length > 0
        ? Math.round(
            avgContactsPerUser.reduce((sum, item) => sum + item._count, 0) /
              avgContactsPerUser.length
          )
        : 0;

    return {
      totalContacts,
      totalEvents,
      totalReminders,
      totalGiftsSaved,
      avgContactsPerUser: avgContacts,
    };
  } catch (error) {
    console.error('Error getting feature usage analytics:', error);
    throw error;
  }
}

/**
 * Get system health
 */
export async function getSystemHealth() {
  try {
    const startTime = Date.now();

    // Test database connection
    await prisma.user.count();

    const dbLatency = Date.now() - startTime;

    return {
      status: 'healthy',
      database: {
        status: 'connected',
        latency: dbLatency,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error checking system health:', error);
    return {
      status: 'unhealthy',
      database: {
        status: 'disconnected',
        error: (error as Error).message,
      },
      timestamp: new Date(),
    };
  }
}

/**
 * Export user data (GDPR)
 */
export async function exportUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contacts: true,
        events: true,
        reminders: true,
        gifts: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      contacts: user.contacts,
      events: user.events,
      reminders: user.reminders,
      gifts: user.gifts,
      subscription: user.subscription,
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}

/**
 * Delete user account (GDPR)
 */
export async function deleteUserAccount(userId: string) {
  try {
    // Delete all user data
    await Promise.all([
      prisma.reminder.deleteMany({ where: { userId } }),
      prisma.gift.deleteMany({ where: { userId } }),
      prisma.event.deleteMany({ where: { userId } }),
      prisma.contact.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
    ]);

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    return { success: true };
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
}
