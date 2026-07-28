import { cacheLife, cacheTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import type { StoreSettings } from "@/lib/supabase";

// Settings (theme, hero, etc.) are read from the root layout on every page, so
// this must be part of the static build-time shell, not a remote cache lookup
// (which needs a network round-trip and isn't available during `next build`,
// causing prerender to hang and time out). Busted via revalidateTag("settings").
export async function getSettings(): Promise<StoreSettings> {
  "use cache";
  cacheTag("settings");
  cacheLife({ expire: 300 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", true).single();
  if (error) throw error;
  return data;
}
