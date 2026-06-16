"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Collection } from "@/lib/supabase";
import { Layers, Loader2 } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCollections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar activePage="shop" />
      <main className="min-h-screen bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 sm:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="font-headline-lg text-[28px] sm:text-[40px] md:text-[52px] text-on-surface leading-tight">
              Collections
            </h1>
            <p className="text-on-surface-variant mt-3 text-[15px] max-w-xl mx-auto font-body-md">
              Curated edits from Tantava - explore each collection to find your perfect piece.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={40} className="text-primary animate-spin" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-24">
              <Layers size={48} className="text-outline-variant mx-auto mb-4" />
              <p className="text-on-surface-variant text-[16px]">No collections available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group block bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {col.cover_image ? (
                      <img
                        src={col.cover_image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers size={48} className="text-outline-variant" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="font-headline-sm text-[18px] sm:text-[20px] text-on-surface group-hover:text-primary transition-colors">
                      {col.name}
                    </h2>
                    {col.description && (
                      <p className="text-on-surface-variant text-[13px] mt-2 font-body-md line-clamp-2">
                        {col.description}
                      </p>
                    )}
                    <p className="mt-3 text-primary font-label-md text-[12px] uppercase tracking-wider">
                      Explore →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
