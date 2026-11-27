import { NextResponse } from "next/server";
import { getAdminEmail, isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    if (user.email.toLowerCase() !== adminEmail) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    return {
      error: NextResponse.json(
        {
          error:
            "Supabase chưa được cấu hình. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào .env.local.",
        },
        { status: 503 },
      ),
    };
  }

  if (!getAdminEmail()) {
    return {
      error: NextResponse.json(
        { error: "Chưa cấu hình ADMIN_EMAIL trong .env.local." },
        { status: 503 },
      ),
    };
  }

  const user = await getAdminUser();
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Chưa đăng nhập hoặc không có quyền quản trị." },
        { status: 401 },
      ),
    };
  }

  return { user };
}
