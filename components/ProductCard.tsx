'use client'
import { TrendingDown } from 'lucide-react'
import type { ProductWithPrices, PriceEntry } from '@/lib/types'

interface ProductCardProps {
  product: ProductWithPrices
}

function SupermarketPriceBadge({ entry }: { entry: PriceEntry }) {
  return (
    <div
      className={`
        flex items-center justify-between p-2 rounded-lg border transition-all
        ${entry.isCheapest
          ? 'border-green-400 bg-green-50'
          : 'border-gray-100 bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.supermarketColor }}
        />
        <span className={`text-sm font-medium ${entry.isCheapest ? 'text-green-800' : 'text-gray-700'}`}>
          {entry.supermarketName}
        </span>
        {entry.isCheapest && (
          <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-medium">
            Más barato
          </span>
        )}
      </div>
      <span className={`font-bold text-sm ${entry.isCheapest ? 'text-green-700' : 'text-gray-800'}`}>
        {entry.price.toFixed(2)} €
      </span>
    </div>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const savingsPct = product.mostExpensivePrice > 0
    ? Math.round((product.savings / product.mostExpensivePrice) * 100)
    : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0 w-14 h-14 flex items-center justify-center
                          bg-gray-50 rounded-xl text-3xl">
            {product.imageEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {product.unit}
              </span>
              <span className="text-xs text-gray-400">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Savings banner */}
        {product.savings > 0.01 && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200
                          rounded-lg px-3 py-2">
            <TrendingDown size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Ahorra hasta{' '}
              <span className="font-bold text-amber-700">{product.savings.toFixed(2)} €</span>
              {' '}({savingsPct}%) eligiendo el más barato
            </p>
          </div>
        )}
      </div>

      {/* Prices */}
      <div className="p-4 space-y-2">
        {product.prices
          .slice()
          .sort((a, b) => a.price - b.price)
          .map((entry) => (
            <SupermarketPriceBadge key={entry.supermarketId} entry={entry} />
          ))}
      </div>
    </div>
  )
}
