"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { Order } from "@/lib/supabase";
import {
  ArrowLeft,
  Loader2,
  Receipt,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";


// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_FLOW = ["pending", "paid", "processing", "shipped", "delivered"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  processing: "Being Prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  paid: "text-blue-600 bg-blue-50 border-blue-200",
  processing: "text-violet-600 bg-violet-50 border-violet-200",
  shipped: "text-primary bg-primary/5 border-primary/20",
  delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-label-md border ${
        STATUS_COLOR[status] ?? "text-on-surface-variant bg-surface-container border-outline-variant"
      }`}
    >
      {status === "delivered" && <CheckCircle2 size={11} />}
      {status === "shipped" && <Truck size={11} />}
      {status === "processing" && <Clock size={11} />}
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4">
        <AlertCircle size={14} className="text-red-500" />
        <span className="font-label-md text-[12px] text-red-600">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="mt-5 overflow-x-auto pb-1">
      <div className="flex items-center gap-0 min-w-[340px]">
        {STATUS_FLOW.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          const isLast = idx === STATUS_FLOW.length - 1;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    active
                      ? "bg-primary border-primary shadow-[0_0_0_3px_rgba(194,71,127,0.18)]"
                      : done
                      ? "bg-primary border-primary"
                      : "bg-transparent border-outline-variant"
                  }`}
                />
                <span
                  className={`font-label-md text-[10px] text-center leading-tight max-w-[60px] transition-colors ${
                    done ? (active ? "text-primary font-semibold" : "text-on-surface") : "text-on-surface-variant opacity-40"
                  }`}
                >
                  {STATUS_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mb-4 mx-1 transition-all duration-500 ${
                    idx < currentIdx ? "bg-primary" : "bg-outline-variant opacity-20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <>
      <Navbar />
      <main className="pt-8 sm:pt-12 pb-stack-lg min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link
              href="/account"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                My Orders
              </h1>
              {!loading && orders.length > 0 && (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={40} className="text-primary animate-spin" />
              <p className="font-body-md text-body-md text-on-surface-variant">Loading your orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
                <Receipt size={36} className="text-outline-variant" />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mb-2">No orders yet</p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                When you place an order, it&apos;ll show up here.
              </p>
              <Link
                href="/shop"
                className="px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-sm transition-shadow"
                >
                  {/* Order header */}
                  <div className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/15">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-label-md text-[13px] text-on-surface">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-label-md text-[11px] text-on-surface-variant opacity-70">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="font-headline-sm text-[18px] text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order body */}
                  <div className="px-5 sm:px-6 py-4">
                    {/* Items */}
                    <div className="flex flex-wrap gap-2.5 mb-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 bg-surface rounded-xl px-3 py-2 border border-outline-variant/15"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={36}
                              height={44}
                              className="w-9 h-11 object-contain rounded-lg bg-surface-container"
                            />
                          )}
                          <div>
                            <p className="font-label-md text-[12px] text-on-surface leading-tight max-w-[120px] line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                              {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status timeline */}
                    <StatusTimeline status={order.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
