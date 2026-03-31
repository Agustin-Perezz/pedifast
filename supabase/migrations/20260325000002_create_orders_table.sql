CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  shop_id bigint NOT NULL REFERENCES shops(id),
  external_reference text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text,
  notes text,
  delivery_method text NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
  address text,
  payment_method text NOT NULL CHECK (payment_method IN ('mercadopago', 'efectivo')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  items jsonb NOT NULL,
  total numeric NOT NULL,
  delivery_cost numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_shop_status_created ON orders (shop_id, status, created_at);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
