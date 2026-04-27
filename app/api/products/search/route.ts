import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ProductWithPrices, PriceEntry } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = (searchParams.get('q') ?? '').trim()
  const islandId = searchParams.get('island') ?? 'gran-canaria'

  if (!query) {
    return NextResponse.json({ products: [], island: { id: islandId }, total: 0 })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { category: { contains: query } },
          { brand: { contains: query } },
        ],
      },
      include: {
        prices: {
          include: {
            store: {
              include: {
                supermarket: true,
                island: true,
              },
            },
          },
          where: {
            store: {
              islandId,
            },
          },
        },
      },
      take: 30,
    })

    const result: ProductWithPrices[] = products
      .filter((p) => p.prices.length > 0)
      .map((p) => {
        const priceEntries: PriceEntry[] = p.prices.map((pr) => ({
          supermarketId: pr.store.supermarket.id,
          supermarketName: pr.store.supermarket.name,
          supermarketColor: pr.store.supermarket.color,
          islandId: pr.store.island.id,
          price: pr.price,
          isCheapest: false,
        }))

        const minPrice = Math.min(...priceEntries.map((e) => e.price))
        const maxPrice = Math.max(...priceEntries.map((e) => e.price))

        priceEntries.forEach((e) => {
          e.isCheapest = e.price === minPrice
        })

        return {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          unit: p.unit,
          imageEmoji: p.imageEmoji,
          prices: priceEntries,
          cheapestPrice: minPrice,
          mostExpensivePrice: maxPrice,
          savings: Math.round((maxPrice - minPrice) * 100) / 100,
        }
      })

    const island = await prisma.island.findUnique({ where: { id: islandId } })

    return NextResponse.json({
      products: result,
      island,
      total: result.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Error al buscar productos' }, { status: 500 })
  }
}
