# 🔧 Troubleshooting Guide - MangaSelf

Panduan mengatasi masalah umum saat development dan deployment.

## 📦 Build Issues

### Error: "Cannot find module"

**Problem:**
```
Error: Cannot find module '@supabase/supabase-js'
```

**Solution:**
```bash
# Install ulang dependencies
rm -rf node_modules
npm install
```

### Error: "Build failed with exit code 1"

**Problem:** Build gagal di Netlify

**Solutions:**

1. **Check Environment Variables**
   - Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah di-set di Netlify
   - Pergi ke: Site settings → Environment variables

2. **Check Node Version**
   - netlify.toml sudah set Node 18
   - Jika masih error, coba set di Netlify dashboard

3. **Check Build Logs**
   - Pergi ke Deploys tab
   - Klik deploy yang failed
   - Check error message detail

### Error: "Unexpected token"

**Problem:** Syntax error saat build

**Solution:**
```bash
# Check dengan ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## 🌐 Deployment Issues

### Blank Page / White Screen

**Problem:** Site loading tapi tampil blank

**Solutions:**

1. **Check Browser Console**
   - Tekan F12
   - Lihat tab Console
   - Cari error messages

2. **Check Environment Variables**
   ```bash
   # Verify di browser console
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```
   - Jika undefined, env vars belum ter-set di Netlify

3. **Check Build Output**
   - Pastikan dist/index.html ada
   - Pastikan dist/assets/ folder ada
   - Run: `npm run build` dan check output

4. **Clear Cache**
   ```bash
   # Clear browser cache
   Ctrl+Shift+R (hard refresh)
   
   # Clear Netlify cache
   # Di Netlify: Site settings → Build & deploy → Clear cache and retry deploy
   ```

### 404 on Page Refresh

**Problem:** Routes return 404 saat refresh

**Solution:** Sudah dihandle dengan `_redirects`

Jika masih error:
1. Check `public/_redirects` exists
2. Check `dist/_redirects` copied after build
3. Check netlify.toml redirects configuration

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Assets Not Loading

**Problem:** Images/CSS/JS tidak load

**Solutions:**

1. **Check Asset Paths**
   - Gunakan absolute paths: `/assets/...`
   - Atau import di component: `import logo from './logo.svg'`

2. **Check Vite Config**
   ```js
   // vite.config.js
   export default defineConfig({
     base: '/', // Should be '/'
   })
   ```

3. **Check Build Output**
   ```bash
   npm run build
   ls dist/assets/
   ```

## 🔐 Authentication Issues

### Error: "Invalid API Key"

**Problem:** Supabase auth tidak bekerja

**Solutions:**

1. **Double-check API Keys**
   - Pergi ke Supabase Dashboard → Settings → API
   - Copy ulang `anon public` key (bukan `service_role` key!)

2. **Check Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxx...
   ```

3. **Restart Dev Server**
   ```bash
   # Ctrl+C untuk stop
   npm run dev
   ```

### Error: "Auth session missing"

**Problem:** User ter-logout terus

**Solutions:**

1. **Check Supabase URL Configuration**
   - Pergi ke Supabase Dashboard
   - Authentication → URL Configuration
   - Tambahkan site URL ke "Site URL"
   - Tambahkan ke "Redirect URLs": `https://your-site.netlify.app/**`

2. **Check Browser Storage**
   - F12 → Application → Local Storage
   - Check ada `supabase.auth.token`

3. **Clear Local Storage**
   ```js
   // In browser console
   localStorage.clear()
   ```

### Error: "CORS Error"

**Problem:** CORS error saat connect ke Supabase

**Solution:**
1. Tambahkan Netlify URL ke Supabase allowed origins
2. Check URL format benar (dengan https://)
3. Restart both dev server and browser

## 💾 Database Issues

### Error: "Permission denied for table"

**Problem:** RLS (Row Level Security) blocking access

**Solutions:**

1. **Check RLS Policies**
   - Pergi ke Supabase Dashboard
   - Table Editor → Select table → Policies
   - Pastikan policies ada dan benar

2. **Recreate Policies**
   - Run SQL dari `supabase-schema.sql`
   - Atau create manual di dashboard

3. **Check User Auth**
   ```js
   // Verify user logged in
   const { data: { user } } = await supabase.auth.getUser()
   console.log(user)
   ```

### Error: "Relation does not exist"

**Problem:** Table tidak ditemukan

**Solution:**
```bash
# Run schema SQL di Supabase SQL Editor
# Copy dari supabase-schema.sql
```

### Error: "Insert violates foreign key constraint"

**Problem:** Referensi ke data yang tidak ada

**Solutions:**

1. **Check User Profile Exists**
   ```sql
   SELECT * FROM profiles WHERE id = 'user-uuid';
   ```

2. **Create Profile First**
   - Profiles biasanya auto-created saat register
   - Jika tidak ada, create manual:
   ```sql
   INSERT INTO profiles (id, email, full_name)
   VALUES ('user-uuid', 'email@example.com', 'Full Name');
   ```

## 🎨 Styling Issues

### Dark Mode Not Working

**Problem:** Toggle dark mode tidak bekerja

**Solutions:**

1. **Check TailwindCSS Config**
   ```js
   // tailwind.config.js
   module.exports = {
     darkMode: 'class', // Should be 'class'
   }
   ```

2. **Check HTML Class**
   ```js
   // Should toggle 'dark' class on <html>
   document.documentElement.classList.toggle('dark')
   ```

3. **Check Zustand Store**
   - Verify `theme` state persisted
   - Check localStorage: `localStorage.getItem('app-storage')`

### Styles Not Applied

**Problem:** TailwindCSS classes tidak bekerja

**Solutions:**

1. **Restart Dev Server**
   ```bash
   npm run dev
   ```

2. **Check Tailwind Config**
   ```js
   // tailwind.config.js
   content: [
     "./index.html",
     "./src/**/*.{js,jsx}",
   ],
   ```

3. **Rebuild**
   ```bash
   npm run build
   ```

## 🔄 State Management Issues

### Data Not Persisting

**Problem:** State hilang saat refresh

**Solutions:**

1. **Check Zustand Persist**
   ```js
   // store/index.js
   persist(
     (set) => ({ /* state */ }),
     { name: 'app-storage' }
   )
   ```

2. **Check LocalStorage**
   - F12 → Application → Local Storage
   - Should see 'app-storage' key

3. **Clear Cache**
   ```js
   localStorage.clear()
   sessionStorage.clear()
   ```

### React Query Not Caching

**Problem:** Data re-fetch terus

**Solutions:**

1. **Check Query Keys**
   ```js
   // Should have unique keys
   useQuery(['mangas'], fetchMangas)
   useQuery(['manga', id], () => fetchManga(id))
   ```

2. **Check Stale Time**
   ```js
   // Increase stale time
   useQuery(['mangas'], fetchMangas, {
     staleTime: 5 * 60 * 1000, // 5 minutes
   })
   ```

## 🚀 Performance Issues

### Slow Page Load

**Solutions:**

1. **Check Bundle Size**
   ```bash
   npm run build
   # Check dist/assets/ sizes
   ```

2. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use CDN for large files

3. **Enable Caching**
   - Already configured in `netlify.toml`
   - Check `_headers` file

### Memory Leaks

**Solutions:**

1. **Check useEffect Cleanup**
   ```js
   useEffect(() => {
     const subscription = supabase
       .channel('changes')
       .subscribe()
     
     return () => {
       subscription.unsubscribe() // Cleanup!
     }
   }, [])
   ```

2. **Remove Console Logs**
   - Remove `console.log()` in production

## 📱 Mobile Issues

### Layout Broken on Mobile

**Solutions:**

1. **Check Responsive Classes**
   ```jsx
   <div className="w-full md:w-1/2 lg:w-1/3">
   ```

2. **Test on Real Device**
   - Use Netlify preview URL
   - Test on actual mobile device

3. **Check Viewport Meta Tag**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

## 🆘 Getting Help

Jika masalah masih berlanjut:

1. **Check Documentation**
   - [README.md](./README.md)
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - [NETLIFY.md](./NETLIFY.md)

2. **Check Official Docs**
   - [Netlify Docs](https://docs.netlify.com)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vite Docs](https://vitejs.dev)
   - [React Query Docs](https://tanstack.com/query)

3. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages
   - Check Network tab for failed requests

4. **Check Netlify Deploy Logs**
   - Netlify Dashboard → Deploys
   - Click on deploy → View logs

5. **Check Supabase Logs**
   - Supabase Dashboard → Logs
   - Check API logs

## 🧪 Debug Mode

Enable debug mode untuk troubleshooting:

```js
// Add to .env.local (development only)
VITE_DEBUG=true

// In code
if (import.meta.env.VITE_DEBUG) {
  console.log('Debug info:', data)
}
```

## ✅ Checklist Umum

Sebelum deploy, pastikan:

- [ ] Environment variables di-set dengan benar
- [ ] Supabase schema sudah dijalankan
- [ ] `npm run build` berhasil tanpa error
- [ ] `./deploy-check.sh` semua passed
- [ ] .gitignore sudah benar (tidak commit .env)
- [ ] Test di localhost terlebih dahulu
- [ ] All features berfungsi normal

---

**Masih error?** Check issue lebih detail dengan menjalankan:
```bash
./deploy-check.sh
```
