# Public Assets Folder

Folder ini berisi static assets dan konfigurasi Netlify.

## Files

### `logo.svg`
Logo aplikasi MangaSelf yang digunakan sebagai favicon.

### `_redirects`
**Purpose:** SPA (Single Page Application) routing configuration untuk Netlify.

**Content:**
```
/*    /index.html   200
```

**Explanation:**
- Redirect semua routes (`/*`) ke `index.html` dengan status 200
- Memastikan React Router bisa handle routing
- Mencegah 404 error saat user refresh page di route tertentu
- File ini akan otomatis ter-copy ke `dist/` saat build

**Without this:** Routes seperti `/profile`, `/manga/123` akan return 404 saat di-refresh di production.

**With this:** Netlify akan serve `index.html` untuk semua routes, React Router akan handle routing di client-side.

### `_headers`
**Purpose:** HTTP headers configuration untuk security dan performance.

**Security Headers:**
- `X-Frame-Options: DENY` - Prevent clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

**Cache Headers:**
- Assets (`/assets/*`): Cached for 1 year (immutable)
- HTML (`/*.html`): No cache (always fresh)
- Service Worker (`/sw.js`): No cache

**Benefits:**
- 🔒 Enhanced security
- ⚡ Better performance with caching
- 🎯 Optimal cache strategy

## Build Process

During `npm run build`:
1. Vite processes all files in this folder
2. Files are copied to `dist/` folder
3. `_redirects` and `_headers` are automatically included
4. Netlify uses these config files during deployment

## Testing Locally

The `_redirects` and `_headers` files are Netlify-specific and won't work in local development. To test:

1. Build: `npm run build`
2. Preview: `npm run preview` or `netlify dev`
3. Or deploy to Netlify for full testing

## Additional Resources

- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Netlify Headers Documentation](https://docs.netlify.com/routing/headers/)
- [SPA Routing Best Practices](https://docs.netlify.com/routing/redirects/redirect-options/#history-pushstate-and-single-page-apps)

## Important Notes

⚠️ **Do NOT delete or modify these files** unless you know what you're doing. They are essential for:
- Proper routing in production
- Security headers
- Performance optimization

✅ These files are automatically configured and ready for Netlify deployment!
