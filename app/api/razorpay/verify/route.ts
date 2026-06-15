import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...orderData,
      user_id: userId,
      status: "paid",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (orderData.items) {
    for (const item of orderData.items) {
      const { data: prod } = await supabase
        .from("products")
        .select("size_inventory")
        .eq("id", item.product_id)
        .single();
      if (prod && item.size) {
        const inv: Record<string, number> = prod.size_inventory || {};
        const current = inv[item.size] ?? 0;
        const updated = { ...inv, [item.size]: Math.max(0, current - item.quantity) };
        await supabase
          .from("products")
          .update({ size_inventory: updated })
          .eq("id", item.product_id);
      }
    }
  }

  return NextResponse.json({ success: true, orderId: data.id });
}
