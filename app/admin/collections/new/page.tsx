"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

const inputCls = "w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] placeholder:text-[#d9afc0] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors";

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
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/collections" className="text-[#8c5971] hover:text-[#21101a] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-headline-lg text-[28px] text-[#21101a]">New Collection</h1>
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
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputCls}
              placeholder="e.g. Bridal Collection"
            />
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputCls}
              placeholder="e.g. bridal-collection"
            />
            <p className="text-[#d9afc0] text-[11px] mt-1">Used in the URL: /collections/{form.slug || "..."}</p>
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="A short description of this collection..."
            />
          </div>

          <div>
            <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Cover Image</label>
            <div className="flex gap-3">
              <input
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className={inputCls}
                placeholder="https://... or upload below"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">Sort Order</label>
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className={inputCls}
                placeholder="0"
              />
              <p className="text-[#d9afc0] text-[11px] mt-1">Lower numbers appear first</p>
            </div>
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
            ) : "Create Collection"}
          </button>
          <Link
            href="/admin/collections"
            className="px-6 py-4 border border-[#d9afc0] text-center text-[#8c5971] rounded-lg hover:border-[#9e3462]/40 hover:text-[#21101a] transition-colors font-label-md text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
