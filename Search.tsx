/*
 * Search & Directory Page
 * Full-text search with category filters, location-based sorting, and favorites
 * Design: Contemporary Research Publication with Bold Accents
 */

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon, MapPin, Star, Phone, Globe, Filter, Navigation } from "lucide-react";
import { Link } from "wouter";
import { searchBusinesses, CATEGORIES, Business } from "@/lib/businesses";
import { calculateDistance, getUserLocation, getCityCoordinates, type Location } from "@/lib/geolocation";
import { SavedSearches } from "@/components/SavedSearches";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "name" | "reviews" | "distance">("rating");
  const [selectedCity, setSelectedCity] = useState("San Francisco");
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [useNearMe, setUseNearMe] = useState(false);

  // Get user location on mount
  useEffect(() => {
    getUserLocation().then((location) => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  // Search and filter businesses
  const results = useMemo(() => {
    let filtered = searchBusinesses(
      searchQuery,
      selectedCategory === "All" ? undefined : selectedCategory
    );

    // Filter by city
    if (useNearMe && userLocation) {
      // Keep all businesses but sort by distance
    } else if (selectedCity) {
      filtered = filtered.filter((b) => b.city === selectedCity);
    }

    // Calculate distances if using location-based sorting
    let businessesWithDistance = filtered.map((b) => {
      let distance = 0;
      if (useNearMe && userLocation) {
        const businessCoords = getCityCoordinates(b.city);
        if (businessCoords) {
          distance = calculateDistance(userLocation, businessCoords);
        }
      }
      return { ...b, distance } as Business & { distance: number };
    });

    // Sort results
    if (sortBy === "name") {
      businessesWithDistance.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "reviews") {
      businessesWithDistance.sort((a, b) => b.review_count - a.review_count);
    } else if (sortBy === "distance" && useNearMe) {
      businessesWithDistance.sort((a, b) => a.distance - b.distance);
    }

    return businessesWithDistance;
  }, [searchQuery, selectedCategory, sortBy, selectedCity, useNearMe, userLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container max-w-6xl py-6">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Find Service Providers
          </h1>
          <p className="text-gray-600 mb-6">
            Search {results.length} verified businesses in your area
          </p>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business name, service, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-6xl py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="col-span-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 mb-4"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} md:block space-y-6`}>
              {/* Saved Searches */}
              <SavedSearches />

              {/* Location Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                <div className="space-y-3">
                  {userLocation && (
                    <button
                      onClick={() => setUseNearMe(!useNearMe)}
                      className={`w-full px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        useNearMe
                          ? "bg-teal-100 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Navigation className="w-4 h-4" />
                      Near Me
                    </button>
                  )}
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setUseNearMe(false);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="San Francisco">San Francisco</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="New York">New York</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Houston">Houston</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  Categories
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      Clear
                    </button>
                  )}
                </h3>
                <div className="space-y-2">
                  {["All", ...CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-teal-100 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "rating" as const, label: "Highest Rated" },
                    { value: "reviews" as const, label: "Most Reviews" },
                    { value: "name" as const, label: "Alphabetical" },
                    ...(useNearMe ? [{ value: "distance" as const, label: "Nearest" }] : []),
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        sortBy === option.value
                          ? "bg-teal-100 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Results */}
          <div className="col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{results.length}</span> results
                {selectedCategory !== "All" && (
                  <span className="text-gray-600">
                    {" "}
                    in <span className="font-semibold">{selectedCategory}</span>
                  </span>
                )}
              </p>
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((business) => (
                  <BusinessCard key={business.id} business={business} showDistance={useNearMe} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Business Card Component
function BusinessCard({ business, showDistance }: { business: Business & { distance?: number }; showDistance?: boolean }) {
  return (
    <Link href={`/business/${business.id}`}>
      <a className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-xl font-bold text-gray-900">
                  {business.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                  {business.category}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(business.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{business.rating}</span>
                <span className="text-gray-500 text-sm">({business.review_count} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {business.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>
                    {business.city}, {business.state}
                    {showDistance && business.distance !== undefined && (
                      <span className="text-teal-600 font-medium ml-1">
                        ({formatDistance(business.distance)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${business.phone}`} className="hover:text-teal-600">
                    {business.phone}
                  </a>
                </div>
              </div>

              {/* Website */}
              {business.website && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 truncate"
                  >
                    {business.website.replace("https://", "")}
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="ml-4 flex flex-col gap-2 flex-shrink-0">
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: "#0D7A6B" }}
              >
                View
              </button>
              <FavoriteButton businessId={business.id} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

// Format distance for display
function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  if (miles < 1) return `${miles.toFixed(1)} mi`;
  return `${miles.toFixed(1)} mi`;
}
