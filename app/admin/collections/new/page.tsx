"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

const inputCls = "w-full bg-[#fbe9e9] border border-[#dbb0b0]/40 rounded-xl px-4 py-3 text-[13px] text-[#200a0c] placeholder:text-[#dbb0b0] focus:border-[#c8102e]/60 focus:outline-none transition-colors";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewCollectionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: "",
    sort_order: "0",
    is_active: true,
  });

  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, name: val, slug: toSlug(val) }));
  };

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
      slug: form.slug || toSlug(form.name),
      description: form.description || null,
      cover_image: form.cover_image || null,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/collections");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create collection");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#200a0c]">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/collections" className="p-2 text-[#8c4f52] hover:text-[#200a0c] hover:bg-[#fbe9e9] rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-[#200a0c] tracking-tight">New Collection</h1>
          <p className="text-[#8c4f52] text-[13px] mt-0.5">Create a new collection to group products</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#f0c7c7] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider">Collection Details</h2>

          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputCls}
              placeholder="e.g. Bridal Collection"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputCls}
              placeholder="e.g. bridal-collection"
            />
            <p className="text-[#dbb0b0] text-[11px] mt-1">Used in the URL: /collections/{form.slug || "..."}</p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="A short description of this collection..."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Cover Image</label>
            <div className="flex flex-wrap gap-2.5">
              <input
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className={`${inputCls} min-w-[140px] flex-1`}
                placeholder="https://... or upload below"
              />
              <label className={`flex items-center gap-2 px-4 py-3 bg-[#fbe9e9] border border-[#dbb0b0]/40 rounded-xl text-[#8c4f52] hover:text-[#200a0c] hover:bg-[#f6d9d9] transition-colors cursor-pointer whitespace-nowrap text-[13px] flex-shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.cover_image && (
              <div className="mt-3">
                <img src={form.cover_image} alt="Cover preview" className="h-24 w-auto rounded-xl border border-[#f0c7c7] object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#8c4f52] uppercase tracking-wider mb-1.5 block">Sort Order</label>
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className={inputCls}
                placeholder="0"
              />
              <p className="text-[#dbb0b0] text-[11px] mt-1">Lower numbers appear first</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#f0c7c7] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#200a0c] font-medium text-[14px]">Active / Visible on site</p>
            <p className="text-[#8c4f52] text-[12px] mt-0.5">Toggle to hide from public pages</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              form.is_active ? "bg-[#c8102e]" : "bg-[#f0c7c7]"
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
            className="flex-1 py-3.5 px-8 bg-[#c8102e] text-white rounded-xl font-medium text-[14px] hover:bg-[#96182a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : "Create Collection"}
          </button>
          <Link
            href="/admin/collections"
            className="px-8 py-3.5 border border-[#dbb0b0] text-center text-[#8c4f52] rounded-xl hover:border-[#c8102e]/40 hover:text-[#200a0c] transition-colors font-medium text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
