import type { Metadata } from "next";
import ContactPage from "./client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about sizing, fabric, or an order? Reach Tantava via our contact form or chat on WhatsApp — we typically respond within a few hours.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Tantava", url: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
