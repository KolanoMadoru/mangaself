import { useState } from 'react'
import { GENRES, SORT_OPTIONS } from '../../utils/constants'

export default function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleGenreChange = (e) => {
    const value = e.target.value
    setSelectedGenre(value)
    onFilter({ genre: value, sortBy })
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    onFilter({ genre: selectedGenre, sortBy: value })
  }

  return (
    <div className="card mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            🔍 Cari Manga
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Cari berdasarkan judul atau pembuat..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            📚 Filter Genre
          </label>
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="input-field"
          >
            <option value="">Semua Genre</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            ⚡ Urutkan
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="input-field"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
