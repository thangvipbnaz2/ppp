import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa được cấu hình." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Vui lòng chọn file ảnh." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Ảnh không được vượt quá 5MB." }, { status: 400 });

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
