# Development Guidelines

AI-focused code standards. Follow these when writing or modifying code.

## TypeScript

- Use `satisfies` to validate an object matches a type while retaining the most specific inferred type.
- Use `type` by default. Only use `interface` for declaration merging or extending.
- Use type guards (`user is Admin`) and assertion functions (`asserts val is string`).
- Never declare inline types in function parameters — use type aliases.
- Required env vars must fail loudly — if missing, the app crashes, no defaults.

## Clean code

- Constants over magic values — extract semantic numbers/strings to named constants.
- Short, single-responsibility functions — if you can describe it with "and", split it.
- Guard clauses over nesting — early returns, happy path flat and last.
- Descriptive names — state what and why, not how. No `data`, `temp`, `info`.
- DRY — extract on third occurrence, do not pre-extract for hypothetical reuse (YAGNI).
- Comments explain why, not what — do not restate code.
- Boring code — plain step-by-step over dense one-liners. Named intermediates document intent.
- Always use braces for `if` statements.
- When in doubt, optimize for the next reader, not the current writer.