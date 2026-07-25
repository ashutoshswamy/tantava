"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Collection, type Category } from "@/lib/supabase";
import { validateImageFile } from "@/lib/image-validation";
import { ArrowLeft, Plus, Loader2, Upload, Trash2, ChevronUp, ChevronDown } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function storagePathFromUrl(url: string): string | null {
  const marker = "/product-images/";
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

function filenameFromUrl(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || url);
  } catch {
    return url;
  }
}

type ImageMeta = { name: string; size: number } | null;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const inputCls = "w-full bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [imageMeta, setImageMeta] = useState<ImageMeta[]>([null]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    category: "",
    fabric: "",
    care: "",
    free_delivery: false,
    images: [""],
    size_inventory: { XS: "0", S: "0", M: "10", L: "0", XL: "0", XXL: "0", XXXL: "0" } as Record<string, string>,
    sku: "",
    badge: "",
    is_active: true,
    collection_ids: [] as string[],
  });

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCollections(data); });
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setCategories(data);
        if (data[0]) setForm((f) => ({ ...f, category: f.category || data[0].name }));
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
      discount_price: form.discount_price ? Math.round(parseFloat(form.discount_price) * 100) : null,
      size_inventory: Object.fromEntries(
        SIZES.map((s) => [s, parseInt(form.size_inventory[s] || "0") || 0])
      ),
      images: form.images.filter(Boolean),
      badge: form.badge || null,
      sku: form.sku || null,
      care: form.care || null,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const product = await res.json();
      if (form.collection_ids.length > 0) {
        await fetch(`/api/products/${product.id}/collections`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection_ids: form.collection_ids }),
        });
      }
      router.push("/admin/products");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create product");
    }
    setSaving(false);
  };

  const toggleCollection = (id: string) => {
    setForm((f) => ({
      ...f,
      collection_ids: f.collection_ids.includes(id)
        ? f.collection_ids.filter((c) => c !== id)
        : [...f.collection_ids, id],
    }));
  };

  const updateImage = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm({ ...form, images: imgs });
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= form.images.length) return;
    const imgs = [...form.images];
    [imgs[idx], imgs[target]] = [imgs[target], imgs[idx]];
    setForm({ ...form, images: imgs });
    setImageMeta((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const validationError = await validateImageFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      setUploadingIdx(idx + i);

      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name }),
      });

      if (!urlRes.ok) {
        const data = await urlRes.json();
        setError(data.error || "Failed to prepare upload");
        continue;
      }

      const { path, token, publicUrl } = await urlRes.json();
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        setError(uploadError.message || "Failed to upload image");
        continue;
      }

      if (i === 0) {
        updateImage(idx, publicUrl);
        setImageMeta((prev) => {
          const next = [...prev];
          next[idx] = { name: file.name, size: file.size };
          return next;
        });
      } else {
        setForm((prev) => ({ ...prev, images: [...prev.images, publicUrl] }));
        setImageMeta((prev) => [...prev, { name: file.name, size: file.size }]);
      }
    }
    setUploadingIdx(null);
    e.target.value = "";
  };

  const handleImageDelete = async (idx: number) => {
    const img = form.images[idx];
    const path = img ? storagePathFromUrl(img) : null;

    setDeletingIdx(idx);
    if (path) {
      await fetch("/api/upload-url", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    }
    setDeletingIdx(null);

    if (form.images.length === 1) {
      setForm({ ...form, images: [""] });
      setImageMeta([null]);
    } else {
      setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
      setImageMeta((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="p-2 text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#fbf0da] rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Add New Product</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">Fill in the details below to add a product</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="e.g. Ivory & Gold Handcrafted Lehenga"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="Describe the piece, its craftsmanship, and unique features..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Price (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
                placeholder="e.g. 85000"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Discounted Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discount_price}
                onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                className={inputCls}
                placeholder="leave blank if no discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`${inputCls} appearance-none`}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-[#dcc9a0] text-[11px] mt-1">
                  No categories yet — <Link href="/admin/categories/new" className="underline">create one first</Link>.
                </p>
              )}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Badge</label>
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
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Fabric</label>
              <input
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className={inputCls}
                placeholder="e.g. Banarasi Silk"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className={inputCls}
                placeholder="e.g. SKU-007"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Care Instructions</label>
            <textarea
              rows={2}
              value={form.care}
              onChange={(e) => setForm({ ...form, care: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="e.g. Dry Clean Only. Store in muslin cloth away from direct sunlight."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Collections</label>
            {collections.length === 0 ? (
              <p className="text-[#dcc9a0] text-[12px]">No collections yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => {
                  const selected = form.collection_ids.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCollection(c.id)}
                      className={`px-3 py-2 rounded-xl border text-[12px] font-medium transition-colors ${
                        selected
                          ? "bg-[#930500] border-[#930500] text-white"
                          : "bg-[#fbf0da] border-[#dcc9a0]/40 text-[#8c6f52] hover:text-[#2b0e0a]"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
            <p className="text-[#dcc9a0] text-[11px] mt-1.5">A product can belong to multiple collections.</p>
          </div>
        </div>

        {/* Stock by Size */}
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Stock by Size</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#8c6f52] text-center uppercase">{size}</span>
                <input
                  type="number"
                  min="0"
                  value={form.size_inventory[size]}
                  onChange={(e) => setForm({ ...form, size_inventory: { ...form.size_inventory, [size]: e.target.value } })}
                  className="w-full bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-2 py-2.5 text-[#2b0e0a] text-[13px] text-center focus:border-[#930500]/60 focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Images</h2>
          <p className="text-[11px] text-[#8c6f52] -mt-2">First image is the product cover. Use the arrows to reorder.</p>
          {form.images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    className="px-1.5 py-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-lg text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#f5e7c9] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === form.images.length - 1}
                    className="px-1.5 py-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-lg text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#f5e7c9] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
                <input
                  value={img}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  className={`${inputCls} min-w-[140px] flex-1`}
                  placeholder="https://..."
                />
                <label className={`flex items-center gap-1.5 px-3 py-3 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#f5e7c9] transition-colors cursor-pointer whitespace-nowrap text-[12px] flex-shrink-0 ${uploadingIdx === idx ? "opacity-60 pointer-events-none" : ""}`}>
                  {uploadingIdx === idx ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span className="hidden sm:inline">{uploadingIdx === idx ? "..." : "Upload"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(idx, e)} disabled={uploadingIdx !== null} />
                </label>
                <button
                  type="button"
                  onClick={() => handleImageDelete(idx)}
                  disabled={deletingIdx !== null}
                  className="px-3 py-3 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl text-[#8c6f52] hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0 disabled:opacity-60"
                >
                  {deletingIdx === idx ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
                {idx === form.images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => { setForm({ ...form, images: [...form.images, ""] }); setImageMeta((prev) => [...prev, null]); }}
                    className="px-3 py-3 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#f5e7c9] transition-colors flex-shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              {img && (
                <div className="flex items-center gap-2">
                  <img src={img} alt={`Image ${idx + 1}`} className="h-16 w-auto rounded-xl border border-[#efdcb0] object-cover" />
                  <span className="text-[11px] text-[#8c6f52] truncate max-w-[220px]">
                    {imageMeta[idx] ? imageMeta[idx]!.name : filenameFromUrl(img)}
                    {imageMeta[idx] && ` (${formatBytes(imageMeta[idx]!.size)})`}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between gap-4 bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#2b0e0a] font-medium text-[14px]">Active / Visible in shop</p>
            <p className="text-[#8c6f52] text-[12px] mt-0.5">Toggle to hide from customers</p>
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

        {/* Free delivery toggle */}
        <div className="flex items-center justify-between gap-4 bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#2b0e0a] font-medium text-[14px]">Free Delivery</p>
            <p className="text-[#8c6f52] text-[12px] mt-0.5">Show a free delivery badge on this product</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, free_delivery: !form.free_delivery })}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              form.free_delivery ? "bg-[#930500]" : "bg-[#efdcb0]"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                form.free_delivery ? "left-7" : "left-1"
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
            ) : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            className="px-8 py-3.5 border border-[#dcc9a0] text-center text-[#8c6f52] rounded-xl hover:border-[#930500]/40 hover:text-[#2b0e0a] transition-colors font-medium text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
