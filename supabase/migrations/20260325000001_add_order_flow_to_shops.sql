ALTER TABLE shops
  ADD COLUMN order_flow text NOT NULL DEFAULT 'whatsapp'
    CHECK (order_flow IN ('whatsapp', 'dashboard')),
  ADD COLUMN dashboard_pin_hash text;
