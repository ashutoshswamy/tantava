"use client";

import { useEffect, useState } from "react";
import { Loader2, CreditCard, MessageCircle } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";

export default function CheckoutSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{ checkout_mode: "razorpay" | "whatsapp"; whatsapp_number: string }>({
    checkout_mode: "razorpay",
    whatsapp_number: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setForm({
          checkout_mode: data.checkout_mode || "razorpay",
          whatsapp_number: data.whatsapp_number || "",
        });
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
          <CreditCard size={20} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#200a0c] tracking-tight">Checkout Settings</h1>
          <p className="text-[#8c4f52] text-[13px] mt-0.5">Choose how customers complete their purchase</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#f0c7c7] rounded-2xl p-5 sm:p-6 space-y-4">
          <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">
            Checkout Mode
          </label>

          <button
            type="button"
            onClick={() => setForm({ ...form, checkout_mode: "razorpay" })}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              form.checkout_mode === "razorpay"
                ? "border-[#c8102e] bg-[#fbe9e9]"
                : "border-[#dbb0b0]/40 hover:border-[#c8102e]/50"
            }`}
          >
            <CreditCard size={20} className="text-[#c8102e] flex-shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-[#200a0c]">Razorpay + Shiprocket</p>
              <p className="text-[12px] text-[#8c4f52]">Customers pay on-site; orders auto-ship via Shiprocket.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, checkout_mode: "whatsapp" })}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              form.checkout_mode === "whatsapp"
                ? "border-[#c8102e] bg-[#fbe9e9]"
                : "border-[#dbb0b0]/40 hover:border-[#c8102e]/50"
            }`}
          >
            <MessageCircle size={20} className="text-[#c8102e] flex-shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-[#200a0c]">WhatsApp Chat</p>
              <p className="text-[12px] text-[#8c4f52]">Buy Now / Checkout opens a WhatsApp chat with your number instead of taking payment on-site.</p>
            </div>
          </button>

          {form.checkout_mode === "whatsapp" && (
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">
                WhatsApp Number
              </label>
              <input
                required
                type="tel"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="e.g. 919876543210 (country code, no + or spaces)"
                className="w-full bg-[#fbe9e9] border border-[#dbb0b0]/40 rounded-xl px-4 py-3 text-[13px] text-[#200a0c] placeholder:text-[#dbb0b0] focus:border-[#c8102e]/60 focus:outline-none transition-colors"
              />
            </div>
          )}
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
