import type { Metadata } from "next";
import FaqPage from "./client";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Shipping, delivery, payments, exchanges, and care instructions — everything you need to know about shopping with Tantava.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "FAQ | Tantava", url: "/faq" },
};

export default function Page() {
  return <FaqPage />;
}
