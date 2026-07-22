// Tantava — full storage reset
// WARNING: deletes every file in the product-images bucket, then the bucket itself.
// Run on dev/staging only, alongside supabase/reset.sql.
//
// Usage: npm run reset:storage

import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function emptyBucket() {
  let removed = 0;
  for (;;) {
    const { data: files, error } = await supabase.storage.from(BUCKET).list("", { limit: 1000 });
    if (error) throw error;
    if (!files || files.length === 0) break;

    const paths = files.map((f) => f.name);
    const { error: removeError } = await supabase.storage.from(BUCKET).remove(paths);
    if (removeError) throw removeError;
    removed += paths.length;
  }
  return removed;
}

const removed = await emptyBucket();
console.log(`Removed ${removed} object(s) from "${BUCKET}".`);

const { error: deleteBucketError } = await supabase.storage.deleteBucket(BUCKET);
if (deleteBucketError) {
  console.error(`Bucket delete failed: ${deleteBucketError.message}`);
  process.exit(1);
}

console.log(`Deleted bucket "${BUCKET}". Re-run supabase/schema.sql to recreate it.`);
