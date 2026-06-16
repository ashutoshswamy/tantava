"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/supabase";
import { ChevronDown, Loader2, Receipt, Save } from "lucide-react";

const STATUSES = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
const ORDER_STATUSES = STATUSES.slice(1) as unknown as string[];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  paid: "bg-blue-50 text-blue-700 border border-blue-200",
  processing: "bg-purple-50 text-purple-700 border border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
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
    <div className="bg-white border border-[#f2cfe3] rounded-2xl p-4 sm:p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-[#f2cfe3]">
        <div>
          <p className="text-[#1a0914] font-semibold text-[14px]">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-[#8c5971] text-[12px] mt-0.5">
            {order.user_name || order.user_email || order.user_id.slice(0, 10)}
            {" · "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="text-[#c2477f] font-bold text-[20px]">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-[#fdeaf2] rounded-xl px-3 py-2">
            <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded-lg" />
            <div>
              <p className="text-[#1a0914] font-medium text-[12px]">{item.name}</p>
              <p className="text-[#8c5971] text-[11px]">
                {item.size} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping */}
      {order.shipping_address && (
        <p className="text-[#8c5971] text-[12px] mb-1">
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
        <p className="text-[#dbb6ca] text-[11px] mb-4">
          Payment: {order.razorpay_payment_id}
        </p>
      )}

      {/* Admin controls */}
      <div className="border-t border-[#f2cfe3] pt-4 mt-2 space-y-3">
        {/* Status selector */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider sm:w-20 sm:shrink-0">Status</span>
          <div className="relative">
            <select
              value={edit.status}
              onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}
              className={`pl-3 pr-8 py-1.5 rounded-xl font-medium text-[12px] capitalize cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-[#c2477f]/40 transition-colors ${
                STATUS_STYLES[edit.status] || "bg-[#fdeaf2] text-[#8c5971]"
              }`}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white capitalize">
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <span className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider sm:w-20 sm:shrink-0 sm:pt-1.5">Notes</span>
          <textarea
            value={edit.admin_notes}
            onChange={(e) => setEdit((p) => ({ ...p, admin_notes: e.target.value }))}
            placeholder="Internal notes (not visible to customer)"
            rows={2}
            className="w-full flex-1 sm:max-w-sm bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl px-3 py-1.5 text-[12px] text-[#1a0914] placeholder:text-[#dbb6ca] focus:outline-none focus:border-[#c2477f]/40 resize-none transition-colors"
          />
        </div>

        {/* Save button */}
        {dirty && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#c2477f] text-white font-medium text-[12px] hover:bg-[#962259] transition-colors disabled:opacity-50"
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
            <span className="text-green-600 text-[12px] font-medium">Saved ✓</span>
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
      })
      .catch(() => setLoading(false));
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
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Orders</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl font-medium text-[12px] capitalize transition-colors ${
              filter === s
                ? "bg-[#c2477f] text-white"
                : "bg-white border border-[#f2cfe3] text-[#52304a] hover:bg-[#fdeaf2] hover:text-[#1a0914]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-[#c2477f] animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onUpdate={handleUpdate} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Receipt size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
              <p className="text-[#8c5971] text-[14px] font-medium">No orders found</p>
              <p className="text-[#dbb6ca] text-[12px] mt-1">Try a different status filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
