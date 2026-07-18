"use client";

import { useEffect, useState } from "react";
import { Loader2, Truck } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";

const inputCls = "w-full bg-[#fbe9e9] border border-[#dbb0b0]/40 rounded-xl px-4 py-3 text-[13px] text-[#200a0c] placeholder:text-[#dbb0b0] focus:border-[#c8102e]/60 focus:outline-none transition-colors resize-none";

export default function DeliveryReturnsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ delivery_info: "", returns_info: "" });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setForm({ delivery_info: data.delivery_info || "", returns_info: data.returns_info || "" });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#c8102e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#200a0c]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#fbe9e9] rounded-xl text-[#c8102e]">
          <Truck size={20} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#200a0c] tracking-tight">Delivery & Returns</h1>
          <p className="text-[#8c4f52] text-[13px] mt-0.5">Site-wide copy shown on every product page</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#f0c7c7] rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Delivery Info</label>
            <textarea
              rows={4}
              value={form.delivery_info}
              onChange={(e) => setForm({ ...form, delivery_info: e.target.value })}
              className={inputCls}
              placeholder="e.g. Complimentary shipping across India. 14–21 working days."
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Returns Info</label>
            <textarea
              rows={4}
              value={form.returns_info}
              onChange={(e) => setForm({ ...form, returns_info: e.target.value })}
              className={inputCls}
              placeholder="e.g. Returns within 7 days for standard sizes."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3.5 px-8 bg-[#c8102e] text-white rounded-xl font-medium text-[14px] hover:bg-[#96182a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
