# Order Data Model Specification

## Purpose

Defines the persisted data foundation: the five Postgres tables, honest RLS policies, realtime publication, domain entities and enums, flat mappers, and one-repository-per-interface data access. This capability is the dependency everything else builds on.

## Requirements

### Requirement: Database schema (5 tables)

The system MUST define these tables in timestamped Supabase migrations (ported from the reference app, renamed to this repo's conventions):

- `shops` — `id`, `shop_name` (unique, not null), `mp_access_token`, `mp_refresh_token`, `mp_token_expires_at`, `mp_user_id`, `mp_public_key`, `connected_at`, `address` (not null, non-empty), `delivery_price`, `whatsapp_phone` (not null), `display_name`, `logo_url`, `portrait_url`, `open_hours`, `lat` (not null, default 0), `lng` (not null, default 0), `price_per_km` (not null, default 0), `order_flow` (not null, default `whatsapp`, check in `whatsapp`/`dashboard`), `dashboard_pin_hash`, `created_at`, `updated_at`.
- `shop_items` — `id`, `shop_id` (FK → shops), `name`, `price` (numeric, `>= 0`), `category` (enum: `pizzas`, `hamburguesas`, `empanadas`, `sandwiches`, `ensaladas`, `papas`, `milanesas`, `bebidas`), `images` (text[], default `{}`), `description`, timestamps.
- `accessory_groups` — `id`, `shop_item_id` (FK → shop_items, on delete cascade), `name`, `selection_mode` (check in `single`/`multi`), `is_required` (default false), `sort_order`.
- `accessory_options` — `id`, `group_id` (FK → accessory_groups, on delete cascade), `name`, `price_delta` (numeric, default 0), `sort_order`.
- `orders` — `id`, `shop_id` (FK → shops), `external_reference` (text, unique, not null), `customer_name` (not null), `customer_phone`, `notes`, `delivery_method` (check in `pickup`/`delivery`), `address`, `payment_method` (check in `mercadopago`/`efectivo`), `payment_status` (check in `pending`/`approved`/`rejected`, default `pending`), `items` (jsonb, not null), `total` (numeric, not null), `delivery_cost` (numeric, default 0), `status` (check in `pending`/`confirmed`/`rejected`, default `pending`), timestamps.

The system MUST add an index on `orders (shop_id, status, created_at)` and an `updated_at` trigger on each table via a shared `handle_updated_at()` function.

#### Scenario: Schema creates cleanly on reset

- GIVEN a fresh local Supabase stack
- WHEN `supabase db reset` runs
- THEN all five tables exist with the specified columns, constraints, and index, and the migrations apply in order without error

### Requirement: Honest RLS policies

The system MUST enable Row Level Security on all five tables and write explicit policies (no reliance on the service role blanket):
- public `SELECT` on `shops`, `shop_items`, `accessory_groups`, and `accessory_options` (anonymous browsing MUST work);
- controlled `INSERT` on `orders` for the dashboard flow;
- panel writes (confirm/reject status updates, MP token updates) MUST go through the service role server-side only (no direct client write policies).

#### Scenario: Anonymous customer can read the catalog

- GIVEN RLS is enabled and public SELECT policies exist on shops/items/accessories
- WHEN an unauthenticated client reads the shop catalog
- THEN the catalog data is returned

#### Scenario: Anonymous customer cannot read orders

- GIVEN RLS is enabled with no public SELECT policy on `orders`
- WHEN an unauthenticated client attempts to read `orders`
- THEN no rows are returned

### Requirement: Realtime publication on orders

The system MUST add `orders` to the `supabase_realtime` publication so `postgres_changes` INSERT/UPDATE events on `orders` are available to the panel's SSE fan-out.

#### Scenario: Orders table is published for realtime

- GIVEN the migrations are applied
- WHEN the panel subscribes to `postgres_changes` on `orders`
- THEN INSERT and UPDATE events for the filtered shop are delivered

### Requirement: Generated types

The system MUST regenerate `database.types.ts` from the local database via `pnpm supabase:gen-types`. The file MUST never be edited by hand.

#### Scenario: Types reflect the ported schema

- GIVEN the migrations are applied to the local DB
- WHEN `pnpm supabase:gen-types` runs
- THEN `database.types.ts` includes the five tables and the category/status/flow enums

### Requirement: Domain entities and enums

The system MUST define pure domain entities — `Shop`, `ShopItem` (Product), `AccessoryGroup`, `AccessoryOption`, `Order` — as classes with private constructors, static factories, and invariants (per `src/domain/AGENTS.md`). It MUST define bounded-set enums for:
- `ShopItemCategory` (the 8 categories);
- `OrderStatus` (`pending`, `confirmed`, `rejected`);
- `PaymentStatus` (`pending`, `approved`, `rejected`);
- `OrderFlow` (`whatsapp`, `dashboard`);
- `DeliveryMethod` (`pickup`, `delivery`);
- `PaymentMethod` (`mercadopago`, `efectivo`).

The `externalReference` MUST be modeled behind a dedicated value object (e.g. `OrderExternalReference`) that encapsulates the `shopName-timestamp` format and can parse shop name and date, so a future format redesign is a one-file change.

#### Scenario: Category is a bounded enum

- GIVEN the domain model
- WHEN a product category is set
- THEN it MUST be one of the 8 defined categories, and any other value is rejected at the boundary

### Requirement: Flat mappers

The system MUST define flat mappers — one file per entity, in `src/infrastructure/database/postgres/mappers/` — exposing `toDomain(row)` and `toPersistence(entity)`. Mappers MUST NOT be nested by relationship; any repository touching an entity MUST import the same mapper.

#### Scenario: Order mapper round-trips

- GIVEN an order DB row
- WHEN `toDomain` is applied
- THEN the domain `Order` has correctly typed fields (numeric `total`/`deliveryCost` coerced, snake_case mapped to camelCase)

### Requirement: One repository per interface

The system MUST implement data access as repositories, one repository class per use-case repository interface (no multi-interface aggregates except the documented auth exception). Repositories MUST call mappers to convert DB rows ↔ domain entities and receive the Supabase client via dependency injection.

#### Scenario: Repositories satisfy use-case interfaces

- GIVEN the `create-order`, `get-shop-catalog`, `get-order`, `update-order-status`, and MP-token update use cases
- WHEN the containers are wired
- THEN each use case is bound to a concrete repository implementing exactly its interface
