"use client";

import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Upload, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase, type StoreSettings } from "@/lib/supabase";
import { validateImageFile } from "@/lib/image-validation";
import { isValidHex } from "@/lib/theme-color";

const DEFAULT_TICKER_COLOR = "#930500";
const DEFAULT_TICKER_TEXT_COLOR = "#ffffff";

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
    hero_images: [] as string[],
    sale_ticker_text: "",
    sale_ticker_enabled: true,
    sale_ticker_color: DEFAULT_TICKER_COLOR,
    sale_ticker_text_color: DEFAULT_TICKER_TEXT_COLOR,
    testimonials_enabled: true,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setForm({
          hero_images: data.hero_images?.length ? data.hero_images : data.hero_image ? [data.hero_image] : [],
          sale_ticker_text: data.sale_ticker_text || "The Sale Is On",
          sale_ticker_enabled: data.sale_ticker_enabled ?? true,
          sale_ticker_color: data.sale_ticker_color || DEFAULT_TICKER_COLOR,
          sale_ticker_text_color: data.sale_ticker_text_color || DEFAULT_TICKER_TEXT_COLOR,
          testimonials_enabled: data.testimonials_enabled ?? true,
        });
        setLoading(false);
      });
  }, []);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    for (const file of files) {
      const validationError = await validateImageFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

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

      setForm((f) => ({ ...f, hero_images: [...f.hero_images, publicUrl] }));
    }

    setUploading(false);
  };

  const handleHeroImageDelete = async (idx: number) => {
    const url = form.hero_images[idx];
    const path = url ? storagePathFromUrl(url) : null;
    if (path) {
      await fetch("/api/upload-url", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    }
    setForm((f) => ({ ...f, hero_images: f.hero_images.filter((_, i) => i !== idx) }));
  };

  const moveHeroImage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    setForm((f) => {
      if (target < 0 || target >= f.hero_images.length) return f;
      const next = [...f.hero_images];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...f, hero_images: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidHex(form.sale_ticker_color)) {
      setError("Enter a valid hex color for the sale ticker, e.g. #930500");
      return;
    }
    if (!isValidHex(form.sale_ticker_text_color)) {
      setError("Enter a valid hex color for the sale ticker text, e.g. #ffffff");
      return;
    }
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
          <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block">Homepage Hero Images</label>
          <p className="text-[12px] text-[#8c6f52] -mt-1">
            Recommended size: 1920×1080px or larger, landscape. Add multiple images to auto-scroll through them;
            one image shows statically. Use the arrows to set the scroll order.
          </p>

          {form.hero_images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.hero_images.map((url, idx) => (
                <div key={url + idx} className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#fbf0da] border border-[#dcc9a0]/40 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">
                    {idx + 1}
                  </span>
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveHeroImage(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 bg-white/90 rounded-md text-[#2b0e0a] hover:bg-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHeroImage(idx, 1)}
                      disabled={idx === form.hero_images.length - 1}
                      className="p-1 bg-white/90 rounded-md text-[#2b0e0a] hover:bg-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHeroImageDelete(idx)}
                      className="p-1 bg-white/90 rounded-md text-red-500 hover:bg-white transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {form.hero_images.length === 0 && (
            <div className="w-full aspect-[16/7] rounded-xl overflow-hidden bg-[#fbf0da] border border-[#dcc9a0]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero.png" alt="Hero preview" className="w-full h-full object-cover object-top" />
            </div>
          )}

          <label className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl font-medium text-[13px] text-[#2b0e0a] cursor-pointer hover:border-[#930500]/50 transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Add Images"}
            <input type="file" accept="image/*" multiple onChange={handleHeroImageUpload} disabled={uploading} className="hidden" />
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
          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block mb-2">Strip Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={isValidHex(form.sale_ticker_color) ? form.sale_ticker_color : DEFAULT_TICKER_COLOR}
                onChange={(e) => setForm({ ...form, sale_ticker_color: e.target.value })}
                className="w-12 h-12 rounded-lg border border-[#dcc9a0]/40 cursor-pointer bg-transparent p-0.5"
                aria-label="Pick sale ticker color"
              />
              <input
                type="text"
                value={form.sale_ticker_color}
                onChange={(e) => setForm({ ...form, sale_ticker_color: e.target.value.trim() })}
                placeholder={DEFAULT_TICKER_COLOR}
                spellCheck={false}
                className="flex-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] font-mono text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block mb-2">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={isValidHex(form.sale_ticker_text_color) ? form.sale_ticker_text_color : DEFAULT_TICKER_TEXT_COLOR}
                onChange={(e) => setForm({ ...form, sale_ticker_text_color: e.target.value })}
                className="w-12 h-12 rounded-lg border border-[#dcc9a0]/40 cursor-pointer bg-transparent p-0.5"
                aria-label="Pick sale ticker text color"
              />
              <input
                type="text"
                value={form.sale_ticker_text_color}
                onChange={(e) => setForm({ ...form, sale_ticker_text_color: e.target.value.trim() })}
                placeholder={DEFAULT_TICKER_TEXT_COLOR}
                spellCheck={false}
                className="flex-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] font-mono text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors"
              />
            </div>
          </div>
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
