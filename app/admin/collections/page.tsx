"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Collection } from "@/lib/supabase";
import { Plus, Loader2, Pencil, Layers, Trash2 } from "lucide-react";

type CollectionWithCount = Collection & { product_count: number };

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collections?all=true");
      const data: Collection[] = await res.json();

      const withCounts = await Promise.all(
        data.map(async (col) => {
          const pRes = await fetch(`/api/products?collection_id=${col.id}&active=all`);
          const products = await pRes.json();
          return { ...col, product_count: Array.isArray(products) ? products.length : 0 };
        })
      );

      setCollections(withCounts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? Products in this collection will be unassigned.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#c2477f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Collections</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{collections.length} collection{collections.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c2477f] text-white text-[13px] font-medium rounded-xl hover:bg-[#962259] transition-colors"
        >
          <Plus size={16} />
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white border border-[#f2cfe3] rounded-2xl p-12 text-center">
          <Layers size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
          <p className="text-[#8c5971] text-[14px] font-medium">No collections yet</p>
          <p className="text-[#dbb6ca] text-[12px] mt-1">Create your first collection to group products</p>
          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#c2477f] text-white text-[13px] font-medium rounded-xl hover:bg-[#962259] transition-colors"
          >
            <Plus size={16} />
            New Collection
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#f2cfe3] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f2cfe3] bg-[#fdeaf2]/40">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Collection</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider hidden md:table-cell">Products</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider hidden lg:table-cell">Sort</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2cfe3]">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-[#fdeaf2]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {col.cover_image ? (
                        <img
                          src={col.cover_image}
                          alt={col.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#f2cfe3]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#fdeaf2] border border-[#f2cfe3] flex items-center justify-center">
                          <Layers size={16} className="text-[#dbb6ca]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[13px] text-[#1a0914]">{col.name}</p>
                        {col.description && (
                          <p className="text-[11px] text-[#8c5971] truncate max-w-[200px] mt-0.5">{col.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="font-mono text-[12px] text-[#8c5971] bg-[#fdeaf2] px-2 py-1 rounded-lg">{col.slug}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-[13px] text-[#1a0914] font-medium">{col.product_count}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-[13px] text-[#1a0914]">{col.sort_order}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        col.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-[#fdeaf2] text-[#8c5971]"
                      }`}
                    >
                      {col.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/admin/collections/${col.id}`}
                        className="p-2 text-[#8c5971] hover:text-[#1a0914] hover:bg-[#fdeaf2] rounded-lg transition-colors"
                        title="Edit collection"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(col.id, col.name)}
                        disabled={deleting === col.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete collection"
                      >
                        {deleting === col.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
