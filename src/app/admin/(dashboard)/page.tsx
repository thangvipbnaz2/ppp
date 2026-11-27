"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  products: number;
  orders: number;
  newOrders: number;
  dealers: number;
  contact: number;
  news: number;
  revenue: number;
  revenueToday: number;
  revenueMonth: number;
  ordersToday: number;
  chart: { date: string; label: string; revenue: number }[];
  recentOrders: {
    id: number;
    order_code: string;
    customer_name: string;
    customer_phone: string;
    total: number;
    status: string;
    created_at: string;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Lỗi tải dữ liệu");
        setStats(data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-black/[0.06] text-center space-y-3">
        <div className="text-3xl">⚠️</div>
        <h1 className="text-base font-bold text-slate-900">
          Không tải được bảng điều khiển
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
        <Link
          href="/admin/login"
          className="inline-block px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-bold"
        >
          Đăng nhập lại
        </Link>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Sản phẩm", value: stats.products, icon: "💡", href: "/admin/products" },
    { label: "Đơn hàng", value: stats.orders, icon: "📦", href: "/admin/orders" },
    { label: "Đơn mới", value: stats.newOrders, icon: "🔔", href: "/admin/orders?status=new" },
    { label: "Đại lý", value: stats.dealers, icon: "🤝", href: "/admin/dealers" },
    { label: "Liên hệ", value: stats.contact, icon: "✉️", href: "/admin/contact" },
    { label: "Tin tức", value: stats.news, icon: "📰", href: "/admin/news" },
  ];
  const chartMax = Math.max(1, ...stats.chart.map((item) => item.revenue));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Tổng quan hệ thống
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi nhanh sản phẩm, đơn hàng và yêu cầu từ khách hàng.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="text-xl">{card.icon}</div>
            <div className="text-2xl font-extrabold text-slate-950 mt-2">
              {card.value}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm"><p className="text-[11px] font-semibold text-slate-500">Doanh thu hôm nay</p><p className="text-xl font-extrabold text-slate-950 mt-1">{formatCurrency(stats.revenueToday)}</p><p className="text-[10px] text-slate-400">{stats.ordersToday} đơn phát sinh hôm nay</p></div>
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm"><p className="text-[11px] font-semibold text-slate-500">Doanh thu tháng này</p><p className="text-xl font-extrabold text-slate-950 mt-1">{formatCurrency(stats.revenueMonth)}</p><p className="text-[10px] text-slate-400">Chỉ tính đơn hoàn thành</p></div>
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm"><p className="text-[11px] font-semibold text-slate-500">Tổng doanh thu</p><p className="text-xl font-extrabold text-slate-950 mt-1">{formatCurrency(stats.revenue)}</p><p className="text-[10px] text-slate-400">Toàn bộ đơn hoàn thành</p></div>
      </div>

      <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm p-5">
        <div className="mb-5"><h2 className="text-sm font-bold text-slate-900">Doanh thu 7 ngày gần nhất</h2><p className="text-[10px] text-slate-400">Theo ngày hoàn thành đơn</p></div>
        <div className="h-44 flex items-end gap-2 sm:gap-4">
          {stats.chart.map((item) => (
            <div key={item.date} className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0" title={`${item.date}: ${formatCurrency(item.revenue)}`}>
              <span className="text-[9px] text-slate-500 truncate max-w-full">{item.revenue ? formatCurrency(item.revenue) : "0đ"}</span>
              <div className="w-full max-w-16 rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400 min-h-1" style={{ height: `${Math.max(3, (item.revenue / chartMax) * 115)}px` }} />
              <span className="text-[10px] font-semibold text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-black/[0.06] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Đơn hàng gần đây
            </h2>
            <Link
              href="/admin/orders"
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 font-mono">
                      {order.order_code}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {order.customer_name} • {order.customer_phone}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Thao tác nhanh</h2>
          <Link
            href="/admin/import"
            className="block p-3 rounded-2xl bg-blue-50 border border-blue-200/60 hover:bg-blue-100/70 transition-colors"
          >
            <p className="text-xs font-bold text-blue-900">
              📥 Import bảng giá Excel
            </p>
            <p className="text-[10px] text-blue-700 mt-0.5">
              Cập nhật giá hàng loạt theo file bảng giá
            </p>
          </Link>
          <Link
            href="/admin/products"
            className="block p-3 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 transition-colors"
          >
            <p className="text-xs font-bold text-slate-900">
              💡 Thêm / sửa sản phẩm
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Quản lý giá, tồn kho và trạng thái hiển thị
            </p>
          </Link>
          <Link
            href="/admin/settings"
            className="block p-3 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 transition-colors"
          >
            <p className="text-xs font-bold text-slate-900">
              ⚙️ Cài đặt cửa hàng
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Hotline, phí ship và thông tin chuyển khoản
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
