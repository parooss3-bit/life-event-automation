/**
 * Business Claim & Verification System
 * Handles business ownership verification via email
 */

export interface ClaimRequest {
  id: string;
  businessId: string;
  businessName: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  verificationCode: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  verifiedAt?: Date;
  expiresAt: Date;
}

export interface VerifiedBusiness {
  id: string;
  businessId: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  verifiedAt: Date;
  canEditProfile: boolean;
  canViewAnalytics: boolean;
  canManageLeads: boolean;
}

// Mock data
const claimRequests: Map<string, ClaimRequest> = new Map();
const verifiedBusinesses: Map<string, VerifiedBusiness> = new Map();

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Submit a claim request for a business
 */
export function submitClaimRequest(
  businessId: string,
  businessName: string,
  ownerEmail: string,
  ownerName: string,
  phone: string
): ClaimRequest {
  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const claimRequest: ClaimRequest = {
    id: `claim_${Date.now()}`,
    businessId,
    businessName,
    ownerEmail,
    ownerName,
    phone,
    verificationCode,
    status: 'pending',
    createdAt: new Date(),
    expiresAt,
  };

  claimRequests.set(claimRequest.id, claimRequest);

  // In production, send verification email here
  console.log(`[EMAIL] Verification code for ${businessName}: ${verificationCode}`);

  return claimRequest;
}

/**
 * Verify a business ownership claim
 */
export function verifyClaimRequest(
  claimId: string,
  verificationCode: string
): { success: boolean; message: string; verified?: VerifiedBusiness } {
  const claim = claimRequests.get(claimId);

  if (!claim) {
    return { success: false, message: 'Claim request not found' };
  }

  if (claim.status !== 'pending') {
    return { success: false, message: 'Claim request already processed' };
  }

  if (new Date() > claim.expiresAt) {
    claim.status = 'rejected';
    return { success: false, message: 'Verification code expired' };
  }

  if (claim.verificationCode !== verificationCode) {
    return { success: false, message: 'Invalid verification code' };
  }

  claim.status = 'verified';
  claim.verifiedAt = new Date();

  const verifiedBusiness: VerifiedBusiness = {
    id: `verified_${Date.now()}`,
    businessId: claim.businessId,
    ownerEmail: claim.ownerEmail,
    ownerName: claim.ownerName,
    phone: claim.phone,
    verifiedAt: claim.verifiedAt,
    canEditProfile: true,
    canViewAnalytics: true,
    canManageLeads: true,
  };

  verifiedBusinesses.set(claim.businessId, verifiedBusiness);

  return {
    success: true,
    message: 'Business verified successfully',
    verified: verifiedBusiness,
  };
}

/**
 * Get verified business info
 */
export function getVerifiedBusiness(businessId: string): VerifiedBusiness | null {
  return verifiedBusinesses.get(businessId) || null;
}

/**
 * Check if business is verified
 */
export function isBusinessVerified(businessId: string): boolean {
  return verifiedBusinesses.has(businessId);
}

/**
 * Get all claim requests (admin only)
 */
export function getAllClaimRequests(): ClaimRequest[] {
  return Array.from(claimRequests.values());
}

/**
 * Get pending claim requests
 */
export function getPendingClaimRequests(): ClaimRequest[] {
  return Array.from(claimRequests.values()).filter(
    (claim) => claim.status === 'pending'
  );
}
