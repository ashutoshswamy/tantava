"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2, IndianRupee, Receipt, Package, CalendarRange,
  PlusCircle, Warehouse, AlertTriangle, ClipboardList, ArrowRight,
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

const STAT_CARDS = (stats: Stats) => [
  {
    label: "Total Revenue",
    value: `₹${(stats.totalRevenue / 100).toLocaleString("en-IN")}`,
    icon: <IndianRupee size={20} />,
    color: "#C9A84C",
    sub: "All time",
  },
  {
    label: "Total Orders",
    value: stats.totalOrders,
    icon: <Receipt size={20} />,
    color: "#496455",
    sub: `${stats.pendingOrders} pending`,
  },
  {
    label: "Products",
    value: stats.totalProducts,
    icon: <Package size={20} />,
    color: "#934848",
    sub: `${stats.lowStockProducts} low stock`,
  },
  {
    label: "Appointments",
    value: stats.pendingAppointments,
    icon: <CalendarRange size={20} />,
    color: "#755b00",
    sub: "Pending confirmation",
  },
];

const QUICK_ACTIONS = [
  { href: "/admin/products/new", icon: <PlusCircle size={20} />,  label: "Add New Product",      color: "#C9A84C" },
  { href: "/admin/orders",       icon: <Receipt size={20} />,     label: "View Pending Orders",   color: "#496455" },
  { href: "/admin/inventory",    icon: <Warehouse size={20} />,   label: "Update Inventory",      color: "#934848" },
  { href: "/admin/appointments", icon: <CalendarRange size={20} />, label: "Manage Appointments", color: "#755b00" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const maxRevenue = Math.max(...stats.dailyRevenue.map((d) => d.revenue), 1);

  return (
    <div className="p-8 text-white">
      <div className="mb-10">
        <h1 className="font-headline-lg text-[32px] text-white mb-1">Dashboard</h1>
        <p className="text-white/40 font-body-md text-body-md">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS(stats).map((card) => (
          <div
            key={card.label}
            className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
            </div>
            <p className="text-[28px] font-bold text-white mb-1">{card.value}</p>
            <p className="text-white/40 font-label-md text-[12px] mb-1">{card.label}</p>
            <p className="text-white/25 font-label-md text-[11px]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
          <h2 className="text-white font-headline-sm text-[18px] mb-6">Revenue (Last 7 Days)</h2>
          <div className="flex items-end gap-3 h-40">
            {stats.dailyRevenue.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                  <div
                    className="w-full rounded-t-sm bg-[#C9A84C]/70 hover:bg-[#C9A84C] transition-colors"
                    style={{
                      height: `${Math.max((day.revenue / maxRevenue) * 100, 2)}%`,
                    }}
                    title={`₹${(day.revenue / 100).toLocaleString("en-IN")}`}
                  />
                </div>
                <span className="text-white/30 font-label-md text-[10px]">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
          <h2 className="text-white font-headline-sm text-[18px] mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <span style={{ color: action.color }}>{action.icon}</span>
                <span className="text-white/70 group-hover:text-white font-label-md text-[13px] transition-colors">
                  {action.label}
                </span>
                <ArrowRight size={16} className="text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.pendingOrders > 0) && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/inventory" className="flex items-center gap-4 bg-[#934848]/10 border border-[#934848]/30 rounded-xl p-4 hover:border-[#934848]/50 transition-colors">
              <AlertTriangle size={24} className="text-[#934848]" />
              <div>
                <p className="text-white font-label-md text-[13px]">{stats.lowStockProducts} products low on stock</p>
                <p className="text-white/40 text-[11px]">Click to manage inventory</p>
              </div>
            </Link>
          )}
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders" className="flex items-center gap-4 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4 hover:border-[#C9A84C]/50 transition-colors">
              <ClipboardList size={24} className="text-[#C9A84C]" />
              <div>
                <p className="text-white font-label-md text-[13px]">{stats.pendingOrders} orders pending</p>
                <p className="text-white/40 text-[11px]">Click to review orders</p>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
