import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin, requireAdmin } from "@/lib/auth";
import { apiError, validateOrderCreateInput, ValidationError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const admin = await isAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (!admin) {
    query = query.eq("user_id", userId);
  }
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return apiError("orders.GET", error);
  return NextResponse.json(data);
}

// Real orders are created via /api/razorpay/verify after payment is confirmed.
// This endpoint is admin-only (e.g. manual/offline order entry) to prevent
// customers from self-issuing "paid" orders with arbitrary items/totals.
export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let order: ReturnType<typeof validateOrderCreateInput>;
  try {
    order = validateOrderCreateInput(rawBody);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({ ...order, user_id: order.user_id ?? userId })
    .select()
    .single();
  if (error) return apiError("orders.POST", error);
  return NextResponse.json(data, { status: 201 });
}
