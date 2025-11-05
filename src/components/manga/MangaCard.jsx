import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useBookmark } from '../../hooks/useManga'

export default function MangaCard({ manga }) {
  const { user } = useAuth()
  const { toggleBookmark } = useBookmark()

  const isBookmarked = manga.bookmarks?.some(
    (bookmark) => bookmark.user_id === user?.id
  )

  const handleBookmark = (e) => {
    e.preventDefault()
    if (user) {
      toggleBookmark.mutate({ mangaId: manga.id, userId: user.id })
    }
  }

  return (
    <Link to={`/manga/${manga.id}`} className="manga-card block">
      <div className="relative">
        <img
          src={manga.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'}
          alt={manga.title}
          className="w-full h-64 object-cover"
        />
        {user && (
          <button
            onClick={handleBookmark}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            {isBookmarked ? '❤️' : '🤍'}
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            manga.status === 'ongoing' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {manga.status === 'ongoing' ? 'Ongoing' : 'Completed'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {manga.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="mr-2">⭐ {manga.rating || 'N/A'}/10</span>
          <span className="mr-2">• 📖 Ch. {manga.last_chapter_read || 0}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {manga.genre?.split(',').slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
            >
              {genre.trim()}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {manga.review || 'Tidak ada review'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>👤 {manga.profiles?.full_name || 'Unknown'}</span>
          <div className="flex items-center space-x-3">
            <span>❤️ {manga.bookmarks?.[0]?.count || 0}</span>
            <span>💬 {manga.comments?.[0]?.count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
