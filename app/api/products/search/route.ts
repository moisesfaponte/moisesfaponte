import { NextRequest, NextResponse } from 'next/server'
import productsData from '@/lib/products-data.json'
import type { ProductWithPrices, PriceEntry } from '@/lib/types'

type RawProduct = (typeof productsData)[number]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()
  const islandId = searchParams.get('island') ?? 'gran-canaria'

  if (!query) {
    return NextResponse.json({ products: [], total: 0 })
  }

  const matched = (productsData as RawProduct[]).filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.brand ?? '').toLowerCase().includes(query)
  )

  const result: ProductWithPrices[] = matched
    .map((p) => {
      const islandPrices = p.prices.filter((pr) => pr.islandId === islandId)
      if (islandPrices.length === 0) return null

      const minPrice = Math.min(...islandPrices.map((e) => e.price))
      const maxPrice = Math.max(...islandPrices.map((e) => e.price))

      const entries: PriceEntry[] = islandPrices.map((pr) => ({
        supermarketId: pr.supermarketId,
        supermarketName: pr.supermarketName,
        supermarketColor: pr.supermarketColor,
        islandId: pr.islandId,
        price: pr.price,
        isCheapest: pr.price === minPrice,
      }))

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        unit: p.unit,
        imageEmoji: p.imageEmoji,
        prices: entries,
        cheapestPrice: minPrice,
        mostExpensivePrice: maxPrice,
        savings: Math.round((maxPrice - minPrice) * 100) / 100,
      } satisfies ProductWithPrices
    })
    .filter(Boolean) as ProductWithPrices[]

  return NextResponse.json({ products: result, total: result.length })
}
