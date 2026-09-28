create table if not exists public.shops (
  id bigint generated always as identity primary key,
  shop_name text not null unique,
  mp_access_token text,
  mp_refresh_token text,
  mp_token_expires_at timestamptz,
  mp_user_id text,
  mp_public_key text,
  connected_at timestamptz,
  address text not null constraint shops_address_not_empty check (address <> ''),
  delivery_price numeric constraint shops_delivery_price_non_negative check (delivery_price >= 0),
  whatsapp_phone text not null,
  display_name text,
  logo_url text,
  portrait_url text,
  open_hours text,
  lat double precision not null default 0,
  lng double precision not null default 0,
  price_per_km numeric not null default 0 constraint shops_price_per_km_non_negative check (price_per_km >= 0),
  order_flow text not null default 'whatsapp' constraint shops_order_flow_check check (order_flow in ('whatsapp', 'dashboard')),
  dashboard_pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on row changes
alter table public.shops enable row level security;

create trigger shops_updated_at
  before update on public.shops
  for each row
  execute function public.handle_updated_at();

-- Panel writes (MP tokens, pin hash, status) go through the service role server-side only.
-- Public catalog read is handled in the dedicated RLS policy below.
create policy "Public read access" on public.shops
  for select
  using (true);

-- Explicit grants per repo standard (see create_books migration).
grant select on public.shops to anon, authenticated;
grant select, insert, update, delete on public.shops to service_role;
