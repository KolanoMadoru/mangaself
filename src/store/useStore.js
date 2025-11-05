import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      theme: 'light',
      
      setUser: (user) => set({ user }),
      
      logout: () => set({ user: null }),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'mangaself-storage',
      partialize: (state) => ({ 
        user: state.user,
        theme: state.theme 
      }),
    }
  )
)
