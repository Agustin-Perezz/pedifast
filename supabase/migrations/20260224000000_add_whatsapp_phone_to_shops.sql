alter table public.shops
  add column if not exists whatsapp_phone text not null default '';
alter table public.shops alter column whatsapp_phone drop default;
