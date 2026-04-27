'use client'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
            <ShoppingCart size={20} />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg leading-none">
              Canarias<span className="text-green-600">Precio</span>
            </span>
            <p className="text-xs text-gray-500 leading-none">Compara y ahorra</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-green-600 transition-colors">Inicio</Link>
          <Link href="/?categoria=ofertas" className="hover:text-green-600 transition-colors hidden sm:block">
            Ofertas
          </Link>
          <a
            href="https://github.com/moisesfaponte/moisesfaponte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors hidden sm:block"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
