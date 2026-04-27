import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CanariasPrecio – Compara precios de supermercados en Canarias',
  description:
    'Compara precios de Mercadona, Lidl, Hiperdino y Superdino en las 7 islas canarias. Encuentra el producto más barato cerca de ti.',
  keywords: 'precios supermercados canarias, comparador precios, mercadona lidl hiperdino canarias',
  openGraph: {
    title: 'CanariasPrecio',
    description: 'Compara precios de supermercados en Canarias por isla',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
