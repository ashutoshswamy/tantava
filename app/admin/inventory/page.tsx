"use client";

import { useEffect, useState } from "react";
import { Loader2, Ban, AlertTriangle, Plus, Minus } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type InventoryProduct = {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  size_inventory: Record<string, number>;
  is_active: boolean;
};

type InventoryLog = {
  id: string;
  product_id: string;
  size: string | null;
  change: number;
  reason: string | null;
  created_at: string;
};

const totalStock = (inv: Record<string, number>) =>
  Object.values(inv || {}).reduce((s, v) => s + v, 0);

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [adjustModal, setAdjustModal] = useState<InventoryProduct | null>(null);
  const [adjustment, setAdjustment] = useState({ size: "M", change: "", reason: "" });

  const fetchData = () => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLogs(data.logs || []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModal) return;
    setUpdating(adjustModal.id);

    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: adjustModal.id,
        size: adjustment.size,
        change: parseInt(adjustment.change),
        reason: adjustment.reason,
      }),
    });

    if (res.ok) {
      fetchData();
      setAdjustModal(null);
      setAdjustment({ size: "M", change: "", reason: "" });
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#c2477f] animate-spin" />
      </div>
    );
  }

  const lowStock = products.filter((p) => totalStock(p.size_inventory) < 5);
  const outOfStock = products.filter((p) => totalStock(p.size_inventory) === 0);

  const stockPillCls = (qty: number) =>
    qty === 0
      ? "bg-red-50 text-red-600 border border-red-100"
      : qty < 3
      ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
      : "bg-green-50 text-green-700 border border-green-100";

  const stockColor = (qty: number) =>
    qty === 0 ? "text-red-500" : qty < 3 ? "text-yellow-600" : "text-green-600";

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Inventory</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{products.length} total products</p>
        </div>
      </div>

      {/* Alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
              <Ban size={18} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium text-[13px]">{outOfStock.length} products out of stock</p>
                <p className="text-red-400 text-[11px]">Immediate restocking needed</p>
              </div>
            </div>
          )}
          {lowStock.filter((p) => totalStock(p.size_inventory) > 0).length > 0 && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3.5">
              <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-yellow-700 font-medium text-[13px]">
                  {lowStock.filter((p) => totalStock(p.size_inventory) > 0).length} products low stock (&lt;5 total)
                </p>
                <p className="text-yellow-500 text-[11px]">Consider restocking soon</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="lg:col-span-2 space-y-3">
          {/* Mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {products.map((product) => {
              const total = totalStock(product.size_inventory);
              return (
                <div key={product.id} className="bg-white border border-[#f2cfe3] rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-[#1a0914] font-medium text-[13px]">{product.name}</p>
                      <p className="text-[#dbb6ca] text-[11px] capitalize mt-0.5">
                        {product.category}{product.sku ? ` · ${product.sku}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => { setAdjustModal(product); setAdjustment({ size: "M", change: "", reason: "" }); }}
                      className="px-3 py-1.5 bg-[#c2477f]/10 text-[#c2477f] border border-[#c2477f]/30 rounded-xl text-[12px] font-medium hover:bg-[#c2477f]/20 transition-colors flex-shrink-0"
                    >
                      Adjust
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {SIZES.map((size) => {
                      const qty = product.size_inventory[size] ?? 0;
                      return (
                        <div key={size} className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border ${stockPillCls(qty)}`}>
                          <span className="text-[9px] font-semibold uppercase">{size}</span>
                          <span className="text-[13px] font-bold">{qty}</span>
                        </div>
                      );
                    })}
                    <div className="ml-auto">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        total === 0 ? "bg-red-50 text-red-600" : total < 5 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
                      }`}>
                        {total === 0 ? "Out of Stock" : total < 5 ? "Low" : "In Stock"} ({total})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-[#f2cfe3] rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#f2cfe3] bg-[#fdeaf2]/40">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Product</th>
                  {SIZES.map((s) => (
                    <th key={s} className="text-center px-3 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">{s}</th>
                  ))}
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2cfe3]">
                {products.map((product) => {
                  const total = totalStock(product.size_inventory);
                  return (
                    <tr key={product.id} className="hover:bg-[#fdeaf2]/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-[#1a0914] font-medium text-[13px]">{product.name}</p>
                        <p className="text-[#dbb6ca] text-[11px] capitalize mt-0.5">{product.category}{product.sku ? ` · ${product.sku}` : ""}</p>
                      </td>
                      {SIZES.map((size) => {
                        const qty = product.size_inventory[size] ?? 0;
                        return (
                          <td key={size} className="px-3 py-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-bold border ${stockPillCls(qty)}`}>{qty}</span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          total === 0 ? "bg-red-50 text-red-600" : total < 5 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
                        }`}>
                          {total === 0 ? "Out" : total < 5 ? "Low" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => { setAdjustModal(product); setAdjustment({ size: "M", change: "", reason: "" }); }}
                          className="px-3 py-1.5 bg-[#c2477f]/10 text-[#c2477f] border border-[#c2477f]/30 rounded-xl text-[12px] font-medium hover:bg-[#c2477f]/20 transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6">
          <h2 className="text-[#1a0914] font-semibold text-[15px] mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#8c5971] text-[13px]">No activity yet</p>
              </div>
            ) : (
              logs.map((log) => {
                const product = products.find((p) => p.id === log.product_id);
                return (
                  <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-[#f2cfe3] last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.change > 0 ? "bg-green-50" : "bg-red-50"}`}>
                      {log.change > 0 ? <Plus size={14} className="text-green-600" /> : <Minus size={14} className="text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#52304a] text-[12px] font-medium truncate">{product?.name || "Unknown"}</p>
                      {log.size && <p className="text-[#8c5971] text-[11px]">Size: {log.size}</p>}
                      <p className={`font-bold text-[13px] ${log.change > 0 ? "text-green-600" : "text-red-500"}`}>
                        {log.change > 0 ? "+" : ""}{log.change}
                      </p>
                      {log.reason && <p className="text-[#8c5971] text-[11px]">{log.reason}</p>}
                      <p className="text-[#dbb6ca] text-[10px]">{new Date(log.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustModal && (
        <div
          className="fixed inset-0 z-50 bg-[#1a0914]/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setAdjustModal(null)}
        >
          <div className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-7 w-full max-w-md shadow-xl">
            <h2 className="text-[#1a0914] font-bold text-[18px] mb-1">Adjust Stock</h2>
            <p className="text-[#8c5971] text-[13px] mb-5">{adjustModal.name}</p>

            {/* Per-size current stock */}
            <div className="mb-5 grid grid-cols-6 gap-2">
              {SIZES.map((size) => {
                const qty = adjustModal.size_inventory[size] ?? 0;
                return (
                  <div key={size} className={`flex flex-col items-center gap-1 rounded-xl p-2 border ${stockPillCls(qty)}`}>
                    <span className="text-[9px] font-semibold uppercase">{size}</span>
                    <span className={`text-[16px] font-bold ${stockColor(qty)}`}>{qty}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-2 block">Size</label>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setAdjustment({ ...adjustment, size })}
                      className={`h-10 border rounded-xl font-semibold text-[12px] transition-colors ${
                        adjustment.size === size
                          ? "border-[#c2477f] bg-[#c2477f]/10 text-[#c2477f]"
                          : "border-[#dbb6ca] text-[#8c5971] hover:border-[#c2477f]/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">
                  Change (+ to add, − to remove)
                </label>
                <input
                  required
                  type="number"
                  value={adjustment.change}
                  onChange={(e) => setAdjustment({ ...adjustment, change: e.target.value })}
                  className="w-full bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl px-4 py-3 text-[#1a0914] text-[13px] focus:border-[#c2477f]/60 focus:outline-none transition-colors"
                  placeholder="e.g. +5 or -2"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider mb-1.5 block">Reason</label>
                <input
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                  className="w-full bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl px-4 py-3 text-[#1a0914] placeholder:text-[#dbb6ca] text-[13px] focus:border-[#c2477f]/60 focus:outline-none transition-colors"
                  placeholder="e.g. Restock, Damage, Sale adjustment"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating === adjustModal.id}
                  className="flex-1 py-3.5 bg-[#c2477f] text-white font-medium text-[14px] rounded-xl hover:bg-[#962259] transition-colors disabled:opacity-60"
                >
                  {updating === adjustModal.id ? "Saving..." : `Apply to ${adjustment.size}`}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-6 py-3.5 border border-[#dbb6ca] text-[#8c5971] rounded-xl hover:border-[#c2477f]/40 hover:text-[#1a0914] transition-colors font-medium text-[14px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
