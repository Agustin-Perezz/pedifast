# supabase/

Local Supabase stack for dev and tests.

- Ports 55321–55327 via `env()` indirection in `config.toml`. Actual values in `supabase/.env` (gitignored). See `docs/supabase.md` for the full pattern.
- `supabase db reset` wipes all data, replays migrations + `seed.sql`. `pnpm test` runs this first.
- `seed.sql` = reference data only, not test fixtures. Re-applied after every reset.
- `migrations/` = source of truth for schema. Timestamped, applied in order.
- `database.types.ts` generated via `pnpm supabase:gen-types` (reads local DB). Never edit by hand.
- Google and Facebook OAuth configured in `config.toml`. `client_id` in config (not a secret), `secret` via `env()` reading from `supabase/.env`. Email (magic link) works by default — captured by Mailpit. See `docs/supabase.md` "Auth providers local development".
- Push to remote: `supabase link --project-ref <ref>` (one-time) then `supabase db push`. Deploy step, not dev step.