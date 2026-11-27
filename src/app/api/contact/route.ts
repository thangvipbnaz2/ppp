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
    email?: string;
    subject?: string;
    message?: string;
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
  const email = cleanText(body.email, 160);
  const subject = cleanText(body.subject, 200);
  const message = cleanText(body.message, 2000);

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
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Email không hợp lệ." },
      { status: 400 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { error: "Vui lòng nhập nội dung tin nhắn (ít nhất 5 ký tự)." },
      { status: 400 },
    );
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Hệ thống liên hệ chưa được cấu hình. Vui lòng gọi hotline 0827.955.888.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    phone,
    email: email || null,
    subject: subject || null,
    message,
    status: "new",
  });

  if (error) {
    console.error("Lỗi gửi liên hệ:", error.message);
    return NextResponse.json(
      { error: "Không gửi được tin nhắn. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Gửi tin nhắn thành công. An Phú Vina sẽ phản hồi sớm nhất.",
  });
}
