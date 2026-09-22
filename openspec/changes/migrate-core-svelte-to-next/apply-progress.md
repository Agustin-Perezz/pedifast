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

## Remaining Tasks

- [ ] 2.1 Add `GetShopCatalog` use case returning shop metadata + products + nested accessory groups/options
- [ ] 2.2 Create catalog pages and components
- [ ] 2.3–2.10 Catalog + cart UI and E2E tests
- [ ] 3.1–3.12 Checkout, geocode, delivery-cost, order submission
- [ ] 4.1–4.11 Panel auth, SSE, confirm/reject, ticket
- [ ] 5.1–5.9 MP integration + receipt
- [ ] 6.1–6.8 Security headers, cleanup, books deletion, full regression

## Delivery / PR Boundary

- Strategy: feature-branch-chain
- Tracker branch: `feat/migrate-core-svelte-to-next`
- PR slice: PR 1c — Phase 1c only (tasks 1.9–1.13)
- PR base: `feat/migrate-core-svelte-to-next` (tracker branch)
- Review budget impact: This Phase 1c slice is large and will exceed the 400-line PR budget. Per the binding decision, `size:exception` is accepted for large pure-infrastructure slices like this one; implement the full phase honestly and report the authored line count.

## Next Recommended

`sdd-apply` Phase 2 (tasks 2.1–2.10) or `sdd-archive` after the maintainer accepts the PR chain state.
