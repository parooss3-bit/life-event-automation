/*
 * Quick Presets Component
 * Provides curated category bundles for instant selection
 */

import { Zap } from "lucide-react";

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryIds: string[];
  color: string;
  reasoning: string;
}

export const QUICK_PRESETS: Preset[] = [
  {
    id: "high-revenue",
    name: "High Revenue Niches",
    description: "Premium categories with $100-500/listing potential",
    icon: "💎",
    categoryIds: ["healthcare", "real-estate", "professional-services"],
    color: "#D4470A",
    reasoning:
      "These three categories command premium listing fees due to high customer lifetime value and strong search intent. Perfect for maximizing revenue per listing.",
  },
  {
    id: "fastest-growing",
    name: "Fastest Growing",
    description: "Categories with 85+ benefit scores and high market demand",
    icon: "🚀",
    categoryIds: ["restaurants", "home-improvement", "healthcare", "automotive"],
    color: "#0D7A6B",
    reasoning:
      "These categories show the strongest directory adoption rates and market momentum. Ideal for capturing emerging opportunities.",
  },
  {
    id: "startup-friendly",
    name: "Best for Startups",
    description: "Lower competition, quick wins, recurring revenue",
    icon: "🌱",
    categoryIds: ["fitness", "beauty-wellness", "childcare-education", "pet-services"],
    color: "#1A6B3C",
    reasoning:
      "These niches have moderate barriers to entry, strong customer loyalty, and recurring revenue models. Great for new directory entrepreneurs.",
  },
  {
    id: "recurring-revenue",
    name: "Recurring Revenue Models",
    description: "Categories with subscription/membership potential",
    icon: "💰",
    categoryIds: ["fitness", "beauty-wellness", "childcare-education", "senior-care"],
    color: "#8B1A6B",
    reasoning:
      "These services naturally align with recurring revenue models, creating predictable, stable income streams for directory operators.",
  },
  {
    id: "high-ltv",
    name: "Highest Customer LTV",
    description: "Categories with $15K-30K customer lifetime value",
    icon: "🎯",
    categoryIds: ["healthcare", "real-estate", "senior-care", "home-improvement"],
    color: "#1E4D8C",
    reasoning:
      "These categories have the highest customer lifetime value, meaning each listing generates significant long-term revenue.",
  },
  {
    id: "local-services",
    name: "Local Services Focus",
    description: "Geographically-driven services with high local search volume",
    icon: "📍",
    categoryIds: ["restaurants", "automotive", "home-improvement", "beauty-wellness"],
    color: "#7A3B0D",
    reasoning:
      "These services rely heavily on local search and proximity, making them ideal for location-based directory strategies.",
  },
];

interface QuickPresetsProps {
  onPresetSelect: (categoryIds: string[]) => void;
  selectedCount: number;
}

export function QuickPresets({ onPresetSelect, selectedCount }: QuickPresetsProps) {
  return (
    <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Quick Presets</h4>
        <span className="text-xs text-gray-500 ml-auto">
          {selectedCount > 0 && `${selectedCount} selected`}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        Click any preset to instantly select a curated bundle of categories. Perfect for exploring different market strategies.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset.categoryIds)}
            className="relative p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all text-left group"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
              style={{ backgroundColor: preset.color + "08" }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{preset.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-gray-700">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {preset.categoryIds.length} categories
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {preset.description}
              </p>

              {/* Reasoning (shown on hover) */}
              <div className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity max-h-0 group-hover:max-h-20 overflow-hidden">
                <p className="pt-2 border-t border-gray-200 mt-2">{preset.reasoning}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Use presets to quickly compare market opportunities, then customize by adding or removing categories.
        </p>
      </div>
    </div>
  );
}
