import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateProductInput, ValidationError } from "@/lib/api-utils";
import type { Category } from "@/lib/supabase";

async function productIdsIn(
  supabase: ReturnType<typeof createServerSupabase>,
  table: "product_collections" | "product_categories",
  column: "collection_id" | "category_id",
  value: string
): Promise<string[]> {
  const { data } = await supabase.from(table).select("product_id").eq(column, value);
  return (data ?? []).map((l) => l.product_id);
}

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");
  const active = searchParams.get("active");
  const collectionId = searchParams.get("collection_id");
  const limit = searchParams.get("limit");

  let productIds: string[] | null = null;
  if (collectionId) productIds = await productIdsIn(supabase, "product_collections", "collection_id", collectionId);
  if (categoryId) {
    const catIds = await productIdsIn(supabase, "product_categories", "category_id", categoryId);
    productIds = productIds ? productIds.filter((id) => catIds.includes(id)) : catIds;
  }
  if (productIds && productIds.length === 0) return NextResponse.json([]);

  let query = supabase
    .from("products")
    .select("*, product_categories(categories(*))")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (active !== "all") query = query.eq("is_active", true);
  if (productIds) query = query.in("id", productIds);
  if (limit) query = query.limit(parseInt(limit, 10));

  const { data, error } = await query;
  if (error) return apiError("products.GET", error);
  const products = (data ?? []).map(({ product_categories, ...rest }) => ({
    ...rest,
    categories: (product_categories ?? []).map((pc: { categories: Category }) => pc.categories),
  }));
  return NextResponse.json(products);
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
