/**
 * Hiperdino / Superdino scraper.
 * Hiperdino is the largest supermarket chain in the Canary Islands.
 * Website: https://www.hiperdino.es
 * They have a product catalog organized by categories.
 */
import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://www.hiperdino.es'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'es-ES,es;q=0.9',
}

export interface HiperdinoProduct {
  name: string
  price: number
  pricePerUnit: string
  imageUrl: string
  url: string
  brand: string
}

export async function searchHiperdino(query: string): Promise<HiperdinoProduct[]> {
  try {
    const url = `${BASE_URL}/es/buscar?q=${encodeURIComponent(query)}`
    const response = await axios.get(url, { headers: HEADERS, timeout: 10000 })
    const $ = cheerio.load(response.data)
    const products: HiperdinoProduct[] = []

    $('.product-item, .product-card, [data-product]').each((_, el) => {
      const name = $(el).find('.product-name, .product-title, h2, h3').first().text().trim()
      const priceText = $(el).find('.price, .product-price, [class*="price"]').first().text().trim()
      const price = parseFloat(priceText.replace(',', '.').replace(/[^\d.]/g, ''))
      const imageUrl = $(el).find('img').first().attr('src') ?? ''
      const href = $(el).find('a').first().attr('href') ?? ''
      const brand = $(el).find('.brand, .manufacturer').first().text().trim()
      const pricePerUnit = $(el).find('.price-per-unit, .unit-price').first().text().trim()

      if (name && !isNaN(price)) {
        products.push({
          name,
          price,
          pricePerUnit,
          imageUrl: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
          url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
          brand,
        })
      }
    })

    return products
  } catch {
    return []
  }
}

export async function scrapeCategory(categoryPath: string): Promise<HiperdinoProduct[]> {
  try {
    const url = `${BASE_URL}${categoryPath}`
    const response = await axios.get(url, { headers: HEADERS, timeout: 10000 })
    const $ = cheerio.load(response.data)
    const products: HiperdinoProduct[] = []

    $('article.product, .product-item').each((_, el) => {
      const name = $(el).find('h2, h3, .name').first().text().trim()
      const priceText = $(el).find('.price-box .price').first().text().trim()
      const price = parseFloat(priceText.replace(',', '.').replace(/[^\d.]/g, ''))
      const imageUrl = $(el).find('img').first().attr('src') ?? ''
      const href = $(el).find('a').first().attr('href') ?? ''

      if (name && !isNaN(price)) {
        products.push({
          name,
          price,
          pricePerUnit: '',
          imageUrl: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
          url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
          brand: '',
        })
      }
    })

    return products
  } catch {
    return []
  }
}
