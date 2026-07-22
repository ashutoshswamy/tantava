import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { apiError } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowed = await checkRateLimit(userId, "razorpay-verify", 10, 600); // 10 per 10 min
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

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

  const signatureBuf = Buffer.from(razorpay_signature ?? "", "hex");
  const expectedBuf = Buffer.from(expectedSignature, "hex");
  const validSignature =
    signatureBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(signatureBuf, expectedBuf);

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const items = orderData?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // Re-price every item server-side — never trust client-supplied price/total.
  const productIds = [...new Set(items.map((i: { product_id: string }) => i.product_id))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, images, size_inventory")
    .in("id", productIds);
  if (productsError) return apiError("razorpay.verify.products", productsError);

  const productById = new Map((products ?? []).map((p) => [p.id, p]));
  let recomputedTotal = 0;
  const verifiedItems = [];
  for (const item of items) {
    const prod = productById.get(item.product_id);
    if (!prod || !item.quantity || item.quantity <= 0) {
      return NextResponse.json({ error: "Invalid item in order" }, { status: 400 });
    }
    recomputedTotal += prod.price * item.quantity;
    verifiedItems.push({
      product_id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: item.quantity,
      size: item.size,
      image: prod.images?.[0] ?? item.image,
    });
  }

  // Cross-check against what was actually paid on Razorpay's side.
  const paidOrder = await razorpay.orders.fetch(razorpay_order_id);
  if (paidOrder.amount !== recomputedTotal) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_email: orderData.user_email,
      user_name: orderData.user_name,
      shipping_address: orderData.shipping_address,
      items: verifiedItems,
      subtotal: recomputedTotal,
      total: recomputedTotal,
      user_id: userId,
      status: "paid",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
    .select()
    .single();

  if (error) return apiError("razorpay.verify.POST", error);

  for (const item of verifiedItems) {
    const prod = productById.get(item.product_id)!;
    if (item.size) {
      const inv: Record<string, number> = prod.size_inventory || {};
      const current = inv[item.size] ?? 0;
      const updated = { ...inv, [item.size]: Math.max(0, current - item.quantity) };
      await supabase
        .from("products")
        .update({ size_inventory: updated })
        .eq("id", item.product_id);
    }
  }

  return NextResponse.json({ success: true, orderId: data.id });
}
