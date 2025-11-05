# Panduan Perbaikan Error "Failed to Fetch" pada Login/Register

## Masalah
Ketika mencoba login atau register, muncul notifikasi error **"Failed to Fetch"** atau **"Tidak dapat terhubung ke server"**.

## Penyebab
Error ini terjadi karena aplikasi belum terhubung dengan database Supabase. Konfigurasi environment variables untuk Supabase belum diatur dengan benar.

## Solusi

### 1. Buat Akun Supabase (Jika belum punya)

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign Up"**
3. Login dengan GitHub atau email

### 2. Buat Project Baru di Supabase

1. Setelah login, klik **"New Project"**
2. Isi detail project:
   - **Name**: `mangaself` (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan password ini!)
   - **Region**: Pilih yang terdekat dengan lokasi Anda
3. Klik **"Create new project"**
4. Tunggu beberapa menit hingga project selesai dibuat

### 3. Dapatkan API Credentials

1. Setelah project siap, buka **Settings** (ikon gear di sidebar kiri)
2. Klik **API** di menu Settings
3. Anda akan melihat dua informasi penting:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: String panjang dimulai dengan `eyJ...`
4. **SIMPAN kedua nilai ini!**

### 4. Setup Database (PENTING!)

Jalankan SQL berikut di Supabase SQL Editor (Settings → SQL Editor):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mangas table
CREATE TABLE IF NOT EXISTS mangas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  author TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'ongoing',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mangas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for mangas
CREATE POLICY "Mangas are viewable by everyone" ON mangas FOR SELECT USING (true);
CREATE POLICY "Users can create mangas" ON mangas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mangas" ON mangas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mangas" ON mangas FOR DELETE USING (auth.uid() = user_id);

-- Policies for bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
```

### 5. Konfigurasi untuk Development (Local)

Jika Anda menjalankan aplikasi di **local** (npm run dev):

1. Buka file `.env` di root project
2. Ganti nilai dengan credentials Anda:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

3. Restart development server:
```bash
# Hentikan server (Ctrl+C)
npm run dev
```

### 6. Konfigurasi untuk Netlify (Production)

Jika aplikasi di-deploy di **Netlify**:

1. Login ke [Netlify Dashboard](https://app.netlify.com)
2. Pilih site Anda (mangaself)
3. Klik **Site settings**
4. Klik **Environment variables** di sidebar
5. Klik **Add a variable** dan tambahkan:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://xxxxxxxxxxxxx.supabase.co` (URL Supabase Anda)
6. Klik **Add a variable** lagi:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...` (Anon key Anda)
7. Klik **Save**
8. Pergi ke **Deploys** tab
9. Klik **Trigger deploy** → **Clear cache and deploy site**

### 7. Verifikasi

1. Buka aplikasi (local atau Netlify)
2. Buka halaman Login atau Register
3. Jika masih ada peringatan merah "Konfigurasi Supabase Belum Diatur", berarti environment variables belum benar
4. Buka **Browser Console** (F12 atau Ctrl+Shift+I)
5. Lihat pesan di Console:
   - ✅ **Jika benar**: Tidak ada pesan error
   - ❌ **Jika salah**: Ada pesan "⚠️ Supabase is not properly configured!"

### 8. Testing

Coba register akun baru:
1. Buka halaman Register
2. Isi form:
   - Nama Lengkap: Test User
   - Email: test@example.com
   - Password: test123
3. Klik **Daftar**
4. Jika berhasil, akan muncul "Registrasi berhasil!" dan redirect ke Login
5. Login dengan email dan password yang baru dibuat

## Troubleshooting

### Error: "Invalid API key"
- Cek apakah ANON KEY yang Anda copy sudah benar dan lengkap
- Pastikan tidak ada spasi di awal atau akhir

### Error: "Invalid URL"
- Cek format URL: harus `https://xxxxx.supabase.co`
- Pastikan tidak ada trailing slash (/) di akhir

### Peringatan masih muncul setelah setting env vars
- **Local**: Restart development server (Ctrl+C, lalu `npm run dev` lagi)
- **Netlify**: Clear cache and redeploy
- Cek Console browser (F12) untuk pesan error

### Error: "Failed to fetch" masih muncul
1. Cek koneksi internet
2. Cek apakah Supabase project masih aktif di dashboard
3. Cek apakah database tables sudah dibuat (step 4)
4. Coba logout dari Supabase dashboard dan login lagi
5. Regenerate anon key di Supabase Settings → API

## Kontak Support

Jika masih ada masalah:
1. Buka browser Console (F12)
2. Screenshot error yang muncul
3. Screenshot Supabase Settings → API page
4. Hubungi administrator dengan screenshot tersebut

---

**Catatan**: File `.env` tidak di-commit ke Git (sudah ada di `.gitignore`). Setiap developer harus membuat `.env` sendiri di local mereka.
