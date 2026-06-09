"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, Package, Warehouse, Receipt, CalendarRange,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",               icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/admin/products",      icon: <Package size={20} />,         label: "Products" },
  { href: "/admin/inventory",     icon: <Warehouse size={20} />,       label: "Inventory" },
  { href: "/admin/orders",        icon: <Receipt size={20} />,         label: "Orders" },
  { href: "/admin/appointments",  icon: <CalendarRange size={20} />,   label: "Appointments" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0f0f0f]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col bg-[#141414] border-r border-white/5 z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
          {!collapsed && (
            <Link href="/" className="font-headline-sm text-[18px] text-[#C9A84C] hover:opacity-80 transition-opacity">
              Tantava
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  active
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="font-label-md text-label-md">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: { avatarBox: "w-8 h-8" },
              }}
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-label-md text-[12px] text-white/70 truncate">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
