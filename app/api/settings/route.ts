import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { apiError, validateSettingsInput, ValidationError } from "@/lib/api-utils";

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (error) {
    return apiError("settings.GET", error);
  }
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
  revalidateTag("settings", "max");
  return NextResponse.json(data);
}
