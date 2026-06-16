"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Collection, Product } from "@/lib/supabase";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { Loader2, Heart, ShoppingBag, Layers, ArrowLeft } from "lucide-react";

export default function CollectionSlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");

  const addItem = useCart((s) => s.addItem);
  const { toggleItem: toggleWish, isWished } = useWishlist();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch all active collections and match by slug
        const colsRes = await fetch("/api/collections");
        const cols: Collection[] = await colsRes.json();
        const col = cols.find((c) => c.slug === slug);

        if (!col) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setCollection(col);

        // Fetch products in this collection
        const prodsRes = await fetch(`/api/products?collection_id=${col.id}`);
        const prods: Product[] = await prodsRes.json();
        setProducts(Array.isArray(prods) ? prods : []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const handleAddToCart = (product: Product) => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    toggleWish({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      category: product.category,
    });
  };

  if (loading) {
    return (
      <>
        <Navbar activePage="shop" />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 size={48} className="text-primary animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !collection) {
    return (
      <>
        <Navbar activePage="shop" />
        <main className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-4">
          <Layers size={48} className="text-[#eec7dd] mb-4" />
          <h1 className="font-headline-lg text-[32px] text-on-surface mb-3">Collection Not Found</h1>
          <p className="text-on-surface-variant mb-6">This collection doesn't exist or has been removed.</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-label-md text-[14px] hover:bg-primary-container transition-colors"
          >
            <ArrowLeft size={16} />
            All Collections
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const sizesWithStock = selectedProduct
    ? Object.entries(selectedProduct.size_inventory)
        .filter(([, qty]) => qty > 0)
        .map(([s]) => s)
    : [];

  return (
    <>
      <Navbar activePage="shop" />

      <main className="min-h-screen bg-surface">
        {/* Hero */}
        <div className="relative overflow-hidden">
          {collection.cover_image ? (
            <div className="relative h-48 sm:h-64 md:h-80">
              <img
                src={collection.cover_image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                <Link
                  href="/collections"
                  className="flex items-center gap-1.5 text-white/80 hover:text-white text-[13px] font-label-md mb-3 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Collections
                </Link>
                <h1 className="font-headline-lg text-[26px] sm:text-[36px] md:text-[48px] leading-tight">
                  {collection.name}
                </h1>
                {collection.description && (
                  <p className="mt-2 text-white/80 text-[14px] max-w-lg font-body-md">
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface-container py-12 px-4 text-center">
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface text-[13px] font-label-md mb-3 transition-colors"
              >
                <ArrowLeft size={14} />
                Collections
              </Link>
              <h1 className="font-headline-lg text-[26px] sm:text-[36px] md:text-[48px] text-on-surface">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-2 text-on-surface-variant text-[14px] max-w-lg mx-auto font-body-md">
                  {collection.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-on-surface-variant text-[13px] font-label-md mb-8">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <Layers size={40} className="text-[#eec7dd] mx-auto mb-4" />
              <p className="text-on-surface-variant text-[16px]">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative bg-white border border-outline-variant/40 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container" />
                      )}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[10px] font-label-md uppercase tracking-wider rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isWished(product.id)
                        ? "bg-primary text-white"
                        : "bg-white/80 text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    <Heart size={14} fill={isWished(product.id) ? "currentColor" : "none"} />
                  </button>

                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-label-md text-[14px] text-on-surface leading-snug line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.fabric && (
                      <p className="text-on-surface-variant text-[11px] mt-0.5 capitalize">{product.fabric}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-headline-sm text-[16px] text-on-surface">
                        ₹{(product.price / 100).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => { setSelectedProduct(product); setSelectedSize(""); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-label-md hover:bg-primary-container transition-colors"
                      >
                        <ShoppingBag size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Size picker modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {selectedProduct.images[0] && (
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover border border-outline-variant/40" />
              )}
              <div>
                <h3 className="font-label-md text-[14px] text-on-surface leading-snug">{selectedProduct.name}</h3>
                <p className="text-primary text-[13px] font-headline-sm">₹{(selectedProduct.price / 100).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div>
              <p className="text-on-surface-variant font-label-md text-[12px] uppercase tracking-wider mb-2">Select Size</p>
              {sizesWithStock.length === 0 ? (
                <p className="text-outline-variant text-[13px]">Out of stock</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizesWithStock.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg border text-[13px] font-label-md transition-all ${
                        selectedSize === s
                          ? "bg-primary text-white border-[#9e3462]"
                          : "border-outline-variant/40 text-on-surface hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={!selectedSize}
              onClick={() => handleAddToCart(selectedProduct)}
              className="w-full py-3 bg-primary text-white rounded-lg font-label-md text-[14px] hover:bg-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
