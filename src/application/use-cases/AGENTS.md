# src/application/use-cases/

One folder per use case. Each folder has:
- `{name}.use-case.ts` — class with `execute()` method
- `{name}.repository.interface.ts` — interface the use case depends on (not the impl)
- `{name}.request.dto.ts` — Zod schema + `z.infer` type (input contract)
- `{name}.response.dto.ts` — plain `type` (output, not Zod)

- Use cases depend on repository **interfaces**, never concrete implementations.
- Request DTOs compose domain schemas from `src/domain/entities/`.
- Form validation reuses the request DTO directly — no second schema.

Use case shape:

```ts
export class CreateBookUseCase {
  constructor(private readonly repository: CreateBookRepository) {}
  async execute(dto: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    const book = Book.create(dto);
    const saved = await this.repository.create(book);
    return { book: saved };
  }
}
```