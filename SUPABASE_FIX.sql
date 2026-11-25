-- Step 1: Drop ALL existing policies on portfolios table
drop policy if exists "Users can read own portfolios" on public.portfolios;
drop policy if exists "Users can insert own portfolios" on public.portfolios;
drop policy if exists "Users can update own portfolios" on public.portfolios;
drop policy if exists "Users can delete own portfolios" on public.portfolios;
drop policy if exists "Public can read published portfolios" on public.portfolios;

-- Step 2: Recreate with correct roles
alter table public.portfolios enable row level security;

create policy "Users can read own portfolios"
on public.portfolios for select
to authenticated
using (auth.uid() = user_id);

create policy "Public can read published portfolios"
on public.portfolios for select
to anon, authenticated
using (is_published = true);

create policy "Users can insert own portfolios"
on public.portfolios for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own portfolios"
on public.portfolios for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own portfolios"
on public.portfolios for delete
to authenticated
using (auth.uid() = user_id);
