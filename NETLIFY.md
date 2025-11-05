# 🌐 Netlify Deployment Configuration

## Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

## Konfigurasi Otomatis

Project ini sudah **siap deploy** ke Netlify! Semua konfigurasi sudah diatur otomatis:

### ✅ File Konfigurasi

| File | Fungsi |
|------|--------|
| `netlify.toml` | Konfigurasi build, redirects, headers |
| `public/_redirects` | Fallback SPA routing |
| `public/_headers` | Security & cache headers |
| `.env.example` | Template environment variables |

### ⚙️ Build Settings

```toml
[build]
  publish = "dist"
  command = "npm run build"
  
[build.environment]
  NODE_VERSION = "18"
```

### 🔄 Redirects

Semua routes otomatis redirect ke `index.html` untuk SPA routing:
```
/* → /index.html (status 200)
```

### 🔒 Security Headers

Headers keamanan yang sudah dikonfigurasi:
- **X-Frame-Options**: DENY (prevent clickjacking)
- **X-Content-Type-Options**: nosniff (prevent MIME sniffing)
- **X-XSS-Protection**: 1; mode=block (enable XSS filter)
- **Referrer-Policy**: strict-origin-when-cross-origin

### ⚡ Cache Strategy

- **Assets** (`/assets/*`): Cache 1 tahun (immutable)
- **HTML** (`/*.html`): No cache (selalu fresh)
- **Logo/Statics**: Cache 1 tahun

## 🚀 Deploy Sekarang

### 1-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR-USERNAME/mangaself)

### Manual Deploy

```bash
# 1. Build project
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod --dir=dist
```

## 🔧 Environment Variables Required

Di Netlify dashboard, tambahkan environment variables berikut:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

**Cara set di Netlify:**
1. Site settings → Environment variables
2. Add variable
3. Deploy ulang

## 📝 Post-Deploy Checklist

Setelah deploy, pastikan:

- [ ] ✅ Site accessible di `https://[site-name].netlify.app`
- [ ] ✅ Environment variables ter-set
- [ ] ✅ Supabase URL sudah ditambahkan ke allowed origins
- [ ] ✅ Register/Login berfungsi
- [ ] ✅ Routing berfungsi (tidak 404)
- [ ] ✅ Assets ter-load dengan benar
- [ ] ✅ Console tidak ada error

## 🔗 Supabase Integration

Jangan lupa tambahkan Netlify URL ke Supabase:

1. Buka Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Tambahkan ke **Site URL**: `https://your-site.netlify.app`
4. Tambahkan ke **Redirect URLs**: `https://your-site.netlify.app/**`

## 📊 Build Status & Logs

- **Build logs**: Deploys tab di Netlify dashboard
- **Deploy preview**: Auto-generated untuk setiap PR
- **Branch deploys**: Auto-deploy untuk setiap branch

## 🎯 Performance

Build yang sudah dioptimasi:
- ⚡ Vite production build
- 📦 Code splitting otomatis
- 🗜️ Minifikasi & compression
- 🎨 CSS extraction
- 🖼️ Asset optimization

**Bundle size:**
- CSS: ~21 KB (4 KB gzipped)
- JS: ~433 KB (124 KB gzipped)

## 🌍 Custom Domain

Setup custom domain:

1. Beli domain dari provider (Namecheap, GoDaddy, dll)
2. Di Netlify: **Domain settings** → **Add custom domain**
3. Update DNS records:
   ```
   A Record: @ → 75.2.60.5
   CNAME: www → [your-site].netlify.app
   ```
4. SSL otomatis aktif via Let's Encrypt

## 🔄 CI/CD Pipeline

Auto-deploy sudah aktif:
- **Push to main** → Auto deploy to production
- **Pull request** → Deploy preview
- **Push to branch** → Branch deploy

## 🐛 Troubleshooting

### Build Failed

**Problem**: Build command failed
```bash
# Solution: Check logs di Netlify dashboard
# Biasanya masalah di dependencies atau env vars
```

### Blank Page

**Problem**: Site loading tapi blank
```bash
# Solution:
1. Check browser console (F12)
2. Verify environment variables
3. Check Supabase connection
```

### 404 on Refresh

**Problem**: Routes return 404 saat refresh
```bash
# Solution: Sudah dihandle oleh _redirects
# Check bahwa file _redirects ada di dist/
```

### CORS Error

**Problem**: Supabase CORS error
```bash
# Solution:
1. Tambahkan Netlify URL ke Supabase allowed origins
2. Check environment variables benar
```

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Docs](https://supabase.com/docs)

## 🎉 Success!

Jika semua steps diikuti, aplikasi sudah live dan bisa diakses di:
```
https://[your-site-name].netlify.app
```

---

**Questions?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan lebih detail.
