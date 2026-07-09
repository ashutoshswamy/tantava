import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// ponytail: non-atomic read-then-write increment, fine for low-traffic abuse
// throttling; move to a Postgres RPC increment if concurrent hits on the same
// key become common enough to matter.
export async function checkRateLimit(
  identifier: string,
  route: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const supabase = createServerSupabase();
  const windowId = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `${route}:${identifier}:${windowId}`;

  if (Math.random() < 0.05) {
    await supabase.from("rate_limits").delete().lt("expires_at", new Date().toISOString());
  }

  const { data: existing } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("key", key)
    .maybeSingle();

  if (existing) {
    if (existing.count >= limit) return false;
    await supabase.from("rate_limits").update({ count: existing.count + 1 }).eq("key", key);
    return true;
  }

  const expiresAt = new Date((windowId + 1) * windowSeconds * 1000).toISOString();
  await supabase.from("rate_limits").insert({ key, count: 1, expires_at: expiresAt });
  return true;
}
