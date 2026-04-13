/*
 * Email Capture Modal Component
 * Captures user emails before PDF download and for lead nurture sequences
 */

import { useState } from "react";
import { X, Mail, CheckCircle } from "lucide-react";
import { CTA_MESSAGES, EMAIL_SERVICE, LEAD_MAGNET, TRACKING } from "@/lib/monetization";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  context: "pdf-download" | "consultation" | "premium-upgrade";
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  context,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Send to email service (Zapier webhook, Mailchimp, etc.)
      const response = await fetch(EMAIL_SERVICE.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          context,
          timestamp: new Date().toISOString(),
          source: "service-directory-research",
        }),
      });

      if (!response.ok) throw new Error("Failed to capture email");

      // Track event
      if (TRACKING.enabled && window.gtag) {
        window.gtag("event", TRACKING.events.emailCaptured, {
          context,
          email_domain: email.split("@")[1],
        });
      }

      setIsSuccess(true);
      onSubmit(email);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Email capture error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const ctaConfig = CTA_MESSAGES.beforePdfDownload;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div
          className="p-6 text-white"
          style={{ backgroundColor: "#0D7A6B" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <h2 className="font-display text-xl font-bold">
                {ctaConfig.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            {ctaConfig.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle
                className="w-12 h-12 text-green-500 mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">
                Success! Check your email
              </h3>
              <p className="text-sm text-gray-600">
                Your report is ready to download. We've also sent you the link and weekly insights.
              </p>
            </div>
          ) : (
            <>
              {/* Lead Magnet Benefits */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-900 mb-3">
                  {LEAD_MAGNET.title}
                </p>
                <ul className="space-y-2">
                  {LEAD_MAGNET.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-blue-800">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all text-white"
                  style={{
                    backgroundColor: "#0D7A6B",
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    ctaConfig.buttonText
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Declare gtag type for TypeScript
declare global {
  interface Window {
    gtag: (command: string, event: string, data?: Record<string, any>) => void;
  }
}
