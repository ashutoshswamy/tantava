"use client";

import { useEffect } from "react";
import type { StoreSettings } from "@/lib/supabase";
import { deriveThemeVars } from "@/lib/theme-color";

export default function ThemeInjector() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        if (!data.theme_color) return;
        const vars = deriveThemeVars(data.theme_color);
        for (const [key, value] of Object.entries(vars)) {
          document.documentElement.style.setProperty(key, value);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
