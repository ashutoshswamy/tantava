"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, Collection } from "@/lib/supabase";
import { ArrowLeft, Plus, Loader2, Upload } from "lucide-react";

const CATEGORY_SUGGESTIONS = ["sarees", "lehengas", "fusion", "gowns", "jewellery"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const inputCls = "w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] placeholder:text-[#d9afc0] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "sarees",
    fabric: "",
    images: [""],
    size_inventory: { XS: "0", S: "0", M: "0", L: "0", XL: "0", XXL: "0" } as Record<string, string>,
    sku: "",
    badge: "",
    is_active: true,
    collection_id: "",
  });

  useEffect(() => {
    const load = async () => {
      const [prodRes, colRes] = await Promise.all([
        fetch(`/api/products/${params.id}`),
        fetch("/api/collections"),
      ]);

      const data: Product = await prodRes.json();
      const cols = await colRes.json();

      if (Array.isArray(cols)) setCollections(cols);

      const inv = data.size_inventory || {};

      setForm({
        name: data.name,
        description: data.description || "",
        price: (data.price / 100).toString(),
        category: data.category,
        fabric: data.fabric || "",
        images: data.images.length > 0 ? data.images : [""],
        size_inventory: Object.fromEntries(SIZES.map((s) => [s, String(inv[s] ?? 0)])),
        sku: data.sku || "",
        badge: data.badge || "",
        is_active: data.is_active,
        collection_id: data.collection_id || "",
      });
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
      size_inventory: Object.fromEntries(
        SIZES.map((s) => [s, parseInt(form.size_inventory[s] || "0") || 0])
      ),
      images: form.images.filter(Boolean),
      badge: form.badge || null,
      sku: form.sku || null,
      collection_id: form.collection_id || null,
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

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      updateImage(idx, url);
    }
    setUploadingIdx(null);
    e.target.value = "";
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
        {/* Basic Info */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Category *</label>
              <input
                required
                list="category-suggestions-edit"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
                placeholder="e.g. sarees"
              />
              <datalist id="category-suggestions-edit">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Badge</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className={inputCls}
                placeholder="e.g. HANDCRAFTED, LIMITED, TRENDING, NEW"
              />
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

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Collection</label>
            <select
              value={form.collection_id}
              onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
              className={`${inputCls} appearance-none`}
            >
              <option value="">No Collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock by Size */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">Stock by Size</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col gap-1">
                <span className="text-[11px] text-[#8c5971] font-label-md text-center">{size}</span>
                <input
                  type="number"
                  min="0"
                  value={form.size_inventory[size]}
                  onChange={(e) => setForm({ ...form, size_inventory: { ...form.size_inventory, [size]: e.target.value } })}
                  className="w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-2 py-2 text-[#21101a] font-body-md text-[14px] text-center focus:border-[#9e3462]/50 focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">Images</h2>
          {form.images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-3 items-center">
                <input
                  value={img}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
                <label className={`flex items-center gap-1.5 px-3 py-3 bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg text-[#8c5971] hover:text-[#21101a] hover:bg-[#f8dde9] transition-colors cursor-pointer whitespace-nowrap font-label-md text-[12px] flex-shrink-0 ${uploadingIdx === idx ? "opacity-60 pointer-events-none" : ""}`}>
                  {uploadingIdx === idx ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span className="hidden sm:inline">{uploadingIdx === idx ? "..." : "Upload"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(idx, e)} disabled={uploadingIdx !== null} />
                </label>
                {idx === form.images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                    className="px-3 py-3 bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg text-[#8c5971] hover:text-[#21101a] hover:bg-[#f8dde9] transition-colors flex-shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              {img && (
                <img src={img} alt={`Image ${idx + 1}`} className="h-16 w-auto rounded-lg border border-[#eec7dd] object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* Active toggle */}
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
