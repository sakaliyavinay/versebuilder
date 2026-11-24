# Vercel + Supabase + Cloudinary CMS Setup

This website now supports a deployed CMS at:

```txt
/admin
```

Use it to upload latest work after deployment.

## 1. Create Supabase project

Create a project at Supabase and copy:

- Project URL
- anon public key

## 2. Create table

In Supabase SQL Editor, run:

```sql
create extension if not exists pgcrypto;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null default 'video' check (item_type in ('video', 'thumbnail')),
  title text not null,
  category text not null,
  video_url text,
  thumb_url text not null,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

create policy "Public can read portfolio items"
on public.portfolio_items
for select
to anon, authenticated
using (true);

create policy "Logged in admin can insert portfolio items"
on public.portfolio_items
for insert
to authenticated
with check (true);
```

If you already created the older table, run this migration too:

```sql
alter table public.portfolio_items
add column if not exists item_type text not null default 'video';

alter table public.portfolio_items
alter column video_url drop not null;

alter table public.portfolio_items
drop constraint if exists portfolio_items_item_type_check;

alter table public.portfolio_items
add constraint portfolio_items_item_type_check
check (item_type in ('video', 'thumbnail'));
```

## 3. Create Cloudinary upload preset

Create a Cloudinary account, then copy your **Cloud name**.

Create an unsigned upload preset:

```txt
Settings -> Upload -> Upload presets -> Add upload preset
```

Set:

```txt
Signing Mode: Unsigned
Folder: portfolio
```

Copy the upload preset name.

## 4. Create your admin login

In Supabase:

```txt
Authentication -> Users -> Add user
```

Use your email and password. This is what you will use on `/admin`.

## 5. Add Vercel environment variables

In Vercel project settings, add:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_TABLE=portfolio_items
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
```

Redeploy after adding them.

## 6. Upload work

Open:

```txt
https://your-domain.com/admin
```

Sign in with your Supabase user and upload:

- title
- category
- video file for the Video section
- thumbnail image for the Thumbnail section

The live portfolio will update automatically.

Videos and thumbnails upload to Cloudinary. Supabase stores only title,
category, item type, and the Cloudinary URLs.
