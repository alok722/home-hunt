-- Users table (username only, no auth)
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  created_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookup by user
create index on projects(user_id);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on projects
for each row execute function update_updated_at();

-- Enable Row Level Security (open read/write since no auth)
alter table users enable row level security;
alter table projects enable row level security;

create policy "Public access for users" on users for all using (true) with check (true);
create policy "Public access for projects" on projects for all using (true) with check (true);
