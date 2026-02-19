create table if not exists public.shops (
  id bigint generated always as identity primary key,
  shop_name text not null unique,
  mp_access_token text,
  mp_refresh_token text,
  mp_token_expires_at timestamptz,
  mp_user_id text,
  mp_public_key text,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS enabled, no policies = only service_role can access
alter table public.shops enable row level security;

-- Auto-update updated_at on row changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger shops_updated_at
  before update on public.shops
  for each row
  execute function public.handle_updated_at();
