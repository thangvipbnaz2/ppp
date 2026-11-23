"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface QuoteItem {
  product: Product;
  quantity: number;
}

export default function QuotePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json").then((r) => r.json()),
      fetch("/data/categories.json").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      // Preload with 2 initial sample products from the Excel order template
      if (prods.length > 5) {
        setQuoteItems([
          { product: prods[0], quantity: 10 },
          { product: prods[1], quantity: 25 },
        ]);
      }
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result.slice(0, 40);
  }, [products, selectedCategory, searchQuery]);

  const addToQuote = (product: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setQuoteItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (productId: number) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalNoVAT = quoteItems.reduce(
    (sum, item) => sum + item.product.priceNoVAT * item.quantity,
    0
  );
  const totalVAT = quoteItems.reduce(
    (sum, item) => sum + item.product.priceWithVAT * item.quantity,
    0
  );
  const vatAmount = totalVAT - totalNoVAT;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Đang tải form báo giá...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Lập Báo Giá Sản Phẩm
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quy chuẩn theo mẫu hợp đồng phân phối Phương Phú / An Phú (VAT 8%)
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product Picker (hidden on print) */}
        <div className="lg:col-span-5 print:hidden space-y-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center justify-between">
              <span>Thư viện sản phẩm ({products.length})</span>
              <span className="text-[11px] font-normal text-slate-400">Click để thêm vào đơn</span>
            </h2>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tìm sản phẩm cần báo giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-2xl bg-slate-100/70 border border-transparent text-xs text-slate-700"
              >
                <option value="">Tất cả danh mục ({products.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToQuote(p)}
                  className="group p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-transparent hover:border-black/[0.05] transition-all duration-200 cursor-pointer flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-xl bg-white p-1 border border-black/[0.04] shrink-0 overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xs">💡</span>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{p.category}</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {formatCurrency(p.priceWithVAT)}
                    </p>
                  </div>

                  <button className="w-7 h-7 rounded-full bg-slate-900 group-hover:bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm transition-colors shrink-0">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: The Official Quote Paper (iPhone / Clean Sheet Aesthetic) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.06)] print:shadow-none print:border-none print:p-0">
            {/* Header Document */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Bảng báo giá phân phối
                </span>
                <h3 className="text-lg font-bold text-slate-950 mt-1">CÔNG TY TNHH THIẾT BỊ ĐIỆN PHƯƠNG PHÚ</h3>
                <p className="text-xs text-slate-500">Đối tác phân phối bóng đèn phích nước Rạng Đông</p>
                <p className="text-[11px] text-slate-400">Hà Đông, TP. Hà Nội • MST: 0110698330</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[11px] text-slate-400">Ngày lập báo giá</p>
                <p className="text-xs font-semibold text-slate-800">
                  {new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Customer Input (interactive on web, clean text on print) */}
            <div className="py-6 border-b border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thông tin người nhận / Đơn vị mua
              </h4>

              <div className="grid sm:grid-cols-2 gap-3 print:hidden">
                <input
                  type="text"
                  placeholder="Tên khách hàng / Công ty đối tác"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại liên hệ"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ giao hàng"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Print view only */}
              <div className="hidden print:block text-xs space-y-1">
                <p><strong>Khách hàng:</strong> {customerName || "..........................................................."}</p>
                <p><strong>Điện thoại:</strong> {customerPhone || "..........................................................."}</p>
                <p><strong>Địa chỉ:</strong> {customerAddress || "..........................................................."}</p>
              </div>
            </div>

            {/* Quote Items List */}
            <div className="py-6">
              {quoteItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-medium">
                        <th className="pb-3 w-8">#</th>
                        <th className="pb-3">Sản phẩm</th>
                        <th className="pb-3 text-center w-24">SL</th>
                        <th className="pb-3 text-right">Đơn giá có VAT</th>
                        <th className="pb-3 text-right">Thành tiền</th>
                        <th className="pb-3 text-right w-10 print:hidden"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quoteItems.map((item, idx) => (
                        <tr key={item.product.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 text-slate-400">{idx + 1}</td>
                          <td className="py-3 pr-2">
                            <p className="font-semibold text-slate-900">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400">{item.product.category}</p>
                          </td>
                          <td className="py-3 text-center">
                            {/* Quantity stepper on web */}
                            <div className="inline-flex items-center gap-1.5 print:hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                            <span className="hidden print:inline font-bold">{item.quantity}</span>
                          </td>
                          <td className="py-3 text-right font-medium text-slate-700">
                            {formatCurrency(item.product.priceWithVAT)}
                          </td>
                          <td className="py-3 text-right font-bold text-slate-950">
                            {formatCurrency(item.product.priceWithVAT * item.quantity)}
                          </td>
                          <td className="py-3 text-right print:hidden">
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Chưa chọn sản phẩm nào cho bảng báo giá này.
                </div>
              )}

              {/* Totals Summary */}
              {quoteItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tổng tiền hàng (chưa VAT):</span>
                    <span>{formatCurrency(totalNoVAT)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Thuế GTGT VAT (8%):</span>
                    <span>{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-100">
                    <span>Tổng thanh toán đã gồm thuế:</span>
                    <span className="text-blue-700">{formatCurrency(totalVAT)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions (Print / Reset) */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-6 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>🖨️</span> In / Xuất PDF báo giá
              </button>
              <button
                onClick={() => setQuoteItems([])}
                className="py-3 px-5 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
