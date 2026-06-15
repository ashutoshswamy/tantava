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
          <Loader2 size={48} className="text-[#9e3462] animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !collection) {
    return (
      <>
        <Navbar activePage="shop" />
        <main className="min-h-screen bg-[#fff9fb] flex flex-col items-center justify-center text-center px-4">
          <Layers size={48} className="text-[#eec7dd] mb-4" />
          <h1 className="font-headline-lg text-[32px] text-[#21101a] mb-3">Collection Not Found</h1>
          <p className="text-[#8c5971] mb-6">This collection doesn't exist or has been removed.</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#9e3462] text-white rounded-lg font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors"
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

      <main className="min-h-screen bg-[#fff9fb]">
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
                <h1 className="font-headline-lg text-[36px] sm:text-[48px] leading-tight">
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
            <div className="bg-[#fce8f0] py-12 px-4 text-center">
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 text-[#8c5971] hover:text-[#21101a] text-[13px] font-label-md mb-3 transition-colors"
              >
                <ArrowLeft size={14} />
                Collections
              </Link>
              <h1 className="font-headline-lg text-[36px] sm:text-[48px] text-[#21101a]">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-2 text-[#8c5971] text-[14px] max-w-lg mx-auto font-body-md">
                  {collection.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[#8c5971] text-[13px] font-label-md mb-8">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <Layers size={40} className="text-[#eec7dd] mx-auto mb-4" />
              <p className="text-[#8c5971] text-[16px]">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative bg-white border border-[#eec7dd] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#9e3462]/30 transition-all duration-300">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#fce8f0]">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#fce8f0]" />
                      )}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#9e3462] text-white text-[10px] font-label-md uppercase tracking-wider rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isWished(product.id)
                        ? "bg-[#9e3462] text-white"
                        : "bg-white/80 text-[#8c5971] hover:text-[#9e3462]"
                    }`}
                  >
                    <Heart size={14} fill={isWished(product.id) ? "currentColor" : "none"} />
                  </button>

                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-label-md text-[14px] text-[#21101a] leading-snug line-clamp-2 hover:text-[#9e3462] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {product.fabric && (
                      <p className="text-[#8c5971] text-[11px] mt-0.5 capitalize">{product.fabric}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-headline-sm text-[16px] text-[#21101a]">
                        ₹{(product.price / 100).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => { setSelectedProduct(product); setSelectedSize(""); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9e3462] text-white rounded-lg text-[12px] font-label-md hover:bg-[#7d1a48] transition-colors"
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
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover border border-[#eec7dd]" />
              )}
              <div>
                <h3 className="font-label-md text-[14px] text-[#21101a] leading-snug">{selectedProduct.name}</h3>
                <p className="text-[#9e3462] text-[13px] font-headline-sm">₹{(selectedProduct.price / 100).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div>
              <p className="text-[#8c5971] font-label-md text-[12px] uppercase tracking-wider mb-2">Select Size</p>
              {sizesWithStock.length === 0 ? (
                <p className="text-[#d9afc0] text-[13px]">Out of stock</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizesWithStock.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg border text-[13px] font-label-md transition-all ${
                        selectedSize === s
                          ? "bg-[#9e3462] text-white border-[#9e3462]"
                          : "border-[#eec7dd] text-[#21101a] hover:border-[#9e3462]/50"
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
              className="w-full py-3 bg-[#9e3462] text-white rounded-lg font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
