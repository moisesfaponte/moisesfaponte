import { NextRequest, NextResponse } from 'next/server'
import { searchMercadona } from '@/lib/scrapers/mercadona'
import { searchHiperdino } from '@/lib/scrapers/hiperdino'
import { searchLidl } from '@/lib/scrapers/lidl'
import productsData from '@/lib/products-data.json'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.SCRAPER_SECRET ?? 'dev-secret'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { productName, islandId = 'gran-canaria' } = body as {
    productName: string
    islandId?: string
  }

  if (!productName) {
    return NextResponse.json({ error: 'productName required' }, { status: 400 })
  }

  const [mercadonaResults, hiperdinoResults, lidlResults] = await Promise.allSettled([
    searchMercadona(productName, islandId),
    searchHiperdino(productName),
    searchLidl(productName),
  ])

  return NextResponse.json({
    message: 'Scrape completed',
    island: islandId,
    query: productName,
    results: {
      mercadona: mercadonaResults.status === 'fulfilled' ? mercadonaResults.value.slice(0, 3) : { error: 'scrape failed' },
      hiperdino: hiperdinoResults.status === 'fulfilled' ? hiperdinoResults.value.slice(0, 3) : { error: 'scrape failed' },
      lidl: lidlResults.status === 'fulfilled' ? lidlResults.value.slice(0, 3) : { error: 'scrape failed' },
    },
  })
}

export async function GET() {
  const totalProducts = (productsData as unknown[]).length
  const totalPrices = (productsData as { prices: unknown[] }[]).reduce(
    (acc, p) => acc + p.prices.length,
    0
  )
  return NextResponse.json({
    totalProducts,
    totalPrices,
    lastUpdated: new Date().toISOString(),
  })
}
