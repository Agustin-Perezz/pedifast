# src/app/

Next.js App Router delivery layer.

- `page.tsx` = composition only — imports + arranges components, fetches server data. No logic, no inline styles.
- `actions.ts` = server actions ONLY — mutations with `"use server"` (forms, writes, redirects). Every action MUST call `requireUser()` first. Never put read-only queries here.
- `queries.ts` = read-only data fetchers for Server Components (no `"use server"`). Plain async functions that call the container and return data. Used by `page.tsx`.
- `components/` = route-private components. Named with feature prefix (`BookCard`, not `Card`). 50-line hard limit per component, split at 40.
- `"use client"` only on leaf components that need hooks/events/browser APIs. Keep server/client boundary as low as possible.
- `hooks/` = route-private hooks. Promote to `src/hooks/` if used by 2+ routes.
- Import shared UI via `@/components/ui/*`, hooks via `@/hooks/*`, utils via `@/lib/*`.

## TTB — fast first byte is a priority

Time to first byte (TTB) matters here. Every route MUST be designed so the server responds fast, even when data is slow.

- Prefer **PPR (Partial Prerendering)**: keep the static shell in `page.tsx` and wrap slow/dynamic data in `<Suspense>` boundaries. The shell ships instantly; the dynamic part streams in.
- Prefer **ISR** for pages whose data changes infrequently — serve a cached page and revalidate in the background instead of rendering on every request.
- If a page genuinely must be rendered per-request (fully dynamic, per-user), always add a `loading.tsx` next to it so the user gets instant UI feedback while the server renders.
- Never block the whole page on a slow query: push data fetching down into a Suspense-bound child component instead of awaiting at the top of `page.tsx`.

## Server action authentication (MANDATORY)

Server Actions are public endpoints — callable directly, bypassing `proxy.ts`. Every action MUST call `requireUser()` as its first line:

```ts
"use server";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";

export async function createBook(formData: FormData): Promise<void> {
  await requireUser(); // ← FIRST line
  // ...rest
}
```

Two layers, both required: `proxy.ts` = edge redirect (cookie presence), `requireUser()` = real authz inside the action. Queries in `queries.ts` don't need it — they're not server actions. Protect them via `PROTECTED_PREFIXES` in `proxy.ts`.

## SOLID in the delivery layer

Next.js App Router makes it easy to violate SOLID without noticing — fat pages, god components, server actions that do everything. These rules keep the delivery layer honest.

**Single Responsibility** — each file has one job. `page.tsx` composes, `actions.ts` fetches/mutates via the container, components render one concern, hooks encapsulate one piece of UI state. If a file's description needs "and", split it.

**Open/Closed** — extend components through composition and props, not by editing their internals. Prefer slot patterns (`children`, render props) over branching logic inside a component for every new variant.

```tsx
// Bad — closed: every new variant adds a branch here
function BookCard({ book, variant }: { book: Book; variant: "compact" | "detailed" | "admin" }) {
  if (variant === "compact") return <CompactLayout book={book} />;
  if (variant === "admin") return <AdminLayout book={book} />;
  return <DetailedLayout book={book} />;
}

// Good — open: new layouts don't touch this component
function BookCard({ book, children }: { book: Book; children: React.ReactNode }) {
  return <article>{children}</article>;
}
// Call site: <BookCard book={book}><AdminLayout book={book} /></BookCard>
```

**Liskov Substitution** — a component must honour its prop contract. No "special" component that silently requires props it declares as optional, or returns a different shape than its siblings. If `BookList` accepts `books: Book[]`, any component accepting `books: Book[]` is a valid drop-in replacement.

**Interface Segregation** — don't pass a fat object when a component needs two fields. Split props so components depend only on what they use.

```tsx
// Bad — BookTitle depends on the entire Book, but only uses title
function BookTitle({ book }: { book: Book }) {
  return <h2>{book.title}</h2>;
}

// Good — BookTitle depends only on what it uses
function BookTitle({ title }: { title: string }) {
  return <h2>{title}</h2>;
}
```

**Dependency Inversion** — delivery layer depends on container abstractions and DTOs, never concrete repositories or use case classes. `actions.ts` calls the container, which wires the use case to the repository interface. See `docs/architecture.md` "Dependency rules".

```tsx
// Bad — delivery layer knows about the repository
import { supabaseBookRepository } from "@/infrastructure/database/postgres/book.repository";
const books = await supabaseBookRepository.findAll();

// Good — delivery layer knows only the container
import { getBooksUseCase } from "@/lib/containers/books.container";
const books = await getBooksUseCase().execute();
```

Page shape — composition only, data fetched here and passed down:

```tsx
export default async function BooksPage() {
  const books = await getBooks();
  return (
    <main>
      <BookHeader />
      <BookCreateForm />
      <BookList books={books} />
    </main>
  );
}
```