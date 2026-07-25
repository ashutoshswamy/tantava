import { Suspense } from "react";
import type { Metadata } from "next";
import ProductDetailPage from "./client";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Category, Product } from "@/lib/supabase";

type Props = { params: Promise<{ id: string }> };

async function getProduct(id: string): Promise<Product | null> {
  "use cache";
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*, product_categories(categories(*))")
    .eq("id", id)
    .single();
  if (!data) return null;
  const { product_categories, ...rest } = data;
  return {
    ...rest,
    categories: (product_categories ?? []).map((pc: { categories: Category }) => pc.categories),
  } as Product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const title = product.name;
  const description =
    product.description?.slice(0, 155) ||
    `Shop ${product.name} at Tantava — handcrafted ethnic wear with pan-India shipping.`;
  const image = product.images[0] || "/og-image.png";

  return {
    title,
    description,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: {
      title,
      description,
      url: `/shop/${product.id}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function ProductJsonLd({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.images,
    sku: product.sku ?? undefined,
    category: product.categories.map((c) => c.name).join(", ") || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: ((product.discount_price ?? product.price) / 100).toFixed(2),
      availability: Object.values(product.size_inventory ?? {}).some((qty) => qty > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://thetantava.in/shop/${product.id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Page({ params }: Props) {
  return (
    <>
      <Suspense fallback={null}>
        <ProductJsonLd params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <ProductDetailPage />
      </Suspense>
    </>
  );
}
