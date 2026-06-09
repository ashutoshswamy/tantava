"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/supabase";
import { ChevronDown, Loader2, Receipt, Save } from "lucide-react";

const STATUSES = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
const ORDER_STATUSES = STATUSES.slice(1) as unknown as string[];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  paid: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  processing: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  shipped: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  delivered: "bg-green-500/15 text-green-400 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/30",
};

type OrderEdit = {
  status: string;
  admin_notes: string;
};

function OrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (id: string, patch: Partial<OrderEdit>) => Promise<void>;
}) {
  const [edit, setEdit] = useState<OrderEdit>({
    status: order.status,
    admin_notes: order.admin_notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    edit.status !== order.status ||
    edit.admin_notes !== (order.admin_notes ?? "");

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(order.id, {
      status: edit.status,
      admin_notes: edit.admin_notes || undefined,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-white font-label-md text-[14px]">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-white/40 text-[12px] mt-0.5">
            {order.user_name || order.user_email || order.user_id.slice(0, 10)}
            {" • "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="text-[#C9A84C] font-headline-sm text-[18px]">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-3 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded" />
            <div>
              <p className="text-white/80 font-label-md text-[12px]">{item.name}</p>
              <p className="text-white/30 text-[11px]">
                {item.size} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping */}
      {order.shipping_address && (
        <p className="text-white/30 font-label-md text-[12px] mb-1">
          📍{" "}
          {[
            order.shipping_address.line1,
            order.shipping_address.city,
            order.shipping_address.state,
            order.shipping_address.pincode,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
      {order.razorpay_payment_id && (
        <p className="text-white/20 font-label-md text-[11px] mb-4">
          Payment: {order.razorpay_payment_id}
        </p>
      )}

      {/* ── Admin controls ── */}
      <div className="border-t border-white/5 pt-4 mt-2 space-y-3">
        {/* Status selector */}
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[12px] font-label-md w-24 shrink-0">Status</span>
          <div className="relative">
            <select
              value={edit.status}
              onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}
              className={`pl-3 pr-8 py-1.5 rounded-lg font-label-md text-[12px] capitalize cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40 transition-colors ${
                STATUS_STYLES[edit.status] || "bg-white/5 text-white/40"
              }`}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#1a1a1a] capitalize">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-50"
            />
          </div>
        </div>

        {/* Admin notes */}
        <div className="flex items-start gap-3">
          <span className="text-white/40 text-[12px] font-label-md w-24 shrink-0 pt-1.5">Notes</span>
          <textarea
            value={edit.admin_notes}
            onChange={(e) => setEdit((p) => ({ ...p, admin_notes: e.target.value }))}
            placeholder="Internal notes (not visible to customer)"
            rows={2}
            className="flex-1 max-w-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 resize-none transition-colors"
          />
        </div>

        {/* Save button */}
        {dirty && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C9A84C] text-black font-label-md text-[12px] hover:bg-[#d4b05a] transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
        {saved && !dirty && (
          <div className="flex justify-end">
            <span className="text-green-400 text-[12px] font-label-md">Saved ✓</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (id: string, patch: Partial<OrderEdit>) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-white mb-1">Orders</h1>
        <p className="text-white/40 text-[13px]">{orders.length} total orders</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-label-md text-[12px] capitalize transition-colors ${
              filter === s
                ? "bg-[#C9A84C] text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={48} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onUpdate={handleUpdate} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <Receipt size={48} className="mx-auto mb-2" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
