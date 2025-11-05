# 🚀 Deployment Guide - MangaSelf ke Netlify

Panduan lengkap untuk deploy MangaSelf ke Netlify dengan Supabase.

## 📋 Prerequisites

- [x] Akun GitHub
- [x] Akun Supabase (free tier)
- [x] Akun Netlify (free tier)

## Step 1: Setup Supabase

### 1.1 Buat Project Supabase

1. Kunjungi https://supabase.com
2. Login/Sign up
3. Click "New Project"
4. Isi detail project:
   - **Name**: mangaself-db (atau nama lain)
   - **Database Password**: buat password kuat (simpan di tempat aman!)
   - **Region**: pilih terdekat dengan target user
5. Click "Create new project"
6. Tunggu 1-2 menit hingga project siap

### 1.2 Setup Database

1. Pergi ke **SQL Editor** di sidebar
2. Click "New Query"
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke query editor
5. Click "Run" atau tekan `Ctrl/Cmd + Enter`
6. Pastikan muncul "Success. No rows returned"

### 1.3 Get API Keys

1. Pergi ke **Settings** > **API**
2. Cari section "Project API keys"
3. Copy dan simpan:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public** key (VITE_SUPABASE_ANON_KEY)

### 1.4 Konfigurasi Email Auth (Optional)

1. Pergi ke **Authentication** > **Providers** > **Email**
2. Enable "Confirm email"
3. Konfigurasi email templates sesuai kebutuhan

## Step 2: Setup GitHub Repository

### 2.1 Push Code ke GitHub

```bash
# Jika belum init git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MangaSelf platform"

# Create repository di GitHub (via web)
# Kemudian add remote
git remote add origin https://github.com/username/mangaself.git

# Push
git branch -M main
git push -u origin main
```

## Step 3: Deploy ke Netlify

### Method 1: Via Netlify Dashboard (Recommended)

#### 3.1 Connect Repository

1. Login ke https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Click "Deploy with GitHub"
4. Authorize Netlify untuk akses GitHub
5. Pilih repository "mangaself"

#### 3.2 Configure Build Settings

Netlify akan auto-detect Vite settings, tapi pastikan:

- **Base directory**: (kosong)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### 3.3 Environment Variables

1. Click "Show advanced"
2. Click "New variable"
3. Tambahkan 2 environment variables:

```
Key: VITE_SUPABASE_URL
Value: [paste supabase project url]

Key: VITE_SUPABASE_ANON_KEY
Value: [paste supabase anon key]
```

#### 3.4 Deploy!

1. Click "Deploy site"
2. Tunggu 2-3 menit untuk build & deploy
3. Site akan live di URL: `https://random-name.netlify.app`

#### 3.5 Custom Domain (Optional)

1. Pergi ke **Site settings** > **Domain management**
2. Click "Add custom domain"
3. Follow instruksi untuk setup DNS

### Method 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Follow prompts:
# - Create & configure new site
# - Connect to GitHub repo
# - Build command: npm run build
# - Publish directory: dist

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_key"

# Deploy
netlify deploy --prod
```

## Step 4: Post-Deployment Setup

### 4.1 Tambahkan Site URL ke Supabase

1. Kembali ke Supabase Dashboard
2. Pergi ke **Authentication** > **URL Configuration**
3. Tambahkan Netlify URL ke "Site URL"
4. Tambahkan ke "Redirect URLs":
   - `https://your-site.netlify.app/**`
   - `https://your-site.netlify.app/auth/callback`

### 4.2 Test Your Site

1. Buka site di browser
2. Test Register user baru
3. Test Login
4. Test tambah manga
5. Test semua fitur

### 4.3 Membuat Admin User

1. Register user normal via website
2. Pergi ke Supabase Dashboard
3. **Authentication** > **Users**
4. Click user yang ingin dijadikan admin
5. Scroll ke "User Metadata"
6. Click "Edit"
7. Tambahkan JSON:
```json
{
  "is_admin": true
}
```
8. Save
9. User sekarang punya akses admin panel

## Step 5: Continuous Deployment

Setelah setup awal, setiap push ke GitHub akan otomatis:

1. Trigger build di Netlify
2. Run `npm run build`
3. Deploy ke production

```bash
# Workflow normal
git add .
git commit -m "Add new feature"
git push

# Netlify akan auto-deploy dalam 2-3 menit
```

## 🔧 Troubleshooting

### Build Failed

**Error: Environment variables not found**
- Solution: Pastikan env vars sudah diset di Netlify dashboard

**Error: Command not found**
- Solution: Check build command di Netlify settings

### Auth Not Working

**Error: Invalid API Key**
- Solution: Double check env vars di Netlify

**Error: CORS Error**
- Solution: Tambahkan site URL di Supabase Auth settings

### Database Errors

**Error: Permission denied**
- Solution: Check RLS policies di Supabase

**Error: Relation does not exist**
- Solution: Jalankan ulang schema SQL di Supabase

## 📊 Monitoring

### Netlify Analytics

1. Pergi ke site dashboard
2. Check **Analytics** tab untuk:
   - Page views
   - Bandwidth usage
   - Form submissions

### Supabase Usage

1. Pergi ke Supabase project
2. Check **Database** > **Usage** untuk:
   - Database size
   - API requests
   - Active users

## 🔐 Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use environment variables for secrets
3. ✅ Enable RLS on all tables
4. ✅ Regularly review Supabase auth logs
5. ✅ Set up proper CORS policies
6. ✅ Enable email verification for production
7. ✅ Regular database backups (Supabase auto-backup)

## 📈 Scaling

### Free Tier Limits

**Netlify Free:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**Supabase Free:**
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users

### Upgrade Path

Jika aplikasi berkembang:
1. Netlify Pro: $19/month
2. Supabase Pro: $25/month

## 🎉 You're Done!

Website sudah live dan siap digunakan! 

**Next Steps:**
- Share link dengan teman
- Tambahkan manga pertama
- Customize branding
- Add more features

**Need Help?**
- Check README.md untuk dokumentasi lengkap
- Visit Netlify docs: https://docs.netlify.com
- Visit Supabase docs: https://supabase.com/docs

Happy deploying! 🚀📚
