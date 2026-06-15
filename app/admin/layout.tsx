"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, Package, Warehouse, Receipt,
  ChevronLeft, ChevronRight, BarChart2, ExternalLink, Layers,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",              icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/admin/analytics",    icon: <BarChart2 size={20} />,       label: "Analytics" },
  { href: "/admin/products",     icon: <Package size={20} />,         label: "Products" },
  { href: "/admin/collections",  icon: <Layers size={20} />,          label: "Collections" },
  { href: "/admin/inventory",    icon: <Warehouse size={20} />,       label: "Inventory" },
  { href: "/admin/orders",       icon: <Receipt size={20} />,         label: "Orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff0f5] pb-24 md:pb-0">
      {/* Sidebar */}
      <aside
        className={`fixed inset-x-0 bottom-0 z-40 flex h-24 bg-white border-t border-[#eec7dd] transition-all duration-300 md:inset-y-0 md:right-auto md:h-full md:flex-col md:border-r md:border-t-0 ${
          collapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <div className="hidden md:flex items-center justify-between px-4 py-5 border-b border-[#eec7dd]">
          {!collapsed && (
            <Link href="/" className="font-headline-sm text-[18px] text-[#9e3462] hover:opacity-80 transition-opacity">
              Tantava
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#8c5971] hover:text-[#21101a] transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="grid flex-1 grid-cols-3 gap-1 px-2 py-2 sm:grid-cols-6 md:block md:space-y-1 md:px-2 md:py-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center transition-all group md:flex-row md:justify-start md:gap-3 md:px-3 md:py-3 ${
                  active
                    ? "bg-[#9e3462]/10 text-[#9e3462]"
                    : "text-[#533347] hover:text-[#21101a] hover:bg-[#fce8f0]"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="font-label-md text-[10px] leading-none sm:text-label-md md:inline">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-2 py-3 border-t border-[#eec7dd] md:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#533347] hover:text-[#21101a] hover:bg-[#fce8f0] transition-all"
          >
            <span className="flex-shrink-0"><ExternalLink size={20} /></span>
            {!collapsed && (
              <span className="font-label-md text-label-md">Visit Website</span>
            )}
          </Link>
        </div>

        <div className="hidden px-4 py-4 border-t border-[#eec7dd] md:block">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: { avatarBox: "w-8 h-8" },
              }}
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-label-md text-[12px] text-[#8c5971] truncate">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={`min-w-0 transition-all duration-300 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
