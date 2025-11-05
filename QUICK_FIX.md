# ⚡ Quick Fix - White Screen Issue

## Masalah
Setelah deploy ke Netlify, aplikasi hanya menampilkan layar putih.

## Solusi Cepat (5 Menit)

### 1️⃣ Get Supabase Credentials
1. Login ke https://supabase.com
2. Pilih project Anda
3. Klik **Settings** (gear icon) → **API**
4. Copy dua values ini:
   - **Project URL**
   - **anon public key**

### 2️⃣ Set di Netlify
1. Login ke https://netlify.com
2. Pilih site Anda
3. **Site configuration** → **Environment variables**
4. Add 2 variables:
   ```
   VITE_SUPABASE_URL = [paste Project URL]
   VITE_SUPABASE_ANON_KEY = [paste anon key]
   ```

### 3️⃣ Redeploy
1. Klik **Deploys** tab
2. **Trigger deploy** → **Clear cache and deploy site**
3. Tunggu 2-3 menit
4. Done! ✅

## Verify Fix
Buka site Anda → Tekan **F12** → Lihat Console:

✅ **Success**:
```
MangaSelf App starting...
Root element found, mounting React app...
React app mounted successfully
```

❌ **Still Missing Env Vars**:
```
Missing Supabase environment variables!
```
→ Cek lagi environment variables di Netlify

## Still White Screen?

Lihat panduan lengkap:
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) - Detailed steps dengan screenshots
- [DEPLOYMENT_FIX.md](DEPLOYMENT_FIX.md) - Full troubleshooting guide

## Penyebab Masalah

White screen biasanya karena:
1. ❌ Environment variables tidak diset (MOST COMMON)
2. ❌ JavaScript error yang crash app
3. ❌ Build configuration salah

## Apa yang Sudah Diperbaiki di Code

✅ **Error Boundary** - Sekarang error akan ditampilkan, bukan white screen
✅ **Env Validation** - Console log jelas jika env vars tidak ada  
✅ **Fallback Values** - App tidak crash jika env vars missing
✅ **Debug Logs** - Mudah troubleshoot via browser console
✅ **Build Optimization** - Vite config dioptimasi untuk production

## Test Local

Sebelum push ke production:
```bash
npm run build
npm run preview
```

Buka http://localhost:4173 dan test.

## Need Help?

Jika masih bermasalah, buka issue dengan:
1. Screenshot browser console (F12)
2. Screenshot Netlify build logs
3. Screenshot environment variables (blur values)
