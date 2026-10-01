-- Remove the starter-scaffold books table.
-- Nothing in the application reads or writes it (no entity, repository, or
-- container references public.books); verified before dropping. The seed rows
-- were removed from seed.sql in the same change.

-- Revoke explicit grants before dropping (grants don't cascade with the table).
revoke select, insert, update, delete on public.books from service_role;
revoke select, insert on public.books from anon, authenticated;

drop policy if exists "Anyone can read books" on public.books;
drop policy if exists "Anyone can insert books" on public.books;

drop table if exists public.books;