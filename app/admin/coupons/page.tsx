"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Coupon } from "@/lib/supabase";
import { Plus, Loader2, Pencil, Ticket, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    if (res.ok) setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const isExpired = (c: Coupon) => c.expires_at !== null && new Date(c.expires_at) < new Date();

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
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Coupons</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#930500] text-white text-[13px] font-medium rounded-xl hover:bg-[#8c0500] transition-colors"
        >
          <Plus size={16} />
          New Coupon
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-12 text-center">
          <Ticket size={40} className="mx-auto mb-3 text-[#dcc9a0]" />
          <p className="text-[#8c6f52] text-[14px] font-medium">No coupons yet</p>
          <p className="text-[#dcc9a0] text-[12px] mt-1">Create a code customers can apply at checkout</p>
          <Link
            href="/admin/coupons/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#930500] text-white text-[13px] font-medium rounded-xl hover:bg-[#8c0500] transition-colors"
          >
            <Plus size={16} />
            New Coupon
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#efdcb0] rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#efdcb0] bg-[#fbf0da]/40">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Discount</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden sm:table-cell">Expires</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efdcb0]">
              {coupons.map((c) => {
                const expired = isExpired(c);
                return (
                  <tr key={c.id} className="hover:bg-[#fbf0da]/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-[12px] text-[#2b0e0a] bg-[#fbf0da] px-2 py-1 rounded-lg">{c.code}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#2b0e0a] font-medium">
                        {c.discount_type === "percent" ? `${c.discount_value}%` : `₹${(c.discount_value / 100).toLocaleString("en-IN")}`} off
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-[13px] text-[#8c6f52]">
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "Never"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          !c.is_active
                            ? "bg-[#fbf0da] text-[#8c6f52]"
                            : expired
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {!c.is_active ? "Disabled" : expired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Link
                          href={`/admin/coupons/${c.id}`}
                          className="p-2 text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#fbf0da] rounded-lg transition-colors"
                          title="Edit coupon"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          disabled={deleting === c.id}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete coupon"
                        >
                          {deleting === c.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
