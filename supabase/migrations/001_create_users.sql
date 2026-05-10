create table if not exists users (
  id bigint primary key generated always as identity,
  clerk_user_id text unique not null,
  email text,
  plan text not null default 'free',
  plan_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_users_clerk_id on users(clerk_user_id);

create or replace function update_users_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on users;
create trigger trg_users_updated_at
  before update on users
  for each row
  execute function update_users_updated_at();
