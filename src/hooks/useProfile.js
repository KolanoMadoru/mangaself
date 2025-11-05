import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      const { data: mangas, error: mangasError } = await supabase
        .from('mangas')
        .select('*, bookmarks(count), comments(count)')
        .eq('user_id', userId)

      if (mangasError) throw mangasError

      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select(`
          id,
          manga_id,
          mangas (
            id,
            title,
            cover_image,
            genre,
            status,
            rating
          )
        `)
        .eq('user_id', userId)

      if (bookmarksError) throw bookmarksError

      const { count: totalBookmarks } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      return {
        ...profile,
        mangas: mangas || [],
        bookmarks: bookmarks || [],
        stats: {
          totalMangas: mangas?.length || 0,
          totalBookmarks: totalBookmarks || 0,
        }
      }
    },
    enabled: !!userId,
  })
}
