-- Seed data for local development and tests.
-- Runs after migrations on `supabase db reset` (see config.toml [db.seed]).
-- Keep this minimal: reference data only, not test fixtures.

-- Demo shops. Development only.
-- For the dashboard-flow shop the PIN panel verifies with verifyPin() in
-- src/lib/shared/infrastructure/panel-session.ts: stored format is
-- sha256(salt + pin) as "salt:hex". The value below encodes pin "1234" with
-- salt "dev-salt". Never reuse outside local development.
insert into public.shops (
  shop_name,
  address,
  whatsapp_phone,
  display_name,
  logo_url,
  portrait_url,
  open_hours,
  lat,
  lng,
  price_per_km,
  delivery_price,
  order_flow,
  dashboard_pin_hash
) values
  (
    'pizzeria-luca',
    'Av. San Martin 123, CABA',
    '+5491123456789',
    'Pizzería Luca',
    null,
    null,
    'Lun a Dom 11:00 a 23:00',
    -34.6037,
    -58.3816,
    150,
    450,
    'whatsapp',
    null
  ),
  (
    'empanadas-sara',
    'Av. Corrientes 456, CABA',
    '+5491134567890',
    'Empanadas Sara',
    null,
    null,
    'Lun a Vie 09:00 a 15:00',
    -34.6015,
    -58.3752,
    175,
    null,
    'dashboard',
    'dev-salt:07a68621c0f87e73d10e232ea1a4036b5c1e7ea1a9986a2d539755792de00836'
  )
on conflict (shop_name) do nothing;

-- Catalog for the WhatsApp-flow shop (category uses the enum values from
-- 20260922084500_create_shop_item_category_enum.sql).
insert into public.shop_items (shop_id, name, price, category, images, description)
select s.id, v.name, v.price, v.category::public.shop_item_category, '{}'::text[], v.description
from public.shops s,
     (values
       ('Pizza Margherita', 9500::numeric, 'pizzas', 'Salsa de tomate, mozzarella y albahaca fresca.'),
       ('Pizza Napolitana', 10800::numeric, 'pizzas', 'Con rodajas de tomate y mozzarella.'),
       ('Hamburguesa Clasica', 7200::numeric, 'hamburguesas', 'Carne, cheddar, lechuga y tomate.'),
       ('Empanada de Carne', 1500::numeric, 'empanadas', 'Carne cortada a cuchillo.'),
       ('Ensalada Mixta', 5100::numeric, 'ensaladas', 'Lechuga, tomate y cebolla.'),
       ('Papas Fritas', 3200::numeric, 'papas', 'Porcion grande.'),
       ('Milanesa Individual', 8000::numeric, 'milanesas', 'Con papas fritas de guarnicion.'),
       ('Coca-Cola 500ml', 1800::numeric, 'bebidas', null)
     ) as v(name, price, category, description)
where s.shop_name = 'pizzeria-luca'
on conflict do nothing;

-- Accessory groups scoped to specific items (required single-select for pizza
-- sizes; optional multi-select extras for the burger). Join through the item
-- name within the pizzeria's catalog only, and pick only the pizza/burger
-- rows via an exists-clause to keep the join unambiguous.
insert into public.accessory_groups (shop_item_id, name, selection_mode, is_required, sort_order)
select i.id, v.name, v.selection_mode::text, v.is_required, v.sort_order
from (values
       ('Pizza Margherita', 'Tamaño', 'single', true, 0),
       ('Pizza Napolitana', 'Tamaño', 'single', true, 0),
       ('Hamburguesa Clasica', 'Extras', 'multi', false, 0)
     ) as v(item_name, name, selection_mode, is_required, sort_order)
join public.shop_items i
  on i.name = v.item_name
 and i.shop_id = (select id from public.shops where shop_name = 'pizzeria-luca')
on conflict do nothing;

-- Options per group, priced deltas in ARS. Group names repeat across items
-- (both pizzas have "Tamaño"), so options join through (item_name, group_name)
-- pairs instead of the group name alone.
insert into public.accessory_options (group_id, name, price_delta, sort_order)
select g.id, gv.name, gv.price_delta, gv.sort_order
from (values
       ('Tamaño', 'Personal', -2500::numeric, 0),
       ('Tamaño', 'Grande', 0::numeric, 1),
       ('Tamaño', 'Familiar', 2500::numeric, 2),
       ('Extras', 'Queso extra', 1000::numeric, 0),
       ('Extras', 'Bacon', 1500::numeric, 1),
       ('Extras', 'Huevo frito', 800::numeric, 2)
     ) as gv(group_name, name, price_delta, sort_order)
join public.accessory_groups g
  on g.name = gv.group_name
 and g.shop_item_id in (
   select id from public.shop_items
   where shop_id = (select id from public.shops where shop_name = 'pizzeria-luca')
 )
on conflict do nothing;

-- Reference books (original starter seed, kept because books table remains).
insert into public.books (title, author) values
  ('The Pragmatic Programmer', 'David Thomas'),
  ('Clean Architecture', 'Robert C. Martin'),
  ('Refactoring', 'Martin Fowler')
on conflict do nothing;