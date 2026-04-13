/*
 * Business Profile Page
 * Public-facing business profile with details, reviews, and contact options
 * Design: Contemporary Research Publication with Bold Accents
 */

import { useRoute } from "wouter";
import { MapPin, Phone, Globe, Mail, Star, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { ReviewForm } from "@/components/ReviewForm";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getBusinessReviews } from "@/lib/reviews";

interface Business {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  email: string;
  rating: number;
  review_count: number;
  category: string;
  description: string;
  hours: string;
  image_url?: string;
}

// Mock data - in production, fetch from API
const mockBusiness: Business = {
  id: "1",
  name: "ABC Plumbing",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  phone: "(415) 555-1234",
  website: "https://abcplumbing.com",
  email: "contact@abcplumbing.com",
  rating: 4.8,
  review_count: 120,
  category: "Plumbing",
  description: "Professional plumbing services for residential and commercial properties. 24/7 emergency service available.",
  hours: "Mon-Fri 8am-5pm, Sat 9am-3pm, Sun Closed",
  image_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
};

export default function BusinessProfile() {
  const [, params] = useRoute("/business/:id");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const business = mockBusiness; // In production, fetch using params.id
  const reviews = getBusinessReviews(business.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-900 overflow-hidden">
        {business.image_url && (
          <img
            src={business.image_url}
            alt={business.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container max-w-4xl pb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-teal-600 text-white text-sm font-medium rounded-full mb-4">
                  {business.category}
                </div>
                <h1 className="font-display text-4xl font-bold text-white mb-2">
                  {business.name}
                </h1>
                <div className="flex items-center gap-2 text-white">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(business.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-gray-300">({business.review_count} reviews)</span>
                </div>
              </div>
              <FavoriteButton businessId={business.id} className="p-3 rounded-full bg-white/20 hover:bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                Hours
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{business.hours}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: "#0D7A6B" }}
                >
                  Write Review
                </button>
              </div>

              {showReviewForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <ReviewForm
                    businessId={business.id}
                    businessName={business.name}
                    onSuccess={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`w-4 h-4 ${
                                    j < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 mb-2">{review.title}</p>
                      <p className="text-gray-700 text-sm mb-3">{review.content}</p>
                      <button className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                        👍 Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No reviews yet. Be the first to review this business!
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">
                Contact
              </h3>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {business.address}
                      <br />
                      {business.city}, {business.state} {business.zip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1 block"
                    >
                      {business.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website</p>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1 block truncate"
                    >
                      {business.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1 block"
                    >
                      {business.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#0D7A6B" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
                <button className="w-full px-4 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Send a Message</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <textarea
                    placeholder="Your message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#0D7A6B" }}
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
