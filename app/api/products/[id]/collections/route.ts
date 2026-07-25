import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateCollectionIds, ValidationError } from "@/lib/api-utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("product_collections")
    .select("collection_id")
    .eq("product_id", id);
  if (error) return apiError("products.[id].collections.GET", error);
  return NextResponse.json(data.map((r) => r.collection_id));
}

// Replaces the full set of collections a product belongs to.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let collectionIds: string[];
  try {
    collectionIds = validateCollectionIds(rawBody);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { error: deleteError } = await supabase.from("product_collections").delete().eq("product_id", id);
  if (deleteError) return apiError("products.[id].collections.PUT", deleteError);

  if (collectionIds.length > 0) {
    const { error: insertError } = await supabase
      .from("product_collections")
      .insert(collectionIds.map((collection_id) => ({ product_id: id, collection_id })));
    if (insertError) return apiError("products.[id].collections.PUT", insertError);
  }

  return NextResponse.json({ success: true });
}
