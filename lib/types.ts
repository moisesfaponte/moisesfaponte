export interface SupermarketInfo {
  id: string
  name: string
  color: string
  website: string
}

export interface IslandInfo {
  id: string
  name: string
}

export interface ProductWithPrices {
  id: number
  name: string
  brand: string | null
  category: string
  unit: string
  imageEmoji: string
  prices: PriceEntry[]
  cheapestPrice: number
  mostExpensivePrice: number
  savings: number
}

export interface PriceEntry {
  supermarketId: string
  supermarketName: string
  supermarketColor: string
  islandId: string
  price: number
  isCheapest: boolean
}

export interface SearchResponse {
  products: ProductWithPrices[]
  island: IslandInfo
  total: number
}
