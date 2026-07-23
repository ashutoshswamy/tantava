"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import { User, ShoppingBag, Menu, X, Search, Heart, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Collection } from "@/lib/supabase";

interface NavbarProps {
  activePage?: "shop" | "contact";
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
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
        {/* Header: search + brand name + icons */}
        <div className="py-3 md:py-4 grid grid-cols-[auto_1fr_auto] items-center px-4 sm:px-6 md:px-margin-desktop border-b border-outline-variant/20">
          <div className="flex items-center">
            <button
              className="md:hidden -m-2.5 p-2.5 text-on-surface-variant"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:block -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          <Link href="/" className="hover:opacity-80 transition-opacity justify-self-center min-w-0">
            <span className="font-display-brand text-xl sm:text-2xl md:text-4xl text-brand-red tracking-wide uppercase whitespace-nowrap">
              Tantava
            </span>
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="relative -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {isSignedIn ? (
              <>
                <Link href="/account" className="hidden md:block -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300">
                  <User size={20} />
                </Link>
                <div className="hidden md:block">
                  <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="hidden md:block -m-2.5 p-2.5 text-on-surface-variant hover:text-primary transition-all duration-300"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Navbar: collections, centered */}
        <nav className="h-12 md:h-14 hidden md:flex items-center justify-center">
          <div className="flex items-center justify-center gap-6 h-full px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto overflow-x-auto custom-scrollbar">
            <Link href="/shop" className={linkClass("shop") + " whitespace-nowrap"}>New Arrivals</Link>
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300 whitespace-nowrap"
              >
                {col.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="font-label-md text-label-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1 rounded whitespace-nowrap"
              >
                Admin
              </Link>
            )}
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-surface border-t border-outline-variant/30 overflow-hidden absolute top-full left-0 right-0"
            >
            <div className="px-margin-mobile py-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
              {[
                { href: "/",     label: "Home" },
                { href: "/shop", label: "New Arrivals" },
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

              <div>
                <button
                  onClick={() => setMobileCollectionsOpen((v) => !v)}
                  className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  Collections
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileCollectionsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileCollectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex flex-col gap-3 overflow-hidden pl-4 pt-3"
                    >
                      {collections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.slug}`}
                          className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {col.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/about"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-label-md text-label-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-2 rounded w-fit"
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
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer - same height as fixed header+navbar so content is never hidden behind it */}
      <div className="h-[3.5rem] md:h-32 shrink-0" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
