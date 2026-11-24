# VerseBuilder — Supabase & Cloudinary Setup Guide

This guide walks you through connecting **Cloudinary** (for cloud photo/video uploads and CDN streaming) and **Supabase** (for cloud authentication & PostgreSQL database storage) to VerseBuilder.

---

## ☁️ PART 1: Cloudinary Setup (Cloud Media & Video Storage)

Cloudinary provides free cloud storage, automatic WebP/MP4 optimization, and fast CDN delivery for your portfolio photos and video reels.

### Step 1: Create an Account
1. Go to [cloudinary.com](https://cloudinary.com) and create a free account.
2. In your Cloudinary Dashboard / Console, copy your **Cloud name** (e.g. `dxy123abc`).

### Step 2: Create an Unsigned Upload Preset
1. In the Cloudinary console, click the **Settings (gear icon ⚙️)** in the bottom left or top right.
2. Select the **Upload** tab from the left sidebar.
3. Scroll down to the **Upload presets** section and click **Add upload preset**.
4. Configure the preset:
   - **Upload preset name**: Enter `versebuilder_uploads` (or any custom name).
   - **Signing Mode**: Change from *Signed* to **Unsigned** *(Required: allows client-side uploads without exposing secret API keys)*.
   - **Folder** (optional): `versebuilder`
5. Click **Save** in the top right.
6. Copy the **Upload preset name** you just created.

---

## ⚡ PART 2: Supabase Setup (Database & Authentication)

Supabase provides a free PostgreSQL database and user authentication to store user accounts, portfolios, Discord configurations, and contact inquiries.

### Step 1: Create a Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Choose an organization, name your project (e.g. `versebuilder`), set a secure database password, and select your region.
4. Click **Create new project** and wait ~1 minute for setup to complete.

### Step 2: Get Your API Keys
1. In your Supabase project dashboard, go to **Project Settings (gear icon ⚙️)** → **API**.
2. Find and copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** → `anon` `public` key (long JWT string).

### Step 3: Run the Database SQL Script
1. In Supabase, go to the **SQL Editor** from the left navigation bar.
2. Click **New Query**, paste the SQL script below, and click **Run**:

```sql
-- 1. Create portfolios table
create table if not exists public.portfolios (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text unique not null,
  title text not null,
  is_published boolean default false,
  published_at timestamp with time zone,
  template_id text default 'dark-futuristic',
  theme_settings jsonb default '{"accentColor": "#f5b84b", "fontStyle": "Inter"}'::jsonb,
  profile jsonb default '{}'::jsonb,
  skills jsonb default '[]'::jsonb,
  stats jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  media jsonb default '[]'::jsonb,
  socials jsonb default '{}'::jsonb,
  contact jsonb default '{}'::jsonb,
  discord jsonb default '{}'::jsonb,
  inbox jsonb default '[]'::jsonb,
  analytics jsonb default '{"views": 0, "uniqueVisitors": 0, "clicks": {"discord": 0, "email": 0, "whatsapp": 0}}'::jsonb,
  section_settings jsonb default '{"showHero": true, "showWork": true, "showSkills": true, "showTimeline": true, "showContact": true, "showDiscord": true}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.portfolios enable row level security;

-- 3. Policy: Public can view published portfolios
create policy "Public can view published portfolios"
on public.portfolios
for select
using (is_published = true);

-- 4. Policy: Owners can view their own portfolios (including drafts)
create policy "Owners can view own portfolios"
on public.portfolios
for select
to authenticated
using (auth.uid() = user_id);

-- 5. Policy: Owners can insert their own portfolios
create policy "Owners can insert own portfolios"
on public.portfolios
for insert
to authenticated
with check (auth.uid() = user_id);

-- 6. Policy: Owners can update their own portfolios
create policy "Owners can update own portfolios"
on public.portfolios
for update
to authenticated
using (auth.uid() = user_id);

-- 7. Policy: Owners can delete their own portfolios
create policy "Owners can delete own portfolios"
on public.portfolios
for delete
to authenticated
using (auth.uid() = user_id);
```

---

## 🔑 PART 3: Configure Environment Variables

Create a file named `.env` in the root of your project:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=versebuilder_uploads

# Site URL (Optional for production)
VITE_SITE_URL=http://localhost:5173
```

### For Production (Vercel / Netlify)
If you deploy to **Vercel** or **Netlify**:
1. Open your project on Vercel / Netlify.
2. Go to **Settings** → **Environment Variables**.
3. Add the 4 keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Trigger a **Redeploy**.
