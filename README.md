-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste all > Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text default '—',
  tiers jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.players enable row level security;

-- Anyone (including signed-out visitors) can read the leaderboard and profiles.
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "players are viewable by everyone"
  on public.players for select using (true);

-- Intentionally no insert/update/delete policies for players or profiles.
-- All writes go through server actions using the service_role key, which
-- checks admin status first. This keeps the write path in one place.

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
