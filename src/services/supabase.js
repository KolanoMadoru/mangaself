import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  const hasValidUrl = supabaseUrl && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseUrl.includes('supabase.co')
  const hasValidKey = supabaseAnonKey && 
    supabaseAnonKey.length > 50 &&
    !supabaseAnonKey.includes('placeholder')
  
  return hasValidUrl && hasValidKey
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  console.error('📝 Please check your .env file or Netlify environment variables')
}

if (!isSupabaseConfigured()) {
  console.warn('⚠️ Supabase is not properly configured!')
  console.warn('Using placeholder credentials - authentication will not work')
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)
