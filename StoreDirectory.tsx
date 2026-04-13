import { Link, useSearch } from 'wouter'
import { Search, MapPin, Star, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { mockStores, flooringCategories } from '../lib/data'

export default function StoreDirectory() {
  const search = useSearch()
  const searchParams = new URLSearchParams(search)
  const initialCity = searchParams.get('city') || ''

  const [searchQuery, setSearchQuery] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRating, setSelectedRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const filteredStores = useMemo(() => {
    return mockStores.filter(store => {
      const matchesSearch = searchQuery === '' || 
        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === '' || 
        store.products.includes(selectedCategory.toLowerCase())
      
      const matchesRating = store.rating >= selectedRating

      return matchesSearch && matchesCategory && matchesRating
    })
  }, [searchQuery, selectedCategory, selectedRating])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Search Section */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container">
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by city, zip code, or store name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="btn-primary">
              <Search size={20} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-primary font-semibold md:hidden"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Flooring Type</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  {flooringCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Minimum Rating</label>
                <div className="space-y-2">
                  {[0, 3.5, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === rating}
                        onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedRating(0)
                  setSearchQuery('')
                }}
                className="w-full btn-outline text-center"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Store Listings */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredStores.length} supplier{filteredStores.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {filteredStores.length > 0 ? (
                filteredStores.map(store => (
                  <Link key={store.id} href={`/store/${store.id}`}>
                    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Image */}
                        <div className="md:col-span-1">
                          <img
                            src={store.imageUrl}
                            alt={store.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Info */}
                        <div className="md:col-span-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{store.name}</h3>
                              <p className="text-sm text-gray-600">
                                {store.address}, {store.city}, {store.state} {store.zipCode}
                              </p>
                            </div>
                            {store.isPremium && (
                              <span className="bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
                                Premium
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < Math.floor(store.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{store.rating} ({store.reviewCount} reviews)</span>
                          </div>

                          {/* Products & Services */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {store.products.map(product => (
                              <span key={product} className="text-xs bg-accent text-primary px-2 py-1 rounded">
                                {product}
                              </span>
                            ))}
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            {store.bulkDiscounts && <span>✓ Bulk Discounts</span>}
                            {store.deliveryAvailable && <span>✓ Delivery Available</span>}
                            {store.financing && <span>✓ Financing</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600 mb-4">No suppliers found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSelectedRating(0)
                      setSearchQuery('')
                    }}
                    className="btn-primary"
                  >
                    Clear Filters and Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
