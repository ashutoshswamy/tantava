"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/lib/supabase";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

const CATEGORIES = ["sarees", "lehengas", "fusion", "gowns", "jewellery"];
const BADGES = ["", "HANDCRAFTED", "LIMITED", "TRENDING", "NEW"];

const inputCls = "w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] placeholder:text-[#d9afc0] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setForm({
          name: data.name,
          description: data.description || "",
          price: (data.price / 100).toString(),
          category: data.category,
          fabric: data.fabric || "",
          images: data.images.length > 0 ? data.images : [""],
          stock_quantity: data.stock_quantity.toString(),
          sku: data.sku || "",
          badge: data.badge || "",
          is_active: data.is_active,
        });
        setLoading(false);
      });
  }, [params.id]);

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

    const res = await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update product");
    }
    setSaving(false);
  };

  const updateImage = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm({ ...form, images: imgs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-[#8c5971] hover:text-[#21101a] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-headline-lg text-[28px] text-[#21101a]">Edit Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body-md text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-5">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Price (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Stock Qty *</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`${inputCls} appearance-none`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-white capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className={`${inputCls} appearance-none`}
              >
                {BADGES.map((b) => (
                  <option key={b} value={b} className="bg-white">{b || "None"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Fabric</label>
              <input
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">Images (URLs)</h2>
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-3">
              <input
                value={img}
                onChange={(e) => updateImage(idx, e.target.value)}
                className={inputCls}
                placeholder="https://..."
              />
              {idx === form.images.length - 1 && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                  className="px-4 py-3 bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg text-[#8c5971] hover:text-[#21101a] hover:bg-[#f8dde9] transition-colors"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <div>
            <p className="text-[#21101a] font-label-md text-[14px]">Active / Visible in shop</p>
            <p className="text-[#8c5971] text-[12px]">Toggle to hide from customers</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              form.is_active ? "bg-[#9e3462]" : "bg-[#eec7dd]"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                form.is_active ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-4 bg-[#9e3462] text-white font-label-md text-[14px] rounded-lg hover:bg-[#7d1a48] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-4 border border-[#d9afc0] text-center text-[#8c5971] rounded-lg hover:border-[#9e3462]/40 hover:text-[#21101a] transition-colors font-label-md text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
