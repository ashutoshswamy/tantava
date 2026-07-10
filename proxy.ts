import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/checkout(.*)"]);

// Backstop for admin-only API routes: these paths accept public GETs (storefront
// reads) but every non-GET method must be an admin. Each route already enforces
// this itself via requireAdmin() — this is a second gate so a route that forgets
// the check is still blocked, rather than relying solely on per-route diligence.
const isAdminApiRoute = createRouteMatcher([
  "/api/products(.*)",
  "/api/collections(.*)",
  "/api/settings(.*)",
  "/api/orders(.*)",
  "/api/inventory(.*)",
  "/api/upload-url(.*)",
  "/api/admin(.*)",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // /api/orders GET is shared by customers (own orders) and admins (all orders),
  // so it's excluded here — ownership is enforced inside the route itself.
  if (isAdminApiRoute(req) && req.method !== "GET") {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
