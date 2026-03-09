# AGENTS.md

This file provides guidance to Claude Code when working with this repository.

---

## Architecture

### Key Directories

- `src/routes/` — File-based routing; `+page.svelte` for pages, `+layout.svelte` for layouts
- `src/lib/components/ui/` — Reusable UI components following shadcn-svelte patterns
- `src/lib/server/` — Server-only code (auth, etc.)
- `src/hooks.client.ts` / `src/hooks.server.ts` — SvelteKit lifecycle hooks with Sentry integration
- `e2e/` — Playwright E2E tests with V8 code coverage

### Forms

Uses **sveltekit-superforms** with **Zod** schemas for validation. Form components in `$components/ui/form-field/` handle error display automatically.

---

## Svelte 5 & SvelteKit Standards

### Runes API

- Use `$state()` for reactive data and `$derived()` for computed values. Abandon Svelte 4's `let` and `$:`.
- Use `$effect` only for side effects (DOM manipulation, third-party libs). Never use it to sync state.
- Use `let { prop } = $props()`. Use `$bindable()` only when two-way binding is strictly necessary.
- Extract logic into `.svelte.ts` files using runes to keep components lean and testable.

### SvelteKit Patterns

- **Server-First:** Use `+page.server.ts` for data fetching and Form Actions for mutations.
- **Progressive Enhancement:** Always use `use:enhance` on forms.
- **Event Handling:** Use Svelte 5 attribute pattern (`onclick={...}`) instead of `on:click`.
- **Error Handling:** Use SvelteKit's `error()` and `redirect()` helpers within load functions.

### Reactivity with `$props()` — CRITICAL

NEVER destructure `$props()` or pass values directly into constructors at the top level. Always wrap in `$derived`.

```ts
// BAD — loses reactivity
const { pokemon } = data;
const detail = new MyClass(data.foo);

// GOOD
const pokemon = $derived(data.pokemon);
const detail = $derived(new MyClass(data.foo));
```

---

## SOLID Principles (Adapted for Svelte)

### S — Single Responsibility

Every new SvelteKit page MUST be decomposed into three layers:

**Layer 1 — `.svelte.ts` class (all logic)**

- State, constants, helper functions, derived values
- Nothing from this list belongs in `+page.svelte`

**Layer 2 — Focused sub-components (one concern each)**

- Each distinct visual concern gets its own `.svelte` file
- Sub-components receive only the props they need

**Layer 3 — `+page.svelte` (pure orchestration)**

- Instantiates the `.svelte.ts` class via `$derived(new MyClass(data.x))`
- Imports and composes sub-components
- Contains zero inline logic, constants, or helper functions

```ts
// userDashboard.svelte.ts — owns ALL state & logic
export class UserDashboardState {
  user = $state<User | null>(null);
  activities = $derived(this.user?.activities ?? []);

  get formattedJoinDate() {
    return new Intl.DateTimeFormat('en').format(this.user?.joinedAt);
  }
}
```

```svelte
<!-- +page.svelte — orchestrates, owns no logic -->
<script lang="ts">
  import UserAvatar from './UserAvatar.svelte';
  import { UserDashboardState } from './userDashboard.svelte';
  import UserStats from './UserStats.svelte';

  const { data } = $props();
  const dashboard = $derived(new UserDashboardState(data.userId));
</script>
```

### O — Open/Closed

Use Svelte 5 **Snippets** (`{#snippet ...}`) to let consumers extend component UI without modifying the component's source.

### L — Liskov Substitution

Wrapper components (e.g. a custom `Button`) must accept and spread all standard HTML attributes of the element they wrap (`HTMLButtonAttributes`).

### I — Interface Segregation

Pass only the specific props a component needs. Never pass a large object when only one field is used.

### D — Dependency Inversion

Use `getContext`/`setContext` (wrapped in type-safe helpers) to inject dependencies instead of hard-coding imports to specific instances.

---

## TypeScript Standards

### `satisfies` Operator

Use `satisfies` to validate an object matches a type while retaining the most specific inferred type.

```ts
const config = {
  endpoint: '/api/v1',
  retries: 3
} satisfies Record<string, string | number>;
```

### Type Guards & Assertion Functions

```ts
function isAdmin(user: User): user is Admin {
  return (user as Admin).role === Role.Admin;
}

function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error('Not a string');
  }
}
```

### Utility Types

Prefer built-in utilities to keep types DRY:

- `Pick<T, K>` / `Omit<T, K>` — narrow down props
- `ReturnType<T>` — capture the output type of a function
- `ComponentProps<T>` — extract props from a Svelte component for wrapping

### Strict Rules

- `any` is forbidden. Use `unknown` with type guards when the type is truly uncertain.
- Use `satisfies` instead of explicit type annotations when you need both validation and inference.
- No magic strings: never inline raw string literals for finite named sets; always use an `enum`.
