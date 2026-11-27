import { NextResponse } from "next/server";
import { isValidPhone, normalizePhone } from "@/lib/catalog";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: {
    name?: string;
    phone?: string;
    company?: string;
    interest?: string;
    note?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const name = cleanText(body.name, 120);
  const phone = normalizePhone(cleanText(body.phone, 20));
  const company = cleanText(body.company, 200);
  const interest = cleanText(body.interest, 200);
  const note = cleanText(body.note, 1000);

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Vui lòng nhập họ tên (ít nhất 2 ký tự)." },
      { status: 400 },
    );
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ." },
      { status: 400 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Hệ thống đăng ký chưa được cấu hình. Vui lòng gọi hotline 0827.955.888.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("dealer_registrations").insert({
    name,
    phone,
    company: company || null,
    interest: interest || null,
    note: note || null,
    status: "new",
  });

  if (error) {
    console.error("Lỗi đăng ký đại lý:", error.message);
    return NextResponse.json(
      { error: "Không gửi được đăng ký. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Đăng ký thành công. An Phú Vina sẽ liên hệ trong thời gian sớm nhất.",
  });
}
