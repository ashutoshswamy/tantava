import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, sku, category, size_inventory, is_active")
    .order("name", { ascending: true });

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
  const { product_id, size, change, reason } = await req.json();

  if (!size) return NextResponse.json({ error: "size is required" }, { status: 400 });
  if (!product_id) return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  const changeNum = Number(change);
  if (!Number.isFinite(changeNum) || changeNum === 0) {
    return NextResponse.json({ error: "change must be a non-zero number" }, { status: 400 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("size_inventory")
    .eq("id", product_id)
    .single();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const current: Record<string, number> = product.size_inventory || {};
  const currentQty = current[size] ?? 0;
  const newQty = Math.max(0, currentQty + changeNum);
  const newInventory = { ...current, [size]: newQty };

  const [updateRes] = await Promise.all([
    supabase.from("products").update({ size_inventory: newInventory }).eq("id", product_id),
    supabase.from("inventory_logs").insert({ product_id, size, change: changeNum, reason }),
  ]);

  if (updateRes.error) return NextResponse.json({ error: updateRes.error.message }, { status: 500 });

  return NextResponse.json({ success: true, size, new_quantity: newQty });
}
