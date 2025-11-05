import { useState, useMemo } from 'react'
import { useManga } from '../hooks/useManga'
import MangaCard from '../components/manga/MangaCard'
import SearchFilter from '../components/manga/SearchFilter'
import Loading from '../components/common/Loading'

export default function HomePage() {
  const { mangas, isLoading } = useManga()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ genre: '', sortBy: 'newest' })

  const filteredMangas = useMemo(() => {
    let result = [...mangas]

    if (searchTerm) {
      result = result.filter(
        (manga) =>
          manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manga.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.genre) {
      result = result.filter((manga) =>
        manga.genre?.includes(filters.genre)
      )
    }

    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => {
          const aCount = a.bookmarks?.[0]?.count || 0
          const bCount = b.bookmarks?.[0]?.count || 0
          return bCount - aCount
        })
        break
      case 'highest_rated':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        break
    }

    return result
  }, [mangas, searchTerm, filters])

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          🎌 MangaSelf
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Platform Sharing & Tracking Manga - Temukan dan bagikan manga favoritmu!
        </p>
      </div>

      <SearchFilter
        onSearch={setSearchTerm}
        onFilter={setFilters}
      />

      {filteredMangas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {searchTerm || filters.genre
              ? 'Tidak ada manga yang ditemukan'
              : 'Belum ada manga. Jadilah yang pertama menambahkan!'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Menampilkan {filteredMangas.length} manga
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMangas.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
