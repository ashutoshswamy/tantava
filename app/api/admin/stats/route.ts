import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  const [ordersRes, productsRes, appointmentsRes, revenueRes] = await Promise.all([
    supabase.from("orders").select("id, status, total, created_at"),
    supabase.from("products").select("id, stock_quantity, is_active"),
    supabase.from("appointments").select("id, status"),
    supabase.from("orders").select("total").eq("status", "paid"),
  ]);

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const appointments = appointmentsRes.data || [];
  const revenue = revenueRes.data || [];

  const totalRevenue = revenue.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockProducts = products.filter((p) => p.stock_quantity < 3 && p.is_active).length;
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const dailyRevenue = last7Days.map((date) => ({
    date,
    revenue: orders
      .filter((o) => o.created_at?.startsWith(date) && o.status === "paid")
      .reduce((sum, o) => sum + o.total, 0),
    orders: orders.filter((o) => o.created_at?.startsWith(date)).length,
  }));

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    pendingOrders,
    lowStockProducts,
    pendingAppointments,
    dailyRevenue,
  });
}
