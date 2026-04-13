/*
 * Affiliate Recommendations Component
 * Displays recommended directory platforms with affiliate links
 */

import { ExternalLink, Star } from "lucide-react";
import { CTA_MESSAGES, TRACKING } from "@/lib/monetization";

interface AffiliateRecommendationsProps {
  position?: "pdf-footer" | "sidebar" | "after-comparison";
}

export function AffiliateRecommendations({
  position = "pdf-footer",
}: AffiliateRecommendationsProps) {
  const config = CTA_MESSAGES.affiliateRecommendation;

  const handleAffiliateClick = (platform: string) => {
    // Track affiliate click
    if (TRACKING.enabled && window.gtag) {
      window.gtag("event", TRACKING.events.affiliateLinkClicked, {
        platform,
        position,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {config.title}
        </h3>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {config.platforms.map((platform, idx) => (
          <a
            key={idx}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(platform.name)}
            className="group relative p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg hover:border-teal-300 transition-all"
          >
            {/* Recommended Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
              <Star className="w-3 h-3" />
              Recommended
            </div>

            {/* Content */}
            <div className="pr-20">
              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                {platform.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{platform.description}</p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Get Started
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Affiliate Disclosure:</strong> We earn a commission if you sign up through these links at no extra cost to you. We only recommend platforms we genuinely believe will help you succeed.
        </p>
      </div>
    </div>
  );
}
