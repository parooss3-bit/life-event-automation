/**
 * Stripe Payment Processing System
 * Handles lead purchases, invoicing, and seller payouts
 */

export interface PaymentTransaction {
  id: string;
  buyerId: string;
  sellerId: string;
  leadId: string;
  amount: number;
  commission: number; // Platform commission (20%)
  sellerPayout: number; // Seller receives 80%
  status: "pending" | "completed" | "failed" | "refunded";
  stripePaymentIntentId: string;
  invoiceId: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Invoice {
  id: string;
  buyerId: string;
  transactionIds: string[];
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
  stripeInvoiceId: string;
}

export interface SellerPayout {
  id: string;
  sellerId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  stripePayoutId: string;
  transactionIds: string[];
  createdAt: Date;
  completedAt?: Date;
}

// Mock data for development
const payments: Map<string, PaymentTransaction> = new Map();
const invoices: Map<string, Invoice> = new Map();
const payouts: Map<string, SellerPayout> = new Map();

/**
 * Create a payment transaction for lead purchase
 */
export function createPaymentTransaction(
  buyerId: string,
  sellerId: string,
  leadId: string,
  amount: number
): PaymentTransaction {
  const commission = amount * 0.2; // 20% platform commission
  const sellerPayout = amount * 0.8; // 80% to seller

  const transaction: PaymentTransaction = {
    id: `txn_${Date.now()}`,
    buyerId,
    sellerId,
    leadId,
    amount,
    commission,
    sellerPayout,
    status: "pending",
    stripePaymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
    invoiceId: `inv_${Date.now()}`,
    createdAt: new Date(),
  };

  payments.set(transaction.id, transaction);
  return transaction;
}

/**
 * Complete a payment transaction
 */
export function completePayment(transactionId: string): PaymentTransaction | null {
  const transaction = payments.get(transactionId);
  if (!transaction) return null;

  transaction.status = "completed";
  transaction.completedAt = new Date();
  payments.set(transactionId, transaction);

  // Trigger payout processing
  processPayout(transaction.sellerId, transaction.sellerPayout, transactionId);

  return transaction;
}

/**
 * Create an invoice for multiple transactions
 */
export function createInvoice(
  buyerId: string,
  transactionIds: string[]
): Invoice | null {
  const transactions = transactionIds
    .map((id) => payments.get(id))
    .filter((t) => t !== undefined) as PaymentTransaction[];

  if (transactions.length === 0) return null;

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

  const invoice: Invoice = {
    id: `inv_${Date.now()}`,
    buyerId,
    transactionIds,
    totalAmount,
    status: "sent",
    dueDate,
    createdAt: new Date(),
    stripeInvoiceId: `in_${Math.random().toString(36).substr(2, 9)}`,
  };

  invoices.set(invoice.id, invoice);
  return invoice;
}

/**
 * Mark invoice as paid
 */
export function markInvoiceAsPaid(invoiceId: string): Invoice | null {
  const invoice = invoices.get(invoiceId);
  if (!invoice) return null;

  invoice.status = "paid";
  invoice.paidAt = new Date();
  invoices.set(invoiceId, invoice);

  return invoice;
}

/**
 * Process seller payout
 */
export function processPayout(
  sellerId: string,
  amount: number,
  transactionId: string
): SellerPayout {
  const payout: SellerPayout = {
    id: `payout_${Date.now()}`,
    sellerId,
    amount,
    status: "pending",
    stripePayoutId: `po_${Math.random().toString(36).substr(2, 9)}`,
    transactionIds: [transactionId],
    createdAt: new Date(),
  };

  payouts.set(payout.id, payout);
  return payout;
}

/**
 * Complete seller payout
 */
export function completePayout(payoutId: string): SellerPayout | null {
  const payout = payouts.get(payoutId);
  if (!payout) return null;

  payout.status = "completed";
  payout.completedAt = new Date();
  payouts.set(payoutId, payout);

  return payout;
}

/**
 * Get seller payout history
 */
export function getSellerPayoutHistory(sellerId: string): SellerPayout[] {
  return Array.from(payouts.values()).filter((p) => p.sellerId === sellerId);
}

/**
 * Get buyer invoice history
 */
export function getBuyerInvoiceHistory(buyerId: string): Invoice[] {
  return Array.from(invoices.values()).filter((i) => i.buyerId === buyerId);
}

/**
 * Get payment transaction details
 */
export function getPaymentTransaction(transactionId: string): PaymentTransaction | null {
  return payments.get(transactionId) || null;
}

/**
 * Calculate seller earnings
 */
export function calculateSellerEarnings(sellerId: string): {
  totalEarnings: number;
  pendingPayout: number;
  completedPayout: number;
  transactionCount: number;
} {
  const payoutHistory = getSellerPayoutHistory(sellerId);

  const totalEarnings = payoutHistory.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayout = payoutHistory
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const completedPayout = payoutHistory
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalEarnings,
    pendingPayout,
    completedPayout,
    transactionCount: payoutHistory.length,
  };
}

/**
 * Get platform revenue metrics
 */
export function getPlatformRevenueMetrics(): {
  totalRevenue: number;
  totalPayouts: number;
  platformCommission: number;
  transactionCount: number;
} {
  const allPayments = Array.from(payments.values());
  const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPayouts = allPayments.reduce((sum, p) => sum + p.sellerPayout, 0);
  const platformCommission = totalRevenue - totalPayouts;

  return {
    totalRevenue,
    totalPayouts,
    platformCommission,
    transactionCount: allPayments.length,
  };
}
