"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Collection, Product } from "@/lib/supabase";
import { ArrowLeft, Loader2, Upload, X, ExternalLink } from "lucide-react";

const inputCls = "w-full bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl px-4 py-3 text-[13px] text-[#1a0914] placeholder:text-[#dbb6ca] focus:border-[#c2477f]/60 focus:outline-none transition-colors";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: "",
    sort_order: "0",
    is_active: true,
  });

  useEffect(() => {
    const load = async () => {
      const [colRes, allProdsRes] = await Promise.all([
        fetch(`/api/collections/${id}`),
        fetch("/api/products?active=all"),
      ]);

      const col: Collection = await colRes.json();
      const allProds: Product[] = await allProdsRes.json();

      setForm({
        name: col.name,
        slug: col.slug,
        description: col.description || "",
        cover_image: col.cover_image || "",
        sort_order: String(col.sort_order),
        is_active: col.is_active,
      });

      const inCol = allProds.filter((p) => p.collection_id === id);
      const notInCol = allProds.filter((p) => p.collection_id !== id);

      setCollectionProducts(inCol);
      setAllProducts(notInCol);
      setLoading(false);
    };

    load();
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, cover_image: url }));
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      cover_image: form.cover_image || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const res = await fetch(`/api/collections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/collections");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update collection");
    }
    setSaving(false);
  };

  const removeProduct = async (product: Product) => {
    setRemovingId(product.id);
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection_id: null }),
    });
    if (res.ok) {
      setCollectionProducts((prev) => prev.filter((p) => p.id !== product.id));
      setAllProducts((prev) => [...prev, { ...product, collection_id: null }]);
    }
    setRemovingId(null);
  };

  const addProduct = async (product: Product) => {
    setAddingId(product.id);
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection_id: id }),
    });
    if (res.ok) {
      setAllProducts((prev) => prev.filter((p) => p.id !== product.id));
      setCollectionProducts((prev) => [...prev, { ...product, collection_id: id }]);
    }
    setAddingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#c2477f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/collections" className="p-2 text-[#8c5971] hover:text-[#1a0914] hover:bg-[#fdeaf2] rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Edit Collection</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">Update collection details and manage products</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Collection Details</h2>

          <div>
            <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputCls}
            />
            <p className="text-[#dbb6ca] text-[11px] mt-1">URL: /collections/{form.slug}</p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Cover Image</label>
            <div className="flex gap-2.5">
              <input
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className={inputCls}
                placeholder="https://..."
              />
              <label className={`flex items-center gap-2 px-4 py-3 bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl text-[#8c5971] hover:text-[#1a0914] hover:bg-[#f8dde9] transition-colors cursor-pointer whitespace-nowrap text-[13px] flex-shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.cover_image && (
              <div className="mt-3">
                <img src={form.cover_image} alt="Cover preview" className="h-24 w-auto rounded-xl border border-[#f2cfe3] object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className={inputCls}
            />
            <p className="text-[#dbb6ca] text-[11px] mt-1">Lower numbers appear first</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#1a0914] font-medium text-[14px]">Active / Visible on site</p>
            <p className="text-[#8c5971] text-[12px] mt-0.5">Toggle to hide from public pages</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              form.is_active ? "bg-[#c2477f]" : "bg-[#f2cfe3]"
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
            className="flex-1 py-3.5 px-8 bg-[#c2477f] text-white rounded-xl font-medium text-[14px] hover:bg-[#962259] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </button>
          <Link
            href="/admin/collections"
            className="px-8 py-3.5 border border-[#dbb6ca] text-center text-[#8c5971] rounded-xl hover:border-[#c2477f]/40 hover:text-[#1a0914] transition-colors font-medium text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Products in this collection */}
      <div className="mt-6 bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">
            Products in this Collection ({collectionProducts.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="text-[12px] text-[#c2477f] font-medium hover:text-[#962259] transition-colors"
          >
            {showAddProduct ? "Hide" : "+ Assign Products"}
          </button>
        </div>

        {collectionProducts.length === 0 && !showAddProduct && (
          <p className="text-[#dbb6ca] text-[13px]">No products assigned yet. Click "Assign Products" to add some.</p>
        )}

        {collectionProducts.length > 0 && (
          <div className="space-y-2">
            {collectionProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-[#fdeaf2]/50 rounded-xl border border-[#f2cfe3]">
                <div className="flex items-center gap-3 min-w-0">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#f2cfe3] flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#f2cfe3] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-[13px] text-[#1a0914] truncate">{p.name}</p>
                    <p className="text-[11px] text-[#8c5971]">₹{(p.price / 100).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 text-[#8c5971] hover:text-[#1a0914] hover:bg-white rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeProduct(p)}
                    disabled={removingId === p.id}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {removingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddProduct && allProducts.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-[#f2cfe3] pt-4">
            <p className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-3">Add Products</p>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {allProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#f2cfe3] hover:border-[#dbb6ca] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#f2cfe3] flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#f2cfe3] flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[13px] text-[#1a0914] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#8c5971]">{p.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProduct(p)}
                    disabled={addingId === p.id}
                    className="flex-shrink-0 px-3 py-1.5 text-[12px] text-[#c2477f] border border-[#c2477f]/30 rounded-xl hover:bg-[#fdeaf2] transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
                  >
                    {addingId === p.id ? <Loader2 size={12} className="animate-spin" /> : null}
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAddProduct && allProducts.length === 0 && (
          <p className="text-[#dbb6ca] text-[13px] border-t border-[#f2cfe3] pt-4 mt-4">All products are already in this collection.</p>
        )}
      </div>
    </div>
  );
}
