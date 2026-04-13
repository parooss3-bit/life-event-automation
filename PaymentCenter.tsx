import { useState } from "react";
import { DollarSign, Download, Eye, CheckCircle, AlertCircle } from "lucide-react";
import {
  getBuyerInvoiceHistory,
  getSellerPayoutHistory,
  calculateSellerEarnings,
  type Invoice,
  type SellerPayout,
} from "@/lib/stripePayments";

interface PaymentCenterProps {
  userId: string;
  userRole: "buyer" | "seller";
}

export function PaymentCenter({ userId, userRole }: PaymentCenterProps) {
  const [activeTab, setActiveTab] = useState<"invoices" | "payouts" | "earnings">(
    userRole === "buyer" ? "invoices" : "payouts"
  );

  const invoices = getBuyerInvoiceHistory(userId);
  const payouts = getSellerPayoutHistory(userId);
  const earnings = calculateSellerEarnings(userId);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {userRole === "buyer" && (
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "invoices"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Invoices
          </button>
        )}
        {userRole === "seller" && (
          <>
            <button
              onClick={() => setActiveTab("payouts")}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === "payouts"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === "earnings"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Earnings
            </button>
          </>
        )}
      </div>

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Your Invoices</h3>
          {invoices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-600">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Your Payouts</h3>
          {payouts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-600">No payouts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <PayoutCard key={payout.id} payout={payout} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === "earnings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EarningsCard
              label="Total Earnings"
              value={`$${earnings.totalEarnings.toLocaleString()}`}
              color="teal"
            />
            <EarningsCard
              label="Pending Payout"
              value={`$${earnings.pendingPayout.toLocaleString()}`}
              color="blue"
            />
            <EarningsCard
              label="Completed Payout"
              value={`$${earnings.completedPayout.toLocaleString()}`}
              color="green"
            />
            <EarningsCard
              label="Transactions"
              value={earnings.transactionCount.toString()}
              color="purple"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Payout Schedule</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Frequency:</strong> Weekly (Every Friday)
              </p>
              <p>
                <strong>Minimum Payout:</strong> $50
              </p>
              <p>
                <strong>Processing Time:</strong> 1-3 business days
              </p>
              <p>
                <strong>Method:</strong> Direct bank transfer via ACH
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InvoiceCardProps {
  invoice: Invoice;
}

function InvoiceCard({ invoice }: InvoiceCardProps) {
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900">{invoice.id}</p>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                statusColors[invoice.status]
              }`}
            >
              {invoice.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {invoice.transactionIds.length} transaction{invoice.transactionIds.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Due: {invoice.dueDate.toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${invoice.totalAmount.toLocaleString()}
          </p>
          <button className="mt-2 px-3 py-1 text-sm rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center gap-1 ml-auto"
            style={{ backgroundColor: "#0D7A6B" }}>
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

interface PayoutCardProps {
  payout: SellerPayout;
}

function PayoutCard({ payout }: PayoutCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: AlertCircle,
    processing: AlertCircle,
    completed: CheckCircle,
    failed: AlertCircle,
  };

  const StatusIcon = statusIcons[payout.status];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 flex-1">
          <StatusIcon className="w-5 h-5 mt-1 text-gray-400" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-900">{payout.id}</p>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                  statusColors[payout.status]
                }`}
              >
                {payout.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {payout.transactionIds.length} transaction{payout.transactionIds.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {payout.createdAt.toLocaleDateString()}
              {payout.completedAt && ` • Completed: ${payout.completedAt.toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${payout.amount.toLocaleString()}
          </p>
          <button className="mt-2 px-3 py-1 text-sm rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center gap-1 ml-auto"
            style={{ backgroundColor: "#0D7A6B" }}>
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

interface EarningsCardProps {
  label: string;
  value: string;
  color: "teal" | "blue" | "green" | "purple";
}

function EarningsCard({ label, value, color }: EarningsCardProps) {
  const colorClasses = {
    teal: "bg-teal-50 border-teal-200 text-teal-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
