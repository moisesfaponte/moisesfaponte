/**
 * Lidl Spain scraper.
 * Lidl has stores in Gran Canaria, Tenerife, Lanzarote, Fuerteventura and La Palma.
 * Website: https://www.lidl.es
 */
import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://www.lidl.es'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9',
}

export interface LidlProduct {
  name: string
  price: number
  originalPrice?: number
  pricePerUnit: string
  imageUrl: string
  url: string
  isOffer: boolean
  category: string
}

export async function searchLidl(query: string): Promise<LidlProduct[]> {
  try {
    const url = `${BASE_URL}/es/search?query=${encodeURIComponent(query)}`
    const response = await axios.get(url, { headers: HEADERS, timeout: 10000 })
    const $ = cheerio.load(response.data)
    const products: LidlProduct[] = []

    $('.product-grid-box, .product-tile, [data-product-id]').each((_, el) => {
      const name = $(el).find('.product-grid-box__title, .product-title, h3').first().text().trim()
      const priceText = $(el).find('.product-grid-box__price--current, .pricebox__price').first().text().trim()
      const price = parseFloat(priceText.replace(',', '.').replace(/[^\d.]/g, ''))
      const origPriceText = $(el).find('.product-grid-box__price--old, .pricebox__price--old').first().text().trim()
      const originalPrice = origPriceText
        ? parseFloat(origPriceText.replace(',', '.').replace(/[^\d.]/g, ''))
        : undefined
      const imageUrl = $(el).find('img').first().attr('src') ?? ''
      const href = $(el).find('a').first().attr('href') ?? ''
      const pricePerUnit = $(el).find('.pricebox__basic-price, .basic-price').first().text().trim()
      const isOffer = $(el).hasClass('product-grid-box--offer') || $(el).find('.offer-badge').length > 0

      if (name && !isNaN(price)) {
        products.push({
          name,
          price,
          originalPrice,
          pricePerUnit,
          imageUrl: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
          url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
          isOffer,
          category: '',
        })
      }
    })

    return products
  } catch {
    return []
  }
}

export async function getWeeklyOffers(): Promise<LidlProduct[]> {
  try {
    const url = `${BASE_URL}/es/ofertas-semanales`
    const response = await axios.get(url, { headers: HEADERS, timeout: 10000 })
    const $ = cheerio.load(response.data)
    const products: LidlProduct[] = []

    $('.offer-item, .weekly-offer').each((_, el) => {
      const name = $(el).find('h2, h3, .title').first().text().trim()
      const priceText = $(el).find('.price').first().text().trim()
      const price = parseFloat(priceText.replace(',', '.').replace(/[^\d.]/g, ''))
      const imageUrl = $(el).find('img').first().attr('src') ?? ''

      if (name && !isNaN(price)) {
        products.push({
          name,
          price,
          pricePerUnit: '',
          imageUrl,
          url: url,
          isOffer: true,
          category: 'Oferta',
        })
      }
    })

    return products
  } catch {
    return []
  }
}
