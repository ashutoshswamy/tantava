"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});

  const formatPrice = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleAddToCart = (item: typeof items[number]) => {
    const size = sizeMap[item.productId] ?? "XS";
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size,
      quantity: 1,
    });
    setAddedIds((prev) => ({ ...prev, [item.productId]: true }));
    setTimeout(
      () => setAddedIds((prev) => ({ ...prev, [item.productId]: false })),
      2000
    );
  };

  return (
    <>
      <Navbar />
      <main className="pt-8 sm:pt-12 pb-stack-lg min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-10">
            <nav className="flex gap-2 mb-4 text-on-surface-variant font-label-md text-label-md">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span className="text-primary">Wishlist</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary flex items-center gap-3">
              <Heart size={32} className="fill-primary text-primary" />
              My Wishlist
            </h1>
            {items.length > 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24 text-center">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
                <Heart size={40} className="text-outline" />
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Your wishlist is empty
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Save pieces you love and come back to them anytime.
                </p>
              </div>
              <Link
                href="/shop"
                className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link href={`/shop/${item.productId}`} className="block relative aspect-[0.73] overflow-hidden bg-surface-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <Link href={`/shop/${item.productId}`}>
                          <h3 className="font-headline-sm text-[16px] text-on-surface hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="font-label-md text-label-md text-primary mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Size selector */}
                      <div className="flex gap-1 flex-wrap">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSizeMap((prev) => ({ ...prev, [item.productId]: s }))}
                            className={`w-9 h-9 text-[11px] border rounded font-label-md transition-colors ${
                              (sizeMap[item.productId] ?? "XS") === s
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-outline-variant text-on-surface-variant hover:border-primary"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-[12px] tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={14} />
                          {addedIds[item.productId] ? "Added!" : "Add to Bag"}
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant hover:border-error hover:text-error transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
