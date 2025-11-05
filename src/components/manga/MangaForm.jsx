import { useState } from 'react'
import { GENRES, STATUS_OPTIONS } from '../../utils/constants'

export default function MangaForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      cover_image: '',
      genre: '',
      status: 'ongoing',
      last_chapter_read: 0,
      rating: 0,
      review: '',
    }
  )

  const [selectedGenres, setSelectedGenres] = useState(
    initialData?.genre ? initialData.genre.split(',').map(g => g.trim()) : []
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSubmit = {
      ...formData,
      genre: selectedGenres.join(', '),
      last_chapter_read: parseInt(formData.last_chapter_read) || 0,
      rating: parseFloat(formData.rating) || 0,
    }
    onSubmit(dataToSubmit)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Judul Manga <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Masukkan judul manga"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          URL Cover Image
        </label>
        <input
          type="url"
          name="cover_image"
          value={formData.cover_image}
          onChange={handleChange}
          className="input-field"
          placeholder="https://example.com/cover.jpg"
        />
        {formData.cover_image && (
          <div className="mt-2">
            <img
              src={formData.cover_image}
              alt="Preview"
              className="w-32 h-48 object-cover rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400?text=Invalid+URL'
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Genre <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => handleGenreToggle(genre)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedGenres.includes(genre)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        {selectedGenres.length === 0 && (
          <p className="text-sm text-red-500 mt-1">Pilih minimal 1 genre</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="input-field"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Chapter Terakhir yang Dibaca
        </label>
        <input
          type="number"
          name="last_chapter_read"
          value={formData.last_chapter_read}
          onChange={handleChange}
          min="0"
          className="input-field"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Rating Pribadi (0-10)
        </label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="10"
          step="0.1"
          className="input-field"
          placeholder="0.0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Review Singkat
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          rows="4"
          className="input-field"
          placeholder="Tulis review singkat tentang manga ini..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || selectedGenres.length === 0}
        className="w-full btn-primary"
      >
        {loading ? 'Loading...' : initialData ? 'Update Manga' : 'Tambah Manga'}
      </button>
    </form>
  )
}
