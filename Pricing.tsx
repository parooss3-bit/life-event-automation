/*
 * Pricing Page — Service Directory Research
 * Design: Contemporary Research Publication with Bold Accents
 * Showcases three pricing tiers with feature comparison and annual discount
 */

import { useState } from "react";
import { Check, X, Zap, BarChart3, Crown } from "lucide-react";
import { PRICING, PREMIUM_FEATURES } from "@/lib/monetization";

interface PricingTierProps {
  tier: "free" | "premium" | "enterprise";
  isAnnual: boolean;
}

function PricingCard({ tier, isAnnual }: PricingTierProps) {
  const tiers = {
    free: {
      name: "Free",
      price: 0,
      description: "Perfect for exploring opportunities",
      cta: "Get Started",
      icon: <BarChart3 className="w-8 h-8" />,
      features: [
        "12 service categories",
        "Basic revenue calculator",
        "Interactive charts",
        "PDF report download",
        "Quick presets",
        "Search & filter",
      ],
      notIncluded: [
        "Advanced revenue calculator",
        "Competitor analysis",
        "Quarterly reports",
        "API access",
        "Priority support",
      ],
      color: "#6B7280",
      bgColor: "#F3F4F6",
    },
    premium: {
      name: "Premium",
      price: isAnnual ? 49 * 10 : 49, // 2 months free with annual
      annualPrice: 49 * 10,
      monthlyPrice: 49,
      description: "For serious entrepreneurs",
      cta: "Start Free Trial",
      icon: <Zap className="w-8 h-8" />,
      features: [
        "Everything in Free, plus:",
        "Advanced revenue calculator",
        "Real-time competitor analysis",
        "Quarterly trend reports",
        "Custom report generation",
        "Priority email support",
        "Unlimited comparisons",
        "Export to CSV",
      ],
      notIncluded: [
        "API access",
        "White-label reports",
        "Dedicated account manager",
      ],
      color: "#9333EA",
      bgColor: "#F3E8FF",
      badge: "Most Popular",
    },
    enterprise: {
      name: "Enterprise",
      price: isAnnual ? 299 * 10 : 299,
      annualPrice: 299 * 10,
      monthlyPrice: 299,
      description: "For agencies & platforms",
      cta: "Contact Sales",
      icon: <Crown className="w-8 h-8" />,
      features: [
        "Everything in Premium, plus:",
        "API access",
        "White-label reports",
        "Dedicated account manager",
        "Custom integrations",
        "Unlimited custom reports",
        "Priority support (24/7)",
        "Advanced analytics",
        "Team collaboration",
      ],
      notIncluded: [],
      color: "#DC2626",
      bgColor: "#FEE2E2",
      badge: "Best Value",
    },
  };

  const plan = tiers[tier];
  const isPopular = tier === "premium";

  return (
    <div
      className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isPopular ? "scale-105" : "shadow-lg"
      }`}
      style={{
        backgroundColor: plan.bgColor,
        boxShadow: isPopular ? `0 0 0 2px ${plan.color}, 0 10px 25px rgba(0,0,0,0.1)` : "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      {/* Badge */}
      {"badge" in plan && plan.badge && (
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: plan.color }}
        >
          {plan.badge}
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: plan.color + "15", color: plan.color }}
            >
              {plan.icon}
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">
              {plan.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            {"monthlyPrice" in plan && (
              <span className="text-gray-600 text-sm">
                /{isAnnual ? "year" : "month"}
              </span>
            )}
          </div>
          {isAnnual && "annualPrice" in plan && (
            <p className="text-xs text-gray-600">
              ${Math.round(plan.annualPrice / 12)}/month billed annually
            </p>
          )}
          {"monthlyPrice" in plan && (
            <p className="text-xs text-green-600 font-semibold mt-2">
              {isAnnual ? "Save 2 months with annual billing" : "Billed monthly"}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg mb-6"
          style={{ backgroundColor: plan.color }}
        >
          {plan.cta}
        </button>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
            Features
          </p>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: plan.color }}
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Not Included */}
        {plan.notIncluded.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-gray-200">
            {plan.notIncluded.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300" />
                <span className="text-sm text-gray-500">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Simple, Transparent Pricing
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Start free and upgrade anytime. All plans include our core research and tools.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  !isAnnual
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  isAnnual
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annual
              </button>
              {isAnnual && (
                <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard tier="free" isAnnual={isAnnual} />
            <PricingCard tier="premium" isAnnual={isAnnual} />
            <PricingCard tier="enterprise" isAnnual={isAnnual} />
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container">
          <div className="mb-12">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Detailed Comparison
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left px-4 py-4 font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-900">
                    Premium
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    category: "Core Features",
                    features: [
                      { name: "12 Service Categories", free: true, premium: true, enterprise: true },
                      { name: "Revenue Calculator", free: true, premium: true, enterprise: true },
                      { name: "Interactive Charts", free: true, premium: true, enterprise: true },
                      { name: "PDF Reports", free: true, premium: true, enterprise: true },
                    ],
                  },
                  {
                    category: "Advanced Features",
                    features: [
                      { name: "Advanced Calculator", free: false, premium: true, enterprise: true },
                      { name: "Competitor Analysis", free: false, premium: true, enterprise: true },
                      { name: "Quarterly Reports", free: false, premium: true, enterprise: true },
                      { name: "Custom Reports", free: false, premium: true, enterprise: true },
                    ],
                  },
                  {
                    category: "Integration & API",
                    features: [
                      { name: "API Access", free: false, premium: false, enterprise: true },
                      { name: "White-Label", free: false, premium: false, enterprise: true },
                      { name: "Custom Integration", free: false, premium: false, enterprise: true },
                    ],
                  },
                  {
                    category: "Support",
                    features: [
                      { name: "Email Support", free: false, premium: true, enterprise: true },
                      { name: "Priority Support", free: false, premium: true, enterprise: true },
                      { name: "24/7 Support", free: false, premium: false, enterprise: true },
                      { name: "Dedicated Manager", free: false, premium: false, enterprise: true },
                    ],
                  },
                ].map((section, idx) => (
                  <tbody key={idx}>
                    <tr className="bg-gray-100">
                      <td colSpan={4} className="px-4 py-3 font-semibold text-gray-900">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feature, fidx) => (
                      <tr key={fidx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{feature.name}</td>
                        <td className="px-4 py-3 text-center">
                          {feature.free ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.premium ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.enterprise ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="mb-12">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Questions?
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade anytime?",
                a: "Yes! You can change your plan at any time. If you upgrade, you'll be prorated for the remainder of your billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all Premium and Enterprise plans include a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. You can cancel your subscription at any time with no penalties or long-term contracts.",
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Annual plans save you 2 months of fees (17% discount). You can switch to annual billing anytime.",
              },
              {
                q: "What's included in Enterprise support?",
                a: "Enterprise includes 24/7 priority support, a dedicated account manager, custom integrations, and quarterly business reviews.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-teal-50 to-blue-50">
        <div className="container max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of entrepreneurs using our research to launch profitable directories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg" style={{ backgroundColor: "#0D7A6B" }}>
              Start Free
            </button>
            <button className="px-8 py-3 rounded-lg font-semibold text-teal-600 border-2 border-teal-600 hover:bg-teal-50 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
