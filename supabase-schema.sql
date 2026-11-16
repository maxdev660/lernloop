-- Run once in your own Supabase project's SQL Editor.
-- Only authenticated users can access their own progress.
create table if not exists public.lernloop_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.lernloop_profiles enable row level security;
revoke all on public.lernloop_profiles from anon;
grant select,insert,update on public.lernloop_profiles to authenticated;

drop policy if exists "Select own study profile" on public.lernloop_profiles;
create policy "Select own study profile" on public.lernloop_profiles
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Insert own study profile" on public.lernloop_profiles;
create policy "Insert own study profile" on public.lernloop_profiles
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Update own study profile" on public.lernloop_profiles;
create policy "Update own study profile" on public.lernloop_profiles
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
