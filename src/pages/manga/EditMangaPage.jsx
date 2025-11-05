import { useParams, useNavigate } from 'react-router-dom'
import { useMangaById, useManga } from '../../hooks/useManga'
import { useAuth } from '../../hooks/useAuth'
import MangaForm from '../../components/manga/MangaForm'
import Loading from '../../components/common/Loading'

export default function EditMangaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: manga, isLoading } = useMangaById(id)
  const { updateManga } = useManga()

  if (isLoading) return <Loading />
  if (!manga) return <div>Manga tidak ditemukan</div>
  if (manga.user_id !== user?.id) {
    navigate('/')
    return null
  }

  const handleSubmit = async (formData) => {
    await updateManga.mutateAsync({
      id: manga.id,
      ...formData,
    })
    navigate(`/manga/${manga.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ✏️ Edit Manga
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Perbarui informasi manga kamu
        </p>
      </div>

      <div className="card">
        <MangaForm
          initialData={manga}
          onSubmit={handleSubmit}
          loading={updateManga.isPending}
        />
      </div>
    </div>
  )
}
