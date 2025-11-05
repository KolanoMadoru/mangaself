import { useParams, Link } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'
import MangaCard from '../../components/manga/MangaCard'
import Loading from '../../components/common/Loading'

export default function ProfilePage() {
  const { userId } = useParams()
  const { data: profile, isLoading } = useProfile(userId)

  if (isLoading) return <Loading />
  if (!profile) return <div>Profile tidak ditemukan</div>

  return (
    <div>
      <div className="card mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile.full_name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-primary-600">
              {profile.stats.totalMangas}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Manga Dibuat
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-primary-600">
              {profile.stats.totalBookmarks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Bookmark
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-primary-600">
              {profile.mangas.reduce((sum, m) => sum + (m.bookmarks?.[0]?.count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Bookmark Diterima
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-primary-600">
              {profile.mangas.reduce((sum, m) => sum + (m.comments?.[0]?.count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Komentar
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📚 Manga yang Dibuat ({profile.mangas.length})
        </h2>
        {profile.mangas.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Belum ada manga yang dibuat
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profile.mangas.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ❤️ Bookmark ({profile.bookmarks.length})
        </h2>
        {profile.bookmarks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Belum ada bookmark
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profile.bookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                to={`/manga/${bookmark.manga_id}`}
                className="manga-card block"
              >
                <div className="relative">
                  <img
                    src={bookmark.mangas.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'}
                    alt={bookmark.mangas.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      bookmark.mangas.status === 'ongoing' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {bookmark.mangas.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {bookmark.mangas.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>⭐ {bookmark.mangas.rating || 'N/A'}/10</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
