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
| `products` | Catalog: name, description, `price`, `discount_price`, category, `fabric`, `care`, `free_delivery`, `images[]`, `size_inventory` (JSON: `{"XS":0,...,"XXXL":0}`), `sku`, `badge`, `is_active`, `collection_id` |
| `store_settings` | Singleton row (`id boolean primary key default true`) holding site-wide `delivery_info` / `returns_info` copy shown on every PDP |
| `orders` | Customer orders — `items` JSON snapshot, `subtotal`/`total`, `status` enum, `shipping_address` JSON, Razorpay IDs, Shiprocket tracking fields, `admin_notes` |
| `inventory_logs` | Append-only audit trail of stock changes (`change` can be +/-, `reason` free text) |
| `feedbacks` | Public feedback form submissions |
| `inquiries` | Public contact/bespoke/collaboration inquiries |
| `rate_limits` | Fixed-window counters backing `lib/rate-limit.ts` (see SECURITY.md) |

RLS is enabled on every table. Public (anon key) read policies exist for `products` (active only), `collections` (active only), `store_settings` (all), and `orders` (own rows only, by `auth.uid()`). All writes go through the service-role key from server-side route handlers, which bypasses RLS.

**Schema changes**: edit `supabase/schema.sql` (canonical, for fresh databases) **and** add a new timestamped file under `supabase/migrations/` with `alter table ... add column if not exists ...` so existing deployments can catch up. `supabase/reset.sql` drops every table/policy/trigger — dev/staging only, never run against production.

## API routes (`app/api/`)

| Route | Access |
|---|---|
| `products`, `products/[id]` | GET public (active only unless `active=all`); POST/PUT/DELETE admin |
| `collections`, `collections/[id]` | GET public; writes admin |
| `settings` | GET public (delivery & returns copy); PUT admin |
| `inventory` | admin |
| `orders`, `orders/[id]` | admin |
| `admin/analytics`, `admin/stats` | admin (own inline Clerk role check, same rule as `requireAdmin`) |
| `feedback`, `inquiries` | POST public, rate-limited; admin reads |
| `upload-url` | admin — issues signed Supabase Storage upload URLs for product images |
| `razorpay/create-order` | signed-in user, rate-limited |
| `razorpay/verify` | signed-in user, rate-limited, HMAC-verified |
| `shiprocket/track/[orderId]` | signed-in user, scoped to their own order |

Route handlers accept the request body largely as-is and pass it to Supabase (no schema/zod validation layer) — the DB's `not null`/`check` constraints are the backstop for admin-only writes. Public-facing routes (`feedback`, `inquiries`, checkout) validate input via `lib/validate.ts` and are rate-limited.

## Checkout / payment flow

1. **`POST /api/razorpay/create-order`** — signed-in user, rate-limited (10 / 10 min). Validates amount (100–100,000,000 paise) and currency (`INR`), creates a Razorpay order.
2. Client completes payment via Razorpay Checkout (client-side SDK).
3. **`POST /api/razorpay/verify`** — signed-in user, rate-limited. Recomputes the HMAC-SHA256 signature of `order_id|payment_id` using `RAZORPAY_KEY_SECRET` and compares it with `crypto.timingSafeEqual`. Re-fetches the order from Razorpay's API and cross-checks the paid amount against a server-side recalculation of the cart total from the current `products` table (client-submitted prices are never trusted). On success: inserts the `orders` row, decrements `size_inventory` per line item, sends an order confirmation email (`lib/email.ts`, via Resend), and fires a non-blocking Shiprocket order creation (a Shiprocket failure is logged but does not fail the checkout).

## Email notifications (`lib/email.ts`)

Resend sends two kinds of order emails, both best-effort (log and continue on failure, never throw into the calling route):

- **Order confirmation** — sent from `POST /api/razorpay/verify` right after the order row is inserted.
- **Order status update** — sent from `PUT /api/orders/[id]` whenever an admin sets a new `status`. Only `processing`, `shipped`, `delivered`, `cancelled` trigger an email (see `STATUS_COPY` in `lib/email.ts`) — `pending`/`paid` are skipped since the confirmation email already covers that moment.

If `RESEND_API_KEY` is not set, both functions no-op silently — safe for local dev without Resend configured.

## Admin panel (`app/admin/`)

Client-rendered pages under `/admin`, gated by `proxy.ts`. Sections: Dashboard, Analytics, Products (list/new/edit), Collections, Inventory, Orders, Delivery & Returns (site-wide copy editor), Feedback, Inquiries.

**Product form** (`admin/products/new`, `admin/products/[id]`): name, description, price, discount price (optional — shown alongside the original price on the storefront when lower), category (free-text input backed by a `<datalist>` populated from every category already used across existing products, so admins can reuse one or type a new one), badge, fabric, care instructions (free text, shown in the "Fabric & Care" PDP accordion), SKU, collection, per-size stock (`XS`–`XXXL`), image upload (validated client-side, uploaded to Supabase Storage via signed URL), active toggle, free-delivery toggle.

**Delivery & Returns** (`admin/delivery-returns`): edits the singleton `store_settings` row. This copy is fetched by every PDP and rendered in the "Delivery & Returns" accordion, replacing what used to be hardcoded text.

## Storefront behavior notes

- **Pricing**: when a product has `discount_price < price`, the PDP, shop grid/quick-view, and collection pages show both prices (discounted price + strikethrough original + % off) and the cart charges the discounted price.
- **Default size**: PDP, shop quick-view, and collection product cards default `selectedSize` to the first size (in `XS → S → M → L → XL → XXL → XXXL` order) that has stock, not a hardcoded `XS`.
- **Description formatting**: product description is rendered with `whitespace-pre-wrap` so line breaks typed in the admin textarea are preserved on the customer-facing page.
- **Free delivery**: a badge is shown wherever price is shown, driven by the per-product `free_delivery` flag.

## Local dev

See README.md for env vars and setup. `scripts/seed-fake-order.mjs` (`npm run seed:order`) inserts a fake order for testing the orders/analytics UI without a real checkout.
