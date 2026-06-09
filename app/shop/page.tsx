"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/supabase";
import {
  SlidersHorizontal, Loader2, ExternalLink, X, ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

const CATEGORY_LABELS: Record<string, string> = {
  fusion: "Kurta & Suit Sets",
  sarees: "Sarees",
  lehengas: "Lehengas",
  gowns: "Gowns",
  jewellery: "Jewellery",
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products?active=true")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const filtered = products
    .filter((p) =>
      selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    setModalProduct(null);
  };

  return (
    <>
      <Navbar activePage="shop" />

      <header className="pt-32 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex gap-2 mb-4 text-on-surface-variant font-label-md text-label-md">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span className="text-primary">Shop All</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Handcrafted Kurtis & Fusion Wear
            </h1>
            <p className="max-w-2xl mt-4 font-body-lg text-body-lg text-on-surface-variant">
              {products.length > 0 ? `${products.length} pieces` : "Discover our collection"} — kurtas, anarkalis, and fusion sets for office, festive, and everyday elegance.
            </p>
          </div>
          <div className="flex items-center gap-4 border-b border-outline-variant pb-2 min-w-[200px]">
            <SlidersHorizontal size={20} className="text-outline" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface-variant cursor-pointer w-full outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4 uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-4 py-2 rounded-lg font-body-md text-body-md transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                    }`}
                  >
                    {cat === "All" ? "All Styles" : (CATEGORY_LABELS[cat.toLowerCase()] ?? cat)}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={48} className="text-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  No products found in this category.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8"
              >
                <AnimatePresence>
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group relative"
                    >
                      <div className="relative aspect-[0.73] overflow-hidden bg-surface-container mb-4">
                        {product.badge && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-secondary text-primary-container font-label-md text-[10px] px-3 py-1 uppercase tracking-widest border border-primary-container">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        {product.stock_quantity === 0 && (
                          <div className="absolute top-4 right-4 z-10 bg-error text-on-error px-2 py-1 text-[10px] font-label-md rounded">
                            Sold Out
                          </div>
                        )}
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={product.images[0] || ""}
                        />
                        <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <button
                            onClick={() => { setModalProduct(product); setSelectedSize("S"); }}
                            className="flex-1 bg-surface text-primary font-label-md text-label-md px-4 py-3 shadow-lg text-[12px] tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            QUICK VIEW
                          </button>
                          <Link
                            href={`/shop/${product.id}`}
                            className="w-12 h-12 bg-surface flex items-center justify-center shadow-lg hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            <ExternalLink size={18} />
                          </Link>
                        </div>
                      </div>
                      <Link href={`/shop/${product.id}`} className="space-y-1 block">
                        <h3 className="font-headline-sm text-headline-sm text-primary hover:opacity-80 transition-opacity">
                          {product.name}
                        </h3>
                        <p className="font-label-md text-label-md text-on-surface-variant capitalize">
                          {product.category} • {formatPrice(product.price)}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModalProduct(null)}
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative rounded-xl"
            >
              <button
                onClick={() => setModalProduct(null)}
                className="absolute top-4 right-4 text-on-surface hover:text-primary z-10 bg-surface rounded-full p-1"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 aspect-[0.73] bg-surface-container">
                  <img
                    alt={modalProduct.name}
                    className="w-full h-full object-cover"
                    src={modalProduct.images[0] || ""}
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
                  <div>
                    <span className="font-label-md text-label-md text-primary tracking-widest uppercase capitalize">
                      {modalProduct.category}
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary mt-2">{modalProduct.name}</h2>
                    <p className="font-headline-sm text-[20px] text-on-surface mt-1">
                      {formatPrice(modalProduct.price)}
                    </p>
                  </div>
                  {modalProduct.description && (
                    <p className="font-body-md text-body-md text-on-surface-variant">{modalProduct.description}</p>
                  )}
                  <div className="space-y-4 pt-4 border-t border-outline-variant">
                    <div>
                      <span className="font-label-md text-label-md block mb-2">Select Size</span>
                      <div className="flex gap-2">
                        {["XS", "S", "M", "L"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 border rounded flex items-center justify-center font-label-md transition-all ${
                              selectedSize === size
                                ? "border-primary text-primary bg-primary/5"
                                : "border-outline-variant hover:border-primary hover:text-primary"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(modalProduct)}
                      disabled={modalProduct.stock_quantity === 0}
                      className="w-full bg-primary text-on-primary py-4 rounded font-label-md text-label-md tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {modalProduct.stock_quantity === 0 ? "Out of Stock" : "ADD TO BAG"}
                    </button>
                    <Link
                      href={`/shop/${modalProduct.id}`}
                      onClick={() => setModalProduct(null)}
                      className="block w-full border border-primary text-primary py-4 rounded font-label-md text-label-md tracking-widest hover:bg-primary-container/10 transition-colors text-center"
                    >
                      VIEW FULL DETAILS
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
