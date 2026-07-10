import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError, validateSettingsInput, ValidationError } from "@/lib/api-utils";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", true).single();
  if (error) return apiError("settings.GET", error);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const rawBody = await req.json();

  let body: Record<string, unknown>;
  try {
    body = validateSettingsInput(rawBody);
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const { data, error } = await supabase
    .from("store_settings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", true)
    .select()
    .single();
  if (error) return apiError("settings.PUT", error);
  return NextResponse.json(data);
}
