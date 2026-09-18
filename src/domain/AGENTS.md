# src/domain/

Pure business logic. Zero framework deps — no Supabase, no Next.js, no `@supabase/ssr`. Only `zod` and your own entity classes.

- Entities = classes with private constructor + static factory + invariants. See `book.entity.ts`.
- Zod schemas (`*.schema.ts`) = source of truth for business invariants. Use cases compose them.
- Errors = domain-specific (`BookNotFoundError`, `InvalidBookError`).
- Enums = `*.enum.ts` for bounded sets (`OAuthProvider`).

Entity shape:

```ts
export class Book {
  private constructor(private readonly props: BookProps) {}
  static create(input: BookInput): Book { /* invariants */ return new Book({...}); }
  get id(): string { return this.props.id; }
  toObject(): BookProps { return { ...this.props }; }
}
```