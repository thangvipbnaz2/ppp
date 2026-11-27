import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  buildNewsPayload,
  type AdminNewsBody,
} from "@/lib/admin-news";
import { getAdminNewsPosts } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const posts = await getAdminNewsPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi đọc tin tức." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as AdminNewsBody;
    const payload = buildNewsPayload(body);
    const { data, error } = await supabase
      .from("news_posts")
      .insert({
        ...payload,
        published_at: payload.published ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ id: data.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không tạo được tin.",
      },
      { status: 400 },
    );
  }
}
