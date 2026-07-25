-- Tantava — full database reset
-- WARNING: destroys all data. Run in Supabase SQL editor on dev/staging only.

-- ─────────────────────────────────────────────
-- DROP POLICIES
-- ─────────────────────────────────────────────
drop policy if exists "inquiries_public_insert"  on inquiries;
drop policy if exists "feedbacks_public_insert"  on feedbacks;
drop policy if exists "orders_user_read"         on orders;
drop policy if exists "products_public_read"     on products;
drop policy if exists "store_settings_public_read" on store_settings;
drop policy if exists "collections_public_read"  on collections;
drop policy if exists "categories_public_read"   on categories;
drop policy if exists "product_images_public_read"  on storage.objects;
drop policy if exists "product_images_service_write" on storage.objects;

-- ─────────────────────────────────────────────
-- STORAGE
-- Supabase blocks direct DELETE on storage.objects/buckets (protect_delete trigger).
-- Empty and drop the product-images bucket via the Storage API instead:
--   npm run reset:storage
-- ─────────────────────────────────────────────

-- ─────────────────────────────────────────────
-- DROP TRIGGERS
-- ─────────────────────────────────────────────
drop trigger if exists orders_updated_at     on orders;
drop trigger if exists products_updated_at   on products;
drop trigger if exists collections_updated_at on collections;
drop trigger if exists categories_updated_at on categories;
drop trigger if exists store_settings_updated_at on store_settings;
drop trigger if exists coupons_updated_at on coupons;

-- ─────────────────────────────────────────────
-- DROP INDEXES
-- ─────────────────────────────────────────────
drop index if exists inquiries_created_at_idx;
drop index if exists feedbacks_created_at_idx;
drop index if exists inventory_logs_created_at_idx;
drop index if exists inventory_logs_product_id_idx;
drop index if exists orders_created_at_idx;
drop index if exists orders_status_idx;
drop index if exists orders_user_id_idx;
drop index if exists products_collection_id_idx;
drop index if exists product_collections_collection_id_idx;
drop index if exists product_categories_category_id_idx;
drop index if exists products_is_active_idx;
drop index if exists products_category_idx;
drop index if exists collections_is_active_idx;
drop index if exists collections_slug_idx;
drop index if exists categories_is_active_idx;
drop index if exists categories_slug_idx;
drop index if exists rate_limits_expires_at_idx;
drop index if exists coupons_code_idx;

-- ─────────────────────────────────────────────
-- DROP TABLES (order respects FK dependencies)
-- ─────────────────────────────────────────────
drop table if exists rate_limits    cascade;
drop table if exists inquiries      cascade;
drop table if exists feedbacks      cascade;
drop table if exists inventory_logs cascade;
drop table if exists orders         cascade;
drop table if exists coupons        cascade;
drop table if exists product_collections cascade;
drop table if exists product_categories  cascade;
drop table if exists products       cascade;
drop table if exists store_settings cascade;
drop table if exists collections    cascade;
drop table if exists categories     cascade;

-- ─────────────────────────────────────────────
-- DROP FUNCTIONS
-- ─────────────────────────────────────────────
drop function if exists set_updated_at cascade;
