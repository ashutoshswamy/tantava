import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";

const BASE_URL = "https://thetantava.in";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/return-policy", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabase();

  const [{ data: products }, { data: collections }] = await Promise.all([
    supabase.from("products").select("id, updated_at").eq("is_active", true),
    supabase.from("collections").select("slug, updated_at").eq("is_active", true),
  ]);

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...(products ?? []).map((p) => ({
      url: `${BASE_URL}/shop/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(collections ?? []).map((c) => ({
      url: `${BASE_URL}/collections/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
