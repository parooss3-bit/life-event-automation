import { SpecialOffer } from '../lib/discounts'
import { Zap, Calendar, Tag, AlertCircle } from 'lucide-react'

interface SpecialOffersProps {
  offers: SpecialOffer[]
  featured?: boolean
}

export default function SpecialOffers({
  offers,
  featured = false,
}: SpecialOffersProps) {
  if (!offers || offers.length === 0) return null

  // Filter featured offers if requested
  const displayOffers = featured
    ? offers.filter(o => o.featured)
    : offers

  if (displayOffers.length === 0) return null

  return (
    <div className="space-y-3">
      {displayOffers.map(offer => (
        <div
          key={offer.id}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3 flex-1">
              <div className="bg-amber-500 text-white p-2 rounded-lg mt-1">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base">
                  {offer.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {offer.description}
                </p>

                {/* Offer details */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {/* Discount badge */}
                  <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <Tag size={16} />
                    Save {offer.discountPercent}%
                    {offer.discountAmount && ` or $${offer.discountAmount}`}
                  </div>

                  {/* Date range */}
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <Calendar size={16} />
                    {offer.startDate.toLocaleDateString()} -{' '}
                    {offer.endDate.toLocaleDateString()}
                  </div>

                  {/* Coupon code */}
                  {offer.code && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                      Code: {offer.code}
                    </div>
                  )}
                </div>

                {/* Conditions */}
                {offer.conditions && (
                  <div className="flex items-start gap-2 mt-3 bg-white bg-opacity-50 p-2 rounded border border-amber-200">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Conditions:</span>{' '}
                      {offer.conditions}
                    </p>
                  </div>
                )}

                {/* Applicable products */}
                {offer.applicableProducts.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold">Applies to:</span>{' '}
                    {offer.applicableProducts.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Featured badge */}
            {offer.featured && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">
                🔥 Featured
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
