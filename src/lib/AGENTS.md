# src/lib/

Cross-cutting wiring + shared infra.

- `containers/` — DI wiring. Functions take a `SupabaseClient` and return use cases wired to concrete repos. One container per entry point — only expose use cases that entry point calls. Construct at call time, never module-level singletons.
- `shared/infrastructure/` — `supabase.server.ts` (per-request cookie client via `cookies()`), `supabase.browser.ts` (browser client), `env.ts` (throws if missing — no defaults), `auth.server.ts` (`getUser()`, `requireUser()`).

Container shape — one per entry point, only expose what it calls:

```ts
export function createBookWriteContainer(supabase: SupabaseClient<Database>) {
  return { create: new CreateBookUseCase(new SupabaseCreateBookRepository(supabase)) };
}
```