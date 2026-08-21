-- In Supabase project's SQL Editor: Dashboard > SQL Editor > New query.

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text,
  prep_time int,
  cook_time int,
  ingredients text[] default '{}',
  instructions text[] default '{}',
  calories int,
  protein numeric,
  carbs numeric,
  fat numeric,
  created_at timestamptz not null default now()
);

-- This is what ties data to a person.
alter table public.recipes enable row level security;

-- What each policy below says: you may only do X to rows where "user_id"
-- matches your own auth id (auth.uid() is supplied automatically by
-- Supabase based on the logged-in user's JWT).

create policy "Users can view their own recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- Helpful index for the default "newest first" sort in the app.
create index if not exists recipes_user_created_idx
  on public.recipes (user_id, created_at desc);
