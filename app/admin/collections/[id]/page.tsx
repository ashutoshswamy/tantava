"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Collection, Product } from "@/lib/supabase";
import { ArrowLeft, Loader2, Upload, X, ExternalLink } from "lucide-react";

const inputCls = "w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] placeholder:text-[#d9afc0] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors";

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
        <Loader2 size={48} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/collections" className="text-[#8c5971] hover:text-[#21101a] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-headline-lg text-[28px] text-[#21101a]">Edit Collection</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body-md text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-5">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">Collection Details</h2>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputCls}
            />
            <p className="text-[#d9afc0] text-[11px] mt-1">URL: /collections/{form.slug}</p>
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Cover Image</label>
            <div className="flex gap-3">
              <input
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className={inputCls}
                placeholder="https://..."
              />
              <label className={`flex items-center gap-2 px-4 py-3 bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg text-[#8c5971] hover:text-[#21101a] hover:bg-[#f8dde9] transition-colors cursor-pointer whitespace-nowrap font-label-md text-[13px] ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.cover_image && (
              <div className="mt-3">
                <img src={form.cover_image} alt="Cover preview" className="h-24 w-auto rounded-lg border border-[#eec7dd] object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className={inputCls}
            />
            <p className="text-[#d9afc0] text-[11px] mt-1">Lower numbers appear first</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <div>
            <p className="text-[#21101a] font-label-md text-[14px]">Active / Visible on site</p>
            <p className="text-[#8c5971] text-[12px]">Toggle to hide from public pages</p>
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
            href="/admin/collections"
            className="px-6 py-4 border border-[#d9afc0] text-center text-[#8c5971] rounded-lg hover:border-[#9e3462]/40 hover:text-[#21101a] transition-colors font-label-md text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Products in this collection */}
      <div className="mt-8 bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#8c5971] font-label-md text-[13px] uppercase tracking-wider">
            Products in this Collection ({collectionProducts.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="text-[12px] text-[#9e3462] font-label-md hover:text-[#7d1a48] transition-colors"
          >
            {showAddProduct ? "Hide" : "+ Assign Products"}
          </button>
        </div>

        {collectionProducts.length === 0 && !showAddProduct && (
          <p className="text-[#d9afc0] text-[13px]">No products assigned yet. Click "Assign Products" to add some.</p>
        )}

        {collectionProducts.length > 0 && (
          <div className="space-y-2">
            {collectionProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-[#fce8f0]/50 rounded-lg border border-[#eec7dd]/60">
                <div className="flex items-center gap-3 min-w-0">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#eec7dd] flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#eec7dd] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-label-md text-[13px] text-[#21101a] truncate">{p.name}</p>
                    <p className="text-[11px] text-[#8c5971]">₹{(p.price / 100).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 text-[#8c5971] hover:text-[#21101a] hover:bg-white rounded-lg transition-colors"
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
          <div className="mt-4 space-y-2 border-t border-[#eec7dd] pt-4">
            <p className="text-[#8c5971] font-label-md text-[12px] uppercase tracking-wider mb-3">Add Products</p>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {allProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#eec7dd]/60 hover:border-[#eec7dd] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#eec7dd] flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#eec7dd] flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-label-md text-[13px] text-[#21101a] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#8c5971]">{p.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProduct(p)}
                    disabled={addingId === p.id}
                    className="flex-shrink-0 px-3 py-1.5 text-[12px] text-[#9e3462] border border-[#9e3462]/30 rounded-lg hover:bg-[#fce8f0] transition-colors font-label-md disabled:opacity-50 flex items-center gap-1"
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
          <p className="text-[#d9afc0] text-[13px] border-t border-[#eec7dd] pt-4 mt-4">All products are already in this collection.</p>
        )}
      </div>
    </div>
  );
}
