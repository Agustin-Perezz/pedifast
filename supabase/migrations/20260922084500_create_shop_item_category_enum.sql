do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'shop_item_category'
  ) then
    create type public.shop_item_category as enum (
      'pizzas',
      'hamburguesas',
      'empanadas',
      'sandwiches',
      'ensaladas',
      'papas',
      'milanesas',
      'bebidas'
    );
  end if;
end $$;
