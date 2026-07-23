"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { Collection } from "@/lib/supabase";

export default function Footer() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCollections(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-surface-container-low w-full py-stack-lg border-t border-outline-variant/30">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div>
          <Link href="/" className="font-headline-sm text-headline-sm text-primary mb-6 block">
            Tantava
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
            Ethnic &amp; Indo-Western wear - kurtas, anarkalis, and fusion sets for office, festive, and everyday elegance. Pan India shipping.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/_tantava" className="text-on-surface-variant hover:text-primary transition-all" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
            <a href="https://wa.me/917558786317" className="text-on-surface-variant hover:text-primary transition-all" aria-label="WhatsApp">
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Shop</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                New Arrivals
              </Link>
            </li>
            {collections.map((col) => (
              <li key={col.id}>
                <Link href={`/collections/${col.slug}`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {col.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Experience</h4>
          <ul className="space-y-4">
            {[
              { label: "About Us",       href: "/about" },
              { label: "Contact",        href: "/contact" },
              { label: "Share Feedback", href: "/feedback" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Policies</h4>
          <ul className="space-y-4">
            {["Privacy Policy", "Terms of Service", "Shipping & Returns"].map((label) => (
              <li key={label}>
                <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-md text-label-md text-on-surface-variant">
          © {new Date().getFullYear()} Tantava. India · Pan India Shipping.
        </p>
        <a
          href="https://anahat-entertainment.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-label-md text-label-md text-on-surface-variant opacity-50 hover:opacity-100 transition-all"
        >
          Made by Anahat Entertainment
        </a>
      </div>
    </footer>
  );
}
