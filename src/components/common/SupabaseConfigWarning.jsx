import { isSupabaseConfigured } from '../../services/supabase'

export default function SupabaseConfigWarning() {
  if (isSupabaseConfigured()) {
    return null
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Konfigurasi Supabase Belum Diatur
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>
              Login dan registrasi tidak akan berfungsi karena Supabase belum dikonfigurasi dengan benar.
            </p>
            <p className="mt-2">
              <strong>Untuk administrator:</strong>
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Buat akun di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">supabase.com</a></li>
              <li>Buat project baru</li>
              <li>Salin URL dan Anon Key dari Settings → API</li>
              <li>Atur environment variables <code className="bg-red-200 dark:bg-red-800 px-1 rounded">VITE_SUPABASE_URL</code> dan <code className="bg-red-200 dark:bg-red-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
              <li>Restart development server atau redeploy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
