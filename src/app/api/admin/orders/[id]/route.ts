import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set([
  "new",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ error: "ID đơn hàng không hợp lệ." }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const status = String(body.status ?? "");
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "Trạng thái đơn hàng không hợp lệ." },
      { status: 400 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
