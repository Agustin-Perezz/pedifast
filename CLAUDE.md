# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm check        # Run TypeScript/Svelte type checks
pnpm lint         # Run Prettier check + ESLint
pnpm format       # Format code with Prettier
pnpm test         # Run Playwright E2E tests (builds first, runs on port 4173)
```

## Architecture

**SvelteKit 2 + Svelte 5** static site using `@sveltejs/adapter-static`. Builds output to `build/` with SPA fallback (`200.html`).

### Authentication

Uses **Supabase Auth** with server-side session management via `@supabase/ssr`.

**Supabase Clients:**

- `$lib/supabase/client.ts` - Browser client for client-side operations
- `$lib/supabase/server.ts` - Server client with cookie-based session handling

**Auth Routes:**

- `/auth/callback` - OAuth callback handler
- `/auth/logout` - Logout endpoint

**Protected Routes:**
Routes starting with `/protected/*` require authentication. Unauthenticated users are redirected to `/login`.

### Path Aliases

- `$lib` → `src/lib`
- `$components` → `src/lib/components`
- `$schemas` → `src/lib/schemas`

### UI Components

Uses **shadcn-svelte** with Bits UI primitives. Components live in `src/lib/components/ui/`. Styling uses:

- Tailwind CSS v4
- `tailwind-variants` for component variants
- `cn()` utility from `$lib/utils.ts` for class merging

### Server Hooks (`src/hooks.server.ts`)

Uses `sequence()` to chain multiple handles:

1. **Sentry Handle**: Error tracking initialization
2. **Supabase Handle**: Creates Supabase server client, populates `event.locals.supabase`, `event.locals.user`, and `event.locals.session`
3. **Auth Guard Handle**: Protects `/protected/*` routes, redirects unauthenticated users to `/login`

### Client Hooks (`src/hooks.client.ts`)

- Sentry client-side initialization with session replay

### Forms

Uses **sveltekit-superforms** with **Zod** for validation.

### HTTP Client

Axios instance configured in `src/lib/axios.ts`.

### Supabase

Uses **@supabase/ssr** for server-side session management and **@supabase/supabase-js** for the Supabase client.

## Testing

E2E tests in `e2e/` directory using Playwright. Tests must import from `e2e/_shared/app-fixtures.ts` (not directly from `@playwright/test`) to get V8 code coverage.

```bash
pnpm test:show-report      # View test results
pnpm coverage:show-report  # View V8 coverage report
```

## Environment Variables

Create a `.env` file based on `.env.dist`:

```bash
# API
VITE_API_BASE_URL=your_base_api

# Supabase
PUBLIC_SUPABASE_URL=your-supabase-project-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Sentry
VITE_SENTRY_DSN=your-sentry-dsn
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## Git Hooks (Husky)

- **pre-commit**: lint-staged runs Prettier + ESLint on staged files
- **pre-push**: runs full E2E test suite
