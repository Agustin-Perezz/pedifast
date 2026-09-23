# Apply Progress: migrate-core-svelte-to-next

## Mode
Standard (strict_tdd: false per openspec/config.yaml).

## Completed Work Units

### Phase 1a — DB schema + generated types

- [x] 1.1 Port shops, shop_items, accessory_groups, accessory_options, orders + shared handle_updated_at()
- [x] 1.2 RLS enabled: public SELECT on catalog tables; controlled INSERT on orders for dashboard flow; no public SELECT on orders; panel writes remain service-role server-side
- [x] 1.3 Regenerated database.types.ts via `pnpm supabase:gen-types`; no hand edits
- [x] 1.4 Verified via `pnpm typecheck` that all 5 tables and the shop_item_category enum are present

### Phase 1b — Env + pure domain

- [x] 1.5 Added 8 fail-loudly env vars to `src/lib/shared/infrastructure/env.ts` and placeholders to `.env.example`
- [x] 1.6 Created pure domain entities + schemas: `Shop`, `ShopItem`, `AccessoryGroup`, `AccessoryOption`, `Order`, `OrderExternalReference`
- [x] 1.7 Created bounded-set enums (`ShopItemCategory`, `OrderStatus`, `PaymentStatus`, `OrderFlow`, `DeliveryMethod`, `PaymentMethod`, `AccessorySelectionMode`) and domain errors (`ShopNotFoundError`, `InvalidOrderError`, `OrderExternalReferenceFormatError`) while preserving book errors
- [x] 1.8 Unit tests for category boundary rejection and `OrderExternalReference` round-trip + malformed rejection

### Phase 1c — Flat mappers + repositories + containers

- [x] 1.9 Created flat mappers in `src/infrastructure/database/postgres/mappers/` for `Shop`, `ShopItem`, `AccessoryGroup`, `AccessoryOption`, and `Order` (snake_case→camelCase; numeric coercion for order totals)
- [x] 1.10 Added `order.mapper.test.ts` with round-trip and numeric-field assertions
- [x] 1.11 Created one-repository-per-interface data access in `src/infrastructure/database/postgres/repositories/`:
  - `shops/`: `SupabaseGetShopCatalogRepository`, `SupabaseUpdateShopMpTokensRepository`
  - `shop-items/`: `SupabaseGetShopItemByIdRepository`
  - `accessories/`: `SupabaseGetAccessoryGroupsByItemIdsRepository`
  - `orders/`: `SupabaseCreateOrderRepository`, `SupabaseGetOrderRepository`, `SupabaseListOrdersByShopRepository`, `SupabaseUpdateOrderStatusRepository`, `SupabaseUpdateOrderPaymentStatusRepository`
- [x] 1.12 Created `src/lib/containers/catalog.container.ts` wiring catalog use cases to concrete repositories
- [x] 1.13 Added `.*.use-case.test.ts` for `GetShopCatalog`, `GetShopItemById`, `GetAccessoryGroupsByItemIds`, `CreateOrder`, `GetOrder`, `ListOrdersByShop`, `UpdateOrderStatus`, `UpdateOrderPaymentStatus`, `UpdateShopMpTokens` — each verifies delegation through the repository interface

## Work Unit Evidence

### Phase 1a

| Evidence | Value |
|---|---|
| Focused test command and exact result | `pnpm supabase:reset && pnpm supabase:gen-types` → exit 0, migrations applied in order, types regenerated |
| Runtime harness command/scenario | Local Supabase running on ports 55321–55327; `pnpm supabase:reset` recreates all 5 tables and re-applies seed.sql successfully |
| Rollback boundary | Revert commit `f47eb3e` (or delete the 7 migrations and run `pnpm supabase:reset && pnpm supabase:gen-types`). The `books` migration remains untouched. |

### Phase 1b

| Evidence | Value |
|---|---|
| Focused test command and exact result | `pnpm test:unit` → exit 0; Test Files 9 passed, Tests 32 passed |
| Runtime harness command/scenario | `pnpm typecheck` + `pnpm lint` pass; `pnpm dev` boot verification deferred until Phase 3 checkout wiring imports env vars. No runtime boundary depends on unmigrated tables. |
| Rollback boundary | Revert commits `fadc847`, `76b020c`, `3ee18f9` (or remove env additions + all new `src/domain/entities/order*.ts`, `shop*.ts`, `accessory*.ts`, enum files and tests). No page or route imports them yet. |

### Phase 1c

| Evidence | Value |
|---|---|
| Focused test command and exact result | `pnpm test:unit` → exit 0; Test Files 16 passed, Tests 45 passed (includes new mapper + repository use-case interface tests) |
| Runtime harness command/scenario | `N/A` — repository and mapper tests are pure unit tests with mock repositories; no live Supabase or Next.js runtime boundary needed for this slice. |
| Rollback boundary | Revert the Phase 1c commit (or delete `src/infrastructure/database/postgres/{entities,mappers,repositories}/*` for order/shop/accessory entities, `src/application/use-cases/{get-shop-catalog,get-shop-item-by-id,get-accessory-groups-by-item-ids,create-order,get-order,list-orders-by-shop,update-order-status,update-order-payment-status,update-shop-mp-tokens}/`, `src/lib/containers/catalog.container.ts`, and `src/domain/entities/accessory-group-with-options.ts`). No page or route imports these files yet. |

## Verification Results

| Command | Result |
|---|---|
| `pnpm supabase:reset` | exit 0; 5 tables + enum + index + triggers created |
| `pnpm supabase:gen-types` | exit 0; `database.types.ts` exposes accessory_groups, accessory_options, orders, shop_items, shops, and shop_item_category enum |
| `pnpm typecheck` | exit 0; TypeScript: No errors found |
| `pnpm lint` | exit 0; Checked 184 files. No fixes applied |
| `pnpm test:unit` | exit 0; Test Files 16 passed, Tests 45 passed |

## Git State

- Branch: `feat/migrate-core-svelte-to-next` (tracker branch)
- Phase 1a commit: `f47eb3e` — `feat(migrate-core-svelte-to-next): phase 1a db schema and generated types`
- Phase 1b commits:
  - `fadc847` — `Add fail-loudly environment variables for Supabase service role, Mercado Pago and Google Maps` (2 files, 34 insertions, 1 deletion)
  - `76b020c` — `Add order domain enums, errors and OrderExternalReference value object` (11 files, 222 insertions)
  - `3ee18f9` — `Add pure domain entities and schemas for shops, items, accessories and orders` (12 files, 809 insertions)
- Phase 1c commit: TBD — `Add flat mappers, one-repository-per-interface data access and catalog container for order domain`
- Total diff since tracker branch head: TBD (Phase 1c pending commit)

## Deviations from Design

- Phase 1c created thin use-case skeletons for the repository interfaces that Phase 1c supports. Future phases (2–5) will expand the use-case logic (e.g., catalog assembly, checkout validation, MP orchestration, panel auth). The repository interfaces and container wiring remain as designed.
- The `Order.deliveryMethod` getter return type was corrected from `string` to `DeliveryMethod` to satisfy strict TypeScript in repository tests.

## Issues Found

- `tsconfig.json` included the nested `pedifast-old` repo and produced 227 errors from missing SvelteKit deps. Fixed by adding `"pedifast-old"` to `exclude` (Phase 1a).
- Initial migration used `create type if not exists`, which is invalid Postgres. Replaced with an idempotent `DO $$` block checking `pg_type.typname` (Phase 1a).
- Zod v4 uses `issues` instead of `errors` on `ZodError`; updated entity factories accordingly.
- Entity schema IDs were initially `positive()`, which rejected the `0` default used by domain factories. Switched to `nonnegative()` to keep parity with the existing `Book` pattern.
- The `Order` domain entity's `items` accessor returns a readonly array, but the `OrderInput` type expects a mutable array. Test helpers now copy arrays before passing them to `Order.create`.

## Phase 3a — Geocode + delivery-cost use cases and Google adapters

- [x] 3.1 Added `src/application/use-cases/geocode-address/` and `src/application/use-cases/calculate-delivery-cost/` 4-file folders. Application-layer ports: `GeocodeProvider` and `DistanceMatrixProvider` live in the use-case repository.interface files.
- [x] 3.2 Added `GoogleGeocodeService` in `src/infrastructure/geo/`; validation for missing address via request DTO → `InvalidOrderError`; query builds `{address}, {city|Esperanza}, {province|Santa Fe}, Argentina` with `components=country:AR` and `language=es`; not-found → `AddressNotFoundError`; upstream failure → `UpstreamGeoError`. Unit tests with mocked fetch cover default city/province, explicit city/province, address not found, and HTTP failure.
- [x] 3.3 Added `GoogleDistanceMatrixService` in `src/infrastructure/geo/`; driving mode; missing origin/destination and non-positive `pricePerKm` are rejected by `CalculateDeliveryCostUseCase` request DTO; no route → `NoRouteFoundError`; `shippingCost = round(distanceKm * pricePerKm)`; unit tests cover the 3.2 km × 500 = 1600 scenario and no route.
- [x] 3.4 Added `src/lib/containers/checkout.container.ts` wiring `GeocodeAddressUseCase` and `CalculateDeliveryCostUseCase` to the Google adapters, constructed at call time. No route handlers, no Leaflet map picker. Server actions using these use cases will be implemented in the next checkout slice (3.10/3.11).

### Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test command and exact result | `pnpm test:unit` → exit 0; Test Files 21 passed, Tests 73 passed (includes geocode/delivery-cost use-case tests and Google adapter tests) |
| Runtime harness command/scenario | `pnpm build` exits 0. No live Google calls in tests — all adapters are tested with a stubbed `Fetcher`. |
| Rollback boundary | Revert commit `26f54de` (or delete `src/application/use-cases/{geocode-address,calculate-delivery-cost}/`, `src/domain/entities/{address-not-found,no-route-found,upstream-geo}.error.ts`, `src/infrastructure/geo/`, `src/lib/containers/checkout.container.ts`). Checkout UI and server actions are not yet wired to this container, so removing these files leaves the app runnable. |

## Verification Results

| Command | Result |
|---|---|
| `pnpm typecheck` | exit 0; TypeScript: No errors found |
| `pnpm lint` | exit 0; Checked 240 files. No fixes applied |
| `pnpm test:unit` | exit 0; Test Files 21 passed, Tests 73 passed |
| `pnpm build` | exit 0; build completed successfully |

## Git State

- Branch: `feat/migrate-core-svelte-to-next` (tracker branch)
- Phase 3a commit: `26f54de` — `Add geocode and delivery-cost use cases with Google adapters, provider interfaces, checkout container and unit tests`
- Authored diff: 20 files, 670 insertions(+), 4 deletions(-)

## Deviations from Design

- The design originally placed interfaces in `src/application/use-cases/geocode/interfaces.ts` and `src/application/use-cases/delivery/interfaces.ts`. We followed the repository's 4-file folder contract and placed `GeocodeProvider` / `DistanceMatrixProvider` in the respective use-case `repository.interface.ts` files, which keeps the port with the consumer as per `src/application/use-cases/AGENTS.md`.
- `3.2 km × 500 = 1600` is verified at the use-case layer (where `pricePerKm` is applied). The distance adapter returns raw `distanceMeters`/`distanceKm`; the use case owns the cost calculation.

## Issues Found

- `vi.mock` with top-level variables caused `ReferenceError: Cannot access 'fakeApiKey' before initialization` because Vitest hoists the mock factory. Fixed by inlining the mock values inside the factory.
- Initial `Fetcher` type alias lacked a mock shape for inspecting calls; added a cast to `{ mock: { calls: unknown[][] } }` in tests rather than widening the production type.

## Remaining Tasks

- [ ] 3.5 Add `use-cases/create-order/` 4-file folder; validate per `checkout-order-submission` requirement "Checkout form validation"
- [ ] 3.6 RED unit — form-validation scenarios "Delivery requires an address", "Dashboard flow requires a phone number", "WhatsApp flow allows omitted phone"
- [ ] 3.7 RED unit — payment-status derivation
- [ ] 3.8 Add `use-cases/create-order/` dashboard ordering logic
- [ ] 3.9 RED unit + production — external reference format
- [ ] 3.10 Build 2-step checkout overlay
- [ ] 3.11 Wire checkout server action
- [ ] 3.12 RED E2E — `tests/checkout.test.ts` (deferred to end of migration per user instruction)
- [ ] 4.1–4.11 Panel auth, SSE, confirm/reject, ticket
- [ ] 5.1–5.9 MP integration + receipt
- [ ] 6.1–6.8 Security headers, cleanup, books deletion, full regression

## Delivery / PR Boundary

- Strategy: feature-branch-chain
- Tracker branch: `feat/migrate-core-svelte-to-next`
- PR slice: PR 3a — Phase 3a only (tasks 3.1–3.4)
- PR base: previous PR branch (Phase 2) per feature-branch-chain; currently stacked on `feat/migrate-core-svelte-to-next` since prior PRs are not yet retargeted.
- Review budget impact: 666 authored insertions over 19 new files (4 deletions are tasks.md checkbox updates). This exceeds the 400-line budget. The slice is a cohesive infrastructure unit (ports + adapters + tests + container) that cannot be split further without breaking compile/test autonomy; recommend `size:exception`.

## Next Recommended

`sdd-apply` Phase 3b (tasks 3.5–3.11) — checkout form validation, `CreateOrderUseCase`, checkout overlay and server-action wiring.
