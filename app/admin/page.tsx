"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/supabase";
import {
  Loader2, IndianRupee, Receipt, Package,
  PlusCircle, Warehouse, AlertTriangle, ClipboardList, ArrowRight, BarChart2, Inbox,
} from "lucide-react";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
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
  const [stats, setStats]               = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([statsData, ordersData]) => {
      setStats(statsData);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#c2477f] animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const maxRevenue = Math.max(...stats.dailyRevenue.map((d) => d.revenue), 1);

  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: fmt(stats.totalRevenue),
      icon: <IndianRupee size={22} />,
      color: "#c2477f",
      sub: "All paid orders",
      href: "/admin/analytics",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <Receipt size={22} />,
      color: "#7952a0",
      sub: `${stats.pendingOrders} pending`,
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: <Package size={22} />,
      color: "#3b82f6",
      sub: `${stats.lowStockProducts} low stock`,
      href: "/admin/products",
    },
  ];

  const QUICK_ACTIONS = [
    { href: "/admin/products/new", icon: <PlusCircle size={16} />, label: "Add Product",     color: "#c2477f" },
    { href: "/admin/orders",       icon: <Receipt size={16} />,    label: "View Orders",      color: "#7952a0" },
    { href: "/admin/inventory",    icon: <Warehouse size={16} />,  label: "Update Inventory", color: "#059669" },
    { href: "/admin/inquiries",    icon: <Inbox size={16} />,      label: "View Inquiries",   color: "#ea580c" },
    { href: "/admin/analytics",    icon: <BarChart2 size={16} />,  label: "Full Analytics",   color: "#3b82f6" },
  ];

  const hasAlerts = stats.lowStockProducts > 0 || stats.pendingOrders > 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 text-[#1a0914] space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Dashboard</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-[#c2477f] text-white text-[13px] font-medium rounded-xl hover:bg-[#962259] transition-colors"
        >
          <BarChart2 size={15} />
          Analytics
        </Link>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="flex flex-col sm:flex-row gap-3">
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/inventory" className="flex-1 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 hover:border-red-300 transition-colors">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-[13px] text-[#1a0914] font-medium flex-1">{stats.lowStockProducts} products low on stock</p>
              <ArrowRight size={14} className="text-red-400" />
            </Link>
          )}
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders" className="flex-1 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3.5 hover:border-yellow-300 transition-colors">
              <ClipboardList size={18} className="text-yellow-600 flex-shrink-0" />
              <p className="text-[13px] text-[#1a0914] font-medium flex-1">{stats.pendingOrders} orders pending</p>
              <ArrowRight size={14} className="text-yellow-400" />
            </Link>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6 hover:border-[#dbb6ca] hover:shadow-sm transition-all group relative overflow-hidden"
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl opacity-60"
              style={{ background: `linear-gradient(90deg, ${card.color}60, transparent)` }}
            />
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                {card.icon}
              </div>
              <ArrowRight size={14} className="text-[#dbb6ca] group-hover:text-[#8c5971] transition-colors mt-1" />
            </div>
            <p className="text-[32px] font-bold text-[#1a0914] leading-none mb-1">{card.value}</p>
            <p className="text-[#8c5971] font-medium text-[13px] mt-1">{card.label}</p>
            <p className="text-[#dbb6ca] text-[11px] mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Middle row: Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[#1a0914] font-semibold text-[15px]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[#c2477f]/60 hover:text-[#c2477f] text-[11px] font-medium transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-20">
              <Receipt size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
              <p className="text-[#8c5971] text-[14px] font-medium">No orders yet</p>
              <p className="text-[#dbb6ca] text-[12px] mt-1">Orders will appear here once placed</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 rounded-xl border border-[#f2cfe3] bg-[#fffafc] px-4 py-3 hover:bg-[#fdeaf2]/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[13px] text-[#52304a] truncate">
                      #{order.id.slice(0, 8).toUpperCase()}
                      <span className="text-[#dbb6ca] font-normal ml-2">
                        {order.user_name || order.user_email || "—"}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#8c5971] mt-0.5">
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-[13px] text-[#1a0914]">{fmt(order.total)}</span>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize"
                      style={{
                        backgroundColor: `${STATUS_COLORS[order.status] ?? "#6b7280"}18`,
                        color: STATUS_COLORS[order.status] ?? "#6b7280",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6">
          <h2 className="text-[#1a0914] font-semibold text-[15px] mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl border-l-[3px] bg-[#fdeaf2] hover:bg-[#f8dde9] transition-colors group"
                style={{ borderLeftColor: action.color }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ color: action.color }}
                >
                  {action.icon}
                </span>
                <span className="text-[#52304a] group-hover:text-[#1a0914] font-medium text-[13px] transition-colors flex-1">
                  {action.label}
                </span>
                <ArrowRight size={13} className="text-[#dbb6ca] group-hover:text-[#8c5971] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1a0914] font-semibold text-[15px]">Revenue — Last 7 Days</h2>
          <Link href="/admin/analytics" className="text-[#c2477f]/60 hover:text-[#c2477f] text-[11px] font-medium transition-colors flex items-center gap-1">
            Full view <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex items-end gap-2 h-52">
          {stats.dailyRevenue.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#dbb6ca] rounded-lg px-2 py-1 text-[10px] text-[#1a0914] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-sm">
                {fmt(day.revenue)} · {day.orders} orders
              </div>
              <div className="w-full flex items-end justify-center" style={{ height: "160px" }}>
                <div
                  className="w-full rounded-t-lg transition-colors"
                  style={{
                    height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 3 : 0)}%`,
                    background: day.revenue > 0 ? "linear-gradient(to top, #c2477f, #fad0e4)" : "#f2cfe3",
                  }}
                />
              </div>
              <span className="text-[#8c5971] font-medium text-[10px]">
                {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
