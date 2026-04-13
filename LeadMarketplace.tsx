import { useState } from "react";
import { ShoppingCart, Star, MapPin, DollarSign, TrendingUp } from "lucide-react";
import {
  getAvailableLeads,
  getAvailableBundles,
  purchaseLead,
  getMarketplaceStats,
  type Lead,
  type LeadBundle,
} from "@/lib/leadMarketplace";

interface LeadMarketplaceProps {
  userId: string;
  userRole: "buyer" | "seller";
}

export function LeadMarketplace({ userId, userRole }: LeadMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "bundles" | "stats">("browse");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [cart, setCart] = useState<string[]>([]);

  const leads = getAvailableLeads(
    selectedCategory || undefined,
    selectedLocation || undefined,
    (selectedQuality as any) || undefined
  );
  const bundles = getAvailableBundles(
    selectedCategory || undefined,
    selectedLocation || undefined
  );
  const stats = getMarketplaceStats();

  const handleAddToCart = (leadId: string) => {
    setCart([...cart, leadId]);
  };

  const handleRemoveFromCart = (leadId: string) => {
    setCart(cart.filter((id) => id !== leadId));
  };

  const handlePurchase = (leadId: string) => {
    const result = purchaseLead(leadId, userId);
    if (result.success) {
      handleRemoveFromCart(leadId);
      alert("Lead purchased successfully!");
    } else {
      alert(result.message);
    }
  };

  const cartTotal = leads
    .filter((l) => cart.includes(l.id))
    .reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "browse"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Browse Leads
        </button>
        <button
          onClick={() => setActiveTab("bundles")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "bundles"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Lead Bundles
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "stats"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Marketplace Stats
        </button>
      </div>

      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Restaurants">Restaurants</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Locations</option>
                <option value="San Francisco">San Francisco</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Quality Levels</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isInCart={cart.includes(lead.id)}
                onAddToCart={() => handleAddToCart(lead.id)}
                onRemoveFromCart={() => handleRemoveFromCart(lead.id)}
                onPurchase={() => handlePurchase(lead.id)}
              />
            ))}
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No leads available matching your filters.</p>
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {cart.length} lead{cart.length !== 1 ? "s" : ""} in cart
                  </p>
                  <p className="text-sm text-gray-600">Total: ${cartTotal.toLocaleString()}</p>
                </div>
                <button className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: "#0D7A6B" }}>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "bundles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
          {bundles.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No bundles available.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={ShoppingCart}
            label="Available Leads"
            value={stats.availableLeads.toLocaleString()}
          />
          <StatCard
            icon={TrendingUp}
            label="Leads Sold"
            value={stats.soldLeads.toLocaleString()}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
          />
          <StatCard
            icon={DollarSign}
            label="Avg Lead Price"
            value={`$${stats.averageLeadPrice.toFixed(2)}`}
          />
          <StatCard
            icon={Star}
            label="Total Buyers"
            value={stats.totalBuyers.toLocaleString()}
          />
          <StatCard
            icon={Star}
            label="Total Sellers"
            value={stats.totalSellers.toLocaleString()}
          />
        </div>
      )}
    </div>
  );
}

interface LeadCardProps {
  lead: Lead;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onPurchase: () => void;
}

function LeadCard({
  lead,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onPurchase,
}: LeadCardProps) {
  const qualityColors = {
    bronze: "bg-amber-100 text-amber-800",
    silver: "bg-gray-100 text-gray-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{lead.category}</h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{lead.location}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${qualityColors[lead.quality]}`}>
          {lead.quality.charAt(0).toUpperCase() + lead.quality.slice(1)}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lead.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-teal-600" />
          <span className="font-bold text-gray-900">${lead.price}</span>
        </div>

        {isInCart ? (
          <button
            onClick={onRemoveFromCart}
            className="px-3 py-1 text-sm rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={onAddToCart}
            className="px-3 py-1 text-sm rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: "#0D7A6B" }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

interface BundleCardProps {
  bundle: LeadBundle;
}

function BundleCard({ bundle }: BundleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{bundle.category}</h3>
          <p className="text-sm text-gray-600">{bundle.location}</p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
          Bundle
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Leads:</span>
          <span className="font-semibold">{bundle.leadCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price per lead:</span>
          <span className="font-semibold">${bundle.pricePerLead}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg text-teal-600">${bundle.totalPrice}</span>
        </div>
      </div>

      <button
        className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
        style={{ backgroundColor: "#0D7A6B" }}
      >
        Purchase Bundle
      </button>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-teal-600" />
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
