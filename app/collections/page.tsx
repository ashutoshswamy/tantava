import type { Metadata } from "next";
import CollectionsPage from "./client";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated edits from Tantava — explore each collection to find your perfect ethnic or Indo-Western piece.",
  alternates: { canonical: "/collections" },
  openGraph: { title: "Collections | Tantava", url: "/collections" },
};

export default function Page() {
  return <CollectionsPage />;
}
