"use client";

import { useEffect } from "react";
import type { StoreSettings } from "@/lib/supabase";
import { deriveThemeVars, DEFAULT_THEME_SEEDS } from "@/lib/theme-color";

export default function ThemeInjector() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        if (!data.theme_background && !data.theme_primary && !data.theme_secondary) return;

        const vars = deriveThemeVars({
          background: data.theme_background || DEFAULT_THEME_SEEDS.background,
          primary: data.theme_primary || DEFAULT_THEME_SEEDS.primary,
          secondary: data.theme_secondary || DEFAULT_THEME_SEEDS.secondary,
        });
        for (const [key, value] of Object.entries(vars)) {
          document.documentElement.style.setProperty(key, value);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
