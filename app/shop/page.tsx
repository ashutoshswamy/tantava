"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/supabase";
import {
  SlidersHorizontal, Loader2, ExternalLink, X, Heart, Search, ArrowDown,
} from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { AnimatePresence, motion } from "framer-motion";

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function firstAvailableSize(product: Product): string {
  return SIZES.find((s) => (product.size_inventory?.[s] ?? 0) > 0) || SIZES[0];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalImg, setModalImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();
  const { toggleItem, isWished } = useWishlist();

  useEffect(() => {
    fetch("/api/products?active=true")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!modalProduct || modalProduct.images.length <= 1) return;
    const timer = setInterval(() => {
      setModalImg((i) => (i + 1) % modalProduct.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [modalProduct]);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const filtered = products
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      return 0; // Featured: keep the site-wide order set in the admin panel
    });

  const effectivePrice = (product: Product) =>
    product.discount_price != null && product.discount_price < product.price ? product.discount_price : product.price;

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice(product),
      image: product.images[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    setModalProduct(null);
  };

  return (
    <>
      <Navbar activePage="shop" />

      <header className="pt-8 sm:pt-12 pb-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
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
              {products.length > 0 ? `${products.length} pieces` : "Discover our collection"} kurtas, anarkalis, and fusion sets for office, festive, and everyday elegance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="flex w-full sm:min-w-[260px] items-center gap-2 border border-outline-variant rounded-lg px-4 py-2.5 bg-surface-container-lowest">
              <Search size={16} className="text-outline flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="bg-transparent font-label-md text-label-md text-on-surface placeholder:text-outline outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-outline hover:text-primary">
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Sort */}
            <div className="flex w-full sm:w-auto items-center gap-2 border-b border-outline-variant pb-2 sm:pb-2 sm:min-w-[180px]">
              <SlidersHorizontal size={18} className="text-outline" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface-variant cursor-pointer w-full outline-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
        <div className="flex flex-col lg:flex-row gap-gutter">
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
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-10 md:gap-y-12 gap-x-5 md:gap-x-8"
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
                        {/* Wishlist heart */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleItem({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images[0] || "",
                              category: product.category,
                            });
                          }}
                          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm ${
                            isWished(product.id)
                              ? "bg-primary text-on-primary"
                              : "bg-surface/80 text-on-surface-variant hover:bg-primary hover:text-on-primary"
                          }`}
                        >
                          <Heart size={16} className={isWished(product.id) ? "fill-on-primary" : ""} />
                        </button>
                        {Object.values(product.size_inventory || {}).reduce((s, v) => s + v, 0) === 0 && (
                          <div className="absolute top-4 left-4 z-10 bg-error text-on-error px-2 py-1 text-[10px] font-label-md rounded">
                            Sold Out
                          </div>
                        )}
                        <img
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          src={product.images[0] || ""}
                        />
                        <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 md:translate-y-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                          <button
                            onClick={() => { setModalProduct(product); setSelectedSize(firstAvailableSize(product)); setModalImg(0); }}
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
                          {product.category} •{" "}
                          {product.discount_price != null && product.discount_price < product.price ? (
                            <>
                              <span className="text-sale-green inline-flex items-center gap-0.5">
                                <ArrowDown size={12} strokeWidth={2.5} />
                                {formatPrice(product.discount_price)}
                              </span>{" "}
                              <span className="line-through">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            formatPrice(product.price)
                          )}
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
                <div className="relative w-full md:w-1/2 aspect-[0.73] bg-surface-container overflow-hidden">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={modalImg}
                      alt={modalProduct.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-contain"
                      src={modalProduct.images[modalImg] || modalProduct.images[0] || ""}
                    />
                  </AnimatePresence>
                  {modalProduct.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {modalProduct.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setModalImg(i)}
                          className={`h-1.5 rounded-full transition-all ${i === modalImg ? "w-5 bg-primary" : "w-1.5 bg-surface/80"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 space-y-6">
                  <div>
                    <span className="font-label-md text-label-md text-primary tracking-widest uppercase capitalize">
                      {modalProduct.category}
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary mt-2">{modalProduct.name}</h2>
                    {modalProduct.discount_price != null && modalProduct.discount_price < modalProduct.price ? (
                      <p className="font-headline-sm text-[20px] text-on-surface mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-sale-green flex items-center gap-1">
                          <ArrowDown size={16} strokeWidth={2.5} />
                          {formatPrice(modalProduct.discount_price)}
                        </span>
                        <span className="text-on-surface-variant text-[15px] line-through">{formatPrice(modalProduct.price)}</span>
                        <span className="text-sale-green text-[12px] font-label-md">
                          {Math.round((1 - modalProduct.discount_price / modalProduct.price) * 100)}% OFF
                        </span>
                      </p>
                    ) : (
                      <p className="font-headline-sm text-[20px] text-on-surface mt-1">
                        {formatPrice(modalProduct.price)}
                      </p>
                    )}
                    {modalProduct.free_delivery && (
                      <p className="font-label-md text-[11px] text-primary uppercase tracking-wider mt-1">Free Delivery</p>
                    )}
                  </div>
                  {modalProduct.description && (
                    <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">{modalProduct.description}</p>
                  )}
                  <div className="space-y-4 pt-4 border-t border-outline-variant">
                    <div>
                      <span className="font-label-md text-label-md block mb-2">Select Size</span>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((size) => {
                          const qty = modalProduct.size_inventory?.[size] ?? 0;
                          const outOfStock = qty === 0;
                          return (
                            <button
                              key={size}
                              onClick={() => !outOfStock && setSelectedSize(size)}
                              disabled={outOfStock}
                              className={`w-12 h-12 border rounded flex items-center justify-center font-label-md transition-all relative ${
                                outOfStock
                                  ? "border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed"
                                  : selectedSize === size
                                  ? "border-primary text-primary bg-primary/5"
                                  : "border-outline-variant hover:border-primary hover:text-primary"
                              }`}
                            >
                              {size}
                              {outOfStock && <span className="absolute inset-0 flex items-center justify-center"><span className="absolute w-full h-px bg-outline-variant/50 rotate-45" /></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {(() => {
                      const selectedQty = modalProduct.size_inventory?.[selectedSize] ?? 0;
                      return (
                        <button
                          onClick={() => handleAddToCart(modalProduct)}
                          disabled={selectedQty === 0}
                          className="w-full bg-primary text-on-primary py-4 rounded font-label-md text-label-md tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {selectedQty === 0 ? `Out of Stock in ${selectedSize}` : "ADD TO BAG"}
                        </button>
                      );
                    })()}
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
