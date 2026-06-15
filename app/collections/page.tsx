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
      <main className="min-h-screen bg-[#fff9fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="font-headline-lg text-[40px] sm:text-[52px] text-[#21101a] leading-tight">
              Collections
            </h1>
            <p className="text-[#8c5971] mt-3 text-[16px] max-w-xl mx-auto font-body-md">
              Curated edits from Tantava — explore each collection to find your perfect piece.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={40} className="text-[#9e3462] animate-spin" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-24">
              <Layers size={48} className="text-[#eec7dd] mx-auto mb-4" />
              <p className="text-[#8c5971] text-[16px]">No collections available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group block bg-white border border-[#eec7dd] rounded-2xl overflow-hidden hover:border-[#9e3462]/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#fce8f0]">
                    {col.cover_image ? (
                      <img
                        src={col.cover_image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers size={48} className="text-[#d9afc0]" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-headline-sm text-[20px] text-[#21101a] group-hover:text-[#9e3462] transition-colors">
                      {col.name}
                    </h2>
                    {col.description && (
                      <p className="text-[#8c5971] text-[13px] mt-2 font-body-md line-clamp-2">
                        {col.description}
                      </p>
                    )}
                    <p className="mt-3 text-[#9e3462] font-label-md text-[12px] uppercase tracking-wider">
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
