'use client'
import { ISLANDS, ISLAND_EMOJI } from '@/lib/data'

interface IslandSelectorProps {
  selectedIsland: string
  onChange: (islandId: string) => void
}

export default function IslandSelector({ selectedIsland, onChange }: IslandSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-600 mb-3">¿En qué isla estás?</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {ISLANDS.map((island) => {
          const isSelected = selectedIsland === island.id
          return (
            <button
              key={island.id}
              onClick={() => onChange(island.id)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center
                ${isSelected
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-105'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50'
                }
              `}
            >
              <span className="text-2xl">{ISLAND_EMOJI[island.id]}</span>
              <span className="text-xs font-medium leading-tight">{island.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
