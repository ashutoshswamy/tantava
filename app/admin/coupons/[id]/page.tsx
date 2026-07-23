"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Coupon } from "@/lib/supabase";
import { ArrowLeft, Loader2 } from "lucide-react";

const inputCls = "w-full bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors";

function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    discount_type: "percent" as "percent" | "flat",
    discount_value: "10",
    expires_at: "",
    is_active: true,
  });

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((coupons: Coupon[]) => {
        const c = coupons.find((x) => x.id === id);
        if (c) {
          setForm({
            code: c.code,
            discount_type: c.discount_type,
            discount_value: c.discount_type === "flat" ? String(c.discount_value / 100) : String(c.discount_value),
            expires_at: toDateInput(c.expires_at),
            is_active: c.is_active,
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      code: form.code,
      discount_type: form.discount_type,
      discount_value:
        form.discount_type === "flat"
          ? Math.round(parseFloat(form.discount_value) * 100)
          : parseInt(form.discount_value) || 0,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      is_active: form.is_active,
    };

    const res = await fetch(`/api/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/coupons");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save coupon");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/coupons" className="p-2 text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#fbf0da] rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Edit Coupon</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">{form.code}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Coupon Details</h2>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Code *</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={`${inputCls} uppercase font-mono`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "flat" })}
                className={inputCls}
              >
                <option value="percent">Percentage</option>
                <option value="flat">Flat amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">
                {form.discount_type === "percent" ? "Percent Off" : "Amount Off (₹)"}
              </label>
              <input
                required
                type="number"
                min="1"
                max={form.discount_type === "percent" ? 100 : undefined}
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Expiry Date</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className={inputCls}
            />
            <p className="text-[#dcc9a0] text-[11px] mt-1">Leave blank for a coupon that never expires</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#2b0e0a] font-medium text-[14px]">Active</p>
            <p className="text-[#8c6f52] text-[12px] mt-0.5">Toggle off to disable this coupon without deleting it</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              form.is_active ? "bg-[#930500]" : "bg-[#efdcb0]"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                form.is_active ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3.5 px-8 bg-[#930500] text-white rounded-xl font-medium text-[14px] hover:bg-[#8c0500] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </button>
          <Link
            href="/admin/coupons"
            className="px-8 py-3.5 border border-[#dcc9a0] text-center text-[#8c6f52] rounded-xl hover:border-[#930500]/40 hover:text-[#2b0e0a] transition-colors font-medium text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
