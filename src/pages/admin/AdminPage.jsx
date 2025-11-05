import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: mangas = [], isLoading: mangasLoading } = useQuery({
    queryKey: ['admin-mangas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mangas')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          ),
          mangas:manga_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const deleteManga = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('mangas').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-mangas'])
      toast.success('Manga berhasil dihapus!')
    },
    onError: (error) => {
      toast.error('Gagal menghapus manga: ' + error.message)
    },
  })

  const deleteComment = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('comments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-comments'])
      toast.success('Komentar berhasil dihapus!')
    },
    onError: (error) => {
      toast.error('Gagal menghapus komentar: ' + error.message)
    },
  })

  const handleDeleteManga = async (id) => {
    if (window.confirm('Yakin ingin menghapus manga ini?')) {
      await deleteManga.mutateAsync(id)
    }
  }

  const handleDeleteComment = async (id) => {
    if (window.confirm('Yakin ingin menghapus komentar ini?')) {
      await deleteComment.mutateAsync(id)
    }
  }

  if (!user?.user_metadata?.is_admin) {
    navigate('/')
    return null
  }

  if (mangasLoading || commentsLoading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          👑 Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola manga dan komentar yang melanggar aturan
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📚 Semua Manga ({mangas.length})
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Judul</th>
                <th className="text-left py-3 px-4">Pembuat</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mangas.map((manga) => (
                <tr
                  key={manga.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <a
                      href={`/manga/${manga.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {manga.title}
                    </a>
                  </td>
                  <td className="py-3 px-4">{manga.profiles?.full_name}</td>
                  <td className="py-3 px-4">
                    {new Date(manga.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteManga(manga.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          💬 Semua Komentar ({comments.length})
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Komentar</th>
                <th className="text-left py-3 px-4">Manga</th>
                <th className="text-left py-3 px-4">Pembuat</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr
                  key={comment.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 max-w-xs truncate">
                    {comment.content}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`/manga/${comment.manga_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {comment.mangas?.title}
                    </a>
                  </td>
                  <td className="py-3 px-4">{comment.profiles?.full_name}</td>
                  <td className="py-3 px-4">
                    {new Date(comment.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
