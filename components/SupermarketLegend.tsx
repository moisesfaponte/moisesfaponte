import { SUPERMARKETS, ISLAND_SUPERMARKETS } from '@/lib/data'

interface SupermarketLegendProps {
  islandId: string
}

export default function SupermarketLegend({ islandId }: SupermarketLegendProps) {
  const available = ISLAND_SUPERMARKETS[islandId] ?? []
  const supermarkets = SUPERMARKETS.filter((sm) => available.includes(sm.id))

  return (
    <div className="flex flex-wrap gap-2">
      {supermarkets.map((sm) => (
        <a
          key={sm.id}
          href={sm.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-100
                     hover:shadow-sm transition-shadow text-sm font-medium text-gray-700"
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: sm.color }}
          />
          {sm.name}
        </a>
      ))}
    </div>
  )
}
