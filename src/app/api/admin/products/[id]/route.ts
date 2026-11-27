import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  buildProductPayload,
  type AdminProductBody,
} from "@/lib/admin-product";
import { getProductById } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "ID sản phẩm không hợp lệ." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  try {
    const existing = await getProductById(productId, true);
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm." },
        { status: 404 },
      );
    }

    const body = (await request.json()) as AdminProductBody;
    const merged = {
      ...existing,
      ...body,
      categorySlug: body.categorySlug ?? existing.categorySlug,
      category:
        body.category ?? existing.categoryOriginal ?? existing.category,
      isActive: body.isActive ?? existing.isActive,
      isFeatured: body.isFeatured ?? existing.isFeatured,
    } as AdminProductBody;

    const payload = await buildProductPayload(
      merged,
      existing.slug ?? null,
    );
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const product = await getProductById(productId, true);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không cập nhật được sản phẩm.",
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
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "ID sản phẩm không hợp lệ." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
