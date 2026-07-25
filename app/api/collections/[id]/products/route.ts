import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";

// Adds a product to this collection without disturbing its other collection memberships.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_id } = await req.json();
  if (typeof product_id !== "string") {
    return NextResponse.json({ error: "product_id must be a string" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("product_collections")
    .upsert({ product_id, collection_id: id }, { onConflict: "product_id,collection_id" });
  if (error) return apiError("collections.[id].products.POST", error);
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_id } = await req.json();
  if (typeof product_id !== "string") {
    return NextResponse.json({ error: "product_id must be a string" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", product_id)
    .eq("collection_id", id);
  if (error) return apiError("collections.[id].products.DELETE", error);
  return NextResponse.json({ success: true });
}
