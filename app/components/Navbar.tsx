"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useCart } from "@/store/cart";
import CartDrawer from "./CartDrawer";
import { User, ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavbarProps {
  activePage?: "shop" | "book-appointment" | "contact";
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [mounted, setMounted]       = useState(false);
  const { isSignedIn, user }        = useUser();
  const itemCount                   = useCart((s) => s.itemCount)();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (page: string) =>
    activePage === page
      ? "font-label-md text-label-md text-primary border-b border-primary-container pb-1"
      : "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300";

  const isAdmin = (user?.publicMetadata as { role?: string })?.role === "admin";

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-surface/95 shadow-md" : "bg-surface/90"
        } frosted-nav`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-headline-md text-headline-md text-primary tracking-tight hover:opacity-80 transition-opacity"
          >
            Tantava
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop"             className={linkClass("shop")}>Shop</Link>
            <Link href="/book-appointment" className={linkClass("book-appointment")}>Book Appointment</Link>
            <Link href="/contact"          className={linkClass("contact")}>Contact</Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="font-label-md text-label-md text-secondary hover:text-primary transition-colors border border-secondary/30 px-3 py-1 rounded"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            {isSignedIn ? (
              <Link href="/account" className="text-on-surface-variant hover:text-primary transition-all duration-300">
                <User size={20} />
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="text-on-surface-variant hover:text-primary transition-all duration-300">
                  <User size={20} />
                </button>
              </SignInButton>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative text-on-surface-variant hover:text-primary transition-all duration-300"
            >
              <ShoppingBag size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {isSignedIn && (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            )}

            <button
              className="md:hidden text-on-surface-variant"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-surface border-t border-outline-variant/30 px-margin-mobile py-6 flex flex-col gap-5 overflow-hidden"
            >
              {[
                { href: "/shop",             label: "Shop" },
                { href: "/book-appointment", label: "Book Appointment" },
                { href: "/contact",          label: "Contact" },
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-label-md text-label-md text-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {!isSignedIn && (
                <SignInButton mode="modal">
                  <button className="font-label-md text-label-md text-primary text-left">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
