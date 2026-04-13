/*
 * Consultation CTA Component
 * Promotes free consultation booking with email capture
 */

import { useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { CTA_MESSAGES, CONSULTATION_BOOKING, TRACKING } from "@/lib/monetization";
import { EmailCaptureModal } from "./EmailCaptureModal";

interface ConsultationCTAProps {
  variant?: "inline" | "banner" | "card";
  position?: "after-pdf" | "sidebar" | "footer";
}

export function ConsultationCTA({
  variant = "card",
  position = "after-pdf",
}: ConsultationCTAProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleBooking = () => {
    // Track event
    if (TRACKING.enabled && window.gtag) {
      window.gtag("event", TRACKING.events.consultationBooked, {
        position,
      });
    }

    // Open Calendly or booking link
    window.open(CONSULTATION_BOOKING.calendarLink, "_blank");
  };

  const handleEmailCapture = (email: string) => {
    // After email capture, redirect to booking
    handleBooking();
  };

  const config = CTA_MESSAGES.afterPdfDownload;

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-l-4 border-teal-500 p-6 rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <Calendar className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {config.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{config.description}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEmailModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all"
                style={{ backgroundColor: "#0D7A6B" }}
              >
                {config.buttonText}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 self-center">
                {config.subtext}
              </p>
            </div>
          </div>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailCapture}
          context="consultation"
        />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: "#0D7A6B" + "15" }}>
            <Calendar className="w-6 h-6" style={{ color: "#0D7A6B" }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {config.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{config.description}</p>
            <button
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: "#0D7A6B" }}
            >
              {config.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-3">{config.subtext}</p>
          </div>
        </div>

        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailCapture}
          context="consultation"
        />
      </div>
    );
  }

  // Inline variant
  return (
    <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-50 border border-teal-200">
      <Calendar className="w-5 h-5 text-teal-600" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{config.title}</p>
        <p className="text-xs text-gray-600">{config.subtext}</p>
      </div>
      <button
        onClick={() => setShowEmailModal(true)}
        className="px-3 py-1.5 rounded font-semibold text-xs text-white transition-all"
        style={{ backgroundColor: "#0D7A6B" }}
      >
        Book Now
      </button>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailCapture}
        context="consultation"
      />
    </div>
  );
}
