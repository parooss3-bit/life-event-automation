/*
 * Premium Upsell Component
 * Displays premium feature teasers and upgrade CTAs
 */

import { useState } from "react";
import { Lock, Zap, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import { PRICING, PREMIUM_FEATURES, CTA_MESSAGES, TRACKING } from "@/lib/monetization";
import { EmailCaptureModal } from "./EmailCaptureModal";

interface PremiumUpsellProps {
  variant?: "banner" | "modal" | "sidebar";
  position?: "after-calculator" | "after-charts" | "footer";
}

export function PremiumUpsell({
  variant = "banner",
  position = "after-calculator",
}: PremiumUpsellProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleUpgradeClick = () => {
    if (TRACKING.enabled && window.gtag) {
      window.gtag("event", TRACKING.events.premiumUpgradeClicked, {
        position,
        variant,
      });
    }
    setShowEmailModal(true);
  };

  const config = CTA_MESSAGES.premiumUpsell;
  const premiumPlan = PRICING.premium;

  if (variant === "banner") {
    return (
      <>
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200 rounded-xl p-6 mb-6 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full opacity-20 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100 rounded-full opacity-20 -ml-16 -mb-16" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900">
                    {config.title}
                  </h3>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {PREMIUM_FEATURES.features.slice(0, 3).map((feature) => (
                <div key={feature.id} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{feature.name}</p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleUpgradeClick}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: "#9333ea" }}
              >
                {config.buttonText}
              </button>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">
                  ${premiumPlan.price}/{premiumPlan.billingCycle}
                </p>
                <p className="text-xs text-gray-600">{config.savings}</p>
              </div>
            </div>
          </div>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={() => {
            // Redirect to pricing page or checkout
            window.location.href = "/pricing";
          }}
          context="premium-upgrade"
        />
      </>
    );
  }

  if (variant === "sidebar") {
    return (
      <>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Premium Features</h4>
          </div>

          <ul className="space-y-3 mb-5">
            {PREMIUM_FEATURES.features.slice(0, 4).map((feature) => (
              <li key={feature.id} className="flex items-start gap-2 text-sm">
                <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{feature.name}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgradeClick}
            className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
            style={{ backgroundColor: "#9333ea" }}
          >
            Unlock for ${premiumPlan.price}/mo
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            14-day free trial • Cancel anytime
          </p>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={() => {
            window.location.href = "/pricing";
          }}
          context="premium-upgrade"
        />
      </>
    );
  }

  // Modal variant
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="font-display text-xl font-bold">{config.title}</h2>
            </div>
            <p className="text-white/90 text-sm">{config.description}</p>
          </div>

          {/* Features */}
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {PREMIUM_FEATURES.features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {feature.name}
                    </p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="p-4 bg-purple-50 rounded-lg mb-4 border border-purple-200">
              <p className="text-2xl font-bold text-gray-900">
                ${premiumPlan.price}
                <span className="text-sm text-gray-600 font-normal">
                  /{premiumPlan.billingCycle}
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-1">{config.savings}</p>
            </div>

            <button
              onClick={handleUpgradeClick}
              className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-all"
              style={{ backgroundColor: "#9333ea" }}
            >
              Start Free Trial
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              14 days free • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={() => {
          window.location.href = "/pricing";
        }}
        context="premium-upgrade"
      />
    </>
  );
}
