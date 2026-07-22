"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const inputCls = "w-full bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sort_order: "0",
    is_active: true,
  });

  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, name: val, slug: toSlug(val) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug || toSlug(form.name),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/categories");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create category");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/categories" className="p-2 text-[#8c6f52] hover:text-[#2b0e0a] hover:bg-[#fbf0da] rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">New Category</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">Create a category so it shows up when adding products</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Category Details</h2>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputCls}
              placeholder="e.g. Sarees"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputCls}
              placeholder="e.g. sarees"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-1.5 block">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className={inputCls}
              placeholder="0"
            />
            <p className="text-[#dcc9a0] text-[11px] mt-1">Lower numbers appear first in the product form dropdown</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6">
          <div>
            <p className="text-[#2b0e0a] font-medium text-[14px]">Active</p>
            <p className="text-[#8c6f52] text-[12px] mt-0.5">Toggle off to hide from the product form dropdown</p>
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
            ) : "Create Category"}
          </button>
          <Link
            href="/admin/categories"
            className="px-8 py-3.5 border border-[#dcc9a0] text-center text-[#8c6f52] rounded-xl hover:border-[#930500]/40 hover:text-[#2b0e0a] transition-colors font-medium text-[14px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
