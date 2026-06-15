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
        <Loader2 size={48} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline-lg text-[28px] text-[#21101a]">Collections</h1>
          <p className="text-[#8c5971] text-[14px] mt-1">{collections.length} collection{collections.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-5 py-3 bg-[#9e3462] text-white rounded-lg font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors"
        >
          <Plus size={18} />
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white border border-[#eec7dd] rounded-xl p-12 text-center">
          <Layers size={48} className="text-[#eec7dd] mx-auto mb-4" />
          <p className="text-[#8c5971] font-body-md text-[16px]">No collections yet</p>
          <p className="text-[#d9afc0] text-[13px] mt-1">Create your first collection to group products</p>
          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-[#9e3462] text-white rounded-lg font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors"
          >
            <Plus size={18} />
            New Collection
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#eec7dd] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eec7dd] bg-[#fce8f0]/40">
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[11px] uppercase tracking-wider">Collection</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[11px] uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[11px] uppercase tracking-wider hidden md:table-cell">Products</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[11px] uppercase tracking-wider hidden lg:table-cell">Sort</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eec7dd]/60">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-[#fce8f0]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {col.cover_image ? (
                        <img
                          src={col.cover_image}
                          alt={col.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#eec7dd]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#fce8f0] border border-[#eec7dd] flex items-center justify-center">
                          <Layers size={16} className="text-[#d9afc0]" />
                        </div>
                      )}
                      <div>
                        <p className="font-label-md text-[14px] text-[#21101a]">{col.name}</p>
                        {col.description && (
                          <p className="text-[12px] text-[#8c5971] truncate max-w-[200px]">{col.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="font-mono text-[12px] text-[#8c5971] bg-[#fce8f0] px-2 py-1 rounded">{col.slug}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-[14px] text-[#21101a]">{col.product_count}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-[14px] text-[#21101a]">{col.sort_order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-label-md ${
                        col.is_active
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-[#fce8f0] text-[#8c5971] border border-[#eec7dd]"
                      }`}
                    >
                      {col.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/collections/${col.id}`}
                        className="p-2 text-[#8c5971] hover:text-[#21101a] hover:bg-[#fce8f0] rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(col.id, col.name)}
                        disabled={deleting === col.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === col.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
