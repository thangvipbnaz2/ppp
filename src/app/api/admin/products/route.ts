import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  buildProductPayload,
  type AdminProductBody,
} from "@/lib/admin-product";
import { getAdminProducts, getProductById } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const products = await getAdminProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi đọc sản phẩm." },
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
    const body = (await request.json()) as AdminProductBody;
    const payload = await buildProductPayload(body, null);
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const product = await getProductById(data.id, true);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không tạo được sản phẩm.",
      },
      { status: 400 },
    );
  }
}
