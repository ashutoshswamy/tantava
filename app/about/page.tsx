import type { Metadata } from "next";
import AboutPage from "./client";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Tantava is a celebration of handloom craft — timeless ethnic & Indo-Western silhouettes cut from fabric woven by artisans across India.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Tantava", url: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
