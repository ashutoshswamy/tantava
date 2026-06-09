-- Drop all tables (cascades to policies, triggers, indexes)
drop table if exists inventory_logs cascade;
drop table if exists orders cascade;
drop table if exists appointments cascade;
drop table if exists products cascade;

-- Drop trigger function
drop function if exists set_updated_at cascade;
