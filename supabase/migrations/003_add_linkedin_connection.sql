alter table users add column if not exists linkedin_access_token text;
alter table users add column if not exists linkedin_user_id text;
alter table users add column if not exists linkedin_connected_at timestamptz;
