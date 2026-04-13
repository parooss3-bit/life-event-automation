import { useParams } from 'wouter'
import { Phone, Mail, Globe, MapPin, Star, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { mockStores } from '../lib/data'
import BulkDiscounts from '../components/BulkDiscounts'
import SpecialOffers from '../components/SpecialOffers'
import DiscountCalculator from '../components/DiscountCalculator'
import { discountService } from '../lib/discounts'

export default function StoreProfile() {
  const { id } = useParams<{ id: string }>()
  const store = mockStores.find(s => s.id === id)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteMessage, setQuoteMessage] = useState('')

  if (!store) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={store.imageUrl}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-[Fraunces] text-4xl font-bold mb-2">{store.name}</h1>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(store.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-lg font-semibold">{store.rating}</span>
                    <span className="text-gray-600">({store.reviewCount} reviews)</span>
                  </div>
                </div>
                {store.isPremium && (
                  <span className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold">
                    Premium Supplier
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">{store.description}</p>
            </div>

            {/* Contact Information */}
            <div className="card mb-8">
              <h2 className="font-semibold text-xl mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{store.address}</p>
                    <p className="text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-primary flex-shrink-0" />
                  <a href={`tel:${store.phone}`} className="text-primary hover:underline font-semibold">
                    {store.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-primary flex-shrink-0" />
                  <a href={`mailto:${store.email}`} className="text-primary hover:underline font-semibold">
                    {store.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-primary flex-shrink-0" />
                  <a href={`https://${store.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    {store.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card mb-8">
              <h2 className="font-semibold text-xl mb-4">Hours of Operation</h2>
              <p className="text-gray-700">{store.hours}</p>
            </div>

            {/* Products & Services */}
            <div className="card mb-8">
              <h2 className="font-semibold text-xl mb-4">Products & Services</h2>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Flooring Types</h3>
                <div className="flex flex-wrap gap-2">
                  {store.products.map(product => (
                    <span key={product} className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {store.brands.map(brand => (
                    <span key={brand} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Services</h3>
                <ul className="space-y-2">
                  {store.services.map(service => (
                    <li key={service} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="capitalize">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bulk Discounts */}
            {store.bulkDiscounts && (
              <div className="mb-8">
                {(() => {
                  const discounts = discountService.getSupplierDiscounts(store.id)
                  return discounts ? (
                    <BulkDiscounts
                      tiers={discounts.discountTiers}
                      bulkOrderMinimum={discounts.bulkOrderMinimum}
                    />
                  ) : null
                })()}
              </div>
            )}

            {/* Special Offers */}
            {(() => {
              const offers = discountService.getActiveOffers(store.id)
              return offers.length > 0 ? (
                <div className="mb-8">
                  <h2 className="font-semibold text-xl mb-4">🎉 Active Promotions</h2>
                  <SpecialOffers offers={offers} />
                </div>
              ) : null
            })()}

            {/* Features */}
            <div className="card">
              <h2 className="font-semibold text-xl mb-4">Special Features</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold">Bulk Discounts</p>
                    <p className="text-sm text-gray-600">{store.bulkDiscounts ? 'Available' : 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-gray-600">{store.deliveryAvailable ? 'Available' : 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold">Financing</p>
                    <p className="text-sm text-gray-600">{store.financing ? 'Available' : 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold">In Business</p>
                    <p className="text-sm text-gray-600">{store.yearsInBusiness} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Quick Actions */}
            <div className="card mb-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${store.phone}`}
                  className="w-full btn-primary text-center flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Call Now
                </a>
                <a
                  href={`mailto:${store.email}`}
                  className="w-full btn-outline text-center flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Email
                </a>
                <button
                  onClick={() => setShowQuoteForm(!showQuoteForm)}
                  className="w-full btn-outline text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Request Quote
                </button>
              </div>
            </div>

            {/* Quote Form */}
            {showQuoteForm && (
              <div className="card mb-6">
                <h3 className="font-semibold text-lg mb-4">Request a Quote</h3>
                <textarea
                  placeholder="Describe your project and materials needed..."
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 h-24"
                />
                <button className="w-full btn-primary">
                  Send Quote Request
                </button>
              </div>
            )}

            {/* Discount Calculator */}
            {store.bulkDiscounts && (
              <div className="mb-6">
                <DiscountCalculator
                  supplierId={store.id}
                  basePrice={75}
                  productCategory="hardwood"
                />
              </div>
            )}

            {/* Store Stats */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">Store Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-primary">{store.rating}/5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-primary">{store.reviewCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years in Business</p>
                  <p className="text-2xl font-bold text-primary">{store.yearsInBusiness}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
