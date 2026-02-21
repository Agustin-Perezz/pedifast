alter table public.shops
  add column if not exists address text,
  add column if not exists delivery_price numeric check (delivery_price >= 0);
