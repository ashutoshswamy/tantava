import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { hasCompletedOrder } from "@/lib/coupons-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ eligible: false, percent: 0 });

  const supabase = createServerSupabase();
  const { data: settings } = await supabase
    .from("store_settings")
    .select("first_purchase_discount_percent")
    .eq("id", true)
    .single();

  const percent = settings?.first_purchase_discount_percent ?? 0;
  if (percent <= 0) return NextResponse.json({ eligible: false, percent: 0 });

  const purchased = await hasCompletedOrder(supabase, userId);
  return NextResponse.json({ eligible: !purchased, percent });
}
