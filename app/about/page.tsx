import type { Metadata } from "next";
import AboutPage from "./client";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Threads of tradition and trends. Tantava Curated is our current collection — festive wear, office staples, everyday dresses, co-ord sets, and ethnic and Indo-Western pieces, each earned its place.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Tantava", url: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
