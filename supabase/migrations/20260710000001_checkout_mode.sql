-- Adds checkout_mode toggle to store_settings: "razorpay" runs the existing
-- Razorpay + Shiprocket flow, "whatsapp" sends buyers to a WhatsApp chat
-- instead of taking payment on-site. Safe to run against an existing database.

alter table store_settings add column if not exists checkout_mode text not null default 'razorpay'
  check (checkout_mode in ('razorpay', 'whatsapp'));
alter table store_settings add column if not exists whatsapp_number text;
