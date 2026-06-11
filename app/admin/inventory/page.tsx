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
        <Loader2 size={48} className="text-[#9e3462] animate-spin" />
      </div>
    );
  }

  const lowStock = products.filter((p) => p.stock_quantity < 3);
  const outOfStock = products.filter((p) => p.stock_quantity === 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-[#21101a] mb-1">Inventory Management</h1>
        <p className="text-[#8c5971] text-[13px]">{products.length} total products</p>
      </div>

      {/* Alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <Ban size={20} className="text-red-500" />
              <div>
                <p className="text-red-700 font-label-md text-[13px]">{outOfStock.length} products out of stock</p>
                <p className="text-red-400 text-[11px]">Immediate restocking needed</p>
              </div>
            </div>
          )}
          {lowStock.filter((p) => p.stock_quantity > 0).length > 0 && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <AlertTriangle size={20} className="text-yellow-600" />
              <div>
                <p className="text-yellow-700 font-label-md text-[13px]">
                  {lowStock.filter((p) => p.stock_quantity > 0).length} products low stock (&lt;3)
                </p>
                <p className="text-yellow-500 text-[11px]">Consider restocking soon</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:hidden">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-[#eec7dd] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[#21101a] font-label-md text-[13px]">{product.name}</p>
                    <p className="text-[#d9afc0] text-[11px] capitalize">
                      {product.category} {product.sku ? `• ${product.sku}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => { setAdjustModal(product); setAdjustment({ change: "", reason: "" }); }}
                    className="px-3 py-1.5 bg-[#9e3462]/10 text-[#9e3462] border border-[#9e3462]/30 rounded-lg font-label-md text-[12px] hover:bg-[#9e3462]/20 transition-colors"
                  >
                    Adjust
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span
                    className={`text-[20px] font-bold ${
                      product.stock_quantity === 0
                        ? "text-red-500"
                        : product.stock_quantity < 3
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock_quantity}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-label-md ${
                      product.stock_quantity === 0
                        ? "bg-red-50 text-red-600"
                        : product.stock_quantity < 3
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {product.stock_quantity === 0 ? "Out of Stock" : product.stock_quantity < 3 ? "Low" : "In Stock"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block bg-white border border-[#eec7dd] rounded-xl overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#eec7dd]">
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[12px] uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[12px] uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 text-[#8c5971] font-label-md text-[12px] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#eec7dd] hover:bg-[#fce8f0]/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[#21101a] font-label-md text-[13px]">{product.name}</p>
                    <p className="text-[#d9afc0] text-[11px] capitalize">{product.category} {product.sku ? `• ${product.sku}` : ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[20px] font-bold ${
                          product.stock_quantity === 0
                            ? "text-red-500"
                            : product.stock_quantity < 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                      <div className="w-16 h-1.5 bg-[#eec7dd] rounded-full overflow-hidden">
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
                          ? "bg-red-50 text-red-600"
                          : product.stock_quantity < 3
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {product.stock_quantity === 0 ? "Out of Stock" : product.stock_quantity < 3 ? "Low" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setAdjustModal(product); setAdjustment({ change: "", reason: "" }); }}
                      className="px-3 py-1.5 bg-[#9e3462]/10 text-[#9e3462] border border-[#9e3462]/30 rounded-lg font-label-md text-[12px] hover:bg-[#9e3462]/20 transition-colors"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white border border-[#eec7dd] rounded-xl p-6">
          <h2 className="text-[#21101a] font-headline-sm text-[16px] mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-[#8c5971] text-[13px] text-center py-8">No activity yet</p>
            ) : (
              logs.map((log) => {
                const product = products.find((p) => p.id === log.product_id);
                return (
                  <div key={log.id} className="flex items-start gap-3 py-2 border-b border-[#eec7dd]">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        log.change > 0 ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {log.change > 0
                        ? <Plus size={14} className="text-green-600" />
                        : <Minus size={14} className="text-red-500" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#533347] text-[12px] truncate">
                        {product?.name || "Unknown"}
                      </p>
                      <p className={`font-bold text-[13px] ${log.change > 0 ? "text-green-600" : "text-red-500"}`}>
                        {log.change > 0 ? "+" : ""}{log.change}
                      </p>
                      {log.reason && (
                        <p className="text-[#8c5971] text-[11px]">{log.reason}</p>
                      )}
                      <p className="text-[#d9afc0] text-[10px]">
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
          className="fixed inset-0 z-50 bg-[#21101a]/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setAdjustModal(null)}
        >
          <div className="bg-white border border-[#eec7dd] rounded-xl p-5 sm:p-8 w-full max-w-md">
            <h2 className="text-[#21101a] font-headline-sm text-[20px] mb-2">Adjust Stock</h2>
            <p className="text-[#8c5971] text-[13px] mb-6">{adjustModal.name}</p>
            <p className="text-[#533347] text-[13px] mb-6">
              Current stock: <span className="text-[#9e3462] font-bold">{adjustModal.stock_quantity}</span>
            </p>
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">
                  Change (+ to add, - to remove)
                </label>
                <input
                  required
                  type="number"
                  value={adjustment.change}
                  onChange={(e) => setAdjustment({ ...adjustment, change: e.target.value })}
                  className="w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors"
                  placeholder="e.g. +5 or -2"
                />
              </div>
              <div>
                <label className="block text-[#8c5971] font-label-md text-[12px] mb-2 uppercase tracking-wider">
                  Reason
                </label>
                <input
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                  className="w-full bg-[#fce8f0] border border-[#d9afc0]/50 rounded-lg px-4 py-3 text-[#21101a] placeholder:text-[#d9afc0] font-body-md text-[14px] focus:border-[#9e3462]/50 focus:outline-none transition-colors"
                  placeholder="e.g. Restock, Damage, Sale adjustment"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating === adjustModal.id}
                  className="flex-1 py-3 bg-[#9e3462] text-white font-label-md text-[14px] rounded-lg hover:bg-[#7d1a48] transition-colors disabled:opacity-60"
                >
                  {updating === adjustModal.id ? "Saving..." : "Apply Adjustment"}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-6 py-3 border border-[#d9afc0] text-[#8c5971] rounded-lg hover:border-[#9e3462]/40 hover:text-[#21101a] transition-colors font-label-md text-[14px]"
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
