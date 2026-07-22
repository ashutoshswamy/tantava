"use client";

import { useEffect, useState } from "react";
import { Loader2, Palette } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";
import { isValidHex, deriveThemeVars, DEFAULT_THEME_SEEDS, type ThemeSeeds } from "@/lib/theme-color";

const FIELDS: { key: keyof ThemeSeeds; label: string; hint: string }[] = [
  { key: "background", label: "Background", hint: "Page background and surfaces (cards, containers)" },
  { key: "primary", label: "Primary / Brand", hint: "Buttons, links, prices, active states" },
  { key: "secondary", label: "Secondary / Accent", hint: "Secondary actions and accent details" },
];

export default function AppearanceSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [seeds, setSeeds] = useState<ThemeSeeds>(DEFAULT_THEME_SEEDS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setSeeds({
          background: data.theme_background || DEFAULT_THEME_SEEDS.background,
          primary: data.theme_primary || DEFAULT_THEME_SEEDS.primary,
          secondary: data.theme_secondary || DEFAULT_THEME_SEEDS.secondary,
        });
        setLoading(false);
      });
  }, []);

  const setSeed = (key: keyof ThemeSeeds, value: string) => setSeeds((s) => ({ ...s, [key]: value }));

  const allValid = (Object.keys(seeds) as (keyof ThemeSeeds)[]).every((k) => isValidHex(seeds[k]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      setError("Enter a valid hex color for every field, e.g. #930500");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme_background: seeds.background,
        theme_primary: seeds.primary,
        theme_secondary: seeds.secondary,
      }),
    });

    if (res.ok) {
      setSaved(true);
      const vars = deriveThemeVars(seeds);
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

  const handleReset = () => setSeeds(DEFAULT_THEME_SEEDS);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  const preview = allValid ? deriveThemeVars(seeds) : null;

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#fbf0da] rounded-xl text-[#930500]">
          <Palette size={20} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Appearance</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">The three colors the whole storefront palette is built from</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-5 sm:p-6 space-y-5">
          {FIELDS.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider block">{label}</label>
              <p className="text-[12px] text-[#8c6f52] mb-2">{hint}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={isValidHex(seeds[key]) ? seeds[key] : DEFAULT_THEME_SEEDS[key]}
                  onChange={(e) => setSeed(key, e.target.value)}
                  className="w-12 h-12 rounded-lg border border-[#dcc9a0]/40 cursor-pointer bg-transparent p-0.5"
                  aria-label={`Pick ${label.toLowerCase()} color`}
                />
                <input
                  type="text"
                  value={seeds[key]}
                  onChange={(e) => setSeed(key, e.target.value.trim())}
                  placeholder={DEFAULT_THEME_SEEDS[key]}
                  spellCheck={false}
                  className="flex-1 bg-[#fbf0da] border border-[#dcc9a0]/40 rounded-xl px-4 py-3 text-[13px] font-mono text-[#2b0e0a] placeholder:text-[#dcc9a0] focus:border-[#930500]/60 focus:outline-none transition-colors"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleReset}
            className="text-[12px] text-[#8c6f52] hover:text-[#930500] transition-colors"
          >
            Reset to defaults
          </button>
        </div>

        {preview && (
          <div className="rounded-2xl border border-[#dcc9a0]/40 p-5 sm:p-6 space-y-4" style={{ background: preview["--color-background"] }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: preview["--color-on-surface-variant"] }}>
              Preview
            </p>
            <div className="flex flex-wrap gap-3">
              <span
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium"
                style={{ background: preview["--color-primary"], color: preview["--color-on-primary"] }}
              >
                Shop the Sale
              </span>
              <span
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium border"
                style={{
                  background: preview["--color-secondary-container"],
                  color: preview["--color-on-secondary-container"],
                  borderColor: preview["--color-outline-variant"],
                }}
              >
                Secondary Action
              </span>
              <span
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium"
                style={{ background: preview["--color-surface-container-high"], color: preview["--color-on-surface"] }}
              >
                Card / Container
              </span>
            </div>
            <p className="text-[13px]" style={{ color: preview["--color-on-surface"] }}>
              Body text on the background above.
            </p>
          </div>
        )}

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
