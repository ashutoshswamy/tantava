// Tantava — removes dummy data created by seed-dummy-data.mjs
// Deletes only rows matching that script's slugs/skus. Safe to re-run.
//
// Usage: npm run unseed:dummy

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const collectionSlugs = ["summer-edit", "festive-collection"];
const categorySlugs = ["kurtas", "sarees", "dresses", "co-ords"];

async function main() {
  const { error: productsError, count: productsCount } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .like("sku", "DUMMY-%");
  if (productsError) throw productsError;
  console.log(`Deleted ${productsCount ?? 0} product(s).`);

  const { error: collectionsError, count: collectionsCount } = await supabase
    .from("collections")
    .delete({ count: "exact" })
    .in("slug", collectionSlugs);
  if (collectionsError) throw collectionsError;
  console.log(`Deleted ${collectionsCount ?? 0} collection(s).`);

  const { error: categoriesError, count: categoriesCount } = await supabase
    .from("categories")
    .delete({ count: "exact" })
    .in("slug", categorySlugs);
  if (categoriesError) throw categoriesError;
  console.log(`Deleted ${categoriesCount ?? 0} categor${categoriesCount === 1 ? "y" : "ies"}.`);

  console.log("Dummy data removed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
