import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { useStore } from '../store/useStore'

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const { user, setUser, logout } = useStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  const handleAuthError = (error) => {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Konfigurasi Supabase belum diatur. Silakan hubungi administrator untuk mengatur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.'
        }
      }
    }

    if (error.message?.includes('fetch')) {
      return {
        error: {
          message: 'Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil dan URL Supabase sudah benar.'
        }
      }
    }

    return { error }
  }

  const signUp = async (email, password, fullName) => {
    try {
      if (!isSupabaseConfigured()) {
        return handleAuthError({ message: 'Supabase not configured' })
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return handleAuthError(error)
      }

      if (!error && data.user) {
        try {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          })
        } catch (profileError) {
          console.warn('Failed to create profile:', profileError)
        }
      }

      return { data, error }
    } catch (error) {
      console.error('SignUp error:', error)
      return handleAuthError(error)
    }
  }

  const signIn = async (email, password) => {
    try {
      if (!isSupabaseConfigured()) {
        return handleAuthError({ message: 'Supabase not configured' })
      }

      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (result.error) {
        return handleAuthError(result.error)
      }

      return result
    } catch (error) {
      console.error('SignIn error:', error)
      return handleAuthError(error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}
