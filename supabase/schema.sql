create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'football-data',
  provider_match_id bigint not null,
  competition text not null,
  utc_kickoff timestamptz not null,
  home_team_name text not null,
  away_team_name text not null,
  status text not null,
  score_home int,
  score_away int,
  stage text,
  matchday int,
  updated_at timestamptz default now(),
  unique(provider, provider_match_id)
);

create table if not exists public.match_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  watched boolean default true,
  attended boolean default false,
  rating numeric(3,1),
  review text,
  stadium text,
  city text,
  notes text,
  visibility text not null default 'public' check (visibility in ('public','private')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, match_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_match_logs_updated_at on public.match_logs;
create trigger set_match_logs_updated_at
before update on public.match_logs
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.match_logs enable row level security;

create policy if not exists "profiles public read" on public.profiles for select using (true);
create policy if not exists "profiles owner insert" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "profiles owner update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "matches public read" on public.matches for select using (true);
create policy if not exists "matches auth write" on public.matches for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "match logs public read" on public.match_logs for select using (visibility = 'public' or auth.uid() = user_id);
create policy if not exists "match logs owner insert" on public.match_logs for insert with check (auth.uid() = user_id);
create policy if not exists "match logs owner update" on public.match_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists "match logs owner delete" on public.match_logs for delete using (auth.uid() = user_id);
