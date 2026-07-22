# Tantava

E-commerce storefront and admin panel for Tantava, an Indian ethnic wear label — sarees, lehengas, fusion wear, gowns, and jewellery.

Built with Next.js 16 (App Router), Supabase (Postgres), Clerk (auth), and Razorpay (payments).

For architecture, data model, and API details see [DOCUMENTATION.md](./DOCUMENTATION.md). For the threat model and security controls see [SECURITY.md](./SECURITY.md).

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Auth**: Clerk (`@clerk/nextjs`) — role-based admin access via `publicMetadata.role`
- **Database**: Supabase Postgres, accessed directly via `@supabase/supabase-js` (no ORM), Row Level Security enabled
- **Payments**: Razorpay
- **State**: Zustand (cart, wishlist)
- **Animation**: Framer Motion

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 3. Set up the database

Run `supabase/schema.sql` once against a fresh Supabase project (SQL editor or CLI) — it's the canonical, idempotent schema. `supabase/reset.sql` drops every table/policy/trigger/function — dev/staging only. It can't touch storage (Supabase blocks direct SQL deletes on storage tables), so also run `npm run reset:storage` to empty and delete the `product-images` bucket.

Grant a Clerk user admin access by setting `publicMetadata.role = "admin"` on their account (Clerk dashboard or Backend API).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin panel lives at `/admin` (requires the admin role above).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed:order` | Seed a fake order for local testing (`scripts/seed-fake-order.mjs`) — **script file is currently missing from the repo, will fail if run** |
| `npm run reset:storage` | Empty and delete the `product-images` Supabase Storage bucket (`scripts/reset-storage.mjs`) |

## Project Structure

```
app/
  admin/          Admin panel — products, categories, collections, inventory, orders, homepage, appearance, checkout settings, delivery & returns, analytics, feedback, inquiries
  api/            Route handlers (REST-ish JSON endpoints)
  shop/           Storefront product listing + PDP
  collections/    Collection landing + listing pages
  checkout/       Cart → Razorpay checkout flow
  account/        Customer order history
  ...             Marketing pages (contact, feedback, wishlist)
lib/              Server/shared helpers (auth, supabase clients, rate limiting, validation)
store/            Zustand stores (cart, wishlist)
supabase/         schema.sql, reset.sql
proxy.ts          Clerk middleware — route protection for /admin, /account, /checkout
```

## Deployment

No custom deploy config — targets Vercel's default Next.js hosting. Set the environment variables above in the hosting provider and point it at the Supabase project.
