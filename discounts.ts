// Bulk discounts and special offers management

export interface DiscountTier {
  id: string
  minQuantity: number
  maxQuantity?: number
  discountPercent: number
  description: string
}

export interface SpecialOffer {
  id: string
  title: string
  description: string
  discountPercent: number
  discountAmount?: number
  applicableProducts: string[] // Product IDs or categories
  startDate: Date
  endDate: Date
  conditions?: string // e.g., "Minimum order $500"
  code?: string // Coupon code
  featured: boolean
}

export interface SupplierDiscount {
  supplierId: string
  discountTiers: DiscountTier[]
  specialOffers: SpecialOffer[]
  bulkOrderMinimum: number // Minimum order quantity for bulk pricing
  freeShippingThreshold?: number // Free shipping above this amount
  lastUpdated: Date
}

// Mock data for suppliers
export const mockDiscounts: Record<string, SupplierDiscount> = {
  'supplier-1': {
    supplierId: 'supplier-1',
    bulkOrderMinimum: 50,
    freeShippingThreshold: 2000,
    discountTiers: [
      {
        id: 'tier-1',
        minQuantity: 50,
        maxQuantity: 99,
        discountPercent: 5,
        description: '50-99 sq ft',
      },
      {
        id: 'tier-2',
        minQuantity: 100,
        maxQuantity: 249,
        discountPercent: 10,
        description: '100-249 sq ft',
      },
      {
        id: 'tier-3',
        minQuantity: 250,
        maxQuantity: 499,
        discountPercent: 15,
        description: '250-499 sq ft',
      },
      {
        id: 'tier-4',
        minQuantity: 500,
        discountPercent: 20,
        description: '500+ sq ft',
      },
    ],
    specialOffers: [
      {
        id: 'offer-1',
        title: 'Spring Hardwood Sale',
        description: 'Get 15% off all hardwood flooring this March',
        discountPercent: 15,
        applicableProducts: ['hardwood'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        featured: true,
      },
      {
        id: 'offer-2',
        title: 'Contractor Bundle Deal',
        description: 'Buy 3 products, get 1 free on selected items',
        discountPercent: 25,
        applicableProducts: ['laminate', 'vinyl'],
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-04-30'),
        conditions: 'Minimum 3 different products',
        featured: true,
      },
      {
        id: 'offer-3',
        title: 'Free Installation Consultation',
        description: 'Free on-site consultation for orders over $5,000',
        discountPercent: 0,
        applicableProducts: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        conditions: 'Orders over $5,000',
        featured: false,
      },
    ],
    lastUpdated: new Date(),
  },
  'supplier-2': {
    supplierId: 'supplier-2',
    bulkOrderMinimum: 100,
    freeShippingThreshold: 1500,
    discountTiers: [
      {
        id: 'tier-1',
        minQuantity: 100,
        maxQuantity: 199,
        discountPercent: 8,
        description: '100-199 sq ft',
      },
      {
        id: 'tier-2',
        minQuantity: 200,
        maxQuantity: 399,
        discountPercent: 12,
        description: '200-399 sq ft',
      },
      {
        id: 'tier-3',
        minQuantity: 400,
        discountPercent: 18,
        description: '400+ sq ft',
      },
    ],
    specialOffers: [
      {
        id: 'offer-4',
        title: 'Luxury Vinyl Plank Promotion',
        description: 'Premium LVP at wholesale prices - Limited time only',
        discountPercent: 20,
        applicableProducts: ['luxury-vinyl'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        featured: true,
      },
    ],
    lastUpdated: new Date(),
  },
}

// Discount service functions
export const discountService = {
  // Get discounts for a supplier
  getSupplierDiscounts(supplierId: string): SupplierDiscount | null {
    return mockDiscounts[supplierId] || null
  },

  // Calculate discount for a given quantity
  calculateDiscount(
    supplierId: string,
    quantity: number,
    productCategory?: string
  ): {
    discountPercent: number
    discountTier?: DiscountTier
    applicableOffers: SpecialOffer[]
  } {
    const discounts = mockDiscounts[supplierId]
    if (!discounts) {
      return { discountPercent: 0, applicableOffers: [] }
    }

    // Find applicable discount tier
    const applicableTier = discounts.discountTiers.find(
      tier =>
        quantity >= tier.minQuantity &&
        (!tier.maxQuantity || quantity <= tier.maxQuantity)
    )

    // Find applicable special offers
    const now = new Date()
    const applicableOffers = discounts.specialOffers.filter(offer => {
      const isActive = offer.startDate <= now && offer.endDate >= now
      const isApplicable =
        offer.applicableProducts.length === 0 ||
        !productCategory ||
        offer.applicableProducts.includes(productCategory)
      return isActive && isApplicable
    })

    // Return highest discount
    const tierDiscount = applicableTier?.discountPercent || 0
    const offerDiscount = applicableOffers.length > 0
      ? Math.max(...applicableOffers.map(o => o.discountPercent))
      : 0

    return {
      discountPercent: Math.max(tierDiscount, offerDiscount),
      discountTier: applicableTier,
      applicableOffers,
    }
  },

  // Get active special offers for a supplier
  getActiveOffers(supplierId: string): SpecialOffer[] {
    const discounts = mockDiscounts[supplierId]
    if (!discounts) return []

    const now = new Date()
    return discounts.specialOffers.filter(
      offer => offer.startDate <= now && offer.endDate >= now
    )
  },

  // Get featured offers
  getFeaturedOffers(supplierId: string): SpecialOffer[] {
    const discounts = mockDiscounts[supplierId]
    if (!discounts) return []

    const now = new Date()
    return discounts.specialOffers.filter(
      offer =>
        offer.featured && offer.startDate <= now && offer.endDate >= now
    )
  },

  // Check if free shipping applies
  hasFreeShipping(supplierId: string, orderTotal: number): boolean {
    const discounts = mockDiscounts[supplierId]
    if (!discounts || !discounts.freeShippingThreshold) return false
    return orderTotal >= discounts.freeShippingThreshold
  },

  // Format discount for display
  formatDiscount(discountPercent: number, amount?: number): string {
    if (amount) {
      return `$${amount.toFixed(2)} off`
    }
    return `${discountPercent}% off`
  },

  // Calculate savings
  calculateSavings(
    originalPrice: number,
    discountPercent: number,
    quantity: number = 1
  ): number {
    return (originalPrice * quantity * discountPercent) / 100
  },

  // Get discount badge color
  getDiscountBadgeColor(discountPercent: number): string {
    if (discountPercent >= 20) return 'bg-red-500'
    if (discountPercent >= 15) return 'bg-orange-500'
    if (discountPercent >= 10) return 'bg-yellow-500'
    return 'bg-green-500'
  },

  // Create discount tier
  createDiscountTier(
    minQuantity: number,
    discountPercent: number,
    maxQuantity?: number,
    description?: string
  ): DiscountTier {
    return {
      id: `tier-${Date.now()}`,
      minQuantity,
      maxQuantity,
      discountPercent,
      description: description || `${minQuantity}+ units`,
    }
  },

  // Create special offer
  createSpecialOffer(
    title: string,
    discountPercent: number,
    startDate: Date,
    endDate: Date,
    options?: {
      description?: string
      applicableProducts?: string[]
      conditions?: string
      code?: string
      featured?: boolean
    }
  ): SpecialOffer {
    return {
      id: `offer-${Date.now()}`,
      title,
      description: options?.description || '',
      discountPercent,
      applicableProducts: options?.applicableProducts || [],
      startDate,
      endDate,
      conditions: options?.conditions,
      code: options?.code,
      featured: options?.featured || false,
    }
  },

  // Update discount tiers
  updateDiscountTiers(
    supplierId: string,
    tiers: DiscountTier[]
  ): SupplierDiscount | null {
    if (!mockDiscounts[supplierId]) return null
    mockDiscounts[supplierId].discountTiers = tiers
    mockDiscounts[supplierId].lastUpdated = new Date()
    return mockDiscounts[supplierId]
  },

  // Add special offer
  addSpecialOffer(supplierId: string, offer: SpecialOffer): SupplierDiscount | null {
    if (!mockDiscounts[supplierId]) return null
    mockDiscounts[supplierId].specialOffers.push(offer)
    mockDiscounts[supplierId].lastUpdated = new Date()
    return mockDiscounts[supplierId]
  },

  // Remove special offer
  removeSpecialOffer(supplierId: string, offerId: string): SupplierDiscount | null {
    if (!mockDiscounts[supplierId]) return null
    mockDiscounts[supplierId].specialOffers = mockDiscounts[
      supplierId
    ].specialOffers.filter(o => o.id !== offerId)
    mockDiscounts[supplierId].lastUpdated = new Date()
    return mockDiscounts[supplierId]
  },
}
