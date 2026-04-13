/*
 * SearchBar Component
 * Allows users to search categories by name or sub-service
 * Shows real-time search results with highlighting
 */

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { categories } from "@/lib/data";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  searchResults: typeof categories;
  showResults: boolean;
  onShowResults: (show: boolean) => void;
}

export function SearchBar({
  onSearch,
  onSelectCategory,
  searchQuery,
  searchResults,
  showResults,
  onShowResults,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onShowResults]);

  const handleClearSearch = () => {
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSelectResult = (categoryId: string) => {
    onSelectCategory(categoryId);
    onSearch("");
    onShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by service name (e.g., 'plumber', 'yoga', 'dentist')..."
          value={searchQuery}
          onChange={(e) => {
            onSearch(e.target.value);
            onShowResults(true);
          }}
          onFocus={() => searchQuery && onShowResults(true)}
          className="w-full pl-11 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D7A6B] transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                {searchResults.length} Result{searchResults.length !== 1 ? "s" : ""} Found
              </div>
              {searchResults.map((result) => {
                // Find matching sub-services
                const matchingServices = result.subServices.filter((s) =>
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result.id)}
                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">
                          {result.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                          {result.keyBenefit}
                        </div>
                        {matchingServices.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {matchingServices.slice(0, 3).map((service) => (
                              <span
                                key={service}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: result.color + "20",
                                  color: result.color,
                                }}
                              >
                                {service}
                              </span>
                            ))}
                            {matchingServices.length > 3 && (
                              <span className="text-xs px-2 py-0.5 text-gray-500">
                                +{matchingServices.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div
                          className="text-xs font-bold"
                          style={{ color: result.color }}
                        >
                          {result.directoryBenefitScore}
                        </div>
                        <div className="text-xs text-gray-400">score</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <div className="text-gray-500 text-sm mb-1">No categories found</div>
              <div className="text-xs text-gray-400">
                Try searching for a different service name
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results message when search is active but empty */}
      {showResults && searchQuery && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 text-center">
          <div className="text-gray-500 text-sm">No matching categories found</div>
          <div className="text-xs text-gray-400 mt-1">
            Try searching for keywords like "plumber", "dentist", "yoga", or "restaurant"
          </div>
        </div>
      )}
    </div>
  );
}
