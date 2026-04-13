/*
 * Reviews Management
 * Handles review submission, moderation, and storage
 */

export interface Review {
  id: string;
  businessId: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  helpful: number;
}

// Mock reviews storage (in production, use backend API)
const mockReviews: Review[] = [
  {
    id: "1",
    businessId: "1",
    author: "John Doe",
    email: "john@example.com",
    rating: 5,
    title: "Excellent service!",
    content: "The team was professional and completed the work on time. Highly recommend!",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    helpful: 12,
  },
  {
    id: "2",
    businessId: "1",
    author: "Jane Smith",
    email: "jane@example.com",
    rating: 4,
    title: "Good work, fair pricing",
    content: "They fixed the issue quickly and the pricing was reasonable.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    helpful: 8,
  },
  {
    id: "3",
    businessId: "1",
    author: "Mike Johnson",
    email: "mike@example.com",
    rating: 5,
    title: "Highly professional",
    content: "Very professional team. They explained everything clearly.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    helpful: 5,
  },
];

/**
 * Get reviews for a business
 */
export function getBusinessReviews(businessId: string): Review[] {
  return mockReviews
    .filter((r) => r.businessId === businessId && r.status === "approved")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Submit a new review
 */
export function submitReview(
  businessId: string,
  author: string,
  email: string,
  rating: number,
  title: string,
  content: string
): Review {
  const review: Review = {
    id: Date.now().toString(),
    businessId,
    author,
    email,
    rating,
    title,
    content,
    createdAt: new Date().toISOString(),
    status: "pending", // Requires moderation
    helpful: 0,
  };

  mockReviews.push(review);

  // In production, send to backend API
  // POST /api/reviews with review data

  return review;
}

/**
 * Mark review as helpful
 */
export function markReviewHelpful(reviewId: string): void {
  const review = mockReviews.find((r) => r.id === reviewId);
  if (review) {
    review.helpful += 1;
  }
}

/**
 * Get pending reviews for moderation
 */
export function getPendingReviews(): Review[] {
  return mockReviews.filter((r) => r.status === "pending");
}

/**
 * Approve a review
 */
export function approveReview(reviewId: string): void {
  const review = mockReviews.find((r) => r.id === reviewId);
  if (review) {
    review.status = "approved";
  }
}

/**
 * Reject a review
 */
export function rejectReview(reviewId: string): void {
  const review = mockReviews.find((r) => r.id === reviewId);
  if (review) {
    review.status = "rejected";
  }
}

/**
 * Check if review content is spam/inappropriate
 */
export function isSpamOrInappropriate(content: string): boolean {
  // Simple spam detection (in production, use ML or third-party service)
  const spamPatterns = [
    /viagra|cialis|casino|lottery/i,
    /click here|buy now|limited offer/i,
    /(http|https):\/\//i, // URLs in review content
  ];

  return spamPatterns.some((pattern) => pattern.test(content));
}

/**
 * Validate review submission
 */
export function validateReview(
  author: string,
  email: string,
  rating: number,
  title: string,
  content: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!author || author.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (rating < 1 || rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  if (!title || title.trim().length < 5) {
    errors.push("Title must be at least 5 characters");
  }

  if (!content || content.trim().length < 10) {
    errors.push("Review must be at least 10 characters");
  }

  if (isSpamOrInappropriate(content)) {
    errors.push("Review contains inappropriate content");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate average rating
 */
export function calculateAverageRating(businessId: string): number {
  const reviews = getBusinessReviews(businessId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Get rating distribution
 */
export function getRatingDistribution(businessId: string): Record<number, number> {
  const reviews = getBusinessReviews(businessId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    distribution[r.rating]++;
  });

  return distribution;
}
