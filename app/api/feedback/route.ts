import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmail, isValidLength } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip, "feedback", 5, 600); // 5 per 10 min
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  const body = await req.json();
  const { name, phone, email, state, city, about } = body;

  if (!isValidLength(name, 100)) {
    return NextResponse.json({ error: "Name is required (max 100 chars)" }, { status: 400 });
  }
  if (!isValidLength(about, 2000)) {
    return NextResponse.json({ error: "Feedback is required (max 2000 chars)" }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (phone && !isValidLength(phone, 20)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  if (state && !isValidLength(state, 100)) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }
  if (city && !isValidLength(city, 100)) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("feedbacks")
    .insert([{ name, phone, email, state, city, about }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
