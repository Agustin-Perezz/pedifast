create type public.shop_item_category as enum (
  'comidas',
  'bebidas',
  'postres',
  'acompañamientos'
);

create table if not exists public.shop_items (
  id bigint generated always as identity primary key,
  shop_id bigint not null references public.shops (id),
  name text not null,
  price numeric not null check (price >= 0),
  category public.shop_item_category not null,
  images text[] not null default '{}',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shop_items enable row level security;

create trigger shop_items_updated_at
  before update on public.shop_items
  for each row
  execute function public.handle_updated_at();
