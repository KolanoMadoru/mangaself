# Setup Environment Variables untuk Netlify

## ⚠️ PENTING: White Screen Fix

Jika aplikasi menampilkan **layar putih** setelah deploy, kemungkinan besar karena **environment variables belum diset**.

## Langkah-langkah Setup di Netlify

### 1. Buka Netlify Dashboard
1. Login ke [Netlify](https://netlify.com)
2. Pilih site Anda
3. Klik **Site configuration** atau **Site settings**

### 2. Set Environment Variables
1. Di menu kiri, klik **Environment variables**
2. Klik tombol **Add a variable** atau **Add environment variables**
3. Tambahkan 2 variables berikut:

#### Variable 1: VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: URL Supabase project Anda
  - Format: `https://xxxxxxxxxxxxx.supabase.co`
  - Didapat dari: Supabase Dashboard → Project Settings → API → Project URL

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Anon/Public Key dari Supabase
  - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (panjang)
  - Didapat dari: Supabase Dashboard → Project Settings → API → Project API keys → anon/public

### 3. Cara Mendapatkan Supabase Credentials

1. Login ke [Supabase](https://supabase.com)
2. Pilih project Anda
3. Klik **Project Settings** (icon gear di kiri bawah)
4. Klik **API** di menu kiri
5. Copy:
   - **Project URL** → untuk `VITE_SUPABASE_URL`
   - **anon/public key** → untuk `VITE_SUPABASE_ANON_KEY`

### 4. Deploy Ulang

Setelah environment variables diset:

1. Kembali ke **Deploys** tab
2. Klik **Trigger deploy** dropdown
3. Pilih **Clear cache and deploy site**
4. Tunggu build selesai (2-3 menit)
5. Klik **Open production deploy** untuk test

## Verifikasi Setup

### Cek di Browser Console (F12)

Setelah deploy, buka site Anda dan tekan F12 untuk console:

✅ **Jika berhasil**, Anda akan melihat:
```
MangaSelf App starting...
Environment: production
Base URL: /
Root element found, mounting React app...
React app mounted successfully
```

❌ **Jika env vars tidak ada**, Anda akan melihat:
```
Missing Supabase environment variables!
VITE_SUPABASE_URL: Missing
VITE_SUPABASE_ANON_KEY: Missing
```

### Test Functionality

1. **Homepage** harus terbuka tanpa white screen
2. **Login/Register** harus muncul form
3. Jika ada error, akan muncul error message (bukan white screen)

## Troubleshooting

### Masih White Screen setelah set env vars?

1. **Clear cache dan deploy ulang**
   ```
   Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy site
   ```

2. **Cek Build Logs**
   - Klik deploy yang sedang running
   - Lihat log output
   - Pastikan tidak ada error saat build

3. **Cek Browser Console**
   - Tekan F12 di browser
   - Lihat tab Console
   - Cek error messages
   - Screenshot dan laporkan jika perlu

4. **Verify Environment Variables**
   - Netlify Dashboard → Site configuration → Environment variables
   - Pastikan kedua variables ada
   - Tidak ada typo di key names
   - Values tidak kosong

### App muncul tapi tidak bisa login?

✅ App sudah berhasil!
➡️ Cek Supabase credentials:
- VITE_SUPABASE_URL benar?
- VITE_SUPABASE_ANON_KEY benar?
- Supabase project masih aktif?

### Error "Failed to fetch" atau "Network error"?

✅ App berhasil, masalah di Supabase connection
➡️ Periksa:
- Supabase project tidak paused
- Database RLS policies sudah disetup
- Environment variables benar

## Template Environment Variables

Untuk reference, ini format yang benar:

```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM0NTY3OCwiZXhwIjoxOTI3OTIxNjc4fQ.your-signature-here
```

## Screenshot Lokasi di Netlify

### Dimana Set Environment Variables:
```
Netlify Dashboard
  └── Your Site
      └── Site configuration (menu kiri)
          └── Environment variables
              └── Add a variable
```

### Dimana Trigger Deploy:
```
Netlify Dashboard
  └── Your Site
      └── Deploys (tab atas)
          └── Trigger deploy (tombol kanan atas)
              └── Clear cache and deploy site
```

## Checklist Deploy

- [ ] Environment variables sudah diset di Netlify
- [ ] VITE_SUPABASE_URL benar
- [ ] VITE_SUPABASE_ANON_KEY benar
- [ ] Clear cache dan deploy ulang
- [ ] Build berhasil tanpa error
- [ ] Site bisa dibuka (tidak white screen)
- [ ] Console logs terlihat di browser
- [ ] Login/register form muncul

## Need Help?

Jika masih bermasalah, siapkan:
1. Screenshot Netlify environment variables (blur values)
2. Screenshot build logs
3. Screenshot browser console (F12)
4. URL site Netlify Anda
