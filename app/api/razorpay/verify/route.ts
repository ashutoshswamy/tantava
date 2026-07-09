import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { checkRateLimit } from "@/lib/rate-limit";

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
      items: orderData.items.map((i: { name: string; product_id: string; quantity: number; price: number }) => ({
        name: i.name,
        sku: i.product_id,
        units: i.quantity,
        selling_price: Math.round(i.price / 100), // paise → rupees
      })),
      subtotal: Math.round(orderData.total / 100),
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
