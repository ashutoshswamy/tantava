"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/supabase";
import { Plus, Loader2, Pencil, Tag, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories?all=true")
      .then((r) => r.json())
      .then((data) => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products already using this category keep their value.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Categories</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">{categories.length} categor{categories.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#930500] text-white text-[13px] font-medium rounded-xl hover:bg-[#8c0500] transition-colors"
        >
          <Plus size={16} />
          New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-12 text-center">
          <Tag size={40} className="mx-auto mb-3 text-[#dcc9a0]" />
          <p className="text-[#8c6f52] text-[14px] font-medium">No categories yet</p>
          <p className="text-[#dcc9a0] text-[12px] mt-1">Create categories so they show up as choices when adding products</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#930500] text-white text-[13px] font-medium rounded-xl hover:bg-[#8c0500] transition-colors"
          >
            <Plus size={16} />
            New Category
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#efdcb0] rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-[#efdcb0] bg-[#fbf0da]/40">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden lg:table-cell">Sort</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efdcb0]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fbf0da]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fbf0da] border border-[#efdcb0] flex items-center justify-center">
                        <Tag size={16} className="text-[#dcc9a0]" />
                      </div>
                      <p className="font-medium text-[13px] text-[#2b0e0a]">{cat.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="font-mono text-[12px] text-[#8c6f52] bg-[#fbf0da] px-2 py-1 rounded-lg">{cat.slug}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-[13px] text-[#2b0e0a]">{cat.sort_order}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        cat.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-[#fbf0da] text-[#8c6f52]"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="p-2 text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#fbf0da] rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleting === cat.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete category"
                      >
                        {deleting === cat.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
