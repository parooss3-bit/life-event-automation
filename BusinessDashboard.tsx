import { useState } from "react";
import { BarChart3, TrendingUp, ShoppingCart, Settings } from "lucide-react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { LeadMarketplace } from "@/components/LeadMarketplace";
import { BusinessClaimForm } from "@/components/BusinessClaimForm";
import { isBusinessVerified } from "@/lib/businessClaim";

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "marketplace" | "settings">("analytics");
  const [isClaimed, setIsClaimed] = useState(false);
  const businessId = "1"; // In production, get from auth context
  const userId = "user_1"; // In production, get from auth context

  // Check if business is verified
  const isVerified = isBusinessVerified(businessId);

  if (!isVerified && !isClaimed) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Claim Your Business
            </h1>
            <p className="text-gray-600 mb-8">
              Verify your business ownership to unlock analytics, manage your profile, and access the lead marketplace.
            </p>

            <BusinessClaimForm
              businessId={businessId}
              businessName="ABC Plumbing"
              onSuccess={() => setIsClaimed(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-6xl py-6">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Business Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage your profile, analytics, and leads</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-6xl">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "marketplace"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Lead Marketplace
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl py-12">
        {activeTab === "analytics" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Performance Analytics
            </h2>
            <AnalyticsDashboard businessId={businessId} />
          </div>
        )}

        {activeTab === "marketplace" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Lead Marketplace
            </h2>
            <LeadMarketplace userId={userId} userRole="buyer" />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Business Settings
            </h2>

            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue="ABC Plumbing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="(415) 555-1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contact@abcplumbing.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    defaultValue="Professional plumbing services for residential and commercial properties."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: "#0D7A6B" }}
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Subscription */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Subscription</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Current Plan: <strong>Premium</strong></p>
                  <p className="text-sm text-gray-600 mt-1">$49/month • Renews on April 15, 2026</p>
                </div>
                <button className="px-4 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
