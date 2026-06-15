-- Tantava — full database reset
-- WARNING: destroys all data. Run in Supabase SQL editor on dev/staging only.

drop table if exists inventory_logs cascade;
drop table if exists orders        cascade;
drop table if exists products      cascade;
drop table if exists collections   cascade;

drop function if exists set_updated_at cascade;
