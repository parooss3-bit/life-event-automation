import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  stripePriceId: string;
  features: string[];
  maxContacts: number;
  maxEvents: number;
  maxReminders: number;
  aiVideoGeneration: boolean;
  giftRecommendations: boolean;
}

// Define subscription tiers
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    stripePriceId: '',
    features: [
      'Up to 10 contacts',
      'Basic event reminders',
      'Email notifications',
      'Mobile app access',
    ],
    maxContacts: 10,
    maxEvents: 50,
    maxReminders: 100,
    aiVideoGeneration: false,
    giftRecommendations: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    billingCycle: 'monthly',
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
    features: [
      'Unlimited contacts',
      'Advanced reminders (email, SMS, push)',
      'AI video generation',
      'Smart gift recommendations',
      'Gift budget tracking',
      'Priority support',
    ],
    maxContacts: 10000,
    maxEvents: 100000,
    maxReminders: 1000000,
    aiVideoGeneration: true,
    giftRecommendations: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 99.99,
    billingCycle: 'monthly',
    stripePriceId: process.env.STRIPE_PRICE_ID_BUSINESS_MONTHLY || '',
    features: [
      'Everything in Pro',
      'Multi-user accounts',
      'Team management',
      'Advanced analytics',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
    maxContacts: 100000,
    maxEvents: 1000000,
    maxReminders: 10000000,
    aiVideoGeneration: true,
    giftRecommendations: true,
  },
};

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer(
  userId: string,
  email: string,
  name: string
) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Save Stripe customer ID to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  tierId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tier = SUBSCRIPTION_TIERS[tierId];
    if (!tier) {
      throw new Error('Invalid subscription tier');
    }

    // If user doesn't have a Stripe customer ID, create one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, user.name);
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tierId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}

/**
 * Handle subscription created or updated
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Get the price ID from the subscription
  const priceId = subscription.items.data[0]?.price.id;
  let tierId = 'free';

  // Find which tier this price belongs to
  for (const [id, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (tier.stripePriceId === priceId) {
      tierId = id;
      break;
    }
  }

  // Update user subscription
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      tierId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      tierId,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

/**
 * Handle subscription cancelled
 */
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Update subscription to free tier
  await prisma.subscription.update({
    where: { userId },
    data: {
      tierId: 'free',
      status: 'cancelled',
      cancelledAt: new Date(),
    },
  });
}

/**
 * Handle payment succeeded
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId;
  if (!userId) return;

  // Update subscription status
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    await handleSubscriptionUpdate(subscription);
  }
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId;
  if (!userId) return;

  console.error(`Payment failed for user ${userId}`);
  // Could send email notification here
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // Return free tier by default
      return {
        userId,
        tierId: 'free',
        tier: SUBSCRIPTION_TIERS.free,
      };
    }

    return {
      userId,
      tierId: subscription.tierId,
      tier: SUBSCRIPTION_TIERS[subscription.tierId],
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
}

/**
 * Cancel user's subscription
 */
export async function cancelSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // Cancel at end of period
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update database
    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

/**
 * Reactivate cancelled subscription
 */
export async function reactivateSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No subscription found');
    }

    // Remove cancellation
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update database
    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: false },
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
}

/**
 * Get billing portal URL
 */
export async function getBillingPortalUrl(userId: string, returnUrl: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      throw new Error('User not found or no Stripe customer ID');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Error getting billing portal URL:', error);
    throw error;
  }
}

export default stripe;
