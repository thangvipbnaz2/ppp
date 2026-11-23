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
  
  // Customer Form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json").then((r) => r.json()),
      fetch("/data/categories.json").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      
      // Load only user's explicitly added items from localStorage (NO default sample items)
      try {
        const stored = localStorage.getItem("anphu_quote_items");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuoteItems(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    });
  }, []);

  // Save changes to localStorage
  const syncStorage = (items: QuoteItem[]) => {
    try {
      localStorage.setItem("anphu_quote_items", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validation rules
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s.-]/g, "");
    return /^(0[35789])[0-9]{8}$/.test(cleaned);
  };

  const errors = useMemo(() => {
    const errs: { name?: string; phone?: string; address?: string; items?: string } = {};

    if (!customerName.trim()) {
      errs.name = "Vui lòng nhập tên khách hàng hoặc đơn vị mua";
    } else if (customerName.trim().length < 2) {
      errs.name = "Tên khách hàng phải có ít nhất 2 ký tự";
    }

    if (!customerPhone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!validatePhone(customerPhone)) {
      errs.phone = "Số điện thoại không hợp lệ (yêu cầu 10 chữ số, ví dụ 0912345678)";
    }

    if (!customerAddress.trim()) {
      errs.address = "Vui lòng nhập địa chỉ giao hàng hoặc công trình";
    } else if (customerAddress.trim().length < 5) {
      errs.address = "Địa chỉ cần chi tiết hơn (tối thiểu 5 ký tự)";
    }

    if (quoteItems.length === 0) {
      errs.items = "Bảng báo giá hiện đang trống. Cần chọn ít nhất 1 sản phẩm";
    }

    return errs;
  }, [customerName, customerPhone, customerAddress, quoteItems]);

  const isFormValid = Object.keys(errors).length === 0;

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result.slice(0, 50);
  }, [products, selectedCategory, searchQuery]);

  const addToQuote = (product: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: QuoteItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      syncStorage(updated);
      return updated;
    });
    showToast(`✓ Đã thêm "${product.name.slice(0, 28)}..." vào báo giá`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setQuoteItems((prev) => {
        const updated = prev.filter((item) => item.product.id !== productId);
        syncStorage(updated);
        return updated;
      });
    } else {
      setQuoteItems((prev) => {
        const updated = prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        syncStorage(updated);
        return updated;
      });
    }
  };

  const removeItem = (productId: number) => {
    setQuoteItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      syncStorage(updated);
      return updated;
    });
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ bảng báo giá?")) {
      setQuoteItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setDiscountPercent(0);
      setTouched({ name: false, phone: false, address: false });
      localStorage.removeItem("anphu_quote_items");
      showToast("Đã làm mới bảng báo giá");
    }
  };

  const subtotalVAT = quoteItems.reduce(
    (sum, item) => sum + item.product.priceWithVAT * item.quantity,
    0
  );
  const discountAmount = Math.round((subtotalVAT * discountPercent) / 100);
  const finalTotalVAT = subtotalVAT - discountAmount;
  const totalNoVAT = Math.round(finalTotalVAT / 1.08);
  const vatAmount = finalTotalVAT - totalNoVAT;

  const handlePrint = () => {
    // Mark all fields touched to show validation errors if any
    setTouched({ name: true, phone: true, address: true });

    if (!isFormValid) {
      if (quoteItems.length === 0) {
        showToast("⚠️ Vui lòng chọn ít nhất 1 sản phẩm trước khi in báo giá!");
      } else {
        showToast("⚠️ Vui lòng điền đúng và đủ thông tin khách hàng để tiếp tục!");
      }
      return;
    }

    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Đang khởi tạo hệ thống báo giá...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10 print:hidden">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <span>📋</span> Lập Báo Giá Hợp Đồng Phân Phối
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Tạo Báo Giá & Hợp Đồng
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Nhập đầy đủ thông tin khách hàng và chọn sản phẩm để xuất file báo giá chuẩn A4 (VAT 8%)
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product Selector Library (Hidden on print) */}
        <div className="lg:col-span-5 print:hidden space-y-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center justify-between">
              <span>Thư viện 672+ sản phẩm</span>
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Click (+) để thêm
              </span>
            </h2>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tìm mã hoặc tên (AT04, Panel 600x600, Smart...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-100/70 border border-transparent text-xs text-slate-700 focus:outline-none"
              >
                <option value="">Tất cả danh mục ({products.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToQuote(p)}
                  className="group p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-transparent hover:border-black/[0.05] transition-all duration-200 cursor-pointer flex items-center gap-3 select-none"
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

                  <button
                    type="button"
                    className="w-7 h-7 rounded-full bg-slate-900 group-hover:bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: The Official Quote Paper */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.06)] print:shadow-none print:border-none print:p-0">
            {/* Header Document With Official Logo */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-black/[0.05] shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="An Phú Vina"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 inline-block mb-1">
                    Bảng Báo Giá Phân Phối Chính Thức
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950 leading-snug">
                    CÔNG TY TNHH MTV TM THIẾT BỊ ĐIỆN AN PHÚ VINA
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Nhà phân phối chính thức thiết bị chiếu sáng Rạng Đông
                  </p>
                  <p className="text-[11px] text-slate-500">
                    MST: <strong>0110271235</strong> • Hotline: <strong className="text-blue-700">0827.955.888</strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <p className="text-[11px] text-slate-400">Ngày lập báo giá</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Hiệu lực: 30 ngày</p>
              </div>
            </div>

            {/* Customer Input Section (Interactive on web with Validation, Clean text on print) */}
            <div className="py-6 border-b border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span>👤 Thông tin người nhận / Đơn vị mua</span>
                  <span className="text-rose-500">*</span>
                </h4>
                <span className="text-[10px] text-slate-400 print:hidden">
                  (Bắt buộc nhập đúng để xuất báo giá)
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 print:hidden">
                {/* Name Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tên khách hàng / Đơn vị mua <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Anh Tuấn / Công ty Xây Dựng Thăng Long"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                      touched.name && errors.name
                        ? "bg-rose-50/50 border border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-200"
                        : "bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-[10px] font-medium text-rose-500 mt-1">⚠️ {errors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0912345678 (10 chữ số)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                      touched.phone && errors.phone
                        ? "bg-rose-50/50 border border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-200"
                        : "bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[10px] font-medium text-rose-500 mt-1">⚠️ {errors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Địa chỉ giao hàng / Công trình <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Biệt thự BT05 KĐT Văn Phú, Q. Hà Đông, Hà Nội"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, address: true }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${
                      touched.address && errors.address
                        ? "bg-rose-50/50 border border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-200"
                        : "bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                  {touched.address && errors.address && (
                    <p className="text-[10px] font-medium text-rose-500 mt-1">⚠️ {errors.address}</p>
                  )}
                </div>

                {/* Discount Stepper (Optional) */}
                <div className="sm:col-span-2 flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-slate-600">
                    Chiết khấu ưu đãi dự án (%):
                  </span>
                  <div className="flex items-center gap-2">
                    {[0, 5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercent(pct)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          discountPercent === pct
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {pct === 0 ? "Chuẩn 0%" : `-${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Print view only */}
              <div className="hidden print:block text-xs space-y-1.5 pt-2">
                <p><strong>Khách hàng / Đơn vị:</strong> {customerName || "..........................................................."}</p>
                <p><strong>Điện thoại liên hệ:</strong> {customerPhone || "..........................................................."}</p>
                <p><strong>Địa chỉ giao nhận:</strong> {customerAddress || "..........................................................."}</p>
              </div>
            </div>

            {/* Quote Items List */}
            <div className="py-6">
              {quoteItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
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
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
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
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                              title="Xóa sản phẩm"
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
                /* Empty state: initially clean with friendly guidance */
                <div className="py-16 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-sm">
                    📋
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Bảng báo giá hiện đang trống
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Vui lòng bấm dấu <strong>(+)</strong> ở thư viện sản phẩm bên trái hoặc từ trang <strong>Bảng giá</strong> để thêm sản phẩm vào đơn.
                  </p>
                </div>
              )}

              {/* Totals Summary */}
              {quoteItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tổng tiền sản phẩm (có VAT):</span>
                    <span>{formatCurrency(subtotalVAT)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                      <span>Chiết khấu dự án ({discountPercent}%):</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tổng tiền chưa VAT:</span>
                    <span>{formatCurrency(totalNoVAT)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Thuế GTGT VAT (8%):</span>
                    <span>{formatCurrency(vatAmount)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-100">
                    <span>Tổng thanh toán đã gồm thuế:</span>
                    <span className="text-blue-700 text-lg">{formatCurrency(finalTotalVAT)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Notice Bar */}
            {!isFormValid && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2 print:hidden">
                <span className="text-base shrink-0">⚠️</span>
                <span>
                  {quoteItems.length === 0
                    ? "Vui lòng chọn ít nhất 1 sản phẩm vào đơn báo giá."
                    : "Vui lòng nhập đầy đủ và chính xác tên, số điện thoại (10 số), địa chỉ khách hàng để In / Xuất báo giá."}
                </span>
              </div>
            )}

            {/* Actions (Print / Reset) */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                disabled={!isFormValid}
                className={`flex-1 py-3 px-6 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isFormValid
                    ? "bg-slate-950 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 cursor-pointer active:scale-98"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>🖨️</span>
                <span>In / Xuất PDF báo giá A4</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
              >
                Làm mới form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
