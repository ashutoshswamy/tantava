-- Migration: add missing columns to orders table
-- subtotal and admin_notes were referenced in app code but absent from schema

alter table orders
  add column if not exists subtotal integer not null default 0 check (subtotal >= 0),
  add column if not exists admin_notes text;
