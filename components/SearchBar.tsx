'use client'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  initialValue?: string
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Busca leche, arroz, aceite...',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-4 text-base border-2 border-gray-200 rounded-2xl
                     focus:outline-none focus:border-green-500 bg-white shadow-sm
                     placeholder:text-gray-400 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 bg-green-600 hover:bg-green-700 text-white
                     px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
