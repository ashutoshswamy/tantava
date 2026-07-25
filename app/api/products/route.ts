import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateProductInput, ValidationError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const active = searchParams.get("active");
  const collectionId = searchParams.get("collection_id");
  const limit = searchParams.get("limit");

  let productIds: string[] | null = null;
  if (collectionId) {
    const { data: links, error: linksError } = await supabase
      .from("product_collections")
      .select("product_id")
      .eq("collection_id", collectionId);
    if (linksError) return apiError("products.GET", linksError);
    productIds = (links ?? []).map((l) => l.product_id);
    if (productIds.length === 0) return NextResponse.json([]);
  }

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (active !== "all") query = query.eq("is_active", true);
  if (productIds) query = query.in("id", productIds);
  if (limit) query = query.limit(parseInt(limit, 10));

  const { data, error } = await query;
  if (error) return apiError("products.GET", error);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let body: Record<string, unknown>;
  try {
    body = validateProductInput(rawBody, false);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  if (rawBody.sort_order === undefined) {
    const { data: last } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    body.sort_order = last ? last.sort_order + 1 : 0;
  }

  const { data, error } = await supabase.from("products").insert(body).select().single();
  if (error) return apiError("products.POST", error);
  return NextResponse.json(data, { status: 201 });
}
