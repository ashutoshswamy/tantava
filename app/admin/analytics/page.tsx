"use client";

import { useEffect, useState } from "react";
import {
  Loader2, TrendingUp, TrendingDown, Users, IndianRupee,
  ShoppingBag, Package, CalendarRange, Minus,
} from "lucide-react";

type AnalyticsData = {
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: Record<string, number>;
  revenueByCategory: { category: string; revenue: number }[];
  topProducts: { name: string; revenue: number; units: number }[];
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowth: number | null;
  uniqueCustomers: number;
  avgOrderValue: number;
  appointmentsByStatus: Record<string, number>;
  inventoryHealth: { total: number; outOfStock: number; lowStock: number; healthy: number };
};

const fmt = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const STATUS_COLORS: Record<string, string> = {
  paid:        "#22c55e",
  pending:     "#eab308",
  processing:  "#a855f7",
  shipped:     "#3b82f6",
  delivered:   "#10b981",
  cancelled:   "#ef4444",
};

const CATEGORY_LABELS: Record<string, string> = {
  fusion:    "Kurta & Suit Sets",
  sarees:    "Sarees",
  lehengas:  "Lehengas",
  gowns:     "Gowns",
  jewellery: "Jewellery",
};

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 1) : 1;
  return (
    <div className="h-2 w-full bg-[#eec7dd] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<7 | 14 | 30>(30);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.revenueByDay.slice(-chartRange);
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const totalOrdersCount = Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 text-[#21101a] space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-[28px] text-[#21101a] mb-1">Analytics</h1>
        <p className="text-[#8c5971] font-body-md text-[13px]">Last 90 days • paid orders only</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* This month revenue */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <IndianRupee size={18} className="text-[#9e3462]" />
            {data.revenueGrowth !== null && (
              <span className={`flex items-center gap-1 text-[11px] font-label-md ${data.revenueGrowth >= 0 ? "text-green-600" : "text-red-500"}`}>
                {data.revenueGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(data.revenueGrowth).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-[22px] font-bold text-[#21101a]">{fmt(data.thisMonthRevenue)}</p>
          <p className="text-[#8c5971] text-[11px] mt-1">This month</p>
          <p className="text-[#d9afc0] text-[10px]">vs {fmt(data.lastMonthRevenue)} last month</p>
        </div>

        {/* AOV */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-5">
          <ShoppingBag size={18} className="text-[#7952a0] mb-3" />
          <p className="text-[22px] font-bold text-[#21101a]">{fmt(data.avgOrderValue)}</p>
          <p className="text-[#8c5971] text-[11px] mt-1">Avg order value</p>
          <p className="text-[#d9afc0] text-[10px]">{totalOrdersCount} total orders</p>
        </div>

        {/* Customers */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-5">
          <Users size={18} className="text-[#3b82f6] mb-3" />
          <p className="text-[22px] font-bold text-[#21101a]">{data.uniqueCustomers}</p>
          <p className="text-[#8c5971] text-[11px] mt-1">Unique customers</p>
          <p className="text-[#d9afc0] text-[10px]">All time</p>
        </div>

        {/* Appointments */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-5">
          <CalendarRange size={18} className="text-[#059669] mb-3" />
          <p className="text-[22px] font-bold text-[#21101a]">
            {data.appointmentsByStatus.pending ?? 0}
          </p>
          <p className="text-[#8c5971] text-[11px] mt-1">Pending appointments</p>
          <p className="text-[#d9afc0] text-[10px]">
            {data.appointmentsByStatus.confirmed ?? 0} confirmed
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center mb-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px]">Revenue Over Time</h2>
          <div className="flex gap-1">
            {([7, 14, 30] as const).map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`px-3 py-1 rounded-lg font-label-md text-[11px] transition-colors ${
                  chartRange === r ? "bg-[#9e3462]/15 text-[#9e3462]" : "text-[#8c5971] hover:text-[#21101a]"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>

        {/* Chart bars */}
        <div className="flex items-end gap-1 h-48 mb-3">
          {chartData.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#d9afc0] rounded-lg px-2 py-1.5 text-[10px] text-[#21101a] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="font-bold">{fmt(day.revenue)}</p>
                <p className="text-[#8c5971]">{day.orders} order{day.orders !== 1 ? "s" : ""}</p>
              </div>
              <div className="w-full flex items-end justify-center" style={{ height: "176px" }}>
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 2 : 0)}%`,
                    background: day.revenue > 0
                      ? "linear-gradient(to top, #9e3462, #f4a8c6)"
                      : "#eec7dd",
                  }}
                />
              </div>
              {chartRange <= 14 && (
                <span className="text-[#d9afc0] font-label-md text-[9px]">
                  {new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          ))}
        </div>
        {chartRange > 14 && (
          <div className="flex justify-between text-[#d9afc0] font-label-md text-[10px]">
            <span>{new Date(chartData[0]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            <span>{new Date(chartData[chartData.length - 1]?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-5">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(data.ordersByStatus)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] ?? "#6b7280" }} />
                      <span className="text-[#533347] font-label-md text-[12px] capitalize">{status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8c5971] text-[11px]">
                        {totalOrdersCount > 0 ? ((count / totalOrdersCount) * 100).toFixed(0) : 0}%
                      </span>
                      <span className="text-[#21101a] font-label-md text-[13px] w-6 text-right">{count}</span>
                    </div>
                  </div>
                  <MiniBar value={count} max={totalOrdersCount} color={STATUS_COLORS[status] ?? "#6b7280"} />
                </div>
              ))}
          </div>
        </div>

        {/* Revenue by category */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-5">Revenue by Category</h2>
          {data.revenueByCategory.length === 0 ? (
            <p className="text-[#8c5971] text-[13px] text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.revenueByCategory.map(({ category, revenue }, i) => {
                const maxCat = data.revenueByCategory[0].revenue;
                const colors = ["#9e3462", "#7952a0", "#3b82f6", "#059669", "#b94f7e"];
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[#533347] font-label-md text-[12px]">
                        {CATEGORY_LABELS[category] ?? category}
                      </span>
                      <span className="text-[#21101a] font-label-md text-[12px]">{fmt(revenue)}</span>
                    </div>
                    <MiniBar value={revenue} max={maxCat} color={colors[i % colors.length]} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-5">Top Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-[#8c5971] text-[13px] text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="text-[#d9afc0] font-bold text-[14px] w-5 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#21101a] font-label-md text-[13px] truncate">{p.name}</p>
                    <p className="text-[#8c5971] text-[11px]">{p.units} unit{p.units !== 1 ? "s" : ""} sold</p>
                  </div>
                  <span className="text-[#9e3462] font-label-md text-[13px] shrink-0">{fmt(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory health */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-5">Inventory Health</h2>
          <div className="space-y-4">
            {[
              { label: "Healthy stock",   value: data.inventoryHealth.healthy,    color: "#22c55e", icon: <Package size={14} /> },
              { label: "Low stock (< 3)", value: data.inventoryHealth.lowStock,   color: "#eab308", icon: <Minus size={14} /> },
              { label: "Out of stock",    value: data.inventoryHealth.outOfStock, color: "#ef4444", icon: <Package size={14} /> },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20`, color }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-[#533347] font-label-md text-[12px]">{label}</p>
                  <MiniBar value={value} max={data.inventoryHealth.total} color={color} />
                </div>
                <span className="text-[#21101a] font-bold text-[16px] w-8 text-right">{value}</span>
              </div>
            ))}
            <p className="text-[#d9afc0] text-[11px] pt-2 border-t border-[#eec7dd]">
              {data.inventoryHealth.total} active products total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
