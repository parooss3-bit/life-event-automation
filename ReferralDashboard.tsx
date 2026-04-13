import { useState } from "react";
import { Copy, Share2, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import {
  getReferralStats,
  getUserReferrals,
  getReferralTiers,
  createReferral,
  type Referral,
  type ReferralTier,
} from "@/lib/referralProgram";

interface ReferralDashboardProps {
  userId: string;
}

export function ReferralDashboard({ userId }: ReferralDashboardProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = getReferralStats(userId);
  const referrals = getUserReferrals(userId);
  const tiers = getReferralTiers();
  const currentTier = tiers.find((t) => t.tier === stats.currentTier)!;
  const nextTier = tiers.find((t) => t.minReferrals > stats.completedReferrals);

  const referralLink = `https://servicedirectory.com/join?ref=USER_${userId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail && inviteName) {
      createReferral(userId, inviteEmail, inviteName);
      setInviteEmail("");
      setInviteName("");
      setShowInviteForm(false);
      alert("Invitation sent!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Tier */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Current Tier</h3>
            </div>
            <p className="text-3xl font-bold text-teal-600 capitalize mb-1">
              {stats.currentTier}
            </p>
            <p className="text-sm text-gray-600">{currentTier.commissionRate}% commission rate</p>
            {nextTier && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>{stats.nextTierIn}</strong> more referrals to reach{" "}
                <strong className="capitalize">{nextTier.tier}</strong>
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-teal-600">
              ${stats.totalCommissions.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Referrals"
          value={stats.totalReferrals.toString()}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Referrals"
          value={stats.activeReferrals.toString()}
        />
        <StatCard
          icon={DollarSign}
          label="Pending Commissions"
          value={`$${stats.pendingCommissions.toLocaleString()}`}
        />
        <StatCard
          icon={Award}
          label="Completed Referrals"
          value={stats.completedReferrals.toString()}
        />
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center gap-2"
            style={{ backgroundColor: "#0D7A6B" }}
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center gap-2"
            style={{ backgroundColor: "#0D7A6B" }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Invite Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Invite Directly</h3>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            {showInviteForm ? "Cancel" : "Send Invite"}
          </button>
        </div>

        {showInviteForm && (
          <form onSubmit={handleInvite} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="john@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: "#0D7A6B" }}
            >
              Send Invite
            </button>
          </form>
        )}
      </div>

      {/* Referral Tiers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Referral Tiers</h3>
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.tier}
              className={`p-4 rounded-lg border-2 transition-colors ${
                tier.tier === stats.currentTier
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">{tier.tier}</p>
                  <p className="text-sm text-gray-600">
                    {tier.minReferrals}+ referrals • {tier.commissionRate}% commission
                    {tier.bonusPercentage > 0 && ` • +${tier.bonusPercentage}% bonus`}
                  </p>
                </div>
                {tier.tier === stats.currentTier && (
                  <span className="px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded">
                    Current
                  </span>
                )}
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Referrals</h3>
        {referrals.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No referrals yet. Share your link to get started!</p>
        ) : (
          <div className="space-y-3">
            {referrals.slice(0, 5).map((referral) => (
              <ReferralRow key={referral.id} referral={referral} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-teal-600" />
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

interface ReferralRowProps {
  referral: Referral;
}

function ReferralRow({ referral }: ReferralRowProps) {
  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{referral.referredName}</p>
        <p className="text-sm text-gray-600">{referral.referredEmail}</p>
      </div>
      <div className="flex items-center gap-3">
        {referral.commissionAmount > 0 && (
          <span className="font-semibold text-teal-600">
            ${referral.commissionAmount.toFixed(2)}
          </span>
        )}
        <span
          className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
            statusColors[referral.status]
          }`}
        >
          {referral.status}
        </span>
      </div>
    </div>
  );
}
