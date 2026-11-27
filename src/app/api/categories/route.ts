import { NextResponse } from "next/server";
import { withGroupCounts } from "@/lib/catalog";
import { getCategoriesFull, getProducts } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [groups, products] = await Promise.all([
    getCategoriesFull(),
    getProducts(),
  ]);

  return NextResponse.json(withGroupCounts(products, groups), {
    headers: { "Cache-Control": "no-store" },
  });
}
