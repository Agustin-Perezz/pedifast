# tests/

- E2E = Playwright. Server runs on port 3100 (not 3000).
- `pnpm test` runs tests without db reset — tests must be independent (unique IDs + cleanup).
- `pnpm test:reset` = `supabase db reset && playwright test` — opt-in full reset when migrations change.
- Unit = Vitest. No Supabase needed. `pnpm test:unit`.
- Parallel workers enabled by default (Playwright default = half CPU cores locally, 2 in CI).

## Test isolation pattern

Tests MUST NOT assume clean DB state. Per Supabase guidance, resetting per test is slow and blocks parallelization.

- **Unique IDs**: every test file uses a `RUN_ID = crypto.randomUUID()` prefix for all data it inserts.
- **beforeAll**: seed test-specific data with unique prefix via service role client.
- **afterAll**: clean up by deleting rows matching the prefix (`like("title", "${PREFIX}%")`).
- **No count assertions**: assert presence of specific elements, not row counts (parallel workers can insert concurrently).

## Auth fixtures

- `tests/_shared/fixtures/auth-fixtures.ts` — `createTestUser`, `deleteTestUser`, `signInAndGetCookies`.
- `testUser` fixture (worker scope): creates a real user via `auth.admin.createUser` with `email_confirm: true`, cleans up in afterAll.
- `authenticatedPage` fixture: signs in via service role, injects session cookies into a fresh browser context — real cookie-based session, no mocking.
- Use `authenticatedPage` for protected routes (for example, `/dashboard`), `page` for public routes.
- Session cookie name: `sb-127-auth-token` (derived from `NEXT_PUBLIC_SUPABASE_URL` hostname).

## Infrastructure

- `tests/_shared/fixtures/supabase-test-client.ts` uses service role key (bypasses RLS). Fallback port 55321.
- Playwright config reads `.env.test` for Supabase URL + keys.
- CI reads ports dynamically from `supabase status -o env` — no hardcoding.
- CI resets DB once at workflow level (`supabase db reset` step), not per test run.