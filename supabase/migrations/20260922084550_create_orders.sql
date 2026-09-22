create table if not exists public.orders (
  id bigint generated always as identity primary key,
  shop_id bigint not null references public.shops (id) on delete cascade,
  external_reference text not null unique,
  customer_name text not null,
  customer_phone text,
  notes text,
  delivery_method text not null check (delivery_method in ('pickup', 'delivery')),
  address text,
  payment_method text not null check (payment_method in ('mercadopago', 'efectivo')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'approved', 'rejected')),
  items jsonb not null,
  total numeric not null,
  delivery_cost numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_shop_status_created
  on public.orders (shop_id, status, created_at);

alter table public.orders enable row level security;

create trigger orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- Anonymous customers MUST NOT read orders.
-- Dashboard orders are created server-side through the service role; this policy lets the
-- public client insert a row when the request supplies the shop's dashboard flow flag.
-- Panel writes (confirm/reject/status/MP tokens) are service-role only, server-side.
create policy "Public insert for dashboard flow" on public.orders
  for insert
  to anon, authenticated
  with check (
    shop_id in (
      select id from public.shops where order_flow = 'dashboard'
    )
  );

-- Anonymous customers may only insert orders (never select) for dashboard-flow shops.
grant insert on public.orders to anon, authenticated;
-- Panel reads/writes go through the service role server-side only.
grant select, insert, update, delete on public.orders to service_role;

alter publication supabase_realtime add table public.orders;
