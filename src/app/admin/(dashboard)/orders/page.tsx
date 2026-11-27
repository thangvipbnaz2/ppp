"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

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

const STATUSES = [
  { value: "new", label: "Mới", color: "bg-blue-50 text-blue-700" },
  { value: "confirmed", label: "Đã xác nhận", color: "bg-amber-50 text-amber-700" },
  { value: "shipping", label: "Đang giao", color: "bg-orange-50 text-orange-700" },
  { value: "completed", label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700" },
  { value: "cancelled", label: "Đã hủy", color: "bg-red-50 text-red-700" },
];

function statusInfo(value: string) {
  return STATUSES.find((item) => item.value === value) ?? STATUSES[0];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => `${order.order_code} ${order.customer_name} ${order.customer_phone} ${order.customer_address}`.toLowerCase().includes(query));
  }, [orders, search]);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders?status=${status}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được đơn hàng");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
    setPage(1);
  }, [filter, load]);

  useEffect(() => setPage(1), [search]);

  const printOrder = (order: Order) => {
    const popup = window.open("", "_blank", "width=860,height=720");
    if (!popup) { setToast("Trình duyệt đang chặn cửa sổ in"); return; }
    const escape = (value: unknown) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char] || char));
    const rows = order.order_items.map((item) => `<tr><td>${escape(item.product_name)}</td><td>${item.quantity}</td><td>${escape(formatCurrency(item.unit_price))}</td><td>${escape(formatCurrency(item.total_price))}</td></tr>`).join("");
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escape(order.order_code)}</title><style>body{font-family:Arial;padding:28px;color:#111}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:9px;text-align:left}.sum{text-align:right;line-height:1.8}</style></head><body><h1>ĐƠN HÀNG ${escape(order.order_code)}</h1><p><b>Khách hàng:</b> ${escape(order.customer_name)} – ${escape(order.customer_phone)}</p><p><b>Địa chỉ:</b> ${escape(order.customer_address)}</p><table><thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>${rows}</tbody></table><div class="sum">Tạm tính: ${escape(formatCurrency(order.subtotal))}<br>Giảm giá: -${escape(formatCurrency(order.discount || 0))}<br>Phí ship: ${escape(formatCurrency(order.shipping_fee))}<br><b>Tổng cộng: ${escape(formatCurrency(order.total))}</b></div></body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateStatus = async (order: Order, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không cập nhật được");
      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? { ...item, status } : item)),
      );
      if (selected?.id === order.id) setSelected({ ...selected, status });
      setToast("Đã cập nhật trạng thái đơn hàng");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Không cập nhật được");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Đơn hàng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {orders.length} đơn hàng {filter !== "all" ? "theo trạng thái" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-slate-950 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Tất cả
        </button>
        {STATUSES.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              filter === item.value
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã đơn, tên, số điện thoại, địa chỉ..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
          </div>
        ) : pagedOrders.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedOrders.map((order) => {
                  const info = statusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <p className="font-mono font-bold text-slate-900">
                          {order.order_code}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(order.created_at).toLocaleString("vi-VN")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {order.customer_name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {order.customer_phone}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {order.order_items?.length ?? 0} sản phẩm
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border-0 ${info.color}`}
                        >
                          {STATUSES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-700"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && <div className="flex justify-center items-center gap-3"><button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40">← Trước</button><span className="text-xs text-slate-500">Trang {page}/{totalPages}</span><button disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40">Sau →</button></div>}

      {selected && (
        <div className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-black/[0.08]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-950 font-mono">
                  {selected.order_code}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {new Date(selected.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
              <button onClick={() => printOrder(selected)} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold">🖨️ In đơn</button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Khách hàng</p>
                  <p className="font-bold text-slate-900">
                    {selected.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Số điện thoại</p>
                  <p className="font-bold text-slate-900">
                    {selected.customer_phone}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-400">Địa chỉ</p>
                  <p className="font-semibold text-slate-800">
                    {selected.customer_address}
                  </p>
                </div>
                {selected.customer_note && (
                  <div className="sm:col-span-2">
                    <p className="text-slate-400">Ghi chú</p>
                    <p className="text-slate-700">{selected.customer_note}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-400">Thanh toán</p>
                  <p className="font-semibold text-slate-800">
                    {selected.payment_method === "cod"
                      ? "COD"
                      : "Chuyển khoản"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Trạng thái</p>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected, e.target.value)}
                    className="mt-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100"
                  >
                    {STATUSES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Sản phẩm ({selected.order_items?.length ?? 0})
                </h3>
                {selected.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(selected.subtotal)}</span>
                </div>
                {selected.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Giảm 2% chuyển khoản</span><span>-{formatCurrency(selected.discount)}</span></div>}
                <div className="flex justify-between text-slate-500">
                  <span>Phí ship</span>
                  <span>
                    {selected.shipping_fee === 0
                      ? "Miễn phí"
                      : formatCurrency(selected.shipping_fee)}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-950 text-sm">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(selected.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
