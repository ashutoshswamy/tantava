"use client";

import { useEffect, useState, useCallback } from "react";
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
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────

interface TrackingActivity {
  date: string;
  activity: string;
  location: string;
  "sr-status"?: string;
}

interface TrackingData {
  shiprocket_order_id: string | null;
  shiprocket_shipment_id: string | null;
  courier_name: string | null;
  awb_code: string | null;
  status: string | null;
  tracking_url: string | null;
  activities: TrackingActivity[];
  estimated_delivery: string | null;
}

interface TrackingResult {
  tracking: TrackingData | null;
  message?: string;
  error?: string;
}

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

function TrackingPanel({ orderId, status }: { orderId: string; status: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchTracking = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shiprocket/track/${orderId}`);
      const data: TrackingResult = await res.json();
      setResult(data);
      setLastFetched(new Date());
    } catch {
      setResult({ tracking: null, error: "Failed to load tracking" });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleToggle = () => {
    if (!open && !result) fetchTracking();
    setOpen((v) => !v);
  };

  // Only show the tracking panel for shipped/delivered orders
  const showTracking = ["shipped", "delivered", "processing"].includes(status);
  if (!showTracking) return null;

  const t = result?.tracking;

  return (
    <div className="mt-4 border-t border-outline-variant/20 pt-4">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-primary font-label-md text-[12px] hover:opacity-80 transition-opacity"
      >
        <Truck size={14} />
        {open ? "Hide" : "View"} Shipment Tracking
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              {/* Refresh bar */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  {lastFetched
                    ? `Updated ${lastFetched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                    : ""}
                </span>
                <button
                  onClick={fetchTracking}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                >
                  <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {loading && !t ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={22} className="text-outline animate-spin" />
                </div>
              ) : result?.error ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle size={14} className="text-red-500 shrink-0" />
                  <p className="text-[12px] text-red-600">{result.error}</p>
                </div>
              ) : !t ? (
                <div className="p-3 bg-surface-container rounded-lg">
                  <p className="text-[12px] text-on-surface-variant">
                    {result?.message ?? "Tracking information not available yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Courier + AWB Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {t.courier_name && (
                      <div className="bg-surface-container rounded-lg px-4 py-3">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Courier</p>
                        <p className="font-label-md text-[13px] text-on-surface">{t.courier_name}</p>
                      </div>
                    )}
                    {t.awb_code && (
                      <div className="bg-surface-container rounded-lg px-4 py-3">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">AWB / Tracking No.</p>
                        <p className="font-label-md text-[13px] text-on-surface font-mono">{t.awb_code}</p>
                      </div>
                    )}
                    {t.estimated_delivery && (
                      <div className="bg-surface-container rounded-lg px-4 py-3">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Est. Delivery</p>
                        <p className="font-label-md text-[13px] text-on-surface">
                          {new Date(t.estimated_delivery).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Live status */}
                  {t.status && (
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-primary" />
                      <span className="text-[12px] text-on-surface-variant">Current status:</span>
                      <span className="font-label-md text-[12px] text-primary">{t.status}</span>
                    </div>
                  )}

                  {/* Activity timeline */}
                  {t.activities.length > 0 && (
                    <div>
                      <p className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider mb-3">
                        Tracking History
                      </p>
                      <div className="space-y-0 relative">
                        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant/30" />
                        {t.activities.slice(0, 6).map((act, i) => (
                          <div key={i} className="flex gap-4 pb-4 relative">
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 z-10 ${
                                i === 0
                                  ? "bg-primary border-primary"
                                  : "bg-surface border-outline-variant"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[12px] leading-snug ${i === 0 ? "text-on-surface font-medium" : "text-on-surface-variant"}`}>
                                {act.activity}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {act.location && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-on-surface-variant">
                                    <MapPin size={9} />
                                    {act.location}
                                  </span>
                                )}
                                <span className="text-[10px] text-on-surface-variant opacity-60">
                                  {new Date(act.date).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External tracking link */}
                  {t.tracking_url && (
                    <a
                      href={t.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] text-primary font-label-md hover:opacity-75 transition-opacity"
                    >
                      Track on Shiprocket
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
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
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-11 object-contain rounded-lg bg-surface-container"
                          />
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

                    {/* Shiprocket live tracking panel */}
                    <TrackingPanel orderId={order.id} status={order.status} />
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
