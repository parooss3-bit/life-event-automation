import { useState } from 'react'
import { discountService } from '../lib/discounts'
import { Calculator, DollarSign } from 'lucide-react'

interface DiscountCalculatorProps {
  supplierId: string
  basePrice: number
  productCategory?: string
}

export default function DiscountCalculator({
  supplierId,
  basePrice,
  productCategory,
}: DiscountCalculatorProps) {
  const [quantity, setQuantity] = useState(100)
  const discounts = discountService.getSupplierDiscounts(supplierId)

  if (!discounts) return null

  const { discountPercent, discountTier, applicableOffers } =
    discountService.calculateDiscount(supplierId, quantity, productCategory)

  const totalPrice = basePrice * quantity
  const savings = discountService.calculateSavings(
    basePrice,
    discountPercent,
    quantity
  )
  const finalPrice = totalPrice - savings
  const hasFreeShipping = discountService.hasFreeShipping(supplierId, totalPrice)

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-500 text-white p-2 rounded-lg">
          <Calculator size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Discount Calculator</h3>
      </div>

      {/* Quantity input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Order Quantity (sq ft)
        </label>
        <div className="flex gap-2">
          <input
            type="range"
            min={discounts.bulkOrderMinimum}
            max={1000}
            step={10}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min={discounts.bulkOrderMinimum}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(discounts.bulkOrderMinimum, parseInt(e.target.value) || 0))}
            className="w-20 px-3 py-2 border border-green-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Minimum order: {discounts.bulkOrderMinimum} sq ft
        </p>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-lg p-4 space-y-2 mb-4 border border-green-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Base Price (per sq ft):</span>
          <span className="font-semibold text-gray-900">${basePrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Quantity:</span>
          <span className="font-semibold text-gray-900">{quantity} sq ft</span>
        </div>

        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Discount info */}
        {discountPercent > 0 && (
          <>
            <div className="flex justify-between text-sm bg-green-50 p-2 rounded">
              <span className="text-green-700 font-semibold">Discount ({discountPercent}%):</span>
              <span className="font-bold text-green-700">
                -${savings.toFixed(2)}
              </span>
            </div>

            {discountTier && (
              <p className="text-xs text-green-600 font-semibold">
                ✓ {discountTier.description} tier applied
              </p>
            )}

            {applicableOffers.length > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                ✓ {applicableOffers.length} special offer(s) available
              </p>
            )}
          </>
        )}

        {hasFreeShipping && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded text-xs text-blue-700 font-semibold">
            🚚 Free shipping on this order!
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="text-gray-900 font-bold">Total Price:</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${finalPrice.toFixed(2)}
            </div>
            {discountPercent > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                Save {discountPercent}% ({' '}
                {((savings / totalPrice) * 100).toFixed(0)}% off)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
        <DollarSign size={20} />
        Request Quote for {quantity} sq ft
      </button>
    </div>
  )
}
