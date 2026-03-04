ALTER TABLE public.shop_items ALTER COLUMN category TYPE text USING category::text;

DROP TYPE public.shop_item_category;

UPDATE public.shop_items SET category = 'hamburguesas';

CREATE TYPE public.shop_item_category AS ENUM (
  'pizzas', 'hamburguesas', 'empanadas', 'sandwiches', 'ensaladas', 'papas', 'milanesas', 'bebidas'
);

ALTER TABLE public.shop_items
  ALTER COLUMN category TYPE public.shop_item_category
  USING category::public.shop_item_category;
