import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, sku, category, stock_quantity, is_active")
    .order("stock_quantity", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: logs } = await supabase
    .from("inventory_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ products, logs: logs || [] });
}

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { product_id, change, reason } = await req.json();

  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", product_id)
    .single();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const newQty = Math.max(0, product.stock_quantity + change);

  const [updateRes] = await Promise.all([
    supabase.from("products").update({ stock_quantity: newQty }).eq("id", product_id),
    supabase.from("inventory_logs").insert({ product_id, change, reason }),
  ]);

  if (updateRes.error) return NextResponse.json({ error: updateRes.error.message }, { status: 500 });

  return NextResponse.json({ success: true, new_quantity: newQty });
}
