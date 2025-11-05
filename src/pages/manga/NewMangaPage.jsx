import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useManga } from '../../hooks/useManga'
import MangaForm from '../../components/manga/MangaForm'

export default function NewMangaPage() {
  const { user } = useAuth()
  const { createManga } = useManga()
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    await createManga.mutateAsync({
      ...formData,
      user_id: user.id,
    })
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📝 Tambah Manga Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bagikan manga yang sedang kamu baca dengan komunitas!
        </p>
      </div>

      <div className="card">
        <MangaForm
          onSubmit={handleSubmit}
          loading={createManga.isPending}
        />
      </div>
    </div>
  )
}
