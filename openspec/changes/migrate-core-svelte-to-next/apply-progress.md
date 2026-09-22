# Apply Progress: migrate-core-svelte-to-next

## Mode
Standard (strict_tdd: false per openspec/config.yaml).

## Completed Work Units

### Phase 1a — DB schema + generated types

- [x] 1.1 Port shops, shop_items, accessory_groups, accessory_options, orders + shared handle_updated_at()
- [x] 1.2 RLS enabled: public SELECT on catalog tables; controlled INSERT on orders for dashboard flow; no public SELECT on orders; panel writes remain service-role server-side
- [x] 1.3 Regenerated database.types.ts via `pnpm supabase:gen-types`; no hand edits
- [x] 1.4 Verified via `pnpm typecheck` that all 5 tables and the shop_item_category enum are present

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test command and exact result | `pnpm supabase:reset && pnpm supabase:gen-types` → exit 0, migrations applied in order, types regenerated |
| Runtime harness command/scenario | Local Supabase running on ports 55321–55327; `pnpm supabase:reset` recreates all 5 tables and re-applies seed.sql successfully |
| Rollback boundary | Revert commit `f47eb3e` (or delete the 7 migrations and run `pnpm supabase:reset && pnpm supabase:gen-types`). The `books` migration remains untouched. |

## Verification Results

| Command | Result |
|---|---|
| `pnpm supabase:reset` | exit 0; 5 tables + enum + index + triggers created |
| `pnpm supabase:gen-types` | exit 0; `database.types.ts` exposes accessory_groups, accessory_options, orders, shop_items, shops, and shop_item_category enum |
| `pnpm typecheck` | exit 0; TypeScript: No errors found |
| `pnpm lint` | exit 0; Checked 98 files. No fixes applied |
| `pnpm test:unit` | exit 0; Test Files 6 passed, Tests 13 passed |

## Git State

- Branch: `feat/migrate-core-svelte-to-next` (tracker branch created from `main`)
- Commit: `f47eb3e` — `feat(migrate-core-svelte-to-next): phase 1a db schema and generated types`
- Diff: 11 files changed, 458 insertions(+), 4 deletions(-)

## Deviations from Design

None — Phase 1a follows the spec and design exactly. The `handle_updated_at()` trigger was extracted into its own migration file before the table migrations so all triggers can share it without re-creation ordering issues.

## Issues Found

- `tsconfig.json` included the nested `pedifast-old` repo and produced 227 errors from missing SvelteKit deps. Fixed by adding `"pedifast-old"` to `exclude`.
- Initial migration used `create type if not exists`, which is invalid Postgres. Replaced with an idempotent `DO $$` block checking `pg_type.typname`.

## Remaining Tasks

- [ ] 1.5 Add 8 fail-loudly env vars
- [ ] 1.6 Create pure domain entities + schemas
- [ ] 1.7 Create bounded-set enums + domain errors
- [ ] 1.8 Unit RED test for category enum + OrderExternalReference
- [ ] 1.9 Flat mappers
- [ ] 1.10 Order mapper round-trip unit test
- [ ] 1.11 One-repository-per-interface data access
- [ ] 1.12 Containers
- [ ] 1.13 Repository use-case interface test

## Delivery / PR Boundary

- Strategy: feature-branch-chain
- Tracker branch: `feat/migrate-core-svelte-to-next`
- PR slice: PR 1a — Phase 1a only (tasks 1.1–1.4)
- Next slice: PR 1b — Phase 1b env vars + domain entities + OrderExternalReference (tasks 1.5–1.8)
- Review budget impact: authored additions ~171 lines across migrations + 2 tsconfig lines; generated `database.types.ts` adds ~286 lines (excluded from authored count). Total commit diff 458 insertions, 4 deletions, well under the 400 authored-line budget.

## Next Recommended

`sdd-apply` Phase 1b (tasks 1.5–1.8) on branch `feat/migrate-core-svelte-to-next`.
