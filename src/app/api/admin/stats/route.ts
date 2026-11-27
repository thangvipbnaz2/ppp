import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  const [products, orders, newOrders, dealers, contact, news, orderValues] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("dealer_registrations")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true }),
      supabase.from("news_posts").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total, status, created_at").order("created_at", { ascending: true }),
    ]);

  const firstError =
    products.error ||
    orders.error ||
    newOrders.error ||
    dealers.error ||
    contact.error ||
    news.error ||
    orderValues.error;

  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 });
  }

  const { data: recentOrders, error: recentError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentError) {
    return NextResponse.json({ error: recentError.message }, { status: 500 });
  }

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const monthKey = todayKey.slice(0, 7);
  const revenueOrders = (orderValues.data ?? []).filter((order) => order.status === "completed");
  const revenue = revenueOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const revenueToday = revenueOrders.filter((order) => order.created_at?.slice(0, 10) === todayKey).reduce((sum, order) => sum + Number(order.total || 0), 0);
  const revenueMonth = revenueOrders.filter((order) => order.created_at?.slice(0, 7) === monthKey).reduce((sum, order) => sum + Number(order.total || 0), 0);
  const ordersToday = (orderValues.data ?? []).filter((order) => order.created_at?.slice(0, 10) === todayKey).length;
  const chart = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));
    const key = day.toISOString().slice(0, 10);
    return {
      date: key,
      label: day.toLocaleDateString("vi-VN", { weekday: "short" }),
      revenue: revenueOrders.filter((order) => order.created_at?.slice(0, 10) === key).reduce((sum, order) => sum + Number(order.total || 0), 0),
    };
  });

  return NextResponse.json({
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    newOrders: newOrders.count ?? 0,
    dealers: dealers.count ?? 0,
    contact: contact.count ?? 0,
    news: news.count ?? 0,
    revenue,
    revenueToday,
    revenueMonth,
    ordersToday,
    chart,
    recentOrders: recentOrders ?? [],
  });
}
