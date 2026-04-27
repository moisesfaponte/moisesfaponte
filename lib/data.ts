import type { IslandInfo, SupermarketInfo } from './types'

export const ISLANDS: IslandInfo[] = [
  { id: 'gran-canaria', name: 'Gran Canaria' },
  { id: 'tenerife', name: 'Tenerife' },
  { id: 'lanzarote', name: 'Lanzarote' },
  { id: 'fuerteventura', name: 'Fuerteventura' },
  { id: 'la-palma', name: 'La Palma' },
  { id: 'la-gomera', name: 'La Gomera' },
  { id: 'el-hierro', name: 'El Hierro' },
]

export const SUPERMARKETS: SupermarketInfo[] = [
  { id: 'mercadona', name: 'Mercadona', color: '#00A651', website: 'https://tienda.mercadona.es' },
  { id: 'lidl', name: 'Lidl', color: '#0050AA', website: 'https://www.lidl.es' },
  { id: 'hiperdino', name: 'Hiperdino', color: '#E8320A', website: 'https://www.hiperdino.es' },
  { id: 'superdino', name: 'Superdino', color: '#FF6B1A', website: 'https://www.superdino.es' },
]

export const CATEGORIES = [
  { id: 'lacteos', name: 'Lácteos', emoji: '🥛' },
  { id: 'huevos', name: 'Huevos', emoji: '🥚' },
  { id: 'panaderia', name: 'Panadería', emoji: '🍞' },
  { id: 'carnes', name: 'Carnes', emoji: '🥩' },
  { id: 'pescados', name: 'Pescados', emoji: '🐟' },
  { id: 'frutas', name: 'Frutas y Verduras', emoji: '🥦' },
  { id: 'aceites', name: 'Aceites y Conservas', emoji: '🫙' },
  { id: 'cereales', name: 'Cereales y Pastas', emoji: '🍝' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
  { id: 'limpieza', name: 'Limpieza', emoji: '🧺' },
  { id: 'higiene', name: 'Higiene Personal', emoji: '🧴' },
]

export const ISLAND_SUPERMARKETS: Record<string, string[]> = {
  'gran-canaria':  ['mercadona', 'lidl', 'hiperdino', 'superdino'],
  'tenerife':      ['mercadona', 'lidl', 'hiperdino', 'superdino'],
  'lanzarote':     ['lidl', 'hiperdino', 'superdino'],
  'fuerteventura': ['lidl', 'hiperdino', 'superdino'],
  'la-palma':      ['lidl', 'hiperdino', 'superdino'],
  'la-gomera':     ['hiperdino', 'superdino'],
  'el-hierro':     ['hiperdino', 'superdino'],
}

export const ISLAND_EMOJI: Record<string, string> = {
  'gran-canaria':  '🏝️',
  'tenerife':      '🌋',
  'lanzarote':     '🌵',
  'fuerteventura': '🏜️',
  'la-palma':      '🌿',
  'la-gomera':     '🌲',
  'el-hierro':     '🦎',
}
