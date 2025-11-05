import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMangaById, useBookmark, useComment, useManga } from '../../hooks/useManga'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'

export default function MangaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: manga, isLoading } = useMangaById(id)
  const { toggleBookmark } = useBookmark()
  const { addComment, deleteComment } = useComment()
  const { deleteManga } = useManga()
  const [comment, setComment] = useState('')

  if (isLoading) return <Loading />
  if (!manga) return <div>Manga tidak ditemukan</div>

  const isOwner = user?.id === manga.user_id
  const isBookmarked = manga.bookmarks?.some(
    (bookmark) => bookmark.user_id === user?.id
  )

  const handleBookmark = () => {
    if (user) {
      toggleBookmark.mutate({ mangaId: manga.id, userId: user.id })
    } else {
      toast.error('Silakan login terlebih dahulu')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return
    }
    if (!comment.trim()) return

    await addComment.mutateAsync({
      mangaId: manga.id,
      userId: user.id,
      content: comment,
    })
    setComment('')
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Yakin ingin menghapus komentar ini?')) {
      await deleteComment.mutateAsync(commentId)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Yakin ingin menghapus manga ini?')) {
      await deleteManga.mutateAsync(manga.id)
      navigate('/')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <img
            src={manga.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'}
            alt={manga.title}
            className="w-full rounded-lg shadow-lg"
          />
          
          {user && (
            <button
              onClick={handleBookmark}
              className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
            >
              <span>{isBookmarked ? '❤️' : '🤍'}</span>
              <span>{isBookmarked ? 'Hapus dari Bookmark' : 'Tambah ke Bookmark'}</span>
            </button>
          )}

          {isOwner && (
            <div className="mt-4 space-y-2">
              <Link
                to={`/manga/${manga.id}/edit`}
                className="w-full btn-secondary flex items-center justify-center"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🗑️ Hapus
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {manga.title}
          </h1>

          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded ${
              manga.status === 'ongoing' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {manga.status === 'ongoing' ? 'Ongoing' : 'Completed'}
            </span>
            <span className="text-lg">⭐ {manga.rating}/10</span>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              👤 Ditambahkan oleh:{' '}
              <Link
                to={`/profile/${manga.user_id}`}
                className="text-primary-600 hover:underline"
              >
                {manga.profiles?.full_name}
              </Link>
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Genre:</h3>
            <div className="flex flex-wrap gap-2">
              {manga.genre?.split(',').map((genre, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Chapter Terakhir Dibaca:</h3>
            <p className="text-gray-600 dark:text-gray-400">📖 Chapter {manga.last_chapter_read}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Review:</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {manga.review || 'Tidak ada review'}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Statistik:</h3>
            <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
              <span>❤️ {manga.bookmarks?.length || 0} Bookmark</span>
              <span>💬 {manga.comments?.length || 0} Komentar</span>
            </div>
          </div>

          {manga.bookmarks && manga.bookmarks.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Di-bookmark oleh:</h3>
              <div className="flex flex-wrap gap-2">
                {manga.bookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.id}
                    to={`/profile/${bookmark.user_id}`}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {bookmark.profiles?.full_name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">💬 Komentar ({manga.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentar..."
              className="input-field mb-2"
              rows="3"
            />
            <button
              type="submit"
              disabled={!comment.trim() || addComment.isPending}
              className="btn-primary"
            >
              {addComment.isPending ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {manga.comments?.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          ) : (
            manga.comments?.map((comment) => (
              <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/profile/${comment.profiles?.id}`}
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    {comment.profiles?.full_name}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('id-ID')}
                    </span>
                    {(user?.id === comment.user_id || user?.user_metadata?.is_admin) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
