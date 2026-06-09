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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-[28px] text-white mb-1">Products</h1>
          <p className="text-white/40 text-[13px]">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-[#C9A84C] text-black font-label-md text-[13px] rounded-lg hover:bg-[#C9A84C]/90 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/30 font-body-md text-[14px] focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={48} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 text-white/40 font-label-md text-[12px] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-white font-label-md text-[13px] leading-tight">{product.name}</p>
                        {product.sku && (
                          <p className="text-white/30 text-[11px]">{product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-white/5 rounded text-white/60 font-label-md text-[12px] capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#C9A84C] font-label-md text-[13px]">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-label-md text-[13px] ${
                        product.stock_quantity === 0
                          ? "text-red-400"
                          : product.stock_quantity < 3
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`px-3 py-1 rounded-full font-label-md text-[11px] transition-colors ${
                        product.is_active
                          ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {product.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        disabled={deleting === product.id}
                        className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Package size={48} className="mx-auto mb-2" />
              <p>No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
