# Design: Migrate Core SvelteKit App to Next.js Clean Architecture

## Technical Approach
The migration is split into six PR‑sized phases (≤400 changed lines each) that map directly to the capabilities defined in the proposal.  Each phase introduces a thin, test‑driven slice of functionality while preserving existing business behaviour.  All new code follows the repository’s Clean Architecture conventions: pure domain layer, 4‑file use‑case folders, flat mappers, one repository per interface, per‑request containers, and a delivery layer limited to composition, server actions and tiny components.

## Architecture Decisions

### Decision: Server‑action vs Route‑handler for geocode & delivery‑cost
**Choice**: Implement *geocode* and *delivery‑cost* as **Next.js Server Actions** (native form actions).
**Alternatives considered**: Separate API route handlers.
**Rationale**: Server actions keep the request‑to‑response cycle inside the same form submission, reduce latency, and match the repo’s convention that mutations are server actions.  The only route‑handlers that remain are SSE streaming and MP‑OAuth callbacks (process‑integration boundaries).

### Decision: SSE implementation strategy
**Choice**: A **module‑level shared subscription** that creates a single Supabase Realtime client (service‑role) per server instance and multiplexes `postgres_changes` events to all connected SSE clients via an in‑memory fan‑out registry.
**Alternatives considered**: Per‑connection client (the old SvelteKit pattern) and polling fallback.
**Rationale**: Avoids the high‑risk “one client per connection” leak, reduces resource usage, and satisfies the high‑risk matrix row.  Fallback polling can be enabled in tests if the subscription becomes unstable.

### Decision: Panel authentication guard
**Choice**: `requirePanelSession()` guard that validates a **SHA‑256 salted PIN hash** stored in the DB, then issues an **HMAC‑signed `panel_session` cookie** (7‑day expiry, `httpOnly`, `secure`, `sameSite=Strict`).
**Alternatives considered**: Re‑using Supabase auth or JWT.
**Rationale**: The product’s existing PIN model is a core business rule; keeping it isolates panel auth from customer auth and matches the user‑decision to keep it separate.

### Decision: Cart state management
**Choice**: **React Context + reducer** limited to the shop‑catalog route tree. No external state library; state lives entirely in memory.
**Alternatives considered**: Zustand, Redux, localStorage persistence.
**Rationale**: Parity with the old app, simplicity, and the 50‑line component limit.  Unit tests cover reducer edge‑cases.

### Decision: `OrderExternalReference` value object
**Choice**: A domain‑level value object that formats `${shopName}-${Date.now()}` and parses it back into `{shopName, timestamp}`.
**Alternatives considered**: UUID primary key or separate timestamp column.
**Rationale**: Retains the behaviour required by the spec and isolates the format for future redesign.

## Data Flow
```
Client (browser)                     Server (Next.js)                Infrastructure
--------------------------------------------------------------------------------
Cart Context   <-- add/remove -->   use‑case (Cart)   <-- repo -->   Postgres (none)
Checkout Form  -- submit -->       Server Action (checkout) -->
   |                               |                               |
   |                               |--- geocode --> Google Geocode API
   |                               |--- deliveryCost --> Google Distance Matrix
   |                               |--- MP OAuth --> MercadoPago SDK
   |                               |--- OrderRepo --> Supabase (orders)
   |                               |--- SSE Hub (shared) --> Supabase Realtime
   |--- SSE stream <-- server handler (Node runtime) <-- shared hub
```

## File Changes
| File | Action | Description |
|------|--------|-------------|
| `src/domain/**` | Create | Entities, schemas, enums for Shop, ShopItem, AccessoryGroup, AccessoryOption, Order, OrderStatus, PaymentStatus, Category, OrderFlow, and `OrderExternalReference` value object. |
| `src/application/use-cases/**/` (4‑file folders) | Create | Use cases: `GetShopCatalog`, `GeocodeAddress`, `CalculateDeliveryCost`, `CreateOrder`, `VerifyMpPayment`, `PanelAuthGuard`, `ConfirmOrder`, `RejectOrder`. |
| `src/infrastructure/database/postgres/**` | Create | Row‑type definitions, flat mappers, repositories (`ShopRepository`, `ProductRepository`, `OrderRepository`). |
| `src/infrastructure/payments/mp/**` | Create | Interfaces `MpOAuthClient`, `MpPreferenceClient`; implementations `MpOAuthService`, `MpPreferenceService` (token refresh with 1 h buffer). |
| `src/infrastructure/geo/**` | Create | Interfaces `GeocodeProvider`, `DistanceMatrixProvider`; implementations `GoogleGeocodeService`, `GoogleDistanceMatrixService`. |
| `src/lib/shared/infrastructure/env.ts` | Modify | Add 8 required env vars, each `if (!process.env.VAR) throw new Error(...)`. |
| `src/lib/containers/**` | Add | Containers for each entry point (catalog, checkout, panel, receipt) wiring use cases to repositories/services. |
| `src/app/[shopName]/pedir/**` | Add | Page (`page.tsx`), server actions (`actions.ts`), queries (`queries.ts`), components (`CartProvider.tsx`, `CartOverlay.tsx`, `ProductCarousel.tsx`, etc.). |
| `src/app/[shopName]/panel/**` | Add | Panel page, `requirePanelSession` guard, SSE route handler (`+server.ts`), confirm/reject actions. |
| `src/app/pedido/[id]/**` | Add | Receipt page, order fetch query, MP verification server action. |
| `src/app/api/orders/[shopId]/stream/+server.ts` | Modify | Replace per‑connection Supabase client with shared hub import; add cleanup on `res.on('close')`. |
| `src/lib/shared/infrastructure/panel-session.ts` | Add | PIN hashing (`crypto.pbkdf2Sync` with per‑shop salt), verification, HMAC cookie helpers. |
| `src/lib/containers/panel.container.ts` | Add | Builds container exposing `authGuard`, `confirmOrder`, `rejectOrder`. |
| `src/components/ui/table.tsx`, `badge.tsx`, `sonner.tsx`, `skeleton.tsx` | Add | shadcn‑nova components (≤50 lines each). |
| `src/components/ui/carousel.tsx` | Add / modify | Embla carousel wrapper; fallback to CSS `scroll-snap` if peer‑deps conflict. |
| `supabase/migrations/` | Add | Timestamped SQL files for `shops`, `shop_items`, `accessory_groups`, `accessory_options`, `orders`; include RLS policies, realtime publication triggers, `updated_at` trigger. |
| `src/lib/shared/infrastructure/security-headers.ts` | Add | Export `securityHeaders` array mirroring old `hooks.server.ts` domains (Sentry, Supabase, MP, Google Fonts). Imported in `next.config.ts`. |
| `next.config.ts` | Modify | Add `headers` config using `securityHeaders`. |
| `tests/unit/**` | Add | Vitest tests for domain entities, use‑case reducers, cart reducer, PIN hashing, MP adapters (mocked SDK). |
| `tests/e2e/**` | Add | Playwright suites for each phase (catalog browse, cart flow, checkout, panel auth + SSE, receipt verification). |

## Interfaces / Contracts
```ts
// src/application/use-cases/geocode/interfaces.ts
export interface GeocodeProvider {
  geocode(address: string, city?: string, province?: string): Promise<{ lat: number; lng: number }>;
}

// src/application/use-cases/delivery/interfaces.ts
export interface DistanceMatrixProvider {
  computeDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<{ distanceMeters: number; distanceKm: number }>;
}

// src/infrastructure/payments/mp/interfaces.ts
export interface MpOAuthClient {
  authorize(shopId: string, state: string): string; // returns redirect URL
  handleCallback(query: Record<string, string>): Promise<{ accessToken: string; expiresAt: number }>;
  refreshToken(token: string): Promise<{ accessToken: string; expiresAt: number }>;
}
export interface MpPreferenceClient {
  createPreference(input: PreferenceInput): Promise<{ initPoint: string; externalReference: string }>;
}
```
All use‑cases depend on the above abstractions; containers inject concrete implementations.

## Testing Strategy
| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | Domain entities, schemas, invariants; cart reducer logic; `OrderExternalReference` parsing; PIN hash/verify; MP OAuth token refresh; Google service adapters (mock HTTP). | Vitest with full coverage; mocks for external HTTP calls. |
| Integration | Use‑case orchestration (e.g., `CreateOrder` invoking geocode, delivery‑cost, MP adapters). | In‑process tests with mocked infra; supabase client replaced by in‑memory repo. |
| E2E | Full user journeys per phase: shop catalog browse → product detail → cart → checkout (delivery & pickup) → order receipt; panel PIN login → SSE order stream → confirm/reject actions; MP hosted‑checkout flow. | Playwright on local dev stack (Supabase, MP sandbox). Use `RUN_ID` env var to isolate runs. |

## Threat Matrix
| Boundary | Minimum adversarial cases | Applicability | Design response | Planned RED tests |
|---|---|---|---|---|
| Documentation-like paths | `README.md`, `AGENTS.md` | N/A: not modified | — | — |
| Git repository selection | `git -C`, relative/absolute paths | N/A | — | — |
| Commit state | staged, `commit -a`, empty index | N/A | — | — |
| Push state | tracking branch, first push, explicit refspec | N/A | — | — |
| PR commands | `--head`, env prefix, composed commands | Applicable – our migration is split into chained PRs (6 phases) respecting the 400‑line budget. | Enforce guard lines in `sdd-tasks`; each PR slice must not exceed 400 changed lines. | Verify PR metadata and line count after each phase. |

## Migration / Rollout
* **Phase 1** – DB foundation, env vars, domain entities, containers. Deploy to a feature branch; run unit tests.
* **Phase 2** – Shop catalog UI (pages, server actions, caching headers). Deploy; run Playwright catalog suite.
* **Phase 3** – Cart context and checkout overlay, geocode & delivery‑cost actions. Deploy; run checkout E2E.
* **Phase 4** – Panel auth, SSE hub, confirm/reject actions, printable ticket. Deploy; run panel SSE tests.
* **Phase 5** – MP OAuth & preference adapters, receipt page verification. Deploy; run MP flow tests.
* **Phase 6** – Security headers/CSP, shadcn component polish, removal of `books` demo, final E2E regression. Deploy to `main`.
Each phase is a separate PR that can be reverted independently (≤400 changed lines).

## Open Questions
- **Books demo**: delete in final phase (recommended) or keep as reference? – decision recorded in proposal Open Questions.
- **Cart persistence**: keep in‑memory only (parity) or add optional localStorage sync? – recommendation: keep in‑memory now.
- **Panel auth implementation**: keep PIN‑HMAC model (chosen) vs migrate to Supabase auth – recommendation: keep parity.
- **External reference format**: keep `${shopName}-${timestamp}` (chosen) vs redesign to UUID – recommendation: keep for now.
- **Geocode/delivery‑cost**: server actions (chosen) vs route handlers – recommendation: server actions.

## Next Steps
The design is ready for task slicing (`sdd-tasks`). The six phases above will be broken into implementation tasks respecting the 400‑line review budget.
