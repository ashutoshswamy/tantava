"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import type { Product } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
      if (products.length === 0) {
        fetch("/api/products?active=true")
          .then((r) => r.json())
          .then((data) => {
            setProducts(Array.isArray(data) ? data : []);
          })
          .catch(() => {
            setProducts([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      return () => window.clearTimeout(focusTimer);
    }
  }, [open, products.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results =
    query.trim().length > 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 7)
      : [];

  const formatPrice = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-on-surface/40 backdrop-blur-sm flex items-start justify-center px-3 pt-16 sm:px-4 sm:pt-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="bg-surface w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-outline-variant">
              {loading ? (
                <Loader2 size={20} className="text-primary animate-spin flex-shrink-0" />
              ) : (
                <Search size={20} className="text-outline flex-shrink-0" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search kurtas, anarkalis, sarees…"
                className="flex-1 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none"
              />
              <button
                onClick={onClose}
                className="text-outline hover:text-primary transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {results.length > 0 && (
              <div className="divide-y divide-outline-variant max-h-[60vh] overflow-y-auto custom-scrollbar">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-surface-container transition-colors"
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                      <img
                        src={p.images[0] || ""}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline-sm text-[15px] text-on-surface truncate">{p.name}</p>
                      <p className="font-label-md text-label-md text-primary">{formatPrice(p.price)}</p>
                      <p className="font-label-md text-[11px] text-outline capitalize">{p.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {query.trim().length > 1 && results.length === 0 && !loading && (
              <div className="px-6 py-10 text-center text-on-surface-variant font-body-md text-body-md">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}

            {query.trim().length <= 1 && (
              <div className="px-6 py-6 text-center text-outline font-label-md text-label-md">
                Type at least 2 characters to search
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
