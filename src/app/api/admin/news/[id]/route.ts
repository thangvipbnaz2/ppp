import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";
import {
  buildNewsPayload,
  type AdminNewsBody,
} from "@/lib/admin-news";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const newsId = Number(id);
  if (!Number.isInteger(newsId) || newsId <= 0) {
    return NextResponse.json({ error: "ID tin tức không hợp lệ." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from("news_posts")
    .select("*")
    .eq("id", newsId)
    .maybeSingle();

  if (existingError || !existing) {
    return NextResponse.json(
      { error: "Không tìm thấy tin tức." },
      { status: 404 },
    );
  }

  try {
    const body = (await request.json()) as AdminNewsBody;
    const payload = buildNewsPayload(body, existing.slug);
    const { error } = await supabase
      .from("news_posts")
      .update({
        ...payload,
        published_at:
          existing.published_at ??
          (payload.published ? new Date().toISOString() : null),
      })
      .eq("id", newsId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không cập nhật được tin.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const newsId = Number(id);
  if (!Number.isInteger(newsId) || newsId <= 0) {
    return NextResponse.json({ error: "ID tin tức không hợp lệ." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { error } = await supabase
    .from("news_posts")
    .delete()
    .eq("id", newsId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
