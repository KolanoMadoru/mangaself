import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export const useManga = () => {
  const queryClient = useQueryClient()

  const { data: mangas = [], isLoading } = useQuery({
    queryKey: ['mangas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mangas')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          ),
          bookmarks (count),
          comments (count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const createManga = useMutation({
    mutationFn: async (mangaData) => {
      const { data, error } = await supabase
        .from('mangas')
        .insert([mangaData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mangas'])
      toast.success('Manga berhasil ditambahkan!')
    },
    onError: (error) => {
      toast.error('Gagal menambahkan manga: ' + error.message)
    },
  })

  const updateManga = useMutation({
    mutationFn: async ({ id, ...mangaData }) => {
      const { data, error } = await supabase
        .from('mangas')
        .update(mangaData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mangas'])
      toast.success('Manga berhasil diupdate!')
    },
    onError: (error) => {
      toast.error('Gagal mengupdate manga: ' + error.message)
    },
  })

  const deleteManga = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('mangas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mangas'])
      toast.success('Manga berhasil dihapus!')
    },
    onError: (error) => {
      toast.error('Gagal menghapus manga: ' + error.message)
    },
  })

  return {
    mangas,
    isLoading,
    createManga,
    updateManga,
    deleteManga,
  }
}

export const useMangaById = (id) => {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mangas')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email
          ),
          bookmarks (
            id,
            user_id,
            profiles:user_id (
              id,
              full_name
            )
          ),
          comments (
            id,
            content,
            created_at,
            profiles:user_id (
              id,
              full_name
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useBookmark = () => {
  const queryClient = useQueryClient()

  const toggleBookmark = useMutation({
    mutationFn: async ({ mangaId, userId }) => {
      const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('manga_id', mangaId)
        .eq('user_id', userId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existing.id)
        if (error) throw error
        return { action: 'removed' }
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ manga_id: mangaId, user_id: userId }])
        if (error) throw error
        return { action: 'added' }
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['mangas'])
      queryClient.invalidateQueries(['manga'])
      queryClient.invalidateQueries(['bookmarks'])
      toast.success(
        data.action === 'added' 
          ? 'Ditambahkan ke bookmark!' 
          : 'Dihapus dari bookmark!'
      )
    },
    onError: (error) => {
      toast.error('Gagal mengubah bookmark: ' + error.message)
    },
  })

  return { toggleBookmark }
}

export const useComment = () => {
  const queryClient = useQueryClient()

  const addComment = useMutation({
    mutationFn: async ({ mangaId, userId, content }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ manga_id: mangaId, user_id: userId, content }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manga'])
      toast.success('Komentar berhasil ditambahkan!')
    },
    onError: (error) => {
      toast.error('Gagal menambahkan komentar: ' + error.message)
    },
  })

  const deleteComment = useMutation({
    mutationFn: async (commentId) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manga'])
      toast.success('Komentar berhasil dihapus!')
    },
    onError: (error) => {
      toast.error('Gagal menghapus komentar: ' + error.message)
    },
  })

  return { addComment, deleteComment }
}
