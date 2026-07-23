# Security

## Reporting a vulnerability

If you find a security issue in this codebase, report it privately to the project maintainer rather than opening a public GitHub issue. Include steps to reproduce and impact. Do not test against production data.

## Auth & authorization

- **Identity**: Clerk. Session verification happens via Clerk's middleware/SDK, not custom cookie/JWT handling.
- **Admin role**: a single flag, `publicMetadata.role === "admin"` on the Clerk user. Checked server-side in two places, both of which must be kept in sync:
  - `lib/auth.ts` (`requireAdmin`) — used by admin API route handlers.
  - `proxy.ts` — Next middleware gate for `/admin(.*)` page routes.
  - `app/api/admin/stats/route.ts` and `app/api/admin/users/route.ts` both inline the same check directly against Clerk rather than importing `requireAdmin` — if the admin rule ever changes, update all three call sites, not just `lib/auth.ts`.
- **Defense in depth**: middleware is a page-routing convenience, not the security boundary — every admin/user-scoped API route independently re-checks `auth()`/`requireAdmin()` before touching data, because API routes are reachable directly regardless of middleware.
- **Row Level Security**: enabled on every Supabase table. Anon-key reads are scoped by policy (e.g. `orders_user_read` restricts to `auth.uid() = user_id`). `coupons` has RLS enabled with **no** public read/write policy at all — it's reachable only through the service-role key, so codes can only be checked via `/api/coupons/validate`, never queried directly by an anon client. All writes happen through the service-role key from server-side route handlers only — the service-role key must never be exposed to the client (it is not `NEXT_PUBLIC_*`).

## Payment integrity

- Client-submitted prices are never trusted. `POST /api/razorpay/verify` recalculates the cart total server-side from the live `products` table before accepting a payment as valid.
- Discounts (coupon or first-purchase) are likewise never trusted from the client — `verify` re-validates the coupon code server-side and re-derives the discount amount, then requires the Razorpay-charged amount to equal the recomputed total minus that server-derived discount.
- Signature verification uses HMAC-SHA256 over `order_id|payment_id` with `RAZORPAY_KEY_SECRET`, compared with `crypto.timingSafeEqual` (constant-time, avoids timing side-channels) — see `app/api/razorpay/verify/route.ts`.
- The verify route additionally re-fetches the order from Razorpay's own API and cross-checks the paid amount, so a forged signature alone isn't enough — the amount must also match what Razorpay actually charged.
- `create-order` clamps amount to a sane range (100–100,000,000 paise) and enforces `currency = "INR"` before creating a Razorpay order.

## Rate limiting

`lib/rate-limit.ts` implements a fixed-window counter backed by the `rate_limits` Postgres table (key = `route:identifier:windowId`). Applied to:
- `feedback`, `inquiries` — 5 requests / 10 min per IP
- `razorpay/create-order`, `razorpay/verify` — 10 requests / 10 min per user
- `coupons/validate` — 20 requests / 10 min per user
- `upload-url` — 60 requests / 10 min per user

Expired rows are pruned probabilistically (5% chance per call) rather than via a cron job — acceptable at current traffic, but a table that grows faster than that prune rate would need a scheduled cleanup instead.

## Input validation

- `lib/validate.ts` provides `isValidEmail` / `isValidLength`, used by the public `feedback` and `inquiries` endpoints.
- `products`, `categories`, `collections`, `settings`, `orders` (create + update), and `coupons` (create + update) admin-write routes validate the body via `lib/api-utils.ts` (`validateProductInput`, `validateCategoryInput`, `validateCollectionInput`, `validateSettingsInput`, `validateOrderCreateInput`/`validateOrderUpdateInput`, `validateCouponInput`) before it reaches Supabase — type/range checks, rejects with 400 on bad input.
- `inventory` does **not** run application-level schema validation — the request body is passed close to as-is to Supabase, relying on Postgres `not null` / `check` constraints as the backstop. `products/reorder` validates inline (array-of-string-ids shape check) rather than via `lib/api-utils.ts`. This is acceptable because these routes are admin-only (`requireAdmin`), not public input surfaces — if any of them are ever opened to non-admin callers, add explicit validation first.

## File uploads

- `lib/image-validation.ts` checks file size (≤ 25MB) and pixel dimensions (≤ 6000px per side) **client-side** before requesting an upload URL. This is a UX gate, not a security control — treat it as such.
- Uploads go to Supabase Storage via a signed URL issued by `POST /api/upload-url` (admin-only). The storage bucket's `allowed_mime_types` (set in `supabase/schema.sql`) is the actual server-side enforcement of file type.

## Secrets

Required secrets (see README.md for the full list): `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `UPSTASH_REDIS_REST_TOKEN`. None of these should ever be prefixed `NEXT_PUBLIC_` or referenced from client components — grep for `NEXT_PUBLIC_` before adding any new env var to confirm it's meant to be public.

## Known gaps / accepted risk

- No CSP or custom security headers are configured in `next.config.ts` or `proxy.ts` — relies on Next.js/Vercel defaults.
- No application-level schema validation on the `inventory` admin write route (`products`, `categories`, `collections`, `settings`, `orders` all validate now) — see "Input validation" above.
- `rate_limits` cleanup is probabilistic, not scheduled.

If you're changing auth, payment verification, or RLS policies, treat those as high-risk changes — get a second review before merging.
