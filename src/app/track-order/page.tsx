"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Image from "@/components/SafeImage";

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string | null;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "Mới", color: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-yellow-100 text-yellow-800" },
  shipping: { label: "Đang giao", color: "bg-orange-100 text-orange-800" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!phone.trim() || !orderCode.trim()) {
      setError("Vui lòng nhập đầy đủ số điện thoại và mã đơn hàng");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/[\s.-]/g, ""), orderCode: orderCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tìm thấy đơn hàng");
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const status = order ? statusMap[order.status] || statusMap.new : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
          📦 Tra cứu đơn hàng
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Tra Cứu Đơn Hàng</h1>
        <p className="text-sm text-slate-500 mt-1">Nhập số điện thoại và mã đơn hàng để kiểm tra trạng thái</p>
      </div>

      <form onSubmit={handleLookup} className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại đặt hàng</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã đơn hàng</label>
            <input type="text" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} placeholder="APV-20261125-ABCD"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50">
          {loading ? "Đang tìm kiếm..." : "Tra cứu đơn hàng →"}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">⚠️ {error}</div>
      )}

      {order && status && (
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Mã đơn hàng</p>
              <p className="text-xl font-mono font-extrabold text-slate-950">{order.order_code}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>{status.label}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Khách hàng:</span> <strong>{order.customer_name}</strong></div>
            <div><span className="text-slate-500">SĐT:</span> <strong>{order.customer_phone}</strong></div>
            <div className="sm:col-span-2"><span className="text-slate-500">Địa chỉ:</span> <strong>{order.customer_address}</strong></div>
            <div><span className="text-slate-500">Thanh toán:</span> <strong>{order.payment_method === "cod" ? "COD (nhận hàng trả tiền)" : "Chuyển khoản"}</strong></div>
            <div><span className="text-slate-500">Ngày đặt:</span> <strong>{new Date(order.created_at).toLocaleDateString("vi-VN")}</strong></div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Sản phẩm đã đặt</h3>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="relative w-12 h-12 rounded-lg bg-white border border-black/[0.04] shrink-0 overflow-hidden">
                    {item.product_image ? <Image src={item.product_image} alt={item.product_name} fill className="object-contain" unoptimized /> : <span className="flex items-center justify-center h-full text-lg">💡</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{item.product_name}</p>
                    <p className="text-[11px] text-slate-500">{formatCurrency(item.unit_price)} x {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Tạm tính:</span><span>{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className={order.shipping_fee === 0 ? "text-green-600 font-semibold" : ""}>{order.shipping_fee === 0 ? "Miễn phí" : formatCurrency(order.shipping_fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold"><span>Giảm 2% chuyển khoản:</span><span>-{formatCurrency(order.discount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-100">
              <span>Tổng cộng:</span>
              <span className="text-blue-700">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
