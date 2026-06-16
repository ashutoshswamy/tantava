-- Migration: inquiries table (contact form submissions)

create table if not exists inquiries (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null default 'other',
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);

alter table inquiries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'inquiries' and policyname = 'inquiries_public_insert'
  ) then
    create policy "inquiries_public_insert" on inquiries
      for insert with check (true);
  end if;
end
$$;
