create table if not exists public.accessory_options (
  id bigint generated always as identity primary key,
  group_id bigint not null references public.accessory_groups (id) on delete cascade,
  name text not null,
  price_delta numeric not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accessory_options enable row level security;

create trigger accessory_options_updated_at
  before update on public.accessory_options
  for each row
  execute function public.handle_updated_at();

create policy "Public read access" on public.accessory_options
  for select
  using (true);
