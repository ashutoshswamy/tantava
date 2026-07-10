import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  const supabase = createServerSupabase();
  let query = supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (all !== "true") {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
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
  return NextResponse.json(data, { status: 201 });
}
