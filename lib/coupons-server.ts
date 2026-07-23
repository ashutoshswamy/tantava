import { createServerSupabase } from "./supabase-server";
import type { Coupon } from "./supabase";

export async function findActiveCoupon(
  supabase: ReturnType<typeof createServerSupabase>,
  code: string
): Promise<Coupon | null> {
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code.trim())
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
  return data;
}

export async function hasCompletedOrder(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string
): Promise<boolean> {
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "paid");
  return (count ?? 0) > 0;
}
