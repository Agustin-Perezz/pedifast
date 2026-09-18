-- Seed data for local development and tests.
-- Runs after migrations on `supabase db reset` (see config.toml [db.seed]).
-- Keep this minimal: reference data only, not test fixtures.

insert into public.books (title, author) values
  ('The Pragmatic Programmer', 'David Thomas'),
  ('Clean Architecture', 'Robert C. Martin'),
  ('Refactoring', 'Martin Fowler')
on conflict do nothing;