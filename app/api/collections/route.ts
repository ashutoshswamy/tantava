import { NextRequest, NextResponse } from "next/server";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateCollectionInput, ValidationError } from "@/lib/api-utils";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Storefront listing is read far more often than it changes, so it's cached
// in the shared Redis-backed remote handler; admin's `all=true` view always
// reads fresh so edits show up immediately in the dashboard.
async function getActiveCollections() {
  "use cache: remote";
  cacheTag("collections");
  cacheLife({ expire: 300 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  if (all !== "true") {
    try {
      return NextResponse.json(await getActiveCollections());
    } catch (error) {
      return apiError("collections.GET", error);
    }
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return apiError("collections.GET", error);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let body: Record<string, unknown>;
  try {
    body = validateCollectionInput(rawBody, false);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const slug = (body.slug as string) || toSlug((body.name as string) || "");

  const { data, error } = await supabase
    .from("collections")
    .insert({ ...body, slug })
    .select()
    .single();

  if (error) return apiError("collections.POST", error);
  revalidateTag("collections", "max");
  return NextResponse.json(data, { status: 201 });
}
