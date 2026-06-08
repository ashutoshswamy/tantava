"use client";

import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  activePage?: "shop" | "collections" | "our-story" | "book-appointment" | "contact";
}

export default function Navbar({ activePage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (page: string) =>
    activePage === page
      ? "font-label-md text-label-md text-primary border-b border-primary-container pb-1"
      : "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300";

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 frosted-nav shadow-sm">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link
          href="/"
          className="font-headline-md text-headline-md text-primary tracking-tight"
        >
          Tantava
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className={linkClass("shop")}>
            Shop
          </Link>
          <Link href="/shop" className={linkClass("collections")}>
            Collections
          </Link>
          <Link href="/our-story" className={linkClass("our-story")}>
            Our Story
          </Link>
          <Link
            href="/book-appointment"
            className={linkClass("book-appointment")}
          >
            Book Appointment
          </Link>
          <Link href="/contact" className={linkClass("contact")}>
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-all duration-300">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-all duration-300">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="relative text-on-surface-variant hover:text-primary transition-all duration-300">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
              0
            </span>
          </button>
          <button
            className="md:hidden text-on-surface-variant"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/30 px-margin-mobile py-4 flex flex-col gap-4">
          <Link
            href="/shop"
            className="font-label-md text-label-md text-on-surface-variant"
            onClick={() => setMobileOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/our-story"
            className="font-label-md text-label-md text-on-surface-variant"
            onClick={() => setMobileOpen(false)}
          >
            Our Story
          </Link>
          <Link
            href="/book-appointment"
            className="font-label-md text-label-md text-on-surface-variant"
            onClick={() => setMobileOpen(false)}
          >
            Book Appointment
          </Link>
          <Link
            href="/contact"
            className="font-label-md text-label-md text-on-surface-variant"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
