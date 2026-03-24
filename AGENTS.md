## Architecture

### Key Directories

- `src/routes/` — File-based routing; `+page.svelte` for pages, `+layout.svelte` for layouts
- `src/routes/[shopName]/pedir/` — Main ordering flow; `components/` holds page-scoped sub-components
- `src/routes/pedido/[id]/` — Order detail page; `components/` holds page-scoped sub-components
- `src/routes/api/` — Server-side API endpoints (e.g. `calcular-envio`, `mp/preference`, `mp/oauth`)
- `src/lib/components/ui/` — Reusable UI components following shadcn-svelte patterns
- `src/lib/server/repositories/` — Data-access layer; one file per database table
- `src/lib/server/services/` — Business logic layer; injected with repositories
- `src/lib/schemas/` — Zod schemas and enums shared between client and server
- `src/lib/types/` — Shared TypeScript types and domain models
- `src/lib/alerts/` — Alert/notification utilities
- `src/lib/assets/` — Static assets imported by components
- `src/hooks.client.ts` / `src/hooks.server.ts` — SvelteKit lifecycle hooks with Sentry integration
- `e2e/` — Playwright E2E tests with V8 code coverage

### Forms

Uses **sveltekit-superforms** with **Zod** schemas for validation. Form components in `$components/ui/form-field/` handle error display automatically.
