import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { sendOrderConfirmationEmail } from "@/lib/email";
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
  if (productsError) return NextResponse.json({ error: productsError.message }, { status: 500 });

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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

  // Send order confirmation email — internally best-effort, never throws
  await sendOrderConfirmationEmail({
    to: orderData.user_email,
    orderId: data.id,
    items: verifiedItems,
    total: recomputedTotal,
  });

  // Fire Shiprocket order — non-blocking, failure doesn't break checkout
  try {
    const addr = orderData.shipping_address;
    const srResult = await createShiprocketOrder({
      orderId: data.id,
      orderDate: new Date().toISOString().slice(0, 10),
      customerName: addr.name || orderData.user_name || "Customer",
      customerPhone: addr.phone,
      customerEmail: orderData.user_email,
      address: [addr.line1, addr.line2].filter(Boolean).join(", "),
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      items: verifiedItems.map((i) => ({
        name: i.name,
        sku: i.product_id,
        units: i.quantity,
        selling_price: Math.round(i.price / 100), // paise → rupees
      })),
      subtotal: Math.round(recomputedTotal / 100),
    });

    await supabase
      .from("orders")
      .update({
        shiprocket_order_id: srResult.shiprocket_order_id,
        shiprocket_shipment_id: srResult.shipment_id,
        shiprocket_awb_code: srResult.awb_code ?? null,
        shiprocket_status: srResult.status ?? null,
        shiprocket_synced_at: new Date().toISOString(),
      })
      .eq("id", data.id);
  } catch (err) {
    console.error("[Shiprocket] order creation failed:", err);
  }

  return NextResponse.json({ success: true, orderId: data.id });
}
