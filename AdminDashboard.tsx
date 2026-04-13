import { useState } from 'react'
import { Plus, Edit2, Trash2, TrendingUp, DollarSign, Zap, Eye } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { discountService } from '../lib/discounts'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'offers' | 'analytics'>('overview')
  const [selectedSupplier, setSelectedSupplier] = useState('supplier-1')
  const [showTierForm, setShowTierForm] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)

  // Form states
  const [tierForm, setTierForm] = useState({
    minQuantity: 50,
    maxQuantity: 99,
    discountPercent: 5,
    description: '',
  })

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discountPercent: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    conditions: '',
    code: '',
    featured: false,
  })

  const discounts = discountService.getSupplierDiscounts(selectedSupplier)
  const activeOffers = discountService.getActiveOffers(selectedSupplier)

  const handleAddTier = () => {
    if (discounts) {
      const newTier = discountService.createDiscountTier(
        tierForm.minQuantity,
        tierForm.discountPercent,
        tierForm.maxQuantity || undefined,
        tierForm.description
      )
      discountService.updateDiscountTiers(selectedSupplier, [
        ...discounts.discountTiers,
        newTier,
      ])
      setTierForm({
        minQuantity: 50,
        maxQuantity: 99,
        discountPercent: 5,
        description: '',
      })
      setShowTierForm(false)
    }
  }

  const handleAddOffer = () => {
    if (discounts) {
      const newOffer = discountService.createSpecialOffer(
        offerForm.title,
        offerForm.discountPercent,
        new Date(offerForm.startDate),
        new Date(offerForm.endDate),
        {
          description: offerForm.description,
          conditions: offerForm.conditions,
          code: offerForm.code,
          featured: offerForm.featured,
        }
      )
      discountService.addSpecialOffer(selectedSupplier, newOffer)
      setOfferForm({
        title: '',
        description: '',
        discountPercent: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conditions: '',
        code: '',
        featured: false,
      })
      setShowOfferForm(false)
    }
  }

  const handleDeleteTier = (tierId: string) => {
    if (discounts) {
      const updated = discounts.discountTiers.filter(t => t.id !== tierId)
      discountService.updateDiscountTiers(selectedSupplier, updated)
    }
  }

  const handleDeleteOffer = (offerId: string) => {
    discountService.removeSpecialOffer(selectedSupplier, offerId)
  }

  if (!discounts) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-gray-600">Supplier not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[Fraunces] text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage discounts and special offers</p>
        </div>

        {/* Supplier Selector */}
        <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-semibold mb-2">Select Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="supplier-1">Premium Flooring Co (supplier-1)</option>
            <option value="supplier-2">Elite Floors Inc (supplier-2)</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {(['overview', 'tiers', 'offers', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Discount Tiers</p>
                  <p className="text-3xl font-bold text-primary">{discounts.discountTiers.length}</p>
                </div>
                <TrendingUp size={32} className="text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Offers</p>
                  <p className="text-3xl font-bold text-primary">{activeOffers.length}</p>
                </div>
                <Zap size={32} className="text-yellow-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Bulk Minimum</p>
                  <p className="text-3xl font-bold text-primary">{discounts.bulkOrderMinimum}</p>
                </div>
                <DollarSign size={32} className="text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Free Shipping</p>
                  <p className="text-3xl font-bold text-primary">
                    ${discounts.freeShippingThreshold || 'N/A'}
                  </p>
                </div>
                <Eye size={32} className="text-purple-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Discount Tiers Tab */}
        {activeTab === 'tiers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Discount Tiers</h2>
              <button
                onClick={() => setShowTierForm(!showTierForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} />
                Add Tier
              </button>
            </div>

            {/* Add Tier Form */}
            {showTierForm && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-bold mb-4">Create New Discount Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Min Quantity</label>
                    <input
                      type="number"
                      value={tierForm.minQuantity}
                      onChange={(e) =>
                        setTierForm({ ...tierForm, minQuantity: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Max Quantity</label>
                    <input
                      type="number"
                      value={tierForm.maxQuantity}
                      onChange={(e) =>
                        setTierForm({ ...tierForm, maxQuantity: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Discount %</label>
                    <input
                      type="number"
                      value={tierForm.discountPercent}
                      onChange={(e) =>
                        setTierForm({ ...tierForm, discountPercent: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <input
                      type="text"
                      value={tierForm.description}
                      onChange={(e) =>
                        setTierForm({ ...tierForm, description: e.target.value })
                      }
                      placeholder="e.g., 50-99 sq ft"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTier}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Create Tier
                  </button>
                  <button
                    onClick={() => setShowTierForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tiers List */}
            <div className="space-y-3">
              {discounts.discountTiers.map(tier => (
                <div key={tier.id} className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{tier.description}</p>
                    <p className="text-sm text-gray-600">
                      {tier.minQuantity} - {tier.maxQuantity || '∞'} sq ft
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{tier.discountPercent}%</p>
                      <p className="text-xs text-gray-600">discount</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteTier(tier.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Special Offers</h2>
              <button
                onClick={() => setShowOfferForm(!showOfferForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} />
                Add Offer
              </button>
            </div>

            {/* Add Offer Form */}
            {showOfferForm && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-bold mb-4">Create New Special Offer</h3>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      placeholder="e.g., Spring Hardwood Sale"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={offerForm.description}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, description: e.target.value })
                      }
                      placeholder="Describe the offer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Discount %</label>
                      <input
                        type="number"
                        value={offerForm.discountPercent}
                        onChange={(e) =>
                          setOfferForm({
                            ...offerForm,
                            discountPercent: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Coupon Code</label>
                      <input
                        type="text"
                        value={offerForm.code}
                        onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value })}
                        placeholder="e.g., SPRING20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date</label>
                      <input
                        type="date"
                        value={offerForm.startDate}
                        onChange={(e) =>
                          setOfferForm({ ...offerForm, startDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date</label>
                      <input
                        type="date"
                        value={offerForm.endDate}
                        onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Conditions</label>
                    <input
                      type="text"
                      value={offerForm.conditions}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, conditions: e.target.value })
                      }
                      placeholder="e.g., Minimum order $500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={offerForm.featured}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Featured Offer</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddOffer}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Create Offer
                  </button>
                  <button
                    onClick={() => setShowOfferForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Offers List */}
            <div className="space-y-3">
              {discounts.specialOffers.map(offer => (
                <div key={offer.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">{offer.title}</p>
                        {offer.featured && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Discount</p>
                      <p className="font-bold text-primary">{offer.discountPercent}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Code</p>
                      <p className="font-mono font-bold">{offer.code || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active</p>
                      <p className="font-bold">
                        {new Date() >= offer.startDate && new Date() <= offer.endDate
                          ? '✓ Yes'
                          : '✗ No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dates</p>
                      <p className="font-bold text-xs">
                        {offer.startDate.toLocaleDateString()} -{' '}
                        {offer.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Discount Analytics</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-600">
              <p className="mb-4">Analytics dashboard coming soon!</p>
              <p className="text-sm">
                Track discount usage, revenue impact, and top performing offers.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
