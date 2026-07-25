import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateIdArray, ValidationError } from "@/lib/api-utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", id);
  if (error) return apiError("products.[id].categories.GET", error);
  return NextResponse.json(data.map((r) => r.category_id));
}

// Replaces the full set of categories a product belongs to.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let categoryIds: string[];
  try {
    categoryIds = validateIdArray(rawBody, "category_ids");
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { error: deleteError } = await supabase.from("product_categories").delete().eq("product_id", id);
  if (deleteError) return apiError("products.[id].categories.PUT", deleteError);

  if (categoryIds.length > 0) {
    const { error: insertError } = await supabase
      .from("product_categories")
      .insert(categoryIds.map((category_id) => ({ product_id: id, category_id })));
    if (insertError) return apiError("products.[id].categories.PUT", insertError);
  }

  return NextResponse.json({ success: true });
}
