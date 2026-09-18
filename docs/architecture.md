# Architecture

Clean Architecture with strict layering. Dependencies point inward — outer layers depend on inner, never the reverse.

## Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Domain | `src/domain/entities/` | Entity classes with business rules + Zod invariant schemas. Zero framework deps. |
| Application | `src/application/use-cases/` | One class per use case. Repository interfaces, request DTOs (Zod), response DTOs (plain types). |
| Infrastructure | `src/infrastructure/database/postgres/` | Supabase repository implementations, DB row types, mappers (one per entity, flat). |
| Container | `src/lib/containers/` | DI wiring — connects use cases to concrete repos. Takes a Supabase client. |
| Shared Infra | `src/lib/shared/infrastructure/` | Supabase server/browser clients, env validation, auth helpers. |
| Delivery | `src/app/{feature}/` | Next.js Server Components, Server Actions, UI components. |

## Dependency rules

- Domain has zero external imports — no Supabase, no Next.js. Only `zod` and own entity classes.
- Use cases depend on repository interfaces, never concrete implementations.
- Infrastructure depends on Domain (entities) and DB types.
- Delivery layer imports only container functions and DTOs — never repositories or use cases directly.
- Mappers are flat, one per entity — any repo that touches an entity imports the same mapper.

## Request flow

`page.tsx` / `actions.ts` → container → use case → repository interface → Supabase repository → mapper → domain entity → back up.

Supabase client is created per-request via `cookies()` and passed to the container at call time. Never module-level singletons.

## Where schemas live

- Domain invariants → `src/domain/entities/{entity}.schema.ts` (source of truth)
- Request DTOs → `src/application/use-cases/{use-case}/{use-case}.request.dto.ts` (Zod, composes domain schemas)
- Response DTOs → `src/application/use-cases/{use-case}/{use-case}.response.dto.ts` (plain type, not Zod)
- Form validation → reuse the request DTO directly, no second schema