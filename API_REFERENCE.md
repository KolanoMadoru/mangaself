# 🔌 API Reference - MangaSelf

This document describes the database schema and API interactions using Supabase.

## 📊 Database Schema

### Tables

#### 1. `profiles`
User profile information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: UUID - User ID from Supabase Auth
- `email`: TEXT - User email (unique)
- `full_name`: TEXT - User's full name
- `created_at`: TIMESTAMP - Creation timestamp
- `updated_at`: TIMESTAMP - Last update timestamp

**Relationships:**
- One-to-Many with `mangas`
- One-to-Many with `bookmarks`
- One-to-Many with `comments`

---

#### 2. `mangas`
Manga information and details.

```sql
CREATE TABLE mangas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  cover_image TEXT,
  genre TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ongoing', 'completed')),
  last_chapter_read INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: UUID - Primary key
- `user_id`: UUID - Foreign key to profiles
- `title`: TEXT - Manga title
- `cover_image`: TEXT - URL to cover image
- `genre`: TEXT - Comma-separated genres
- `status`: TEXT - 'ongoing' or 'completed'
- `last_chapter_read`: INTEGER - Chapter progress
- `rating`: DECIMAL - User rating (0-10)
- `review`: TEXT - User review
- `created_at`: TIMESTAMP - Creation timestamp
- `updated_at`: TIMESTAMP - Last update timestamp

**Constraints:**
- `status` must be 'ongoing' or 'completed'
- `rating` must be between 0 and 10

**Relationships:**
- Many-to-One with `profiles`
- One-to-Many with `bookmarks`
- One-to-Many with `comments`

---

#### 3. `bookmarks`
User bookmarks for mangas.

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);
```

**Fields:**
- `id`: UUID - Primary key
- `user_id`: UUID - Foreign key to profiles
- `manga_id`: UUID - Foreign key to mangas
- `created_at`: TIMESTAMP - Creation timestamp

**Constraints:**
- Unique combination of `user_id` and `manga_id`

**Relationships:**
- Many-to-One with `profiles`
- Many-to-One with `mangas`

---

#### 4. `comments`
User comments on mangas.

```sql
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id`: UUID - Primary key
- `user_id`: UUID - Foreign key to profiles
- `manga_id`: UUID - Foreign key to mangas
- `content`: TEXT - Comment content
- `created_at`: TIMESTAMP - Creation timestamp
- `updated_at`: TIMESTAMP - Last update timestamp

**Relationships:**
- Many-to-One with `profiles`
- Many-to-One with `mangas`

---

## 🔒 Row Level Security (RLS) Policies

### Profiles

**SELECT**: Public (anyone can view)
```sql
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);
```

**INSERT**: Users can create their own profile
```sql
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

**UPDATE**: Users can update their own profile
```sql
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

---

### Mangas

**SELECT**: Public (anyone can view)
```sql
CREATE POLICY "Mangas are viewable by everyone"
  ON mangas FOR SELECT USING (true);
```

**INSERT**: Authenticated users only
```sql
CREATE POLICY "Authenticated users can insert mangas"
  ON mangas FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**UPDATE**: Owners only
```sql
CREATE POLICY "Users can update their own mangas"
  ON mangas FOR UPDATE USING (auth.uid() = user_id);
```

**DELETE**: Owners only
```sql
CREATE POLICY "Users can delete their own mangas"
  ON mangas FOR DELETE USING (auth.uid() = user_id);
```

---

### Bookmarks

**SELECT**: Public (anyone can view)
```sql
CREATE POLICY "Bookmarks are viewable by everyone"
  ON bookmarks FOR SELECT USING (true);
```

**INSERT**: Users can create their own bookmarks
```sql
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**DELETE**: Users can delete their own bookmarks
```sql
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);
```

---

### Comments

**SELECT**: Public (anyone can view)
```sql
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);
```

**INSERT**: Authenticated users only
```sql
CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**UPDATE**: Owners only
```sql
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);
```

**DELETE**: Owners only
```sql
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);
```

---

## 📝 Common Query Examples

### Authentication

#### Register User
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
    },
  },
})
```

#### Login
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

#### Logout
```javascript
const { error } = await supabase.auth.signOut()
```

---

### Manga Operations

#### Get All Mangas
```javascript
const { data, error } = await supabase
  .from('mangas')
  .select(`
    *,
    profiles:user_id (id, full_name, email),
    bookmarks (count),
    comments (count)
  `)
  .order('created_at', { ascending: false })
```

#### Get Single Manga
```javascript
const { data, error } = await supabase
  .from('mangas')
  .select(`
    *,
    profiles:user_id (id, full_name, email),
    bookmarks (id, user_id, profiles:user_id (id, full_name)),
    comments (id, content, created_at, profiles:user_id (id, full_name))
  `)
  .eq('id', mangaId)
  .single()
```

#### Create Manga
```javascript
const { data, error } = await supabase
  .from('mangas')
  .insert([{
    user_id: userId,
    title: 'Manga Title',
    cover_image: 'https://...',
    genre: 'Action, Adventure',
    status: 'ongoing',
    last_chapter_read: 10,
    rating: 8.5,
    review: 'Great manga!',
  }])
  .select()
  .single()
```

#### Update Manga
```javascript
const { data, error } = await supabase
  .from('mangas')
  .update({
    title: 'Updated Title',
    last_chapter_read: 20,
    rating: 9.0,
  })
  .eq('id', mangaId)
  .select()
  .single()
```

#### Delete Manga
```javascript
const { error } = await supabase
  .from('mangas')
  .delete()
  .eq('id', mangaId)
```

---

### Bookmark Operations

#### Toggle Bookmark
```javascript
// Check if bookmark exists
const { data: existing } = await supabase
  .from('bookmarks')
  .select('id')
  .eq('manga_id', mangaId)
  .eq('user_id', userId)
  .single()

if (existing) {
  // Remove bookmark
  await supabase.from('bookmarks').delete().eq('id', existing.id)
} else {
  // Add bookmark
  await supabase.from('bookmarks').insert([{
    manga_id: mangaId,
    user_id: userId,
  }])
}
```

#### Get User Bookmarks
```javascript
const { data, error } = await supabase
  .from('bookmarks')
  .select(`
    id,
    manga_id,
    mangas (id, title, cover_image, genre, status, rating)
  `)
  .eq('user_id', userId)
```

---

### Comment Operations

#### Add Comment
```javascript
const { data, error } = await supabase
  .from('comments')
  .insert([{
    manga_id: mangaId,
    user_id: userId,
    content: 'This is a comment',
  }])
  .select()
  .single()
```

#### Delete Comment
```javascript
const { error } = await supabase
  .from('comments')
  .delete()
  .eq('id', commentId)
```

---

### Profile Operations

#### Get User Profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()

// Get user's mangas
const { data: mangas } = await supabase
  .from('mangas')
  .select('*, bookmarks(count), comments(count)')
  .eq('user_id', userId)

// Get user's bookmarks
const { data: bookmarks } = await supabase
  .from('bookmarks')
  .select('id, manga_id, mangas(*)')
  .eq('user_id', userId)
```

---

## 🔍 Indexes

Performance indexes on frequently queried columns:

```sql
CREATE INDEX mangas_user_id_idx ON mangas(user_id);
CREATE INDEX mangas_created_at_idx ON mangas(created_at DESC);
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_manga_id_idx ON bookmarks(manga_id);
CREATE INDEX comments_manga_id_idx ON comments(manga_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
```

---

## ⚡ Triggers

Auto-update `updated_at` timestamp:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mangas_updated_at BEFORE UPDATE ON mangas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔐 Admin Access

Admin users are identified by `user_metadata.is_admin = true` in Supabase Auth.

To check admin status:
```javascript
const isAdmin = user?.user_metadata?.is_admin === true
```

Admin users can:
- Delete any manga
- Delete any comment
- Access `/admin` route

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**For setup instructions, see `supabase-schema.sql`**
