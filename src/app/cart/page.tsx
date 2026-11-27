"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import Image from "@/components/SafeImage";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const [settings, setSettings] = useState<{
    shipping_fee: number;
    free_ship_threshold: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) =>
        setSettings({
          shipping_fee: Number(data.shipping_fee) || 0,
          free_ship_threshold: Number(data.free_ship_threshold) || 0,
        })
      )
      .catch(() => {});
  }, []);

  const freeShipThreshold = settings?.free_ship_threshold ?? 1000000;
  const defaultShippingFee = settings?.shipping_fee ?? 30000;
  const shippingFee = subtotal >= freeShipThreshold ? 0 : defaultShippingFee;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🛒</div>
        <h1 className="text-2xl font-extrabold text-slate-950">Giỏ hàng trống</h1>
        <p className="text-sm text-slate-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link href="/products" className="inline-block px-6 py-3 rounded-full bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md">
          Khám phá sản phẩm →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Giỏ hàng</h1>
        <p className="text-sm text-slate-500 mt-1">{totalItems} sản phẩm trong giỏ hàng</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl bg-slate-50 border border-black/[0.04] shrink-0 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-contain" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">💡</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(item.price)} / sản phẩm</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors">−</button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors">+</button>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.productId)} className="text-[11px] text-red-500 hover:text-red-700 mt-1 transition-colors">Xóa</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900">Tổng cộng</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span>Tạm tính:</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
                  {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-blue-600">💡 Mua thêm {formatCurrency(freeShipThreshold - subtotal)} để được miễn phí ship</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-lg font-extrabold text-blue-700">{formatCurrency(total)}</span>
            </div>

            <Link href="/checkout" className="block w-full py-3 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-center text-xs font-bold shadow-md transition-all">
              Tiến hành đặt hàng →
            </Link>

            <Link href="/products" className="block w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center text-xs font-semibold transition-all">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
