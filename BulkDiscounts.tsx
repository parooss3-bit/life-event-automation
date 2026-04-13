import { DiscountTier } from '../lib/discounts'
import { TrendingDown, Package } from 'lucide-react'

interface BulkDiscountsProps {
  tiers: DiscountTier[]
  bulkOrderMinimum: number
}

export default function BulkDiscounts({
  tiers,
  bulkOrderMinimum,
}: BulkDiscountsProps) {
  if (!tiers || tiers.length === 0) return null

  // Sort tiers by min quantity
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity)

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500 text-white p-2 rounded-lg">
          <TrendingDown size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Bulk Buy Discounts</h3>
          <p className="text-sm text-gray-600">
            Order {bulkOrderMinimum}+ sq ft and save
          </p>
        </div>
      </div>

      {/* Discount tiers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {sortedTiers.map(tier => (
          <div
            key={tier.id}
            className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {tier.description}
                </span>
              </div>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-bold">
                -{tier.discountPercent}%
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Min: {tier.minQuantity} sq ft
              {tier.maxQuantity && ` - Max: ${tier.maxQuantity} sq ft`}
            </p>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 Tip:</p>
        <p>
          The more you order, the bigger your savings! Contact us for custom quotes
          on large orders.
        </p>
      </div>
    </div>
  )
}
