import { NextResponse } from "next/server";
import { getProducts } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}
