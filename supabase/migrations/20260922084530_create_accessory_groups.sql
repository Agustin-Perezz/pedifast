create table if not exists public.accessory_groups (
  id bigint generated always as identity primary key,
  shop_item_id bigint not null references public.shop_items (id) on delete cascade,
  name text not null,
  selection_mode text not null check (selection_mode in ('single', 'multi')),
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accessory_groups enable row level security;

create trigger accessory_groups_updated_at
  before update on public.accessory_groups
  for each row
  execute function public.handle_updated_at();

create policy "Public read access" on public.accessory_groups
  for select
  using (true);
