import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  const body = await request.json();
  const id = Number(body.id);
  const status = String(body.status ?? "new");
  if (!Number.isInteger(id) || !["new", "processing", "done"].includes(status)) return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  const { data, error } = await supabase.from("contact_messages").update({ status }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "ID không hợp lệ." }, { status: 400 });
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
