import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api-utils";

export async function PATCH(req: NextRequest) {
  const { userId, authorized } = await requireAdmin();
  if (!userId || !authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "ids must be an array of product ids" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const results = await Promise.all(
    ids.map((id: string, index: number) =>
      supabase.from("products").update({ sort_order: index }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return apiError("products.reorder.PATCH", failed.error);

  return NextResponse.json({ success: true });
}
