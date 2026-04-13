/*
 * Category Comparison Component
 * Allows users to select multiple categories and compare them side-by-side
 * Includes interactive radar and bar charts plus PDF export
 */

import { useState, useRef, useEffect } from "react";
import { categories } from "@/lib/data";
import { Check, X, Download, BarChart3 } from "lucide-react";
import { generateCategoryComparisonPDF } from "@/lib/pdfExport";
import { QuickPresets } from "./QuickPresets";
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  Cell,
} from "recharts";

export function CategoryComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const { ref: containerRef, visible } = useIntersectionObserver();

  const selectedCategories = categories.filter((c) => selectedIds.includes(c.id));

  // Prepare chart data
  const chartData = selectedCategories.map((cat) => {
    const revenueMatch = cat.revenuePerListing.match(/\$(\d+)/);
    const revenueValue = revenueMatch ? parseInt(revenueMatch[1]) : 100;

    const searchMatch = cat.avgMonthlySearches.match(/(\d+(?:\.\d+)?)/);
    const searchValue = searchMatch ? parseFloat(searchMatch[1]) : 1;

    return {
      name: cat.name,
      icon: cat.icon,
      benefitScore: cat.directoryBenefitScore,
      marketSize: parseInt(cat.marketSize.replace(/[^0-9]/g, "")) || 100,
      searchVolume: searchValue * 100,
      revenue: revenueValue,
      ltv: cat.customerLTV,
      color: cat.color,
    };
  });

  // Normalize values for radar chart (0-100 scale)
  const radarData = chartData.map((item) => ({
    name: item.icon + " " + item.name.split(" ")[0],
    "Benefit Score": item.benefitScore,
    "Market Size": Math.min(100, (item.marketSize / 50) * 10),
    "Search Volume": Math.min(100, item.searchVolume),
    Revenue: item.revenue,
    "Customer LTV": Math.min(100, (item.ltv / 30) * 100),
  }));

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleExportComparison = async () => {
    if (selectedCategories.length === 0) return;
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      generateCategoryComparisonPDF(
        selectedCategories.map((cat) => ({
          icon: cat.icon,
          name: cat.name,
          directoryBenefitScore: cat.directoryBenefitScore,
          marketSize: cat.marketSize,
          avgMonthlySearches: cat.avgMonthlySearches,
          revenuePerListing: cat.revenuePerListing,
          keyBenefit: cat.keyBenefit,
        }))
      );
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
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
            🔄 Compare Categories
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Select 2 or more categories to compare side-by-side with interactive charts and download a comprehensive report.
          </p>
        </div>

        {/* Quick Presets */}
        <QuickPresets onPresetSelect={setSelectedIds} selectedCount={selectedIds.length} />

        {/* Selection Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Select Categories ({selectedIds.length})
            </label>
            {selectedIds.length > 0 && (
              <button
                onClick={clearSelection}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="relative p-4 rounded-lg border-2 transition-all text-left"
                  style={{
                    borderColor: isSelected ? cat.color : "#e5e7eb",
                    backgroundColor: isSelected ? cat.color + "08" : "#fafaf8",
                  }}
                >
                  {/* Checkmark indicator */}
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? cat.color : "transparent",
                      border: isSelected ? "none" : `2px solid #d1d5db`,
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Category info */}
                  <div className="pr-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-semibold text-gray-900">{cat.name}</span>
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {cat.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Score: {cat.directoryBenefitScore}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: cat.color }}
                      >
                        {cat.revenuePerListing}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Preview */}
        {selectedCategories.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">
              Selected for Comparison
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: cat.color + "15",
                    color: cat.color,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedCategories.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Metric
                  </th>
                  {selectedCategories.map((cat) => (
                    <th
                      key={cat.id}
                      className="text-center px-4 py-3 font-semibold"
                      style={{ color: cat.color }}
                    >
                      {cat.icon} {cat.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Benefit Score
                  </td>
                  {selectedCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="text-center px-4 py-3 font-semibold"
                      style={{ color: cat.color }}
                    >
                      {cat.directoryBenefitScore}/100
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Market Size
                  </td>
                  {selectedCategories.map((cat) => (
                    <td key={cat.id} className="text-center px-4 py-3 text-gray-600">
                      {cat.marketSize}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Monthly Searches
                  </td>
                  {selectedCategories.map((cat) => (
                    <td key={cat.id} className="text-center px-4 py-3 text-gray-600">
                      {cat.avgMonthlySearches}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Revenue per Listing
                  </td>
                  {selectedCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="text-center px-4 py-3 font-semibold"
                      style={{ color: cat.color }}
                    >
                      {cat.revenuePerListing}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Customer LTV
                  </td>
                  {selectedCategories.map((cat) => (
                    <td
                      key={cat.id}
                      className="text-center px-4 py-3 font-semibold"
                      style={{ color: cat.color }}
                    >
                      ${cat.customerLTV}K
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    Key Benefit
                  </td>
                  {selectedCategories.map((cat) => (
                    <td key={cat.id} className="text-center px-4 py-3 text-xs text-gray-600">
                      {cat.keyBenefit}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Charts Toggle */}
        {selectedCategories.length >= 2 && (
          <div className="mb-6">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "#0D7A6B" + "15",
                color: "#0D7A6B",
              }}
            >
              <BarChart3 className="w-4 h-4" />
              {showCharts ? "▲ Hide Charts" : "▼ Show Comparison Charts"}
            </button>
          </div>
        )}

        {/* Charts */}
        {showCharts && selectedCategories.length >= 2 && (
          <div className="mb-8 space-y-8">
            {/* Radar Chart */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm mb-4">
                📊 Multi-Dimensional Comparison (Radar Chart)
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#666", fontFamily: "Outfit" }}
                  />
                  <Radar
                    name="Benefit Score"
                    dataKey="Benefit Score"
                    stroke={selectedCategories[0]?.color || "#0D7A6B"}
                    fill={selectedCategories[0]?.color || "#0D7A6B"}
                    fillOpacity={0.25}
                  />
                  {selectedCategories.length > 1 && (
                    <Radar
                      name="Market Size"
                      dataKey="Market Size"
                      stroke={selectedCategories[1]?.color || "#1A6B3C"}
                      fill={selectedCategories[1]?.color || "#1A6B3C"}
                      fillOpacity={0.15}
                    />
                  )}
                  <Legend wrapperStyle={{ fontFamily: "Outfit", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Outfit",
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Benefit Score Comparison */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm mb-4">
                📈 Benefit Score & Revenue Comparison
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="icon"
                    tick={{ fontSize: 14, fill: "#666", fontFamily: "Outfit" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
                    label={{ value: "Benefit Score", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
                    label={{ value: "Revenue ($)", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Outfit",
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Outfit", fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="benefitScore" name="Benefit Score" fill="#0D7A6B" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue/Listing" fill="#D4470A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Customer LTV */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm mb-4">
                💰 Customer Lifetime Value Comparison
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="icon"
                    tick={{ fontSize: 14, fill: "#666", fontFamily: "Outfit" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Outfit",
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                    formatter={(v) => [`$${v}K`, "Customer LTV"]}
                  />
                  <Bar dataKey="ltv" name="Customer LTV" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Export Button */}
        {selectedCategories.length >= 2 && (
          <div className="flex gap-3">
            <button
              onClick={handleExportComparison}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all text-white"
              style={{
                backgroundColor: "#0D7A6B",
                opacity: isExporting ? 0.7 : 1,
                cursor: isExporting ? "not-allowed" : "pointer",
              }}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Comparison Report
                </>
              )}
            </button>
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
              }}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Empty State */}
        {selectedCategories.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <p className="text-gray-600 text-sm">
              Select 2 or more categories to compare and download a report
            </p>
          </div>
        )}

        {/* Info Message */}
        {selectedCategories.length === 1 && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Select at least one more category to enable comparison charts and PDF export.
            </p>
          </div>
        )}
      </div>
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
