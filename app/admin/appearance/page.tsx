"use client";

import { useEffect, useState } from "react";
import { Loader2, Palette } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";
import { isValidHex, deriveThemeVars } from "@/lib/theme-color";

const DEFAULT_COLOR = "#930500";

export default function AppearanceSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setColor(data.theme_color || DEFAULT_COLOR);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidHex(color)) {
      setError("Enter a valid hex color, e.g. #930500");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme_color: color }),
    });

    if (res.ok) {
      setSaved(true);
      const vars = deriveThemeVars(color);
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
      setTimeout(() => setSaved(false), 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save settings");
    }
    setSaving(false);
  };

  const handleReset = () => setColor(DEFAULT_COLOR);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  const preview = isValidHex(color) ? deriveThemeVars(color) : null;

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#fbf0da] rounded-xl text-[#930500]">
          <Palette size={20} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Appearance</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">The brand color used across the storefront</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-4">
          <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block">
            Brand Color
          </label>
          <p className="text-[12px] text-[#8c6f52] -mt-2">
            Drives buttons, links, and accents on the public storefront. Type a hex code or use the color picker.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={isValidHex(color) ? color : DEFAULT_COLOR}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded-lg border border-[#dcc9a0]/40 cursor-pointer bg-transparent p-0.5"
              aria-label="Pick brand color"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value.trim())}
              placeholder="#930500"
              spellCheck={false}
              className="flex-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] font-mono text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleReset}
              className="text-[12px] text-[#8c6f52] hover:text-[#930500] transition-colors whitespace-nowrap px-2"
            >
              Reset
            </button>
          </div>

          {preview && (
            <div>
              <p className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider mb-2">Preview</p>
              <div className="flex flex-wrap gap-3">
                <span
                  className="px-5 py-2.5 rounded-lg text-[13px] font-medium"
                  style={{ background: preview["--color-primary"], color: preview["--color-on-primary"] }}
                >
                  Shop the Sale
                </span>
                <span
                  className="px-5 py-2.5 rounded-lg text-[13px] font-medium"
                  style={{ background: preview["--color-primary-container"], color: preview["--color-on-primary-container"] }}
                >
                  Sale Badge
                </span>
              </div>
            </div>
          )}
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
