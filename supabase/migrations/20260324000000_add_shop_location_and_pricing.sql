ALTER TABLE shops
  ADD COLUMN lat double precision NOT NULL DEFAULT 0,
  ADD COLUMN lng double precision NOT NULL DEFAULT 0,
  ADD COLUMN price_per_km numeric NOT NULL DEFAULT 0;