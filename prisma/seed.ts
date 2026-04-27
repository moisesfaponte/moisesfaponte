import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const supermarkets = [
  { id: 'mercadona', name: 'Mercadona', color: '#00A651', website: 'https://tienda.mercadona.es' },
  { id: 'lidl', name: 'Lidl', color: '#0050AA', website: 'https://www.lidl.es' },
  { id: 'hiperdino', name: 'Hiperdino', color: '#E8320A', website: 'https://www.hiperdino.es' },
  { id: 'superdino', name: 'Superdino', color: '#FF6B1A', website: 'https://www.superdino.es' },
]

const islands = [
  { id: 'gran-canaria', name: 'Gran Canaria' },
  { id: 'tenerife', name: 'Tenerife' },
  { id: 'lanzarote', name: 'Lanzarote' },
  { id: 'fuerteventura', name: 'Fuerteventura' },
  { id: 'la-palma', name: 'La Palma' },
  { id: 'la-gomera', name: 'La Gomera' },
  { id: 'el-hierro', name: 'El Hierro' },
]

// Supermarkets available per island
const storeMatrix: Record<string, string[]> = {
  'gran-canaria':  ['mercadona', 'lidl', 'hiperdino', 'superdino'],
  'tenerife':      ['mercadona', 'lidl', 'hiperdino', 'superdino'],
  'lanzarote':     ['lidl', 'hiperdino', 'superdino'],
  'fuerteventura': ['lidl', 'hiperdino', 'superdino'],
  'la-palma':      ['lidl', 'hiperdino', 'superdino'],
  'la-gomera':     ['hiperdino', 'superdino'],
  'el-hierro':     ['hiperdino', 'superdino'],
}

// Island transport cost multiplier (smaller/remote islands are more expensive)
const islandMultiplier: Record<string, number> = {
  'gran-canaria':  1.00,
  'tenerife':      1.00,
  'lanzarote':     1.04,
  'fuerteventura': 1.04,
  'la-palma':      1.07,
  'la-gomera':     1.12,
  'el-hierro':     1.16,
}

// Base prices per supermarket [mercadona, lidl, hiperdino, superdino]
// null means product not available at that supermarket
const products: {
  name: string
  brand: string
  category: string
  unit: string
  imageEmoji: string
  prices: { mercadona: number | null; lidl: number | null; hiperdino: number | null; superdino: number | null }
}[] = [
  // LACTEOS
  {
    name: 'Leche entera 1L',
    brand: 'Hacendado / Milbona',
    category: 'Lácteos',
    unit: '1L',
    imageEmoji: '🥛',
    prices: { mercadona: 0.72, lidl: 0.69, hiperdino: 0.78, superdino: 0.80 },
  },
  {
    name: 'Leche semidesnatada 1L',
    brand: 'Hacendado / Milbona',
    category: 'Lácteos',
    unit: '1L',
    imageEmoji: '🥛',
    prices: { mercadona: 0.69, lidl: 0.67, hiperdino: 0.75, superdino: 0.77 },
  },
  {
    name: 'Yogur natural (pack 4)',
    brand: 'Danone / Milbona',
    category: 'Lácteos',
    unit: 'pack 4×125g',
    imageEmoji: '🍦',
    prices: { mercadona: 0.95, lidl: 0.79, hiperdino: 1.05, superdino: 1.08 },
  },
  {
    name: 'Queso tierno lonchas 200g',
    brand: 'Hacendado / Milbona',
    category: 'Lácteos',
    unit: '200g',
    imageEmoji: '🧀',
    prices: { mercadona: 1.85, lidl: 1.69, hiperdino: 1.99, superdino: 2.05 },
  },
  {
    name: 'Mantequilla 250g',
    brand: 'Hacendado / Milbona',
    category: 'Lácteos',
    unit: '250g',
    imageEmoji: '🧈',
    prices: { mercadona: 1.45, lidl: 1.29, hiperdino: 1.59, superdino: 1.65 },
  },
  // HUEVOS
  {
    name: 'Huevos tamaño M (12 uds)',
    brand: 'Hacendado / Favorina',
    category: 'Huevos',
    unit: '12 uds',
    imageEmoji: '🥚',
    prices: { mercadona: 2.15, lidl: 1.99, hiperdino: 2.29, superdino: 2.35 },
  },
  {
    name: 'Huevos tamaño L (6 uds)',
    brand: 'Hacendado / Favorina',
    category: 'Huevos',
    unit: '6 uds',
    imageEmoji: '🥚',
    prices: { mercadona: 1.35, lidl: 1.19, hiperdino: 1.45, superdino: 1.49 },
  },
  // PANADERIA
  {
    name: 'Pan de molde integral',
    brand: 'Bimbo / Panrico',
    category: 'Panadería',
    unit: '500g',
    imageEmoji: '🍞',
    prices: { mercadona: 1.25, lidl: 1.09, hiperdino: 1.39, superdino: 1.45 },
  },
  {
    name: 'Baguette precocida',
    brand: 'Hacendado / Milbona',
    category: 'Panadería',
    unit: '280g',
    imageEmoji: '🥖',
    prices: { mercadona: 0.59, lidl: 0.49, hiperdino: 0.65, superdino: 0.69 },
  },
  // CARNES
  {
    name: 'Pechuga de pollo filetes 500g',
    brand: 'Hacendado / Metzgerfrisch',
    category: 'Carnes',
    unit: '500g',
    imageEmoji: '🍗',
    prices: { mercadona: 3.25, lidl: 2.99, hiperdino: 3.49, superdino: 3.59 },
  },
  {
    name: 'Carne picada mixta 400g',
    brand: 'Hacendado / Metzgerfrisch',
    category: 'Carnes',
    unit: '400g',
    imageEmoji: '🥩',
    prices: { mercadona: 2.45, lidl: 2.29, hiperdino: 2.65, superdino: 2.75 },
  },
  {
    name: 'Lomo de cerdo adobado 500g',
    brand: 'Hacendado / Metzgerfrisch',
    category: 'Carnes',
    unit: '500g',
    imageEmoji: '🥩',
    prices: { mercadona: 3.15, lidl: 2.89, hiperdino: 3.39, superdino: 3.49 },
  },
  // PESCADOS
  {
    name: 'Atún en aceite de oliva (pack 3)',
    brand: 'Calvo / Nixe',
    category: 'Pescados y Conservas',
    unit: 'pack 3×80g',
    imageEmoji: '🐟',
    prices: { mercadona: 2.85, lidl: 2.49, hiperdino: 2.99, superdino: 3.10 },
  },
  {
    name: 'Merluza filetes congelados 400g',
    brand: 'Hacendado / Balea',
    category: 'Pescados y Conservas',
    unit: '400g',
    imageEmoji: '🐠',
    prices: { mercadona: 3.45, lidl: 2.99, hiperdino: 3.65, superdino: 3.75 },
  },
  // FRUTAS Y VERDURAS
  {
    name: 'Plátanos de Canarias 1kg',
    brand: 'Canarias',
    category: 'Frutas y Verduras',
    unit: '1kg',
    imageEmoji: '🍌',
    prices: { mercadona: 1.89, lidl: 1.75, hiperdino: 1.95, superdino: 1.99 },
  },
  {
    name: 'Tomates pera 1kg',
    brand: 'Granel',
    category: 'Frutas y Verduras',
    unit: '1kg',
    imageEmoji: '🍅',
    prices: { mercadona: 1.45, lidl: 1.29, hiperdino: 1.55, superdino: 1.59 },
  },
  {
    name: 'Patatas 2kg',
    brand: 'Granel',
    category: 'Frutas y Verduras',
    unit: '2kg',
    imageEmoji: '🥔',
    prices: { mercadona: 1.89, lidl: 1.69, hiperdino: 2.05, superdino: 2.10 },
  },
  {
    name: 'Cebollas 1kg',
    brand: 'Granel',
    category: 'Frutas y Verduras',
    unit: '1kg',
    imageEmoji: '🧅',
    prices: { mercadona: 0.95, lidl: 0.85, hiperdino: 1.05, superdino: 1.09 },
  },
  {
    name: 'Manzanas Golden 1kg',
    brand: 'Granel',
    category: 'Frutas y Verduras',
    unit: '1kg',
    imageEmoji: '🍎',
    prices: { mercadona: 1.79, lidl: 1.59, hiperdino: 1.89, superdino: 1.95 },
  },
  // ACEITES Y CONDIMENTOS
  {
    name: 'Aceite de oliva virgen extra 750ml',
    brand: 'Hacendado / Belantis',
    category: 'Aceites y Conservas',
    unit: '750ml',
    imageEmoji: '🫙',
    prices: { mercadona: 4.95, lidl: 4.29, hiperdino: 5.25, superdino: 5.35 },
  },
  {
    name: 'Arroz redondo 1kg',
    brand: 'SOS / Trata',
    category: 'Cereales y Pastas',
    unit: '1kg',
    imageEmoji: '🍚',
    prices: { mercadona: 0.85, lidl: 0.79, hiperdino: 0.95, superdino: 0.99 },
  },
  {
    name: 'Macarrones 500g',
    brand: 'Hacendado / Combino',
    category: 'Cereales y Pastas',
    unit: '500g',
    imageEmoji: '🍝',
    prices: { mercadona: 0.65, lidl: 0.59, hiperdino: 0.72, superdino: 0.75 },
  },
  // BEBIDAS
  {
    name: 'Agua mineral 1.5L (pack 6)',
    brand: 'Hacendado / Saskia',
    category: 'Bebidas',
    unit: 'pack 6×1.5L',
    imageEmoji: '💧',
    prices: { mercadona: 2.85, lidl: 2.49, hiperdino: 2.99, superdino: 3.05 },
  },
  {
    name: 'Coca-Cola 2L',
    brand: 'Coca-Cola',
    category: 'Bebidas',
    unit: '2L',
    imageEmoji: '🥤',
    prices: { mercadona: 2.15, lidl: 1.99, hiperdino: 2.25, superdino: 2.29 },
  },
  {
    name: 'Cerveza Tropical pack 6 latas',
    brand: 'Tropical',
    category: 'Bebidas',
    unit: 'pack 6×330ml',
    imageEmoji: '🍺',
    prices: { mercadona: null, lidl: null, hiperdino: 3.49, superdino: 3.55 },
  },
  {
    name: 'Cerveza Heineken pack 6',
    brand: 'Heineken',
    category: 'Bebidas',
    unit: 'pack 6×330ml',
    imageEmoji: '🍺',
    prices: { mercadona: 3.95, lidl: 3.69, hiperdino: 4.15, superdino: 4.25 },
  },
  // LIMPIEZA
  {
    name: 'Detergente lavadora 30 lavados',
    brand: 'Hacendado / Formil',
    category: 'Limpieza',
    unit: '30 lavados',
    imageEmoji: '🧺',
    prices: { mercadona: 4.25, lidl: 3.79, hiperdino: 4.55, superdino: 4.65 },
  },
  {
    name: 'Suavizante 60 lavados 1.5L',
    brand: 'Hacendado / Formil',
    category: 'Limpieza',
    unit: '1.5L / 60 lavados',
    imageEmoji: '🧴',
    prices: { mercadona: 2.95, lidl: 2.49, hiperdino: 3.15, superdino: 3.25 },
  },
  {
    name: 'Papel higiénico pack 12 rollos',
    brand: 'Hacendado / Floralys',
    category: 'Limpieza',
    unit: '12 rollos',
    imageEmoji: '🧻',
    prices: { mercadona: 3.95, lidl: 3.49, hiperdino: 4.25, superdino: 4.35 },
  },
  // HIGIENE
  {
    name: 'Gel de ducha 750ml',
    brand: 'Hacendado / Cien',
    category: 'Higiene Personal',
    unit: '750ml',
    imageEmoji: '🚿',
    prices: { mercadona: 1.65, lidl: 1.29, hiperdino: 1.79, superdino: 1.85 },
  },
  {
    name: 'Champú cabello normal 400ml',
    brand: 'Hacendado / Cien',
    category: 'Higiene Personal',
    unit: '400ml',
    imageEmoji: '🧴',
    prices: { mercadona: 1.45, lidl: 1.19, hiperdino: 1.59, superdino: 1.65 },
  },
]

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Supermarkets
  for (const sm of supermarkets) {
    await prisma.supermarket.upsert({
      where: { id: sm.id },
      update: sm,
      create: sm,
    })
  }
  console.log(`✅ ${supermarkets.length} supermercados creados`)

  // Islands
  for (const island of islands) {
    await prisma.island.upsert({
      where: { id: island.id },
      update: island,
      create: island,
    })
  }
  console.log(`✅ ${islands.length} islas creadas`)

  // Stores (supermarket × island combinations)
  const storeMap: Record<string, number> = {}
  for (const [islandId, smIds] of Object.entries(storeMatrix)) {
    for (const smId of smIds) {
      const store = await prisma.store.upsert({
        where: { supermarketId_islandId: { supermarketId: smId, islandId } },
        update: {},
        create: { supermarketId: smId, islandId },
      })
      storeMap[`${smId}_${islandId}`] = store.id
    }
  }
  console.log(`✅ ${Object.keys(storeMap).length} tiendas creadas`)

  // Products & Prices
  let priceCount = 0
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: (await prisma.product.findFirst({ where: { name: p.name } }))?.id ?? 0 },
      update: { name: p.name, brand: p.brand, category: p.category, unit: p.unit, imageEmoji: p.imageEmoji },
      create: { name: p.name, brand: p.brand, category: p.category, unit: p.unit, imageEmoji: p.imageEmoji },
    })

    const baseBySuper: Record<string, number | null> = {
      mercadona: p.prices.mercadona,
      lidl: p.prices.lidl,
      hiperdino: p.prices.hiperdino,
      superdino: p.prices.superdino,
    }

    for (const [islandId, smIds] of Object.entries(storeMatrix)) {
      const mult = islandMultiplier[islandId]
      for (const smId of smIds) {
        const basePrice = baseBySuper[smId]
        if (basePrice === null) continue
        const storeId = storeMap[`${smId}_${islandId}`]
        if (!storeId) continue
        const finalPrice = Math.round(basePrice * mult * 100) / 100
        await prisma.price.upsert({
          where: { productId_storeId: { productId: product.id, storeId } },
          update: { price: finalPrice },
          create: { productId: product.id, storeId, price: finalPrice },
        })
        priceCount++
      }
    }
  }

  console.log(`✅ ${products.length} productos y ${priceCount} precios creados`)
  console.log('🎉 Seed completado con éxito')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
