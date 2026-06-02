create table if not exists public.city_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  city_key text not null,
  province text not null,
  city text not null,
  people text not null default '',
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, city_key)
);

alter table public.city_records enable row level security;

drop policy if exists "city_records_select_own" on public.city_records;
create policy "city_records_select_own"
on public.city_records
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "city_records_insert_own" on public.city_records;
create policy "city_records_insert_own"
on public.city_records
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "city_records_update_own" on public.city_records;
create policy "city_records_update_own"
on public.city_records
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "city_records_delete_own" on public.city_records;
create policy "city_records_delete_own"
on public.city_records
for delete
to authenticated
using (auth.uid() = user_id);
