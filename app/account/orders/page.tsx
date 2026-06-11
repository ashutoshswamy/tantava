"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { Order } from "@/lib/supabase";
import { ArrowLeft, Loader2, Receipt } from "lucide-react";

const STATUS_FLOW = ["pending", "paid", "processing", "shipped", "delivered"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  processing: "Being Prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4">
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-label-md text-[12px]">
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-[320px]">
        {STATUS_FLOW.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          const isLast = idx === STATUS_FLOW.length - 1;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    done
                      ? active
                        ? "bg-primary border-primary"
                        : "bg-primary border-primary"
                      : "bg-transparent border-outline-variant"
                  }`}
                />
                <span
                  className={`font-label-md text-[10px] text-center leading-tight max-w-[56px] ${
                    done ? "text-on-surface" : "text-on-surface-variant opacity-50"
                  } ${active ? "font-semibold" : ""}`}
                >
                  {STATUS_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mb-4 mx-0.5 transition-colors ${
                    idx < currentIdx ? "bg-primary" : "bg-outline-variant opacity-30"
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
      <main className="pt-32 pb-stack-lg min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-4 mb-10">
            <Link href="/account" className="text-on-surface-variant hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">My Orders</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={48} className="text-outline animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Receipt size={72} className="text-outline-variant mx-auto" />
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 mb-6">
                No orders yet
              </p>
              <Link
                href="/shop"
                className="px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-surface-container-low rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="font-label-md text-[12px] text-on-surface-variant opacity-70">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="font-headline-sm text-[18px] text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-label-md text-[12px] text-on-surface">{item.name}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            {item.size} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status timeline */}
                  <StatusTimeline status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
