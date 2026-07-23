import type { Metadata } from "next";
import ShopPage from "./client";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse Tantava's full curated collection of handcrafted kurtas, anarkalis, sarees, and fusion sets. XS–XXXL, pan-India shipping.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop All | Tantava", url: "/shop" },
};

export default function Page() {
  return <ShopPage />;
}
