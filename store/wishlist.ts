"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type WishlistStore = {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isWished: (productId: string) => boolean;
  itemCount: () => number;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const exists = get().items.find((i) => i.productId === item.productId);
        if (exists) {
          set((state) => ({ items: state.items.filter((i) => i.productId !== item.productId) }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      isWished: (productId) => get().items.some((i) => i.productId === productId),
      itemCount: () => get().items.length,
    }),
    { name: "tantava-wishlist" }
  )
);
