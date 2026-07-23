import { Suspense } from "react";
import type { Metadata } from "next";
import CollectionSlugPage from "./client";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Collection } from "@/lib/supabase";

type Props = { params: Promise<{ slug: string }> };

async function getCollection(slug: string): Promise<Collection | null> {
  "use cache";
  const supabase = createServerSupabase();
  const { data } = await supabase.from("collections").select("*").eq("slug", slug).single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};

  const title = collection.name;
  const description =
    collection.description?.slice(0, 155) ||
    `Shop the ${collection.name} collection at Tantava — curated ethnic & Indo-Western wear.`;
  const image = collection.cover_image || "/og-image.png";

  return {
    title,
    description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title,
      description,
      url: `/collections/${collection.slug}`,
      type: "website",
      images: [{ url: image, alt: collection.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CollectionSlugPage />
    </Suspense>
  );
}
