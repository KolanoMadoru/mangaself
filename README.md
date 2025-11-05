# 📚 MangaSelf - Platform Sharing & Tracking Manga

Platform berbasis web untuk berbagi dan tracking manga yang sedang kamu baca, dengan fitur sosial seperti bookmark, komentar, dan profile user.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Database & Auth**: Supabase
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Deployment**: Netlify

## ✨ Fitur

### 🔐 Autentikasi & User
- Register dan Login dengan Supabase Auth
- Profile user dengan statistik
- Dark/Light mode toggle
- Responsive design (mobile-desktop)

### 📚 Manga Management
- Tambah manga dengan detail lengkap:
  - Judul, Cover Image, Genre
  - Status (Ongoing/Completed)
  - Chapter terakhir dibaca
  - Rating pribadi (0-10)
  - Review singkat
- Edit dan hapus manga milik sendiri
- Upload data tersimpan di Supabase database

### 🌟 Fitur Sosial
- Bookmark manga dari user lain
- Lihat siapa saja yang bookmark manga tertentu
- Komentar pada manga siapa pun
- Notifikasi real-time untuk aksi

### 🔍 Search & Filter
- Pencarian berdasarkan judul dan pembuat
- Filter berdasarkan genre
- Sorting: Update terbaru, Paling populer, Rating tertinggi

### 👑 Admin Panel
- Dashboard admin untuk moderasi
- Hapus manga yang melanggar aturan
- Hapus komentar yang tidak pantas

## 📋 Prerequisites

- Node.js 18 atau lebih tinggi
- npm atau yarn
- Akun Supabase (gratis)
- Akun Netlify (gratis)

## 🛠️ Setup Supabase

### 1. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com) dan buat akun
2. Buat project baru
3. Tunggu hingga database selesai di-setup

### 2. Setup Database

Jalankan SQL query berikut di Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mangas table
CREATE TABLE mangas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  cover_image TEXT,
  genre TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ongoing', 'completed')),
  last_chapter_read INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX mangas_user_id_idx ON mangas(user_id);
CREATE INDEX mangas_created_at_idx ON mangas(created_at DESC);
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_manga_id_idx ON bookmarks(manga_id);
CREATE INDEX comments_manga_id_idx ON comments(manga_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mangas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Mangas policies
CREATE POLICY "Mangas are viewable by everyone"
  ON mangas FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert mangas"
  ON mangas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mangas"
  ON mangas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mangas"
  ON mangas FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Bookmarks are viewable by everyone"
  ON bookmarks FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mangas_updated_at BEFORE UPDATE ON mangas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Get API Keys

1. Pergi ke Settings > API
2. Copy `Project URL` dan `anon public` key
3. Simpan untuk digunakan nanti

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd mangaself
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Buat file `.env` di root folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Ganti `your_supabase_project_url` dan `your_supabase_anon_key` dengan values dari Supabase project kamu.

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📦 Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`

## 🌐 Deploy ke Netlify

Project ini **sudah siap** di-deploy ke Netlify! ✅

### Pre-flight Check

Jalankan script untuk memastikan konfigurasi sudah benar:

```bash
./deploy-check.sh
```

### Method 1: GitHub + Netlify (Recommended)

1. Push code ke GitHub
2. Login ke [Netlify](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect GitHub repository
5. **Konfigurasi otomatis terdeteksi** dari `netlify.toml`
6. Tambahkan Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy site"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Method 3: Drag & Drop

```bash
npm run build
# Drag folder 'dist/' ke netlify.com/drop
```

**Fitur deployment yang sudah dikonfigurasi:**
- ✅ SPA routing dengan redirects otomatis
- ✅ Security headers (X-Frame-Options, CSP, dll)
- ✅ Cache optimization untuk assets
- ✅ Node 18 environment
- ✅ Auto-deploy dari GitHub

📖 **Dokumentasi lengkap**: Lihat [NETLIFY.md](./NETLIFY.md) dan [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 👤 Membuat Admin User

Untuk membuat user dengan akses admin:

1. Register user biasa
2. Pergi ke Supabase Dashboard > Authentication > Users
3. Klik user yang ingin dijadikan admin
4. Scroll ke "User Metadata"
5. Tambahkan:
   ```json
   {
     "is_admin": true
   }
   ```
6. Save changes
7. User sekarang bisa mengakses Admin Panel

## 📱 Features Overview

### User Features
- ✅ Register & Login
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Real-time notifications

### Manga Features
- ✅ Create, Read, Update, Delete manga
- ✅ Upload cover image (URL)
- ✅ Multiple genres selection
- ✅ Rating system (0-10)
- ✅ Chapter tracking

### Social Features
- ✅ Bookmark manga
- ✅ View bookmark list
- ✅ See who bookmarked
- ✅ Comment system
- ✅ User profiles with stats

### Search & Filter
- ✅ Search by title/creator
- ✅ Filter by genre
- ✅ Sort by: newest, popular, highest rated

### Admin Features
- ✅ View all manga
- ✅ Delete inappropriate manga
- ✅ View all comments
- ✅ Delete inappropriate comments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Developer

Created with ❤️ for manga lovers

---

**Happy Reading! 📚✨**
