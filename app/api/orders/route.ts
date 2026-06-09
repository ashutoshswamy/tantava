import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const admin = await isAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (!admin) {
    query = query.eq("user_id", userId);
  }
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("orders")
    .insert({ ...body, user_id: userId })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
