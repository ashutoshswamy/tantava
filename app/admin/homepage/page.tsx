"use client";

import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { supabase, type StoreSettings } from "@/lib/supabase";
import { validateImageFile } from "@/lib/image-validation";

function storagePathFromUrl(url: string): string | null {
  const marker = "/product-images/";
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export default function HomepageSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    hero_image: "" as string | null,
    sale_ticker_text: "",
    sale_ticker_enabled: true,
    testimonials_enabled: true,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setForm({
          hero_image: data.hero_image || "",
          sale_ticker_text: data.sale_ticker_text || "The Sale Is On",
          sale_ticker_enabled: data.sale_ticker_enabled ?? true,
          testimonials_enabled: data.testimonials_enabled ?? true,
        });
        setLoading(false);
      });
  }, []);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validationError = await validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError("");

    const urlRes = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name }),
    });

    if (!urlRes.ok) {
      const data = await urlRes.json();
      setError(data.error || "Failed to prepare upload");
      setUploading(false);
      return;
    }

    const { path, token, publicUrl } = await urlRes.json();
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .uploadToSignedUrl(path, token, file);

    if (uploadError) {
      setError(uploadError.message || "Failed to upload image");
      setUploading(false);
      return;
    }

    const oldPath = form.hero_image ? storagePathFromUrl(form.hero_image) : null;
    if (oldPath) {
      await fetch("/api/upload-url", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: oldPath }),
      });
    }

    setForm((f) => ({ ...f, hero_image: publicUrl }));
    setUploading(false);
  };

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
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#fbf0da] rounded-xl text-[#930500]">
          <ImageIcon size={20} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Homepage</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">Hero image, sale ticker, and testimonials section</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-3">
          <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block">Homepage Hero Image</label>
          <p className="text-[12px] text-[#8c6f52] -mt-1">
            Recommended size: 1920×1080px or larger, landscape. Image fills the full-width hero banner and is
            cropped to fit, so keep the main subject centered.
          </p>
          <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden bg-[#fbf0da] border border-[#dcc9a0]/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.hero_image || "/hero.png"} alt="Hero preview" className="w-full h-full object-cover" />
          </div>
          <label className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl font-medium text-[13px] text-[#2b0e0a] cursor-pointer hover:border-[#930500]/50 transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Change Image"}
            <input type="file" accept="image/*" onChange={handleHeroImageUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-medium text-[#2b0e0a]">Sale Ticker Strip</p>
              <p className="text-[12px] text-[#8c6f52] mt-0.5">The scrolling banner shown at the top of the homepage</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.sale_ticker_enabled}
              onClick={() => setForm({ ...form, sale_ticker_enabled: !form.sale_ticker_enabled })}
              className={`relative w-12 h-7 rounded-full shrink-0 transition-colors ${
                form.sale_ticker_enabled ? "bg-[#930500]" : "bg-[#dcc9a0]/50"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  form.sale_ticker_enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <input
            type="text"
            value={form.sale_ticker_text}
            onChange={(e) => setForm({ ...form, sale_ticker_text: e.target.value })}
            className="w-full bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors"
            placeholder="e.g. The Sale Is On"
          />
        </div>

        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-[#2b0e0a]">Homepage Testimonials</p>
            <p className="text-[12px] text-[#8c6f52] mt-0.5">Show the customer testimonials section on the homepage</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.testimonials_enabled}
            onClick={() => setForm({ ...form, testimonials_enabled: !form.testimonials_enabled })}
            className={`relative w-12 h-7 rounded-full shrink-0 transition-colors ${
              form.testimonials_enabled ? "bg-[#930500]" : "bg-[#dcc9a0]/50"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                form.testimonials_enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3.5 px-8 bg-[#930500] text-white rounded-xl font-medium text-[14px] hover:bg-[#8c0500] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
