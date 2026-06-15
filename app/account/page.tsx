"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { User, Package, ShoppingBag, Headphones, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const quickLinks = [
  { href: "/account/orders", icon: <Package size={28} />,     title: "My Orders",         desc: "Track and manage your orders" },
  { href: "/wishlist",       icon: <Heart size={28} />,        title: "My Wishlist",        desc: "View your saved pieces" },
  { href: "/shop",           icon: <ShoppingBag size={28} />, title: "Continue Shopping", desc: "Explore our curated collections" },
  { href: "/contact",        icon: <Headphones size={28} />,  title: "Support",            desc: "Get help with your orders" },
];

const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default function AccountPage() {
  const { user } = useUser();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});

  const handleAddToCart = (item: typeof items[number]) => {
    const size = sizeMap[item.productId] ?? "XS";
    addItem({ productId: item.productId, name: item.name, price: item.price, image: item.image, size, quantity: 1 });
    setAddedIds((prev) => ({ ...prev, [item.productId]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [item.productId]: false })), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-stack-lg min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-12">

          {/* Header */}
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">My Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, {user?.firstName || "valued customer"}
            </p>
          </div>

          {/* Profile + quick links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Avatar card */}
            <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center text-center gap-4">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
              )}
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">{user?.fullName}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="md:col-span-2 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-surface-container-low rounded-xl p-5 hover:bg-surface-container transition-colors group"
                >
                  <div className="text-primary mb-3 group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </div>
                  <h3 className="font-headline-sm text-[16px] text-on-surface mb-1">{item.title}</h3>
                  <p className="font-body-md text-[13px] text-on-surface-variant">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Wishlist section */}
          <div>
            <div className="flex flex-col items-start justify-between gap-3 min-[420px]:flex-row min-[420px]:items-center mb-6">
              <div className="flex items-center gap-2">
                <Heart size={20} className="fill-primary text-primary" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">My Wishlist</h2>
                {items.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-[12px]">
                    {items.length}
                  </span>
                )}
              </div>
              {items.length > 0 && (
                <Link href="/wishlist" className="font-label-md text-label-md text-primary hover:opacity-70 transition-opacity">
                  View all →
                </Link>
              )}
            </div>

            {items.length === 0 ? (
              <div className="bg-surface-container-low rounded-xl p-10 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                  <Heart size={28} className="text-outline" />
                </div>
                <div>
                  <p className="font-headline-sm text-[16px] text-on-surface mb-1">Nothing saved yet</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Heart pieces you love while browsing the shop.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 hover:shadow-md transition-shadow"
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
                            <h3 className="font-headline-sm text-[15px] text-on-surface hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="font-label-md text-label-md text-primary mt-0.5">{formatPrice(item.price)}</p>
                        </div>

                        {/* Size selector */}
                        <div className="flex gap-1 flex-wrap">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSizeMap((prev) => ({ ...prev, [item.productId]: s }))}
                              className={`w-8 h-8 text-[10px] border rounded font-label-md transition-colors ${
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
                            className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-md text-[12px] tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag size={13} />
                            {addedIds[item.productId] ? "Added!" : "Add to Bag"}
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="w-9 h-9 border border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant hover:border-error hover:text-error transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
