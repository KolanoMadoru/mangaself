import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
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

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
      })
    }

    return { data, error }
  }

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
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
