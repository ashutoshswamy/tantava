"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const formatPrice = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-on-surface/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[80] bg-surface shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-outline-variant/30">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Your Bag
                {items.length > 0 && (
                  <span className="ml-2 text-on-surface-variant font-body-md text-body-md">
                    ({items.length})
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 sm:px-8 sm:py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={64} className="text-outline-variant" />
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Your bag is empty
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-8 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-24 h-28 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-label-md text-label-md text-on-surface truncate">
                          {item.name}
                        </h3>
                        <p className="text-on-surface-variant font-label-md text-[12px] mt-0.5">
                          Size: {item.size}
                        </p>
                        <p className="font-headline-sm text-[16px] text-primary mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-outline-variant rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 font-label-md text-label-md text-on-surface">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-outline-variant/30 px-4 py-5 sm:px-8 sm:py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Subtotal
                  </span>
                  <span className="font-headline-sm text-[20px] text-on-surface">
                    {formatPrice(total())}
                  </span>
                </div>
                <p className="font-label-md text-[11px] text-on-surface-variant opacity-70">
                  Taxes and shipping calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-primary text-on-primary text-center py-4 rounded-lg font-label-md text-label-md tracking-widest hover:opacity-90 transition-opacity shadow-md"
                >
                  PROCEED TO CHECKOUT
                </Link>
                <button
                  onClick={onClose}
                  className="block w-full text-center py-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
