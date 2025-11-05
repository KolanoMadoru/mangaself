# ⚡ Quick Start Guide - MangaSelf

Get MangaSelf up and running in 5 minutes!

## 📦 1. Install Dependencies

```bash
npm install
```

## 🗄️ 2. Setup Supabase

### Create Account & Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Login
3. Create new project
4. Wait for database to initialize

### Run Database Schema
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy entire content from `supabase-schema.sql`
5. Paste and click **Run**

### Get API Keys
1. Go to **Settings** > **API**
2. Copy:
   - Project URL
   - anon/public key

## 🔧 3. Configure Environment

Create `.env` file in root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace values with your actual Supabase credentials.

## 🚀 4. Start Development Server

```bash
npm run dev
```

Open browser at `http://localhost:3000`

## 🎯 5. First Steps

1. **Register** a new account
2. **Login** with your credentials
3. **Add your first manga**
4. **Explore** the features!

## 👑 6. Create Admin (Optional)

1. Register user via website
2. Go to Supabase Dashboard
3. **Authentication** > **Users**
4. Click on user
5. Edit "User Metadata"
6. Add:
   ```json
   {
     "is_admin": true
   }
   ```
7. Save

User now has admin access at `/admin`

## 🌐 7. Deploy to Netlify

See detailed guide in `DEPLOYMENT_GUIDE.md`

**Quick version:**
1. Push to GitHub
2. Connect to Netlify
3. Add environment variables
4. Deploy!

## 📚 Resources

- **Full Documentation**: `README.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Feature List**: `FEATURES.md`
- **Database Schema**: `supabase-schema.sql`

## 🆘 Common Issues

**Environment variables not found?**
```bash
# Make sure .env exists and is not in .gitignore
cat .env
```

**Build fails?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection error?**
```bash
# Check if credentials are correct
# Check if tables are created
# Check Supabase project status
```

## 🎉 You're Ready!

Start building your manga collection! 📚✨

**Helpful commands:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

Need more help? Check the full README.md!
