# 🚀 Panduan Deploy ke Netlify

## Cara Cepat Deploy

### Option 1: Deploy via GitHub (Recommended)

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect ke Netlify**
   - Login ke [netlify.com](https://netlify.com)
   - Klik "Add new site" → "Import an existing project"
   - Pilih "Deploy with GitHub"
   - Pilih repository ini

3. **Konfigurasi sudah otomatis**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
   
4. **Tambahkan Environment Variables**
   - Klik "Site settings" → "Environment variables"
   - Tambahkan:
     ```
     VITE_SUPABASE_URL = [your-supabase-url]
     VITE_SUPABASE_ANON_KEY = [your-supabase-anon-key]
     ```

5. **Deploy!**
   - Klik "Deploy site"
   - Tunggu 2-3 menit
   - Site live di `https://[random-name].netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_key"
```

### Option 3: Drag & Drop

1. Build project locally:
   ```bash
   npm install
   npm run build
   ```

2. Drag folder `dist/` ke netlify.com/drop

3. Set environment variables di site settings

## ✅ Fitur yang Sudah Dikonfigurasi

- ✅ **SPA Routing**: Semua routes redirect ke index.html
- ✅ **Security Headers**: X-Frame-Options, CSP, XSS Protection
- ✅ **Cache Optimization**: Assets di-cache 1 tahun, HTML selalu fresh
- ✅ **Node Version**: Fixed ke Node 18 untuk konsistensi
- ✅ **Build Optimization**: Vite production build dengan minifikasi

## 🔧 Troubleshooting

### Build Failed
- **Error**: `Command failed with exit code 1`
  - Check environment variables sudah diset
  - Check `npm install` berjalan sukses

### Blank Page
- **Error**: Site loading tapi blank
  - Check Console (F12) untuk error
  - Pastikan environment variables benar
  - Check Supabase URL sudah ditambahkan ke allowed domains

### 404 Errors
- **Error**: Routes tidak bekerja (404)
  - Sudah dihandle oleh `_redirects` dan `netlify.toml`
  - Check deploy log bahwa redirects rules ter-apply

## 📊 Post-Deployment Checklist

- [ ] Site bisa diakses
- [ ] Register user baru berhasil
- [ ] Login berhasil
- [ ] Bisa tambah manga
- [ ] Bisa bookmark manga
- [ ] Routing berjalan normal (refresh tetap bekerja)
- [ ] Admin panel accessible (untuk admin users)

## 🔐 Keamanan

File `netlify.toml` dan `_headers` sudah dikonfigurasi dengan:
- X-Frame-Options: Prevent clickjacking
- X-Content-Type-Options: Prevent MIME sniffing
- X-XSS-Protection: Enable XSS filter
- Referrer-Policy: Control referrer information

## 🎯 Custom Domain (Optional)

1. Beli domain dari provider (Namecheap, GoDaddy, etc)
2. Di Netlify: Site settings → Domain management
3. Add custom domain
4. Update DNS records sesuai instruksi Netlify
5. SSL otomatis aktif via Let's Encrypt

## 📈 Monitoring

- **Build logs**: Deploys → [build-name] → Deploy log
- **Function logs**: Functions → [function-name] → Logs
- **Analytics**: Analytics tab (paid feature)

## 🚀 Continuous Deployment

Setelah setup awal, setiap push ke branch `main` akan otomatis:
1. Trigger build di Netlify
2. Run tests (jika ada)
3. Build production bundle
4. Deploy ke live site

Branch preview juga otomatis dibuat untuk Pull Requests!

---

**Need more help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan lengkap.
