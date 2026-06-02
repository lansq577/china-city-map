create table if not exists public.city_records (
  user_id uuid references auth.users(id) on delete cascade,
  city_key text not null,
  province text not null,
  city text not null,
  people text not null default '',
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (city_key)
);

alter table public.city_records enable row level security;

alter table public.city_records drop constraint if exists city_records_pkey;
alter table public.city_records alter column user_id drop not null;
alter table public.city_records add constraint city_records_pkey primary key (city_key);

drop policy if exists "city_records_select_own" on public.city_records;
drop policy if exists "city_records_insert_own" on public.city_records;
drop policy if exists "city_records_update_own" on public.city_records;
drop policy if exists "city_records_delete_own" on public.city_records;
drop policy if exists "city_records_public_select" on public.city_records;
drop policy if exists "city_records_public_insert" on public.city_records;
drop policy if exists "city_records_public_update" on public.city_records;
drop policy if exists "city_records_public_delete" on public.city_records;

create policy "city_records_public_select"
on public.city_records
for select
to anon, authenticated
using (true);

create policy "city_records_public_insert"
on public.city_records
for insert
to anon, authenticated
with check (true);

create policy "city_records_public_update"
on public.city_records
for update
to anon, authenticated
using (true)
with check (true);

create policy "city_records_public_delete"
on public.city_records
for delete
to anon, authenticated
using (true);
