"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/supabase";
import { Plus, Search, Loader2, Pencil, Trash2, Package } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products?active=all")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const toggleActive = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !product.is_active } : p))
      );
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
  const totalStock = (inv: Record<string, number>) => Object.values(inv || {}).reduce((s, v) => s + v, 0);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Products</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c2477f] text-white text-[13px] font-medium rounded-xl hover:bg-[#962259] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c5971]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fdeaf2] border border-[#dbb6ca]/40 rounded-xl pl-10 pr-4 py-3 text-[#1a0914] placeholder:text-[#dbb6ca] text-[13px] focus:border-[#c2477f]/60 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="text-[#c2477f] animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white border border-[#f2cfe3] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded-xl flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[#1a0914] font-medium text-[13px] leading-tight">{product.name}</p>
                    {product.sku && <p className="text-[#dbb6ca] text-[11px] mt-0.5">{product.sku}</p>}
                    <p className="mt-1.5 text-[#c2477f] font-semibold text-[13px]">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-[12px] text-[#8c5971] capitalize mt-0.5">
                      {product.category} · Stock {totalStock(product.size_inventory)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize transition-colors ${
                      product.is_active
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-[#fdeaf2] text-[#8c5971] hover:bg-[#f8dde9]"
                    }`}
                  >
                    {product.is_active ? "Active" : "Hidden"}
                  </button>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-[#8c5971] hover:text-[#1a0914] rounded-lg hover:bg-[#fdeaf2] transition-colors"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={deleting === product.id}
                      className="p-2 text-[#8c5971] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Package size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
                <p className="text-[#8c5971] text-[14px] font-medium">No products found</p>
                <p className="text-[#dbb6ca] text-[12px] mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-[#f2cfe3] rounded-2xl overflow-hidden">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#f2cfe3] bg-[#fdeaf2]/40">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c5971] uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2cfe3]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fdeaf2]/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-[#1a0914] font-medium text-[13px] leading-tight">{product.name}</p>
                          {product.sku && (
                            <p className="text-[#dbb6ca] text-[11px] mt-0.5">{product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize" style={{ backgroundColor: "#c2477f18", color: "#c2477f" }}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#c2477f] font-semibold text-[13px]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const total = totalStock(product.size_inventory);
                        return (
                          <span className={`font-semibold text-[13px] ${total === 0 ? "text-red-500" : total < 5 ? "text-yellow-600" : "text-green-600"}`}>
                            {total}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize transition-colors ${
                          product.is_active
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-[#fdeaf2] text-[#8c5971] hover:bg-[#f8dde9]"
                        }`}
                      >
                        {product.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-[#8c5971] hover:text-[#1a0914] rounded-lg hover:bg-[#fdeaf2] transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-[#8c5971] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Package size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
                <p className="text-[#8c5971] text-[14px] font-medium">No products found</p>
                <p className="text-[#dbb6ca] text-[12px] mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
