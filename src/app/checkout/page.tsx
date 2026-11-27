"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import Image from "@/components/SafeImage";
import Link from "next/link";

interface Settings {
  hotline: string;
  shipping_fee: number;
  free_ship_threshold: number;
  bank_info: {
    bank: string;
    branch: string;
    account_number: string;
    account_name: string;
  };
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState<{ orderCode: string; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  const freeShipThreshold = settings?.free_ship_threshold ?? 1000000;
  const defaultShippingFee = settings?.shipping_fee ?? 30000;
  const shippingFee = subtotal >= freeShipThreshold ? 0 : defaultShippingFee;
  const discount = paymentMethod === "bank_transfer" ? Math.round(subtotal * 0.02) : 0;
  const total = subtotal - discount + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Vui lòng nhập họ tên (ít nhất 2 ký tự)"); return;
    }
    if (!/^(0[35789])[0-9]{8}$/.test(phone.replace(/[\s.-]/g, ""))) {
      setError("Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03/05/07/08/09)"); return;
    }
    if (!address.trim() || address.trim().length < 10) {
      setError("Vui lòng nhập địa chỉ giao hàng chi tiết (ít nhất 10 ký tự)"); return;
    }
    if (items.length === 0) {
      setError("Giỏ hàng trống"); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName.trim(),
          customerPhone: phone.replace(/[\s.-]/g, ""),
          customerAddress: address.trim(),
          customerNote: note.trim() || null,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đặt hàng");
      setOrderResult({ orderCode: data.orderCode, total: data.total });
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline 0827.955.888");
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center text-4xl">✅</div>
        <h1 className="text-2xl font-extrabold text-slate-950">Đặt hàng thành công!</h1>
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-3">
          <p className="text-sm text-slate-600">Mã đơn hàng của bạn:</p>
          <p className="text-2xl font-mono font-extrabold text-blue-700">{orderResult.orderCode}</p>
          <p className="text-sm text-slate-600">Tổng thanh toán: <strong className="text-slate-900">{formatCurrency(orderResult.total)}</strong></p>
          <p className="text-xs text-slate-500">An Phú Vina sẽ gọi xác nhận đơn hàng qua hotline 0827.955.888</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/track-order" className="px-6 py-3 rounded-full bg-slate-950 text-white text-sm font-semibold shadow-md hover:bg-slate-800 transition-all">
            Tra cứu đơn hàng →
          </Link>
          <Link href="/products" className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🛒</div>
        <h1 className="text-2xl font-extrabold text-slate-950">Giỏ hàng trống</h1>
        <p className="text-sm text-slate-500">Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <Link href="/products" className="inline-block px-6 py-3 rounded-full bg-slate-950 text-white text-sm font-semibold shadow-md">Xem sản phẩm →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Thanh toán</h1>
        <p className="text-sm text-slate-500 mt-1">Hoàn tất thông tin để đặt hàng</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">📦 Thông tin giao hàng</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ giao hàng *</label>
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú thêm (tùy chọn)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">💳 Phương thức thanh toán</h2>

            <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"}`}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">🚚 Thanh toán khi nhận hàng (COD)</p>
                <p className="text-xs text-slate-500">Kiểm tra hàng trước khi thanh toán</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "bank_transfer" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"}`}>
              <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="accent-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">🏦 Chuyển khoản ngân hàng</p>
                <p className="text-xs text-slate-500">Chuyển khoản trước, giao hàng sau</p>
              </div>
            </label>

            {paymentMethod === "bank_transfer" && settings?.bank_info && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200/60 space-y-2">
                <h4 className="text-xs font-bold text-blue-900">Thông tin chuyển khoản:</h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Ngân hàng:</strong> {settings.bank_info.bank} - Chi nhánh {settings.bank_info.branch}</p>
                  <p><strong>Số tài khoản:</strong> {settings.bank_info.account_number || "(Liên hệ hotline)"}</p>
                  <p><strong>Chủ tài khoản:</strong> {settings.bank_info.account_name}</p>
                  <p className="text-[11px] text-blue-600">Nội dung CK: [Mã đơn hàng] - [Họ tên] - [SĐT]</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900">Đơn hàng ({items.length} sản phẩm)</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-black/[0.04] shrink-0 overflow-hidden">
                    {item.image ? <Image src={item.image} alt={item.name} fill className="object-contain" unoptimized /> : <span className="flex items-center justify-center h-full">💡</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span>Tạm tính:</span><span>{formatCurrency(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold"><span>Giảm 2% chuyển khoản BIDV:</span><span>-{formatCurrency(discount)}</span></div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold">Tổng cộng:</span>
              <span className="text-lg font-extrabold text-blue-700">{formatCurrency(total)}</span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Đang xử lý..." : "Đặt hàng →"}
            </button>

            <p className="text-[10px] text-slate-400 text-center">An Phú Vina sẽ gọi xác nhận đơn qua hotline 0827.955.888</p>
          </div>
        </div>
      </form>
    </div>
  );
}
