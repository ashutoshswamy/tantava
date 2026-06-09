"use client";

import { useEffect, useState } from "react";
import { Loader2, Ban, AlertTriangle, Plus, Minus } from "lucide-react";

type InventoryProduct = {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  stock_quantity: number;
  is_active: boolean;
};

type InventoryLog = {
  id: string;
  product_id: string;
  change: number;
  reason: string | null;
  created_at: string;
};

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [adjustModal, setAdjustModal] = useState<InventoryProduct | null>(null);
  const [adjustment, setAdjustment] = useState({ change: "", reason: "" });

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
        change: parseInt(adjustment.change),
        reason: adjustment.reason,
      }),
    });

    if (res.ok) {
      fetchData();
      setAdjustModal(null);
      setAdjustment({ change: "", reason: "" });
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  const lowStock = products.filter((p) => p.stock_quantity < 3);
  const outOfStock = products.filter((p) => p.stock_quantity === 0);

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-white mb-1">Inventory Management</h1>
        <p className="text-white/40 text-[13px]">{products.length} total products</p>
      </div>

      {/* Alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <Ban size={20} className="text-red-400" />
              <div>
                <p className="text-red-400 font-label-md text-[13px]">{outOfStock.length} products out of stock</p>
                <p className="text-red-400/50 text-[11px]">Immediate restocking needed</p>
              </div>
            </div>
          )}
          {lowStock.filter((p) => p.stock_quantity > 0).length > 0 && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <AlertTriangle size={20} className="text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-label-md text-[13px]">
                  {lowStock.filter((p) => p.stock_quantity > 0).length} products low stock (&lt;3)
                </p>
                <p className="text-yellow-400/50 text-[11px]">Consider restocking soon</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-label-md text-[13px]">{product.name}</p>
                    <p className="text-white/30 text-[11px] capitalize">{product.category} {product.sku ? `• ${product.sku}` : ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[20px] font-bold ${
                          product.stock_quantity === 0
                            ? "text-red-400"
                            : product.stock_quantity < 3
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            product.stock_quantity === 0
                              ? "bg-red-400"
                              : product.stock_quantity < 3
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: `${Math.min((product.stock_quantity / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-label-md ${
                        product.stock_quantity === 0
                          ? "bg-red-500/15 text-red-400"
                          : product.stock_quantity < 3
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-green-500/15 text-green-400"
                      }`}
                    >
                      {product.stock_quantity === 0 ? "Out of Stock" : product.stock_quantity < 3 ? "Low" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setAdjustModal(product); setAdjustment({ change: "", reason: "" }); }}
                      className="px-3 py-1.5 bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg font-label-md text-[12px] hover:bg-[#C9A84C]/25 transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Logs */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
          <h2 className="text-white font-headline-sm text-[16px] mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-white/30 text-[13px] text-center py-8">No activity yet</p>
            ) : (
              logs.map((log) => {
                const product = products.find((p) => p.id === log.product_id);
                return (
                  <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        log.change > 0 ? "bg-green-500/15" : "bg-red-500/15"
                      }`}
                    >
                      {log.change > 0
                        ? <Plus size={14} className="text-green-400" />
                        : <Minus size={14} className="text-red-400" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/70 text-[12px] truncate">
                        {product?.name || "Unknown"}
                      </p>
                      <p className={`font-bold text-[13px] ${log.change > 0 ? "text-green-400" : "text-red-400"}`}>
                        {log.change > 0 ? "+" : ""}{log.change}
                      </p>
                      {log.reason && (
                        <p className="text-white/30 text-[11px]">{log.reason}</p>
                      )}
                      <p className="text-white/20 text-[10px]">
                        {new Date(log.created_at).toLocaleDateString("en-IN")}
                      </p>
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setAdjustModal(null)}
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 w-full max-w-md">
            <h2 className="text-white font-headline-sm text-[20px] mb-2">Adjust Stock</h2>
            <p className="text-white/40 text-[13px] mb-6">{adjustModal.name}</p>
            <p className="text-white/60 text-[13px] mb-6">
              Current stock: <span className="text-[#C9A84C] font-bold">{adjustModal.stock_quantity}</span>
            </p>
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">
                  Change (+ to add, - to remove)
                </label>
                <input
                  required
                  type="number"
                  value={adjustment.change}
                  onChange={(e) => setAdjustment({ ...adjustment, change: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                  placeholder="e.g. +5 or -2"
                />
              </div>
              <div>
                <label className="block text-white/50 font-label-md text-[12px] mb-2 uppercase tracking-wider">
                  Reason
                </label>
                <input
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                  placeholder="e.g. Restock, Damage, Sale adjustment"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating === adjustModal.id}
                  className="flex-1 py-3 bg-[#C9A84C] text-black font-label-md text-[14px] rounded-lg hover:bg-[#C9A84C]/90 transition-colors disabled:opacity-60"
                >
                  {updating === adjustModal.id ? "Saving..." : "Apply Adjustment"}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-6 py-3 border border-white/10 text-white/60 rounded-lg hover:border-white/20 hover:text-white transition-colors font-label-md text-[14px]"
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
