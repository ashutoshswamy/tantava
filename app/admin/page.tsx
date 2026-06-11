"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/supabase";
import {
  Loader2, IndianRupee, Receipt, Package, CalendarRange,
  PlusCircle, Warehouse, AlertTriangle, ClipboardList, ArrowRight, BarChart2,
} from "lucide-react";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  pendingAppointments: number;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  paid:        "#22c55e",
  pending:     "#eab308",
  processing:  "#a855f7",
  shipped:     "#3b82f6",
  delivered:   "#10b981",
  cancelled:   "#ef4444",
};

const fmt = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const [stats, setStats]           = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([statsData, ordersData]) => {
      setStats(statsData);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const maxRevenue = Math.max(...stats.dailyRevenue.map((d) => d.revenue), 1);

  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: fmt(stats.totalRevenue),
      icon: <IndianRupee size={18} />,
      color: "#9e3462",
      sub: "All paid orders",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <Receipt size={18} />,
      color: "#7952a0",
      sub: `${stats.pendingOrders} pending`,
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: <Package size={18} />,
      color: "#3b82f6",
      sub: `${stats.lowStockProducts} low stock`,
    },
    {
      label: "Appointments",
      value: stats.pendingAppointments,
      icon: <CalendarRange size={18} />,
      color: "#059669",
      sub: "Awaiting confirmation",
    },
  ];

  const QUICK_ACTIONS = [
    { href: "/admin/analytics",    icon: <BarChart2 size={18} />,      label: "View Analytics",        color: "#9e3462" },
    { href: "/admin/products/new", icon: <PlusCircle size={18} />,     label: "Add New Product",       color: "#7952a0" },
    { href: "/admin/orders",       icon: <Receipt size={18} />,        label: "View All Orders",       color: "#3b82f6" },
    { href: "/admin/inventory",    icon: <Warehouse size={18} />,      label: "Update Inventory",      color: "#059669" },
    { href: "/admin/appointments", icon: <CalendarRange size={18} />,  label: "Manage Appointments",   color: "#b94f7e" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 text-[#21101a] space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="font-headline-lg text-[28px] text-[#21101a] mb-1">Dashboard</h1>
          <p className="text-[#8c5971] font-body-md text-[13px]">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#9e3462]/10 border border-[#9e3462]/20 text-[#9e3462] font-label-md text-[12px] hover:bg-[#9e3462]/20 transition-colors"
        >
          <BarChart2 size={14} />
          Full Analytics
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#eec7dd] rounded-xl p-5 hover:border-[#d9afc0] transition-colors"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${card.color}18`, color: card.color }}
            >
              {card.icon}
            </div>
            <p className="text-[24px] font-bold text-[#21101a] mb-0.5">{card.value}</p>
            <p className="text-[#8c5971] font-label-md text-[12px] mb-0.5">{card.label}</p>
            <p className="text-[#d9afc0] font-label-md text-[10px]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#21101a] font-headline-sm text-[16px]">Revenue Last 7 Days</h2>
            <Link href="/admin/analytics" className="text-[#9e3462]/60 hover:text-[#9e3462] text-[11px] font-label-md transition-colors flex items-center gap-1">
              Full view <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex items-end gap-2 h-44">
            {stats.dailyRevenue.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#d9afc0] rounded-lg px-2 py-1 text-[10px] text-[#21101a] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {fmt(day.revenue)} • {day.orders} orders
                </div>
                <div className="w-full flex items-end justify-center" style={{ height: "128px" }}>
                  <div
                    className="w-full rounded-t transition-colors"
                    style={{
                      height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 3 : 0)}%`,
                      background: day.revenue > 0 ? "linear-gradient(to top, #9e3462, #f4a8c6)" : "#eec7dd",
                    }}
                  />
                </div>
                <span className="text-[#8c5971] font-label-md text-[10px]">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#fce8f0] hover:bg-[#f8dde9] transition-colors group"
              >
                <span style={{ color: action.color }}>{action.icon}</span>
                <span className="text-[#533347] group-hover:text-[#21101a] font-label-md text-[12px] transition-colors flex-1">
                  {action.label}
                </span>
                <ArrowRight size={14} className="text-[#d9afc0] group-hover:text-[#8c5971] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#21101a] font-headline-sm text-[16px]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#9e3462]/60 hover:text-[#9e3462] text-[11px] font-label-md transition-colors flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-[#8c5971]">
            <Receipt size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-[13px]">No orders yet</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:hidden">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-[#eec7dd] bg-[#fffafc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-label-md text-[12px] text-[#533347]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[12px] text-[#8c5971]">
                        {order.user_name || order.user_email || "—"}
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full font-label-md text-[10px] capitalize"
                      style={{
                        backgroundColor: `${STATUS_COLORS[order.status] ?? "#6b7280"}18`,
                        color: STATUS_COLORS[order.status] ?? "#6b7280",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#8c5971]">
                    <span>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</span>
                    <span className="font-label-md text-[#21101a]">{fmt(order.total)}</span>
                    <span>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="border-b border-[#eec7dd]">
                  {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left text-[#8c5971] font-label-md text-[11px] pb-3 pr-4 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eec7dd]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fce8f0]/50 transition-colors">
                    <td className="py-3 pr-4 font-label-md text-[12px] text-[#533347]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4 text-[12px] text-[#8c5971] max-w-[140px] truncate">
                      {order.user_name || order.user_email || "—"}
                    </td>
                    <td className="py-3 pr-4 text-[12px] text-[#8c5971]">
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3 pr-4 font-label-md text-[12px] text-[#21101a]">
                      {fmt(order.total)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full font-label-md text-[10px] capitalize"
                        style={{
                          backgroundColor: `${STATUS_COLORS[order.status] ?? "#6b7280"}18`,
                          color: STATUS_COLORS[order.status] ?? "#6b7280",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-[#d9afc0]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.pendingOrders > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/inventory" className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-4 hover:border-red-300 transition-colors">
              <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-[#21101a] font-label-md text-[13px]">{stats.lowStockProducts} products low on stock</p>
                <p className="text-[#8c5971] text-[11px]">Click to manage inventory</p>
              </div>
              <ArrowRight size={16} className="text-[#d9afc0] ml-auto" />
            </Link>
          )}
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders" className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:border-yellow-300 transition-colors">
              <ClipboardList size={22} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-[#21101a] font-label-md text-[13px]">{stats.pendingOrders} orders pending</p>
                <p className="text-[#8c5971] text-[11px]">Click to review orders</p>
              </div>
              <ArrowRight size={16} className="text-[#d9afc0] ml-auto" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
