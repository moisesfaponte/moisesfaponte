'use client'
import { useState, useEffect, useCallback } from 'react'
import IslandSelector from '@/components/IslandSelector'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'
import CategoryGrid from '@/components/CategoryGrid'
import SupermarketLegend from '@/components/SupermarketLegend'
import type { ProductWithPrices } from '@/lib/types'
import { ISLANDS } from '@/lib/data'
import { Loader2, PackageSearch } from 'lucide-react'

const DEFAULT_ISLAND = 'gran-canaria'

export default function HomePage() {
  const [selectedIsland, setSelectedIsland] = useState(DEFAULT_ISLAND)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductWithPrices[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [sortBy, setSortBy] = useState<'cheapest' | 'name'>('cheapest')

  const fetchProducts = useCallback(async (q: string, island: string) => {
    if (!q.trim()) {
      setProducts([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(q)}&island=${encodeURIComponent(island)}`
      )
      const data = await res.json()
      setProducts(data.products ?? [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query) fetchProducts(query, selectedIsland)
  }, [selectedIsland, query, fetchProducts])

  const handleSearch = (q: string) => {
    setQuery(q)
    fetchProducts(q, selectedIsland)
  }

  const handleIslandChange = (islandId: string) => {
    setSelectedIsland(islandId)
  }

  const handleCategorySelect = (categoryName: string) => {
    setQuery(categoryName)
    fetchProducts(categoryName, selectedIsland)
  }

  const islandName = ISLANDS.find((i) => i.id === selectedIsland)?.name ?? ''

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'cheapest') return a.cheapestPrice - b.cheapestPrice
    return a.name.localeCompare(b.name, 'es')
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Compara precios en{' '}
          <span className="text-green-600">Canarias</span>
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Encuentra el supermercado más barato en tu isla y ahorra en tu compra semanal.
        </p>
      </div>

      {/* Island selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <IslandSelector selectedIsland={selectedIsland} onChange={handleIslandChange} />
      </div>

      {/* Search */}
      <div className="space-y-3">
        <SearchBar onSearch={handleSearch} initialValue={query} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Supermercados en {islandName}:</span>
          <SupermarketLegend islandId={selectedIsland} />
        </div>
      </div>

      {/* Categories (show when no search) */}
      {!query && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Explorar por categoría
          </h2>
          <CategoryGrid onSelect={handleCategorySelect} />
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Loader2 className="animate-spin text-green-600" size={36} />
          <p className="text-gray-500 text-sm">Comparando precios en {islandName}...</p>
        </div>
      )}

      {!loading && searched && products.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <PackageSearch size={48} className="text-gray-300" />
          <p className="text-gray-500 font-medium">No encontramos productos para "{query}"</p>
          <p className="text-gray-400 text-sm">Prueba con otro término de búsqueda</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              {' '}en {islandName}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'cheapest' | 'name')}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white
                           focus:outline-none focus:border-green-400"
              >
                <option value="cheapest">Precio más bajo</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <p className="text-xs text-center text-gray-400 pt-4">
            Precios actualizados regularmente. Pueden existir variaciones en tienda.
          </p>
        </div>
      )}

      {/* Info cards (when no search) */}
      {!query && !searched && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {[
            { emoji: '💰', title: 'Ahorra en tu compra', desc: 'Compara precios de más de 30 productos básicos' },
            { emoji: '🏝️', title: '7 islas canarias', desc: 'Precios adaptados a cada isla, incluyendo el coste de transporte' },
            { emoji: '🔄', title: 'Datos actualizados', desc: 'Precios sincronizados regularmente con Mercadona, Lidl e Hiperdino' },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{card.emoji}</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
