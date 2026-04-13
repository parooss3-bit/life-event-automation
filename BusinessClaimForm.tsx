import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitClaimRequest, verifyClaimRequest } from "@/lib/businessClaim";

interface BusinessClaimFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: () => void;
}

export function BusinessClaimForm({
  businessId,
  businessName,
  onSuccess,
}: BusinessClaimFormProps) {
  const [step, setStep] = useState<"info" | "verify">("info");
  const [loading, setLoading] = useState(false);
  const [claimId, setClaimId] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    phone: "",
  });

  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const claim = submitClaimRequest(
        businessId,
        businessName,
        formData.ownerEmail,
        formData.ownerName,
        formData.phone
      );

      setClaimId(claim.id);
      setStep("verify");
      setMessage({
        type: "success",
        text: `Verification code sent to ${formData.ownerEmail}. Check your email!`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to submit claim. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = verifyClaimRequest(claimId, verificationCode);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Business verified successfully! You can now manage your profile.",
        });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {step === "info" ? (
        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Name
            </label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) =>
                setFormData({ ...formData, ownerName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.ownerEmail}
              onChange={(e) =>
                setFormData({ ...formData, ownerEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="(555) 123-4567"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: "#0D7A6B" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Claim Business"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              We've sent a verification code to <strong>{formData.ownerEmail}</strong>. 
              Enter it below to verify your business ownership.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("info");
                setVerificationCode("");
                setMessage(null);
              }}
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#0D7A6B" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
