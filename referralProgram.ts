/**
 * Referral Program System
 * Manages referral tracking, commission calculations, and payouts
 */

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredEmail: string;
  referredName: string;
  referralCode: string;
  status: "pending" | "active" | "completed";
  commissionRate: number; // Percentage (e.g., 20 = 20%)
  commissionAmount: number;
  referralLink: string;
  createdAt: Date;
  activatedAt?: Date;
  completedAt?: Date;
}

export interface ReferralTier {
  tier: "bronze" | "silver" | "gold" | "platinum";
  minReferrals: number;
  commissionRate: number; // Percentage
  bonusPercentage: number; // Additional bonus percentage
  benefits: string[];
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  currentTier: string;
  nextTierIn: number;
}

// Referral tiers
const REFERRAL_TIERS: ReferralTier[] = [
  {
    tier: "bronze",
    minReferrals: 0,
    commissionRate: 15,
    bonusPercentage: 0,
    benefits: ["15% commission on referred subscriptions"],
  },
  {
    tier: "silver",
    minReferrals: 5,
    commissionRate: 20,
    bonusPercentage: 5,
    benefits: [
      "20% commission on referred subscriptions",
      "5% bonus on all referral earnings",
      "Priority support",
    ],
  },
  {
    tier: "gold",
    minReferrals: 15,
    commissionRate: 25,
    bonusPercentage: 10,
    benefits: [
      "25% commission on referred subscriptions",
      "10% bonus on all referral earnings",
      "Dedicated account manager",
      "Co-marketing opportunities",
    ],
  },
  {
    tier: "platinum",
    minReferrals: 50,
    commissionRate: 30,
    bonusPercentage: 15,
    benefits: [
      "30% commission on referred subscriptions",
      "15% bonus on all referral earnings",
      "Dedicated account manager",
      "Co-marketing opportunities",
      "Custom commission rates",
      "API access",
    ],
  },
];

// Mock data
const referrals: Map<string, Referral> = new Map();
const referralCodes: Map<string, string> = new Map(); // Map code to referrer ID

/**
 * Generate unique referral code
 */
function generateReferralCode(referrerId: string): string {
  const code = `REF_${referrerId.substring(0, 4).toUpperCase()}_${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
  referralCodes.set(code, referrerId);
  return code;
}

/**
 * Create a new referral
 */
export function createReferral(
  referrerId: string,
  referredEmail: string,
  referredName: string
): Referral {
  const referralCode = generateReferralCode(referrerId);
  const tier = getUserReferralTier(referrerId);
  const commissionRate = tier.commissionRate;

  const referral: Referral = {
    id: `ref_${Date.now()}`,
    referrerId,
    referredUserId: `user_${Date.now()}`,
    referredEmail,
    referredName,
    referralCode,
    status: "pending",
    commissionRate,
    commissionAmount: 0,
    referralLink: `https://servicedirectory.com/join?ref=${referralCode}`,
    createdAt: new Date(),
  };

  referrals.set(referral.id, referral);
  return referral;
}

/**
 * Activate a referral (when referred user signs up)
 */
export function activateReferral(referralCode: string): Referral | null {
  const referral = Array.from(referrals.values()).find(
    (r) => r.referralCode === referralCode
  );

  if (!referral) return null;

  referral.status = "active";
  referral.activatedAt = new Date();
  referrals.set(referral.id, referral);

  return referral;
}

/**
 * Complete a referral (when referred user makes first purchase)
 */
export function completeReferral(
  referralId: string,
  purchaseAmount: number
): Referral | null {
  const referral = referrals.get(referralId);
  if (!referral) return null;

  const tier = getUserReferralTier(referral.referrerId);
  const baseCommission = (purchaseAmount * referral.commissionRate) / 100;
  const bonus = (baseCommission * tier.bonusPercentage) / 100;
  referral.commissionAmount = baseCommission + bonus;

  referral.status = "completed";
  referral.completedAt = new Date();
  referrals.set(referralId, referral);

  return referral;
}

/**
 * Get referrer's referral tier
 */
export function getUserReferralTier(referrerId: string): ReferralTier {
  const userReferrals = Array.from(referrals.values()).filter(
    (r) => r.referrerId === referrerId && r.status === "completed"
  );

  const completedCount = userReferrals.length;

  // Find appropriate tier
  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (completedCount >= REFERRAL_TIERS[i].minReferrals) {
      return REFERRAL_TIERS[i];
    }
  }

  return REFERRAL_TIERS[0]; // Default to bronze
}

/**
 * Get referral statistics for a user
 */
export function getReferralStats(referrerId: string): ReferralStats {
  const userReferrals = Array.from(referrals.values()).filter(
    (r) => r.referrerId === referrerId
  );

  const totalReferrals = userReferrals.length;
  const activeReferrals = userReferrals.filter((r) => r.status === "active").length;
  const completedReferrals = userReferrals.filter((r) => r.status === "completed").length;
  const totalCommissions = userReferrals.reduce((sum, r) => sum + r.commissionAmount, 0);

  const currentTier = getUserReferralTier(referrerId);
  const nextTier = REFERRAL_TIERS.find((t) => t.minReferrals > completedReferrals);
  const nextTierIn = nextTier ? nextTier.minReferrals - completedReferrals : 0;

  return {
    totalReferrals,
    activeReferrals,
    completedReferrals,
    totalCommissions,
    pendingCommissions: userReferrals
      .filter((r) => r.status === "active")
      .reduce((sum, r) => sum + r.commissionAmount, 0),
    currentTier: currentTier.tier,
    nextTierIn,
  };
}

/**
 * Get all referrals for a user
 */
export function getUserReferrals(referrerId: string): Referral[] {
  return Array.from(referrals.values())
    .filter((r) => r.referrerId === referrerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get referral by code
 */
export function getReferralByCode(code: string): Referral | null {
  const referral = Array.from(referrals.values()).find((r) => r.referralCode === code);
  return referral || null;
}

/**
 * Get all referral tiers
 */
export function getReferralTiers(): ReferralTier[] {
  return REFERRAL_TIERS;
}

/**
 * Calculate commission for a purchase
 */
export function calculateCommission(
  referrerId: string,
  purchaseAmount: number
): { baseCommission: number; bonus: number; total: number } {
  const tier = getUserReferralTier(referrerId);
  const baseCommission = (purchaseAmount * tier.commissionRate) / 100;
  const bonus = (baseCommission * tier.bonusPercentage) / 100;

  return {
    baseCommission,
    bonus,
    total: baseCommission + bonus,
  };
}

/**
 * Get platform referral metrics
 */
export function getPlatformReferralMetrics(): {
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  totalCommissionsDistributed: number;
  averageCommissionPerReferral: number;
} {
  const allReferrals = Array.from(referrals.values());
  const totalReferrals = allReferrals.length;
  const activeReferrals = allReferrals.filter((r) => r.status === "active").length;
  const completedReferrals = allReferrals.filter((r) => r.status === "completed").length;
  const totalCommissionsDistributed = allReferrals.reduce(
    (sum, r) => sum + r.commissionAmount,
    0
  );
  const averageCommissionPerReferral =
    completedReferrals > 0 ? totalCommissionsDistributed / completedReferrals : 0;

  return {
    totalReferrals,
    activeReferrals,
    completedReferrals,
    totalCommissionsDistributed,
    averageCommissionPerReferral,
  };
}

/**
 * Get top referrers
 */
export function getTopReferrers(limit = 10): Array<{
  referrerId: string;
  completedReferrals: number;
  totalCommissions: number;
  tier: string;
}> {
  const referrerStats: Map<
    string,
    {
      referrerId: string;
      completedReferrals: number;
      totalCommissions: number;
      tier: string;
    }
  > = new Map();

  Array.from(referrals.values()).forEach((referral) => {
    if (!referrerStats.has(referral.referrerId)) {
      referrerStats.set(referral.referrerId, {
        referrerId: referral.referrerId,
        completedReferrals: 0,
        totalCommissions: 0,
        tier: getUserReferralTier(referral.referrerId).tier,
      });
    }

    const stats = referrerStats.get(referral.referrerId)!;
    if (referral.status === "completed") {
      stats.completedReferrals++;
      stats.totalCommissions += referral.commissionAmount;
    }
  });

  return Array.from(referrerStats.values())
    .sort((a, b) => b.totalCommissions - a.totalCommissions)
    .slice(0, limit);
}
