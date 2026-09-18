## Project

Next.js (App Router) starter with React 19, TypeScript strict mode, base-ui + shadcn components, Biome for lint/format, Playwright for E2E, and Sentry for monitoring. Clean Architecture with strict layering — domain pure, infrastructure swappable.

## Commands

```bash
pnpm dev                # Start dev server (port 3000)
pnpm typecheck          # tsc --noEmit
pnpm lint               # Biome check
pnpm format             # Biome format --write
pnpm test               # Playwright E2E (runs supabase db reset first, server on port 3100)
pnpm test:ui            # Playwright UI mode
pnpm test:unit          # Vitest unit tests (no Supabase needed)
pnpm test:unit:coverage # Vitest + V8 coverage
```

Incremental checking: `pnpm typecheck` → `pnpm lint` → `pnpm build`.

## Key Constraints

Never touch `database.types.ts` by hand — it is generated.

Never use magic strings — always use named constants or enums for values that can change or have semantic meaning.

Never declare inline types in function parameters — use type aliases instead.

Required env vars must fail loudly — if missing, the app crashes, no defaults.

## AI instruction files (read when writing code)

- @docs/development-guidelines.md — TypeScript and clean code standards

## Per-folder guides (read when working in that area)

- src/domain/AGENTS.md — entity and schema rules
- src/application/use-cases/AGENTS.md — use case structure
- src/infrastructure/database/postgres/AGENTS.md — repository and mapper rules
- src/lib/AGENTS.md — DI and shared infra
- src/app/AGENTS.md — Next.js route patterns
- supabase/AGENTS.md — local stack and migrations
- tests/AGENTS.md — test patterns

## Human docs (high-level only)

- docs/architecture.md — Clean Architecture concepts
- docs/supabase.md — Supabase local dev operations