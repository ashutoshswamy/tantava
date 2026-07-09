import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/rate-limit";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowed = await checkRateLimit(userId, "razorpay-create-order", 10, 600); // 10 per 10 min
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  const { amount, currency = "INR", notes } = await req.json();

  if (!amount || typeof amount !== "number" || amount < 100 || amount > 100_000_000) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (currency !== "INR") {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  const order = await razorpay.orders.create({
    amount,
    currency,
    notes,
    receipt: `receipt_${Date.now()}`,
  });

  return NextResponse.json(order);
}
