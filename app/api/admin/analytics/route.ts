import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();

  const since90 = new Date();
  since90.setDate(since90.getDate() - 89);
  const since90Str = since90.toISOString().split("T")[0];

  const [paidOrdersRes, allOrdersRes, productsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, subtotal, items, created_at, status")
      .eq("status", "paid")
      .gte("created_at", since90Str),
    supabase.from("orders").select("id, status, total, created_at, user_id"),
    supabase.from("products").select("id, name, category, price, size_inventory, is_active"),
  ]);

  const paidOrders = paidOrdersRes.data || [];
  const allOrders = allOrdersRes.data || [];
  const products = productsRes.data || [];

  // Revenue by day - last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  const revenueByDay = last30Days.map((date) => ({
    date,
    revenue: paidOrders
      .filter((o) => o.created_at?.startsWith(date))
      .reduce((sum: number, o) => sum + o.total, 0),
    orders: paidOrders.filter((o) => o.created_at?.startsWith(date)).length,
  }));

  // Orders by status
  const statusCounts: Record<string, number> = {};
  for (const o of allOrders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  // Category revenue - parse items JSONB, match product_id → category
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const categoryRevenue: Record<string, number> = {};
  for (const order of paidOrders) {
    const items: { product_id: string; price: number; quantity: number }[] = order.items || [];
    for (const item of items) {
      const prod = productMap[item.product_id];
      const cat = prod?.category ?? "other";
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.price * item.quantity;
    }
  }
  const revenueByCategory = Object.entries(categoryRevenue)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; units: number }> = {};
  for (const order of paidOrders) {
    const items: { product_id: string; name: string; price: number; quantity: number }[] = order.items || [];
    for (const item of items) {
      if (!productRevenue[item.product_id]) {
        productRevenue[item.product_id] = { name: item.name, revenue: 0, units: 0 };
      }
      productRevenue[item.product_id].revenue += item.price * item.quantity;
      productRevenue[item.product_id].units += item.quantity;
    }
  }
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue comparison: this month vs last month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  const thisMonthRevenue = paidOrders
    .filter((o) => o.created_at >= thisMonthStart)
    .reduce((sum: number, o) => sum + o.total, 0);
  const lastMonthRevenue = paidOrders
    .filter((o) => o.created_at >= lastMonthStart && o.created_at <= lastMonthEnd)
    .reduce((sum: number, o) => sum + o.total, 0);

  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : null;

  // Unique customers
  const uniqueCustomers = new Set(allOrders.map((o) => o.user_id)).size;

  // AOV
  const avgOrderValue =
    paidOrders.length > 0
      ? paidOrders.reduce((sum: number, o) => sum + o.total, 0) / paidOrders.length
      : 0;

  // Inventory health
  const totalStock = (inv: Record<string, number>) => Object.values(inv).reduce((s, v) => s + v, 0);
  const activeProducts = products.filter((p) => p.is_active);
  const outOfStock = activeProducts.filter((p) => totalStock(p.size_inventory || {}) === 0).length;
  const lowStock = activeProducts.filter((p) => { const t = totalStock(p.size_inventory || {}); return t > 0 && t < 5; }).length;

  return NextResponse.json({
    revenueByDay,
    ordersByStatus: statusCounts,
    revenueByCategory,
    topProducts,
    thisMonthRevenue,
    lastMonthRevenue,
    revenueGrowth,
    uniqueCustomers,
    avgOrderValue,
    inventoryHealth: {
      total: activeProducts.length,
      outOfStock,
      lowStock,
      healthy: activeProducts.length - outOfStock - lowStock,
    },
  });
}
