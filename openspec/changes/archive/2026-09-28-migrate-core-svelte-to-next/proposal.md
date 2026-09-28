# Proposal: Migrate Core SvelteKit App to Next.js Clean Architecture

> **Verdict first**: Port the pedifast-old SvelteKit core (ordering flow, product detail, shop panel, order receipt, order flows, server APIs, DB schema, env vars, security headers) into this Next.js 16 strict Clean Architecture repo, sliced into ~6 PR-sized phases under the 400-line review budget. MP webhooks and the Leaflet map picker are explicitly deferred. Delivery address becomes: plain text input → server geocode → delivery-cost calculation.

## Intent

The production ordering app lives in `pedifast-old/` (SvelteKit 2 + Svelte 5) as a read-only reference. The business needs it on the maintained Next.js 16 stack, under this repo's strict Clean Architecture (pure domain, use-case 4-file folders, swappable infrastructure, per-request containers, native form actions). The migration must preserve all CORE business behavior — anonymous customer ordering, per-shop dashboard PIN panel, SSE-driven order management, Mercado Pago hosted-checkout with receipt verification — while dropping dead code and porting DB schema, env handling, and security headers to this repo's conventions.

**Deferred by explicit user decision**: MP webhooks (payment confirmation still relies on receipt-page verification via `payment_id` query param + `external_reference` cross-check) and the Leaflet map picker (replaced by plain-text address input → server geocode → delivery-cost calculation).

## Scope

### In Scope

1. **DB migrations ported** — all 5 tables (`shops`, `shop_items`, `accessory_groups`, `accessory_options`, `orders`) from pedifast-old/supabase/migrations into `supabase/migrations/` (timestamped, this repo's naming), including the `order_flow` column, RLS, realtime publication on `orders`, and `updated_at` triggers. Regenerate `database.types.ts` via `pnpm supabase:gen-types` — never by hand.
2. **Environment port** — all 8 required env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MP_APP_ID`, `MP_CLIENT_SECRET`, `MP_REDIRECT_URI`, `MP_OAUTH_STATE_SECRET`, `GOOGLE_MAPS_API_KEY`, `GOOGLE_MAPS_BASE_URL`) added to `src/lib/shared/infrastructure/env.ts` fail-loudly pattern (no defaults).
3. **Ordering flow** — `/[shopName]/pedir`: shop + products load (cached ~30s/swr ~60s parity), ShopHeader, sticky CategoryNav with scroll-spy (IntersectionObserver), product rows/grid, CartBottomBar, adaptive CheckoutOverlay (Dialog desktop / Drawer mobile), 2-step checkout (accessories with required-group gating → checkout form), accessories (single/multi selection modes, price deltas). Cart in React context (no state lib), in-memory only (parity with old app — no persistence).
4. **Product detail** — `/[shopName]/pedir/[productId]`: embla carousel (or equivalent if dependency conflicts) + product info + add-to-cart.
5. **Shop panel** — `/[shopName]/panel`: PIN login (salted SHA-256 verify, HMAC-signed `panel_session` cookie ~7d), SSE stream for new/updated orders, pending/confirmed order lists, confirm/reject server actions with shop-ownership checks, notification sound, printable 80mm ticket (CSS print), WhatsApp confirmation deep link on confirm.
6. **Order receipt** — `/pedido/[id]`: MP payment verification on return (`payment_id` query param, `external_reference` cross-check), status display, whatsapp-flow orders read from localStorage + auto-redirect to `wa.me`, date parsed from `external_reference` timestamp.
7. **Order flows** — `whatsapp` (order lives in localStorage only, never hits server) vs `dashboard` (POST order, managed in panel) — per-shop via `shops.order_flow`.
8. **Server APIs as Clean Architecture use cases** — delivery-cost (Google Distance Matrix), geocode (Google Geocoding, defaults Esperanza/Santa Fe), MP per-shop OAuth (authorize + callback, HMAC state, token refresh with 1h buffer), MP preference creation (hosted checkout, `external_reference = ${shopName}-${Date.now()}`, back_urls → `/pedido/{extRef}` in non-localhost), order creation, order stream (SSE, Node runtime route handler).
9. **Security headers/CSP port** — from old `hooks.server.ts` (MP, OpenStreetMap, Supabase, Sentry, Google Fonts domains) into `next.config` headers (and/or `src/proxy.ts` where Next 16 demands it).
10. **UI components** — shadcn (base-nova) additions: table, badge, sonner (toast), skeleton; select/tabs only if actually needed.
11. **Test suite** — Vitest unit tests for use-cases/entities/mappers (coverage scope per repo config) + Playwright E2E (port 3100, RUN_ID pattern) for: ordering flow, checkout, panel PIN + order management, receipt. Old app had none — authored from scratch.
12. **Domain model** — entities + schemas for Shop, ShopItem, AccessoryGroup, AccessoryOption, Order, OrderStatus/PaymentStatus enums, Category enum (pizzas/hamburguesas/empanadas/sandwiches/ensaladas/papas/milanesas/bebidas), OrderFlow enum.

### Out of Scope

- **MP webhooks** — deferred by user decision; payment verification stays receipt-driven.
- **Leaflet map picker** — deferred; plain text address input + server geocode replaces it.
- Dead code explicitly not migrated: old `axios.ts`, `@supabase/ssr` usage patterns from old app, status-badge timer, old toast helpers.
- Admin/supabase-auth (`/signin`, `/dashboard`) — kept untouched (see Open Questions for `books`).
- Any redesign/improvement of UX beyond behavior parity (cart persistence improvement deferred — parity kept).

## Capabilities

> This section is the CONTRACT between proposal and specs phases.
> `openspec/specs/` is currently empty — no existing capabilities to modify.

### New Capabilities

- `shop-catalog`: Shop + product browsing — shop page load, category navigation with scroll-spy, product listing, product detail with carousel, caching parity.
- `order-cart`: Anonymous customer cart — React context cart (add/remove/quantity), accessory selection with single/multi modes and required-group gating, 2-step checkout overlay, in-memory only.
- `checkout-order-submission`: Checkout form + order flows — customer/delivery data, delivery address geocode + delivery-cost calculation, whatsapp vs dashboard order flow branching.
- `shop-panel-management`: Shop owner panel — PIN authentication (HMAC session cookie), SSE real-time order stream, pending/confirmed order lists, confirm/reject actions with ownership checks, printable ticket, notification sound.
- `payment-mp-checkout`: Mercado Pago integration — per-shop OAuth (authorize/callback/refresh), hosted-checkout preference creation, receipt page payment verification, whatsapp-flow localStorage handling.
- `delivery-pricing`: Geocoding + delivery cost server capabilities — Google Geocoding + Distance Matrix adapters as infrastructure, exposed as use cases.
- `order-data-model`: DB schema for shops/shop_items/accessories/orders — migrations, entities, mappers, repositories, honest RLS policies, realtime publication.

### Modified Capabilities

None — `openspec/specs/` is empty; all capabilities are new.

## Approach

Sequence the migration in dependency order, one reviewable PR slice per phase (Feature Branch Chain — each PR targets the previous slice's branch):

1. **Phase 1 — Data foundation**: port migrations, regenerate types, env vars, domain entities/schemas/enums, mappers, repositories, containers for shops/shop_items/accessories. Seed a test shop for E2E.
2. **Phase 2 — Ordering flow UI**: shop catalog page + category scroll-spy nav + product grid + product detail. Cart context (add/remove/quantity, accessory single/multi modes, required-group gating). Unit tests for cart logic.
3. **Phase 3 — Checkout + order submission**: 2-step checkout overlay, plain-text delivery address input, geocode + delivery-cost use cases with Google infra adapter, order creation for `dashboard` flow, localStorage persistence for `whatsapp` flow. No MP yet — orders are created/submitted without payment.
4. **Phase 4 — Shop panel**: PIN auth (HMAC cookie), SSE stream (Node runtime route handler + Supabase Realtime postgres_changes — see Risks for connection strategy), pending/confirmed order lists, confirm/reject server actions with ownership checks, printable 80mm ticket, notification sound.
5. **Phase 5 — MP integration**: `src/infrastructure/payments/mp/` adapter (per-shop OAuth authorize/callback, token refresh w/ 1h buffer), hosted-checkout preference creation with `external_reference = ${shopName}-${Date.now()}`, receipt page `/pedido/[id]` with payment verification (`payment_id` + `external_reference` cross-check) and whatsapp-flow localStorage redirect.
6. **Phase 6 — Security + hardening**: CSP/security headers port, client-concern polish (sound/vibrate/print), E2E suite completion, full verify (typecheck + lint + unit + build + E2E).

Each phase is a chained PR slice (Feature Branch Chain): clear start, clear finish, autonomous scope, verification (unit + E2E where applicable), and rollback = revert that slice's PR. Per config rule `rules.proposal`, the 400-changed-lines review budget is enforced by this slicing; `sdd-tasks` will forecast each phase and must emit the standard guard lines before apply.

**Auth design stance (proposal decision, flagged for user)**: shop-panel PIN auth is a SEPARATE auth path from the repo's supabase-auth `/dashboard`. Anonymous customers stay anonymous (RLS policies must allow public reads on shops/items/accessories and controlled writes for orders). The repo's `requireUser()` convention does NOT apply to customer/panel routes — the panel gets its own `requirePanelSession()` server-side guard. This needs explicit user sign-off.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `supabase/migrations/` | New | Ported 5-table schema, RLS, realtime publication, triggers (timestamped) |
| `src/domain/` | New | Shop/ShopItem/AccessoryGroup/AccessoryOption/Order entities, schemas, enums (category, order_flow, statuses) |
| `src/application/use-cases/` | New | 4-file folders: get-shop-catalog, geocode-address, calculate-delivery-cost, create-order, get-order, verify-mp-payment, panel auth actions, confirm/reject order |
| `src/infrastructure/database/postgres/` | New | entities (row aliases), flat mappers, one repository class per interface |
| `src/infrastructure/payments/` (new module) | New | MP OAuth client + preference client (per-shop token refresh) |
| `src/infrastructure/geo/` (new module) | New | Google Geocoding + Distance Matrix adapters |
| `src/lib/shared/infrastructure/env.ts` | Modified | +8 fail-loudly required env vars |
| `src/lib/containers/` | New | Per-entry-point containers (shop-catalog, checkout, panel, receipt) |
| `src/app/[shopName]/pedir/` | New | Ordering flow + product detail pages |
| `src/app/[shopName]/panel/` | New | Shop panel (PIN login + order management) |
| `src/app/pedido/[id]/` | New | Order receipt page |
| `src/app/api/` or route handlers | New | SSE stream (Node runtime), MP OAuth callback, geocode/delivery-cost endpoints if not pure server actions |
| `next.config.ts` / `src/proxy.ts` | Modified | Security headers/CSP port |
| `src/components/` | New | shadcn additions: table, badge, sonner, skeleton (+ select/tabs if needed) |
| `tests/` | New | Playwright E2E: ordering, checkout, panel, receipt flows (RUN_ID pattern) |
| `src/domain/…/books`, `src/app/books/` | Removed? | Reference material — delete after migration completes (Open Question) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSE + Supabase Realtime in Next 16: old app created a service-role client per connection — fragile, leaks connections | High | Single shared server-side subscription (module-level or per-request cached) multiplexing postgres_changes to all SSE clients via a fan-out; Node runtime route handler; load-test locally; fall back to polling if unstable |
| `external_reference` doubles as order ID (`shopName-timestamp`) — format is load-bearing for receipt + date parsing | Med | Keep format for behavior parity; document as tech-debt; isolate behind a dedicated `OrderExternalReference` value object so a later redesign is one-file |
| Anonymous cart in React without state lib — context re-renders, stale closures | Med | Cart context with reducer pattern, derived selectors, unit tests for cart logic; keep components ≤50 lines Biome rule |
| RLS policies: old app relied on service role everywhere (RLS enabled, no policies); books demo is permissive | Med | Write honest RLS from day one: public SELECT on shops/items/accessories, controlled INSERT on orders (dashboard flow), panel writes via service role server-side only; document in migration comments |
| MP sandbox behavior differs from production (back_urls localhost behavior) | Med | Port the non-localhost back_urls logic exactly; E2E with mocked MP responses; manual sandbox verification step |
| 400-line budget overrun — migration is large | High | 6-phase chained PR plan; each phase forecast before apply; `sdd-tasks` emits the 3-line guard; split any phase that forecasts over budget |
| Print ticket + notification sound + vibrate are client concerns — hydration/SSR pitfalls | Low | Client-only components with `useEffect` guards; test manually + E2E print-styles smoke |
| CSP port breaks existing Sentry/Supabase/fonts flows | Med | Port domain list from old hooks verbatim first; run existing E2E suite + new flows against local stack before merge |
| embla carousel dependency conflict with React 19 / base-ui | Low | Verify peer deps before install; fallback to a simple scroll-snap carousel (product images count is small) |

## Rollback Plan

- Each phase ships as its own PR on a feature branch chain → revert the PR to roll back that slice without touching earlier phases.
- DB migrations: all ported migrations are new tables in the local Supabase stack; rollback = `supabase migration down` / reset local stack. No prod data exists yet (app not deployed from this repo) — migration rollback is safe pre-deploy.
- Env vars: additive — removal of new entries restores prior crash-on-missing behavior for the old set only.
- `books` demo deletion (if approved) happens in the final phase only — revert restores it; it stays intact until migration is verified.
- Full rollback = revert the merge of every phase PR in reverse order; the repo returns to pre-migration state since all additions are new files/folders except `env.ts` and `next.config.ts` (small, isolated diffs).

## Dependencies

- Local Supabase stack running (per `supabase/AGENTS.md`) for migrations + E2E.
- Google Maps API key with Geocoding + Distance Matrix enabled (local .env).
- MP sandbox credentials (APP_ID/CLIENT_SECRET) for OAuth + preference testing.
- shadcn CLI additions available for base-nova style.
- Node runtime route handlers enabled (Next 16 default supports; SSE needs explicit Node runtime).

## Success Criteria

- [ ] All 5 tables exist in local Supabase with ported schema, RLS policies, realtime publication on `orders`; `database.types.ts` regenerated via CLI, never hand-edited.
- [ ] A customer can: browse a shop's menu with category scroll-spy, open product detail, configure accessories (required-group gating enforced), see cart, complete 2-step checkout with geocoded delivery address and calculated delivery cost, and submit an order in both `whatsapp` and `dashboard` flows.
- [ ] A shop owner can: PIN-login to the panel, receive new orders via SSE in real time, confirm/reject with ownership checks, print an 80mm ticket, and trigger the WhatsApp confirm deep link.
- [ ] MP hosted-checkout round-trip works in sandbox: preference created per shop, receipt verifies `payment_id` against `external_reference`, status displayed correctly.
- [ ] All 8 env vars fail loudly when missing; no magic strings; no inline param types; typecheck + lint + unit + build + E2E green.
- [ ] CSP/security headers ported and existing flows (auth, Sentry) still pass E2E.
- [ ] Every PR slice ≤ 400 changed lines (or explicitly accepted exception).
- [ ] Deferred items (MP webhooks, Leaflet picker) remain absent and documented as follow-ups.

## Open Questions (user decision needed — proposal does not block on these)

1. **`books` demo routes** (`/books` + domain/infra/containers): delete after migration, or keep as permanent reference? Recommendation: delete in final phase (it's duplicated reference material; git history preserves it).
2. **Panel PIN auth design**: separate HMAC `panel_session` cookie path (parity) vs migrating panel to supabase-auth? Recommendation: parity — the PIN model is the product's actual auth for shop owners.
3. **`external_reference` format**: keep `shopName-timestamp` as order ID (parity, recommended) vs redesign to UUID + separate timestamp column now?
4. **Cart persistence**: keep in-memory only (parity, recommended) vs add localStorage persistence as a cheap improvement?
5. **Geocode/delivery-cost as server actions vs route handlers**: old app used POST APIs; this repo prefers server actions. Recommendation: server actions (repo convention) unless a client-side fetch context demands a route handler — SSE and MP OAuth callback remain route handlers regardless.