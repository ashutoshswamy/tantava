# Documentation

## Overview

Tantava is a Next.js 16 App Router application: a public storefront plus an admin panel, sharing one Next.js app and one Supabase Postgres database. There is no separate backend service — `app/api/*` route handlers are the API layer, calling Supabase directly with the service-role key on the server.

## Auth model

- Clerk (`@clerk/nextjs`) handles sign-up/sign-in for both customers and admins — there's no separate admin login.
- Admin status is a Clerk user property: `publicMetadata.role === "admin"`. It is **not** stored in the app database.
- `lib/auth.ts` exposes `isAdmin()` and `requireAdmin()` — the latter returns `{ userId, authorized }` and is called at the top of every admin-only API route handler.
- `proxy.ts` (Next's middleware, exported as `proxy` rather than `middleware`) wraps requests in `clerkMiddleware`:
  - `/admin(.*)` — requires sign-in **and** `role === "admin"`; redirects to `/` otherwise.
  - `/account(.*)`, `/checkout(.*)` — requires sign-in; redirects to `/sign-in` otherwise.
  - API routes still re-check auth themselves (middleware is a UX gate, not the only enforcement point — see SECURITY.md).

To promote a user to admin: set `publicMetadata.role = "admin"` on their Clerk user via the Clerk dashboard or Backend API. There is no in-app UI for this by design.

## Data model (`supabase/schema.sql`)

All money fields are integers in **paise** (₹1 = 100 paise).

| Table | Purpose |
|---|---|
| `collections` | Curated product groupings (name, slug, cover image, active flag, sort order) |
| `products` | Catalog: name, description, `price`, `discount_price`, category, `fabric`, `care`, `free_delivery`, `images[]`, `size_inventory` (JSON: `{"XS":0,...,"XXXL":0}`), `sku`, `badge`, `is_active`, `collection_id`, `sort_order` (manual display order, admin-editable) |
| `store_settings` | Singleton row (`id boolean primary key default true`) holding site-wide `delivery_info` / `returns_info` copy, `checkout_mode` / `whatsapp_number` (see Checkout flow below), `hero_image` (homepage hero banner URL), `sale_ticker_text` / `sale_ticker_enabled` (homepage scrolling banner), `testimonials_enabled` (toggles the homepage testimonials section), and `theme_background` / `theme_primary` / `theme_secondary` (three seed hex colors the full storefront palette is derived from) |
| `categories` | Admin-managed category taxonomy: `name`, `slug`, `is_active`, `sort_order` |
| `orders` | Customer orders — `items` JSON snapshot, `subtotal`/`total`, `status` enum, `shipping_address` JSON, Razorpay IDs, `admin_notes` |
| `inventory_logs` | Append-only audit trail of stock changes (`change` can be +/-, `reason` free text) |
| `feedbacks` | Public feedback form submissions |
| `inquiries` | Public contact/bespoke/collaboration inquiries |
| `rate_limits` | Fixed-window counters backing `lib/rate-limit.ts` (see SECURITY.md) |

RLS is enabled on every table. Public (anon key) read policies exist for `products` (active only), `collections` (active only), `store_settings` (all), and `orders` (own rows only, by `auth.uid()`). All writes go through the service-role key from server-side route handlers, which bypasses RLS.

**Schema changes**: edit `supabase/schema.sql` directly (canonical, single source of truth). For an already-deployed database, apply the equivalent `alter table` manually against it. `supabase/reset.sql` drops every table/policy/trigger/function — dev/staging only, never run against production. Storage isn't SQL-droppable (Supabase blocks direct deletes on storage tables); run `npm run reset:storage` to empty and delete the `product-images` bucket.

## API routes (`app/api/`)

| Route | Access |
|---|---|
| `products`, `products/[id]` | GET public (active only unless `active=all`); POST/PUT/DELETE admin |
| `products/reorder` | admin — PATCH bulk-persists `sort_order` from an array of product IDs |
| `categories`, `categories/[id]` | GET public (active only unless `all=true`); POST/PUT/DELETE admin |
| `collections`, `collections/[id]` | GET public; writes admin |
| `settings` | GET public (delivery & returns copy, checkout mode, hero image, sale ticker, testimonials toggle, theme color); PUT admin |
| `inventory` | admin |
| `orders` | GET signed-in user (own orders; all orders if admin); POST admin-only (manual/offline entry) |
| `orders/[id]` | GET signed-in user, scoped to their own order (or admin); PUT admin-only |
| `admin/analytics`, `admin/stats` | admin — `admin/stats` inlines its own Clerk role check, same rule as `requireAdmin` |
| `feedback`, `inquiries` | POST public, rate-limited; admin reads |
| `upload-url` | admin — issues signed Supabase Storage upload URLs for product images |
| `razorpay/create-order` | signed-in user, rate-limited |
| `razorpay/verify` | signed-in user, rate-limited, HMAC-verified |

`products`, `categories`, `collections`, `settings`, and `orders` (create + update) validate the request body via `lib/api-utils.ts` (`validateProductInput`, `validateCategoryInput`, `validateCollectionInput`, `validateSettingsInput`, `validateOrderCreateInput`/`validateOrderUpdateInput`) before hitting Supabase — type-checks fields and rejects unknown shapes with a 400, on top of the DB's `not null`/`check` constraints. `inventory` remains unvalidated at the application level, relying on Postgres constraints as the backstop (admin-only route). Public-facing routes (`feedback`, `inquiries`, checkout) validate input via `lib/validate.ts` and are rate-limited.

## Checkout / payment flow

`store_settings.checkout_mode` (`"razorpay"` | `"whatsapp"`, admin-configurable at `/admin/checkout-settings`) picks the flow:

- **`razorpay`** (default):
  1. **`POST /api/razorpay/create-order`** — signed-in user, rate-limited (10 / 10 min). Validates amount (100–100,000,000 paise) and currency (`INR`), creates a Razorpay order.
  2. Client completes payment via Razorpay Checkout (client-side SDK).
  3. **`POST /api/razorpay/verify`** — signed-in user, rate-limited. Recomputes the HMAC-SHA256 signature of `order_id|payment_id` using `RAZORPAY_KEY_SECRET` and compares it with `crypto.timingSafeEqual`. Re-fetches the order from Razorpay's API and cross-checks the paid amount against a server-side recalculation of the cart total from the current `products` table (client-submitted prices are never trusted). On success: inserts the `orders` row and decrements `size_inventory` per line item.
- **`whatsapp`**: no on-site payment. `lib/whatsapp.ts` (`buildWhatsAppCheckoutUrl`) builds a `wa.me/<whatsapp_number>?text=...` link listing cart items and total, and the checkout page sends the buyer there instead of invoking Razorpay. No `orders` row is created — the order is negotiated over chat.

## Admin panel (`app/admin/`)

Client-rendered pages under `/admin`, gated by `proxy.ts`. Sections (in nav order): Dashboard, Analytics, Products (list/new/edit), Categories, Collections, Inventory, Orders, Homepage (hero image, sale ticker, testimonials toggle), Appearance (storefront brand color), Checkout Settings (payment mode toggle), Delivery & Returns (site-wide copy editor), Feedback, Inquiries.

**Product form** (`admin/products/new`, `admin/products/[id]`): name, description, price, discount price (optional — shown alongside the original price on the storefront when lower), category (free-text input backed by a `<datalist>` populated from every category already used across existing products, so admins can reuse one or type a new one), badge, fabric, care instructions (free text, shown in the "Fabric & Care" PDP accordion), SKU, collection, per-size stock (`XS`–`XXXL`), image upload (validated client-side, uploaded to Supabase Storage via signed URL), active toggle, free-delivery toggle. The product list (`admin/products`) lets admins reorder products, persisted via `PATCH /api/products/reorder` and reflected in storefront listing order.

**Categories** (`admin/categories`): CRUD for the `categories` table — name (auto-slugified), active flag, sort order. Distinct from the free-text `category` field on `products`, which just uses category names as suggestions.

**Homepage** (`admin/homepage`): edits the singleton `store_settings` row — hero banner image (uploaded via the same signed-URL flow as product images), sale ticker text + on/off toggle, and a toggle for whether the homepage testimonials section is shown.

**Delivery & Returns** (`admin/delivery-returns`): edits the singleton `store_settings` row — delivery/returns copy, fetched by every PDP and rendered in the "Delivery & Returns" accordion.

**Appearance** (`admin/appearance`): sets `store_settings.theme_background` / `theme_primary` / `theme_secondary` — three hex colors (typed in or picked via native color inputs). `lib/theme-color.ts` (`deriveThemeVars`) derives the entire tonal palette from these three seeds — every surface tier, outline, and the primary/secondary/tertiary on-color + container families (contrast-checked, not hardcoded to white text) — the same structure defined in `app/globals.css`'s `@theme` block. `app/components/ThemeInjector.tsx`, mounted once in the root layout, fetches the seeds client-side and overrides those CSS custom properties on `<html>` at runtime (falling back to the built-in defaults for any seed left unset). Only the storefront's `bg-primary`/`text-on-surface`/etc Tailwind classes pick this up; the admin panel itself is styled with hardcoded hex literals and does not re-theme.

**Checkout Settings** (`admin/checkout-settings`): toggles `store_settings.checkout_mode` between `razorpay` and `whatsapp`, and sets the `whatsapp_number` used when in WhatsApp mode. Also edits the singleton `store_settings` row via `PUT /api/settings`.

## Storefront behavior notes

- **Pricing**: when a product has `discount_price < price`, the PDP, shop grid/quick-view, and collection pages show both prices (discounted price + strikethrough original + % off) and the cart charges the discounted price.
- **Default size**: PDP, shop quick-view, and collection product cards default `selectedSize` to the first size (in `XS → S → M → L → XL → XXL → XXXL` order) that has stock, not a hardcoded `XS`.
- **Description formatting**: product description is rendered with `whitespace-pre-wrap` so line breaks typed in the admin textarea are preserved on the customer-facing page.
- **Free delivery**: a badge is shown wherever price is shown, driven by the per-product `free_delivery` flag.

## Local dev

See README.md for env vars and setup. `npm run seed:order` is meant to insert a fake order for testing the orders/analytics UI without a real checkout, but `scripts/seed-fake-order.mjs` is currently missing from the repo — the script will fail until it's restored.
