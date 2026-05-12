create table if not exists jd_library (
  id text primary key,
  user_id text not null,
  title text not null,
  content text not null,
  language text not null default 'both',
  created_at timestamptz not null default now()
);

create index if not exists idx_jd_library_user_id on jd_library(user_id);

alter table jd_library enable row level security;

create policy "jd_library access"
  on jd_library
  using (user_id = auth.uid()::text);
