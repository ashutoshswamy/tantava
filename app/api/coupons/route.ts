import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateCouponInput, ValidationError } from "@/lib/api-utils";

export async function GET() {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  if (error) return apiError("coupons.GET", error);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let body: Record<string, unknown>;
  try {
    body = validateCouponInput(rawBody, false);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { data, error } = await supabase.from("coupons").insert(body).select().single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return apiError("coupons.POST", error);
  }
  return NextResponse.json(data, { status: 201 });
}
