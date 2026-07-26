"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { Collection } from "@/lib/supabase";

export default function Footer() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCollections(data))
      .catch(() => {});
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-surface-container-low w-full py-stack-lg border-t border-outline-variant/30">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div>
          <Link href="/" className="font-headline-sm text-headline-sm text-primary tracking-[0.15em] uppercase mb-6 block">
            Tantava
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
            Festive wear, office staples, everyday essentials — all thoughtfully curated, never mass-produced. Elegant kurtas, anarkalis, and contemporary Indo-Western styles, shipped across India.
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
            {[
              { label: "FAQ",                        href: "/faq" },
              { label: "Terms of Service",            href: "/terms" },
              { label: "Shipping Policy",              href: "/shipping-policy" },
              { label: "Return & Exchange Policy",     href: "/return-policy" },
              { label: "Privacy Policy",               href: "/privacy-policy" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-md text-label-md text-on-surface-variant">
          © {year ?? ""} Tantava. India · Pan India Shipping.
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
