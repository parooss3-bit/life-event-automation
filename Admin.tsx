/*
 * Admin Dashboard Page
 * Provides interface for managing directory data and imports
 * Design: Contemporary Research Publication with Bold Accents
 */

import { useState } from "react";
import { BarChart3, Upload, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { CSVUploadAdmin } from "@/components/CSVUploadAdmin";

type AdminTab = "import" | "stats" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("import");
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Directory Admin
            </h1>
            <p className="text-sm text-gray-600">Manage your business directory</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-6xl">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("import")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "import"
                  ? "text-teal-600 border-teal-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Businesses
              </span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "stats"
                  ? "text-teal-600 border-teal-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "text-teal-600 border-teal-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main>
        {activeTab === "import" && <CSVUploadAdmin />}

        {activeTab === "stats" && (
          <div className="container max-w-6xl py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                Directory Statistics
              </h2>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-900">1,247</div>
                  <div className="text-sm text-blue-700 mt-1">Total Businesses</div>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-900">856</div>
                  <div className="text-sm text-green-700 mt-1">Claimed Listings</div>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-900">342</div>
                  <div className="text-sm text-purple-700 mt-1">Premium Members</div>
                </div>
                <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-900">$12,450</div>
                  <div className="text-sm text-orange-700 mt-1">Monthly Revenue</div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>500 businesses imported from API</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>45 new premium signups</span>
                    <span className="text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CSV import: plumbers_sf.csv</span>
                    <span className="text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="container max-w-6xl py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Directory Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Service Directory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Listing Price (Monthly)
                  </label>
                  <input
                    type="number"
                    defaultValue="49"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Price
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: "#0D7A6B" }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
