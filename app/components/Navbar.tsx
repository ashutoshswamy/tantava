"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import { User, ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Collection } from "@/lib/supabase";

interface NavbarProps {
  activePage?: "shop" | "contact";
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const { isSignedIn, user } = useUser();
  const itemCount            = useCart((s) => s.itemCount)();
  const wishlistCount        = useWishlist((s) => s.itemCount)();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCollections(data))
      .catch(() => {});
  }, []);

  const linkClass = (page: string) =>
    activePage === page
      ? "font-label-md text-label-md text-primary border-b border-primary-container pb-1"
      : "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300";

  const isAdmin = (user?.publicMetadata as { role?: string })?.role === "admin";

  return (
    <>
      {/* Fixed header + navbar - h-24 mobile / h-28 desktop total */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-surface/95 shadow-sm" : "bg-surface/90"
        } frosted-nav`}
      >
        {/* Header: brand name */}
        <div className="py-3 md:py-4 flex items-center justify-center border-b border-outline-variant/20">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="font-display-brand text-2xl md:text-4xl text-brand-red tracking-wide uppercase">
              Tantava
            </span>
          </Link>
        </div>

        {/* Navbar: collections + utility icons */}
        <nav className="h-12 md:h-14 flex items-center">
          <div className="grid grid-cols-[1fr_auto] items-center h-full px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto w-full gap-4">
            {/* Left: collection links */}
            <div className="hidden md:flex items-center gap-6 overflow-x-auto custom-scrollbar">
              <Link href="/shop" className={linkClass("shop") + " whitespace-nowrap"}>Shop All</Link>
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300 whitespace-nowrap"
                >
                  {col.name}
                </Link>
              ))}
              <Link href="/contact" className={linkClass("contact") + " whitespace-nowrap"}>Contact</Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-label-md text-label-md text-secondary hover:text-primary transition-colors border border-secondary/30 px-3 py-1 rounded whitespace-nowrap"
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="md:hidden" />

            {/* Right: icons */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:block text-on-surface-variant hover:text-primary transition-all duration-300"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="relative hidden md:block text-on-surface-variant hover:text-primary transition-all duration-300"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative hidden md:block text-on-surface-variant hover:text-primary transition-all duration-300"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {isSignedIn ? (
                <>
                  <Link href="/account" className="hidden md:block text-on-surface-variant hover:text-primary transition-all duration-300">
                    <User size={20} />
                  </Link>
                  <div className="hidden md:block">
                    <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
                  </div>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="hidden md:block text-on-surface-variant hover:text-primary transition-all duration-300"
                    aria-label="Sign in"
                  >
                    <User size={20} />
                  </button>
                </SignInButton>
              )}

              <button
                className="md:hidden text-on-surface-variant"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-surface border-t border-outline-variant/30 px-margin-mobile py-6 flex flex-col gap-5 overflow-hidden absolute top-full left-0 right-0"
            >
              <button
                onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                <Search size={18} /> Search
              </button>

              {[
                { href: "/shop",     label: "Shop" },
                { href: "/contact",  label: "Contact" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <Link
                href="/wishlist"
                className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Heart size={18} /> Wishlist
                {mounted && wishlistCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => { setCartOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                <ShoppingBag size={18} /> Cart
                {mounted && itemCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-label-md text-label-md text-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
                  <Link
                    href="/account"
                    className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Account
                  </Link>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="font-label-md text-label-md text-primary text-left"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer - same height as fixed header+navbar so content is never hidden behind it */}
      <div className="h-[6.5rem] md:h-32 shrink-0" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
