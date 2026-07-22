// Tantava — dummy data seed for local preview
// Inserts sample collections, categories, and products so the storefront
// looks populated. Safe to re-run (upserts on slug/sku).
//
// Usage: npm run seed:dummy

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const IMG = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

const collections = [
  { name: "Summer Edit", slug: "summer-edit", description: "Light fabrics for warm days.", cover_image: IMG("summer-edit"), sort_order: 1 },
  { name: "Festive Collection", slug: "festive-collection", description: "Statement pieces for celebrations.", cover_image: IMG("festive"), sort_order: 2 },
];

const categories = [
  { name: "Kurtas", slug: "kurtas", sort_order: 1 },
  { name: "Sarees", slug: "sarees", sort_order: 2 },
  { name: "Dresses", slug: "dresses", sort_order: 3 },
  { name: "Co-ords", slug: "co-ords", sort_order: 4 },
];

const sizeInventory = { XS: 4, S: 8, M: 10, L: 6, XL: 3, XXL: 0 };

function makeProducts(collectionIdBySlug) {
  const items = [
    { name: "Handblock Cotton Kurta", category: "kurtas", price: 189900, discount_price: 149900, fabric: "Pure Cotton", badge: "New", collection: "summer-edit" },
    { name: "Embroidered Anarkali Kurta", category: "kurtas", price: 249900, fabric: "Rayon", badge: null, collection: "festive-collection" },
    { name: "Chanderi Silk Saree", category: "sarees", price: 349900, discount_price: 299900, fabric: "Chanderi Silk", badge: "Bestseller", collection: "festive-collection" },
    { name: "Linen Blend Maxi Dress", category: "dresses", price: 219900, fabric: "Linen Blend", badge: null, collection: "summer-edit" },
    { name: "Printed Co-ord Set", category: "co-ords", price: 259900, fabric: "Cotton Blend", badge: "New", collection: "summer-edit" },
    { name: "Banarasi Silk Saree", category: "sarees", price: 499900, fabric: "Banarasi Silk", badge: "Limited", collection: "festive-collection" },
    { name: "Floral A-line Dress", category: "dresses", price: 179900, discount_price: 139900, fabric: "Cotton", badge: null, collection: null },
    { name: "Straight Fit Kurta Set", category: "co-ords", price: 229900, fabric: "Rayon", badge: null, collection: null },
  ];

  return items.map((item, i) => ({
    name: item.name,
    description: `${item.name} — crafted with care using ${item.fabric.toLowerCase()}. Perfect for everyday elegance.`,
    price: item.price,
    discount_price: item.discount_price ?? null,
    category: item.category,
    fabric: item.fabric,
    care: "Dry clean recommended. Do not bleach.",
    free_delivery: i % 2 === 0,
    images: [IMG(`product-${i}-a`), IMG(`product-${i}-b`)],
    size_inventory: sizeInventory,
    sku: `DUMMY-${String(i + 1).padStart(3, "0")}`,
    badge: item.badge,
    is_active: true,
    collection_id: item.collection ? collectionIdBySlug[item.collection] ?? null : null,
    sort_order: i,
  }));
}

async function main() {
  const { data: upsertedCollections, error: collectionsError } = await supabase
    .from("collections")
    .upsert(collections, { onConflict: "slug" })
    .select("id, slug");
  if (collectionsError) throw collectionsError;
  console.log(`Upserted ${upsertedCollections.length} collection(s).`);

  const { data: upsertedCategories, error: categoriesError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select("id, slug");
  if (categoriesError) throw categoriesError;
  console.log(`Upserted ${upsertedCategories.length} categor${upsertedCategories.length === 1 ? "y" : "ies"}.`);

  const collectionIdBySlug = Object.fromEntries(upsertedCollections.map((c) => [c.slug, c.id]));
  const products = makeProducts(collectionIdBySlug);

  const { data: upsertedProducts, error: productsError } = await supabase
    .from("products")
    .upsert(products, { onConflict: "sku" })
    .select("id, name");
  if (productsError) throw productsError;
  console.log(`Upserted ${upsertedProducts.length} product(s).`);

  console.log("Dummy data seeded. Re-run any time — sku/slug conflicts overwrite in place.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
