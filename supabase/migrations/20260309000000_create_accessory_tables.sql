-- Accessory groups for shop items (e.g., "Tipo de carne")
create table accessory_groups (
  id serial primary key,
  shop_item_id integer not null references shop_items(id) on delete cascade,
  name text not null,
  selection_mode text not null check (selection_mode in ('single', 'multi')),
  is_required boolean not null default false,
  sort_order integer not null default 0
);

-- Accessory options within a group (e.g., "Doble carne")
create table accessory_options (
  id serial primary key,
  group_id integer not null references accessory_groups(id) on delete cascade,
  name text not null,
  price_delta numeric not null default 0,
  sort_order integer not null default 0
);

-- RLS
alter table accessory_groups enable row level security;
alter table accessory_options enable row level security;

create policy "Public read access" on accessory_groups
  for select using (true);

create policy "Public read access" on accessory_options
  for select using (true);
