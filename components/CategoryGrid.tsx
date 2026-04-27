'use client'
import { CATEGORIES } from '@/lib/data'

interface CategoryGridProps {
  onSelect: (categoryName: string) => void
}

export default function CategoryGrid({ onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.name)}
          className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100
                     hover:border-green-300 hover:bg-green-50 transition-all text-center group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
          <span className="text-xs text-gray-600 font-medium leading-tight">{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
