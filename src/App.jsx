import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useStore } from './store/useStore'

import ErrorBoundary from './components/common/ErrorBoundary'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import NewMangaPage from './pages/manga/NewMangaPage'
import MangaDetailPage from './pages/manga/MangaDetailPage'
import EditMangaPage from './pages/manga/EditMangaPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminPage from './pages/admin/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const { theme } = useStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: theme === 'dark' ? '#374151' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/manga/:id" element={<MangaDetailPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              
              <Route
                path="/manga/new"
                element={
                  <ProtectedRoute>
                    <NewMangaPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manga/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditMangaPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
