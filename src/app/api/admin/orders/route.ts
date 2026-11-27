import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
