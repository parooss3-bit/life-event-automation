/*
 * Search Widget Component
 * Featured on homepage for quick access to search
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/businesses";

export function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    setLocation(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
        Find Service Providers
      </h2>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you looking for?
          </label>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g., plumber, electrician, dentist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Category (Optional)
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0D7A6B" }}
        >
          <SearchIcon className="w-5 h-5" />
          Search Directory
        </button>
      </form>

      {/* Quick Links */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-3 font-medium">Popular Categories:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLocation(`/search?category=${cat}`);
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-teal-100 hover:text-teal-700 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
