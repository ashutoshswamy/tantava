"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

const CATEGORIES = ["sarees", "lehengas", "fusion", "gowns", "jewellery"];
const BADGES = ["", "HANDCRAFTED", "LIMITED", "TRENDING", "NEW"];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "sarees",
    fabric: "",
    images: [""],
    stock_quantity: "10",
    sku: "",
    badge: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
      stock_quantity: parseInt(form.stock_quantity),
      images: form.images.filter(Boolean),
      badge: form.badge || null,
      sku: form.sku || null,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create product");
    }
    setSaving(false);
  };

  const updateImage = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm({ ...form, images: imgs });
  };

  return (
    <div className="p-8 text-white max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-headline-lg text-[28px] text-white">Add New Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-body-md text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 space-y-5">
          <h2 className="text-white/70 font-label-md text-[13px] uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
              placeholder="e.g. Ivory & Gold Handcrafted Lehenga"
            />
          </div>

          <div>
            <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors resize-none"
              placeholder="Describe the piece, its craftsmanship, and unique features..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Price (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                placeholder="e.g. 85000"
              />
            </div>
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Stock Qty *</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1a1a1a] capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors appearance-none"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b} className="bg-[#1a1a1a]">{b || "None"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">Fabric</label>
              <input
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                placeholder="e.g. Banarasi Silk"
              />
            </div>
            <div>
              <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                placeholder="e.g. SKU-007"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 space-y-4">
          <h2 className="text-white/70 font-label-md text-[13px] uppercase tracking-wider">Images (URLs)</h2>
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-3">
              <input
                value={img}
                onChange={(e) => updateImage(idx, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                placeholder="https://..."
              />
              {idx === form.images.length - 1 && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
          <div>
            <p className="text-white font-label-md text-[14px]">Active / Visible in shop</p>
            <p className="text-white/30 text-[12px]">Toggle to hide from customers</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              form.is_active ? "bg-[#C9A84C]" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                form.is_active ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-4 bg-[#C9A84C] text-black font-label-md text-[14px] rounded-lg hover:bg-[#C9A84C]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-4 border border-white/10 text-white/60 rounded-lg hover:border-white/20 hover:text-white transition-colors font-label-md text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
