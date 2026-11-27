import { NextResponse } from "next/server";
import { getNewsPosts } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getNewsPosts();
  return NextResponse.json(posts, {
    headers: { "Cache-Control": "no-store" },
  });
}
