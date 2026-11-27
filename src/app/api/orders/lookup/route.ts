import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/catalog";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { phone?: string; orderCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const phone = normalizePhone(body.phone ?? "");
  const orderCode = String(body.orderCode ?? "").trim().toUpperCase();

  if (!phone || !orderCode) {
    return NextResponse.json(
      { error: "Vui lòng nhập số điện thoại và mã đơn hàng." },
      { status: 400 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Hệ thống tra cứu chưa được cấu hình. Vui lòng gọi hotline 0827.955.888.",
      },
      { status: 503 },
    );
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_code", orderCode)
    .eq("customer_phone", phone)
    .maybeSingle();

  if (error) {
    console.error("Lỗi tra cứu đơn hàng:", error.message);
    return NextResponse.json(
      { error: "Không tra cứu được đơn hàng. Vui lòng thử lại." },
      { status: 500 },
    );
  }

  if (!order) {
    return NextResponse.json(
      {
        error:
          "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại số điện thoại và mã đơn.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(order);
}
