/**
 * Mercadona scraper using their unofficial API.
 * Mercadona is available in Gran Canaria and Tenerife.
 * Warehouse codes for Canarias: the API uses warehouse identifiers.
 * We map islands to the closest peninsula warehouse as fallback.
 */
import axios from 'axios'

const BASE_URL = 'https://tienda.mercadona.es/api'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; CanariasPrecioBot/1.0)',
  Accept: 'application/json',
}

const ISLAND_WAREHOUSE: Record<string, string> = {
  'gran-canaria': 'vlc1',
  'tenerife': 'vlc1',
}

export interface MercadonaProduct {
  id: string
  slug: string
  display_name: string
  price_instructions: {
    unit_price: number
    bulk_price: number
    unit_size: number
    size_format: string
    approx_size: boolean
    selling_method: number
    price_decreased: boolean
  }
  thumbnail: string
  categories: string[]
}

export async function searchMercadona(
  query: string,
  islandId: string
): Promise<MercadonaProduct[]> {
  const warehouse = ISLAND_WAREHOUSE[islandId]
  if (!warehouse) return []

  try {
    const url = `${BASE_URL}/products/search/?q=${encodeURIComponent(query)}&lang=es&wh=${warehouse}`
    const response = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const results = response.data?.results ?? []
    return results as MercadonaProduct[]
  } catch {
    return []
  }
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get(`${BASE_URL}/categories/?lang=es`, {
      headers: HEADERS,
      timeout: 8000,
    })
    return response.data?.results ?? []
  } catch {
    return []
  }
}

export async function getProductsByCategory(
  categoryId: number,
  warehouse = 'vlc1'
): Promise<MercadonaProduct[]> {
  try {
    const url = `${BASE_URL}/categories/${categoryId}/?lang=es&wh=${warehouse}`
    const response = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const subcategories = response.data?.categories ?? []
    const products: MercadonaProduct[] = []
    for (const sub of subcategories) {
      if (sub.products) products.push(...sub.products)
    }
    return products
  } catch {
    return []
  }
}
