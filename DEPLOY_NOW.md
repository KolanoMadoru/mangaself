# 🚀 DEPLOY NOW - Quick Guide

Deploy MangaSelf ke Netlify dalam 5 menit!

## ⚡ Super Quick Deploy

### Step 1: Build Test (30 detik)
```bash
npm run build
```
✅ Harus success tanpa error

### Step 2: Push ke GitHub (1 menit)
```bash
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

### Step 3: Connect ke Netlify (2 menit)
1. Buka [netlify.com](https://netlify.com)
2. Login/Sign up
3. Klik **"Add new site"** → **"Import an existing project"**
4. Pilih **GitHub**
5. Pilih repository ini

### Step 4: Configure (1 menit)
Netlify auto-detect settings dari `netlify.toml`:
- Build command: `npm run build` ✅
- Publish directory: `dist` ✅
- Node version: 18 ✅

**Tambahkan Environment Variables:**
```
VITE_SUPABASE_URL = [your-supabase-url]
VITE_SUPABASE_ANON_KEY = [your-supabase-key]
```

### Step 5: Deploy! (30 detik)
Klik **"Deploy site"**

Tunggu 2-3 menit → **LIVE!** 🎉

## 📋 Supabase Setup (Jika Belum)

### Get API Keys:
1. Buka [supabase.com](https://supabase.com)
2. Pilih project → Settings → API
3. Copy:
   - Project URL
   - anon public key

### Setup Database:
1. SQL Editor → New Query
2. Copy paste dari `supabase-schema.sql`
3. Run query

## 🔧 Post-Deploy Setup

### Add Netlify URL ke Supabase:
1. Supabase Dashboard
2. Authentication → URL Configuration
3. Site URL: `https://your-site.netlify.app`
4. Redirect URLs: `https://your-site.netlify.app/**`

## ✅ Done!

Site live di: `https://[random-name].netlify.app`

### Test:
- [ ] Buka site
- [ ] Register user
- [ ] Login
- [ ] Tambah manga
- [ ] Test routing (refresh page)

## 🎯 Alternative: CLI Deploy

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set env vars
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
```

## 🆘 Troubleshooting

### Build Failed?
```bash
# Run locally first
npm install
npm run build

# Should see dist/ folder created
```

### Blank Page?
- Check browser console (F12)
- Verify env vars di Netlify
- Check Supabase URL added to allowed origins

### 404 Errors?
- Already handled by `_redirects`
- Check deploy logs

## 📚 Full Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step lengkap
- [NETLIFY.md](./NETLIFY.md) - Konfigurasi detail
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix common issues

## 🎊 That's It!

Your MangaSelf is now LIVE! 🚀📚

Share the link and start adding manga! ✨
