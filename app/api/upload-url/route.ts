import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { apiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await checkRateLimit(userId, "upload-url", 60, 600); // 60 per 10 min
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  const { filename } = await req.json();
  if (!filename || typeof filename !== "string" || filename.length > 255) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // strip path separators/traversal and anything but safe filename chars
  const safeName = filename.replace(/[/\\]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  if (!safeName) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const path = `${Date.now()}-${safeName}`;
  const supabase = createServerSupabase();

  const { data, error } = await supabase.storage
    .from("product-images")
    .createSignedUploadUrl(path);

  if (error) {
    return apiError("upload-url.POST", error);
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

  return NextResponse.json({ path, token: data.token, publicUrl }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await req.json();
  if (!path || typeof path !== "string" || path.includes("..") || path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.storage.from("product-images").remove([path]);

  if (error) {
    return apiError("upload-url.DELETE", error);
  }

  return NextResponse.json({ ok: true });
}
