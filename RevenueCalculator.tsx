/*
 * Revenue Calculator Widget
 * Allows users to estimate monthly earnings based on category and number of listings
 * Includes conservative, average, and best-case scenarios
 */

import { useState, useRef, useEffect } from "react";
import { categories } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ExportButton } from "./ExportButton";
import { EmailCaptureModal } from "./EmailCaptureModal";
import { ConsultationCTA } from "./ConsultationCTA";

interface RevenueScenario {
  conservative: number;
  average: number;
  bestCase: number;
}

function parseRevenueRange(range: string): { min: number; max: number } {
  const match = range.match(/\$(\d+)–\$(\d+)/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2]) };
  }
  return { min: 50, max: 200 };
}

function calculateRevenue(category: typeof categories[0], listings: number): RevenueScenario {
  const range = parseRevenueRange(category.revenuePerListing);
  const min = range.min;
  const max = range.max;
  const avg = (min + max) / 2;

  return {
    conservative: Math.round(min * listings),
    average: Math.round(avg * listings),
    bestCase: Math.round(max * listings),
  };
}

export function RevenueCalculator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id);
  const [listings, setListings] = useState(10);
  const [showChart, setShowChart] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { ref: containerRef, visible } = useIntersectionObserver();

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const revenue = calculateRevenue(selectedCategory, listings);

  const chartData = [
    {
      scenario: "Conservative",
      revenue: revenue.conservative,
      color: "#94A3B8",
    },
    {
      scenario: "Average",
      revenue: revenue.average,
      color: selectedCategory.color,
    },
    {
      scenario: "Best Case",
      revenue: revenue.bestCase,
      color: "#D4820A",
    },
  ];

  const annualRevenue = {
    conservative: revenue.conservative * 12,
    average: revenue.average * 12,
    bestCase: revenue.bestCase * 12,
  };

  const handleExportClick = () => {
    setShowEmailModal(true);
  };

  const handleEmailSubmit = (email: string) => {
    // Email captured, now proceed with export
    setShowEmailModal(false);
    // The ExportButton will handle the actual export
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
            💰 Revenue Calculator
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Estimate your monthly directory revenue by selecting a category and entering the number of listings you plan to offer.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': selectedCategory.color } as React.CSSProperties}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              Current range: <span className="font-semibold">{selectedCategory.revenuePerListing}/listing/month</span>
            </p>
          </div>

          {/* Listings Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Listings
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={listings}
                onChange={(e) => setListings(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ '--tw-ring-color': selectedCategory.color } as React.CSSProperties}
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setListings(Math.max(1, listings - 5))}
                  className="px-3 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  −
                </button>
                <button
                  onClick={() => setListings(listings + 5)}
                  className="px-3 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Adjust using the input or +/− buttons
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Conservative */}
          <div className="rounded-xl p-4 border-2" style={{ borderColor: "#94A3B8" + "40", backgroundColor: "#94A3B8" + "08" }}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Conservative
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${revenue.conservative.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">
              Monthly estimate (low end)
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-2">
              Annual: ${annualRevenue.conservative.toLocaleString()}
            </div>
          </div>

          {/* Average */}
          <div
            className="rounded-xl p-4 border-2"
            style={{
              borderColor: selectedCategory.color + "60",
              backgroundColor: selectedCategory.color + "08",
            }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: selectedCategory.color }}
            >
              Average
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: selectedCategory.color }}
            >
              ${revenue.average.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">
              Monthly estimate (mid-range)
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-2">
              Annual: ${annualRevenue.average.toLocaleString()}
            </div>
          </div>

          {/* Best Case */}
          <div className="rounded-xl p-4 border-2" style={{ borderColor: "#D4820A" + "60", backgroundColor: "#D4820A" + "08" }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#D4820A" }}>
              Best Case
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: "#D4820A" }}>
              ${revenue.bestCase.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">
              Monthly estimate (high end)
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-2">
              Annual: ${annualRevenue.bestCase.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowChart(!showChart)}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: selectedCategory.color + "15",
              color: selectedCategory.color,
            }}
          >
            {showChart ? "▲ Hide Chart" : "▼ Show Chart"}
          </button>
        </div>

        {/* Chart */}
        {showChart && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="scenario"
                  tick={{ fontSize: 11, fill: "#555", fontFamily: "Outfit" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Outfit",
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(v) => [`$${(v as number).toLocaleString()}`, "Monthly Revenue"]}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">💡 Key Insights</h4>
          <ul className="text-sm text-gray-700 space-y-1.5">
            <li>
              • <span className="font-medium">{selectedCategory.name}</span> listings range from{" "}
              <span className="font-semibold">{selectedCategory.revenuePerListing}</span> per month
            </li>
            <li>
              • With <span className="font-semibold">{listings} listings</span>, your estimated monthly revenue is{" "}
              <span className="font-semibold">${revenue.average.toLocaleString()}</span> (average)
            </li>
            <li>
              • Annual potential: <span className="font-semibold">${annualRevenue.average.toLocaleString()}</span> at average rates
            </li>
            <li>
              • {selectedCategory.directoryBenefitScore >= 90
                ? "This is a HIGH-OPPORTUNITY category with strong market demand."
                : selectedCategory.directoryBenefitScore >= 85
                ? "This is a SOLID-OPPORTUNITY category with good growth potential."
                : "This category has moderate opportunity — consider diversifying with other niches."}
            </li>
          </ul>
        </div>

        {/* Export Button */}
        <ExportButton
          reportData={{
            selectedCategoryName: selectedCategory.name,
            selectedCategoryIcon: selectedCategory.icon,
            listings,
            conservativeRevenue: revenue.conservative,
            averageRevenue: revenue.average,
            bestCaseRevenue: revenue.bestCase,
            conservativeAnnual: annualRevenue.conservative,
            averageAnnual: annualRevenue.average,
            bestCaseAnnual: annualRevenue.bestCase,
            revenuePerListing: selectedCategory.revenuePerListing,
            directoryBenefitScore: selectedCategory.directoryBenefitScore,
            marketSize: selectedCategory.marketSize,
            avgMonthlySearches: selectedCategory.avgMonthlySearches,
            keyBenefit: selectedCategory.keyBenefit,
            description: selectedCategory.description,
            subServices: selectedCategory.subServices,
          }}
          categoryColor={selectedCategory.color}
        />

        {/* Consultation CTA */}
        <ConsultationCTA variant="card" position="after-pdf" />
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        context="pdf-download"
      />
    </div>
  );
}

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
