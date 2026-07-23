import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { findActiveCoupon } from "@/lib/coupons-server";
import { calcDiscount } from "@/lib/discount";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowed = await checkRateLimit(userId, "coupon-validate", 20, 600); // 20 per 10 min
  if (!allowed) return NextResponse.json({ error: "Too many attempts, try again later" }, { status: 429 });

  const { code, subtotal } = await req.json();
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }
  if (typeof subtotal !== "number" || subtotal <= 0) {
    return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const coupon = await findActiveCoupon(supabase, code);
  if (!coupon) return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 });

  const discount_amount = calcDiscount(subtotal, coupon.discount_type, coupon.discount_value);
  return NextResponse.json({
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    discount_amount,
  });
}
