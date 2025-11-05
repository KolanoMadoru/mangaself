# Panduan Mengatasi White Screen setelah Deploy

## Masalah yang Diperbaiki

White screen setelah deployment biasanya disebabkan oleh:

1. ❌ Environment variables tidak terset
2. ❌ JavaScript error yang tidak tertangkap
3. ❌ Konfigurasi build yang salah
4. ❌ Path/routing issues

## Solusi yang Diterapkan

### 1. Error Boundary ✅
- Menambahkan `ErrorBoundary` component untuk menangkap error
- Error akan ditampilkan dengan jelas di UI
- User dapat melihat detail error dan refresh halaman

### 2. Environment Variables Validation ✅
- Supabase client sekarang memvalidasi env vars
- Console log error jika env vars tidak ada
- Fallback ke placeholder values agar app tidak crash

### 3. Vite Configuration ✅
- Menambahkan `base: '/'` untuk routing
- Code splitting untuk optimasi
- Build output yang lebih stabil

### 4. Debug Logging ✅
- Console logs di main.jsx untuk tracking startup
- Memudahkan identifikasi masalah saat deploy

## Langkah-langkah Deploy di Netlify

### 1. Set Environment Variables
Buka Netlify Dashboard → Site Settings → Environment Variables

Tambahkan:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **PENTING**: Tanpa environment variables, app akan tetap jalan tapi tidak bisa connect ke Supabase!

### 2. Build Settings
Pastikan di Netlify Dashboard → Site Settings → Build & Deploy:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

### 3. Deploy Ulang
Setelah set environment variables:
1. Klik "Trigger deploy" → "Clear cache and deploy site"
2. Tunggu build selesai
3. Buka site URL
4. Buka browser console (F12) untuk lihat logs

## Troubleshooting

### Masih White Screen?

1. **Cek Browser Console (F12)**
   - Lihat error messages
   - Lihat startup logs ("MangaSelf App starting...")

2. **Cek Build Logs di Netlify**
   - Pastikan build berhasil tanpa error
   - Cek warning messages

3. **Cek Environment Variables**
   - Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diset
   - Re-deploy setelah set env vars

4. **Test Local Production Build**
   ```bash
   npm run build
   npm run preview
   ```

5. **Cek Netlify Redirects**
   - File `public/_redirects` harus ada
   - File `netlify.toml` sudah configured

### Error "Missing Supabase environment variables"
✅ Normal jika belum set env vars di Netlify
➡️ Set env vars di Netlify Dashboard → redeploy

### App Muncul tapi Tidak Bisa Login
✅ App berhasil load
➡️ Cek Supabase env vars sudah benar
➡️ Test connection ke Supabase

## Files yang Dimodifikasi

- ✅ `src/components/common/ErrorBoundary.jsx` (NEW)
- ✅ `src/services/supabase.js` (UPDATED)
- ✅ `src/App.jsx` (UPDATED)
- ✅ `src/main.jsx` (UPDATED)
- ✅ `vite.config.js` (UPDATED)

## Testing Checklist

- [ ] Build berhasil: `npm run build`
- [ ] Preview local: `npm run preview`
- [ ] App bisa dibuka
- [ ] No console errors
- [ ] Env vars terset di Netlify
- [ ] Redeploy setelah set env vars
- [ ] App bisa dibuka di production URL
- [ ] Login/register berfungsi

## Kontak Support

Jika masih ada masalah:
1. Screenshot browser console (F12)
2. Screenshot Netlify build logs
3. Screenshot Netlify env vars (blur sensitive data)
