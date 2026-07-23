import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateCouponInput, ValidationError } from "@/lib/api-utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let body: Record<string, unknown>;
  try {
    body = validateCouponInput(rawBody, true);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { data, error } = await supabase
    .from("coupons")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return apiError("coupons.[id].PUT", error);
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabase();

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return apiError("coupons.[id].DELETE", error);
  return NextResponse.json({ success: true });
}
