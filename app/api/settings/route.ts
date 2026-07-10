import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", true).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const body = await req.json();
  const { delivery_info, returns_info, checkout_mode, whatsapp_number } = body;

  const { data, error } = await supabase
    .from("store_settings")
    .update({ delivery_info, returns_info, checkout_mode, whatsapp_number, updated_at: new Date().toISOString() })
    .eq("id", true)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
