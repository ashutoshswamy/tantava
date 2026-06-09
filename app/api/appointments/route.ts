import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase.from("appointments").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const body = await req.json();

  const { userId } = await auth();

  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...body, user_id: userId || null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { id, ...body } = await req.json();
  const { data, error } = await supabase
    .from("appointments")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
