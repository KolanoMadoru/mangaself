# 🚨 Quick Fix: Error "Failed to Fetch" pada Login/Register

## Masalah
Error **"Failed to Fetch"** atau **"Tidak dapat terhubung ke server"** saat login/register.

## Penyebab
❌ Supabase belum dikonfigurasi

## Solusi Cepat (5 Menit)

### 1️⃣ Dapatkan Supabase Credentials

1. Buka [supabase.com](https://supabase.com) → Login/Sign up
2. Create new project (tunggu 2-3 menit)
3. Buka **Settings** → **API**
4. Copy 2 nilai ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGci...` (string panjang)

### 2️⃣ Setup Database

1. Di Supabase, buka **SQL Editor**
2. Copy-paste SQL dari file `PANDUAN_PERBAIKAN_AUTH.md` section 4
3. Run SQL

### 3️⃣ Set Environment Variables

**Local Development:**
```bash
# Edit file .env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Restart server
npm run dev
```

**Netlify Production:**
1. Netlify Dashboard → Site settings → Environment variables
2. Add variable: `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
3. Add variable: `VITE_SUPABASE_ANON_KEY` = `eyJhbGci...`
4. Deploys → Trigger deploy → Clear cache and deploy

### 4️⃣ Test

1. Buka halaman Register
2. Buat akun baru
3. Login

✅ **Selesai!**

---

## Pesan Error & Solusi

| Error | Solusi |
|-------|--------|
| ⚠️ Peringatan merah di halaman | Environment variables belum diset |
| ❌ "Failed to fetch" | Supabase URL salah atau internet mati |
| ❌ "Invalid API key" | ANON_KEY salah atau tidak lengkap |
| ⚠️ "Supabase is not properly configured!" di Console | Restart server atau clear cache |

## Need Help?

Lihat dokumentasi lengkap: **`PANDUAN_PERBAIKAN_AUTH.md`**
