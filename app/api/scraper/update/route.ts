import { NextRequest, NextResponse } from 'next/server'
import { searchMercadona } from '@/lib/scrapers/mercadona'
import { searchHiperdino } from '@/lib/scrapers/hiperdino'
import { searchLidl } from '@/lib/scrapers/lidl'
import { prisma } from '@/lib/prisma'

// Protected endpoint to trigger price updates
// In production, protect this with a secret token
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

  const results: Record<string, unknown> = {}

  // Run all scrapers in parallel
  const [mercadonaResults, hiperdinoResults, lidlResults] = await Promise.allSettled([
    searchMercadona(productName, islandId),
    searchHiperdino(productName),
    searchLidl(productName),
  ])

  results.mercadona = mercadonaResults.status === 'fulfilled'
    ? mercadonaResults.value.slice(0, 3)
    : { error: 'scrape failed' }

  results.hiperdino = hiperdinoResults.status === 'fulfilled'
    ? hiperdinoResults.value.slice(0, 3)
    : { error: 'scrape failed' }

  results.lidl = lidlResults.status === 'fulfilled'
    ? lidlResults.value.slice(0, 3)
    : { error: 'scrape failed' }

  // Here you would parse the results and update the database
  // For now, we return the raw scraper data for review

  return NextResponse.json({
    message: 'Scrape completed',
    island: islandId,
    query: productName,
    results,
  })
}

// GET: return last update timestamp per supermarket
export async function GET() {
  const lastUpdated = await prisma.price.aggregate({
    _max: { updatedAt: true },
    _min: { updatedAt: true },
  })

  const totalPrices = await prisma.price.count()
  const totalProducts = await prisma.product.count()

  return NextResponse.json({
    lastUpdated: lastUpdated._max.updatedAt,
    totalPrices,
    totalProducts,
  })
}
