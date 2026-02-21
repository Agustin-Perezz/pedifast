update public.shops set address = 'Dirección pendiente' where address is null;

alter table public.shops
  alter column address set not null,
  add constraint shops_address_not_empty check (address <> '');
