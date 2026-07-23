-- Sale ticker scroll speed, in seconds per loop — higher is slower.
alter table store_settings
  add column if not exists sale_ticker_speed_seconds integer not null default 40
  check (sale_ticker_speed_seconds >= 5 and sale_ticker_speed_seconds <= 120);
