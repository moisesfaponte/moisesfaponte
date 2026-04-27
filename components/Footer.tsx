export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-2">
        <p className="text-sm font-semibold text-gray-700">
          Canarias<span className="text-green-600">Precio</span>
        </p>
        <p className="text-xs text-gray-400">
          Comparador de precios de supermercados en las Islas Canarias.
          Los precios son orientativos y pueden variar.
        </p>
        <p className="text-xs text-gray-400">
          Hecho con ❤️ en Canarias · Datos actualizados regularmente
        </p>
      </div>
    </footer>
  )
}
