-- Migration: feedbacks table

-- ─────────────────────────────────────────────
-- 1. FEEDBACKS TABLE
-- ─────────────────────────────────────────────
create table if not exists feedbacks (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name       text not null,
  phone      text,
  email      text,
  state      text,
  city       text,
  about      text not null
);

create index if not exists feedbacks_created_at_idx on feedbacks (created_at desc);

-- ─────────────────────────────────────────────
-- 2. RLS
-- ─────────────────────────────────────────────
alter table feedbacks enable row level security;

-- Public can insert (submit feedback form)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'feedbacks' and policyname = 'feedbacks_public_insert'
  ) then
    create policy "feedbacks_public_insert" on feedbacks
      for insert with check (true);
  end if;
end
$$;

-- No public read — admin reads via service role key (bypasses RLS)
