"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { companyInfo } from "@/lib/company";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ["/images/products/image281.png"];

  const installationImages = product.installationImages || [];
  const allThumbnails = [
    ...productImages.map((url) => ({ url, type: "product" as const })),
    ...installationImages
      .filter((u) => !productImages.includes(u))
      .map((url) => ({ url, type: "install" as const })),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const optionChoices =
    product.attributes &&
    product.attributes.length > 0 &&
    product.attributes[0].options.length > 0
      ? product.attributes[0].options
      : [
          "Ánh sáng Trắng (6500K)",
          "Ánh sáng Trung tính (4000K)",
          "Ánh sáng Vàng (3000K)",
          "Đổi 3 màu (6500K/4000K/3000K)",
        ];

  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
    setSelectedOption(optionChoices[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const regularPrice =
    product.regularPrice ||
    product.retailPrice ||
    Math.round(product.priceWithVAT * 1.35);
  const salePrice = product.priceWithVAT;
  const hasDiscount = regularPrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;
  const projectPriceEst = Math.round(salePrice * 0.85);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handleAddToQuote = () => {
    try {
      const stored = localStorage.getItem("anphu_quote_items");
      const current = stored ? JSON.parse(stored) : [];
      const existingIdx = current.findIndex(
        (item: { product: Product }) => item.product.id === product.id
      );
      if (existingIdx >= 0) {
        current[existingIdx].quantity += quantity;
      } else {
        current.push({ product, quantity });
      }
      localStorage.setItem("anphu_quote_items", JSON.stringify(current));
      showToast(
        `✓ Đã thêm ${quantity} x "${product.name.slice(0, 32)}..." (${selectedOption}) vào báo giá!`
      );
    } catch {
      showToast(`✓ Đã thêm vào báo giá!`);
    }
  };

  const currentImgObj = allThumbnails[activeIndex] || allThumbnails[0];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Breadcrumb Bar (CellphoneS style) */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
            <span>🏠</span>
            <span>Trang chủ</span>
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">
            Sản phẩm
          </Link>
          <span>/</span>
          <Link
            href={`/products?brand=${
              product.brand === "Kingled"
                ? "kingled"
                : product.brand === "Ledvance"
                ? "ledvance"
                : "rangdong"
            }`}
            className="hover:text-blue-600 font-semibold text-slate-700"
          >
            {product.brand || "Rạng Đông"}
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-blue-600"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-[280px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Title & Anchor Nav Pills (Exact CellphoneS reference layout) */}
        <div className="space-y-3 pb-4 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
              {product.name}
            </h1>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 font-bold">
              Mã SP: #{product.id}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <span>★★★★★</span>
              <span className="text-slate-800 ml-1">4.9</span>
              <span className="text-slate-400 font-normal">(Chính hãng {product.brand || "Rạng Đông"})</span>
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#uu-diem"
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold transition-all flex items-center gap-1"
              >
                <span>✨</span> Ưu điểm đáng mua
              </a>
              <a
                href="#thong-so"
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold transition-all flex items-center gap-1"
              >
                <span>⚙️</span> Thông số kỹ thuật
              </a>
              <a
                href="#lap-dat"
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold transition-all flex items-center gap-1"
              >
                <span>🏗️</span> Ảnh lắp đặt ({installationImages.length})
              </a>
              <a
                href="#cam-ket"
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold transition-all flex items-center gap-1"
              >
                <span>🛡️</span> Bảo hành 2 năm
              </a>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout (CellphoneS Structure) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (Gallery + Commitments + Highlights + Installation Photos + Description) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Gallery Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/[0.06] shadow-sm space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 flex items-center justify-center overflow-hidden group">
                {hasDiscount && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md">
                    Giảm {discountPercent}%
                  </span>
                )}

                <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-md">
                  {currentImgObj?.type === "install"
                    ? "🏗️ Ảnh lắp đặt thực tế"
                    : `📸 Ảnh sản phẩm (${activeIndex + 1}/${allThumbnails.length})`}
                </span>

                <div className="relative w-full h-full p-4">
                  <Image
                    src={currentImgObj?.url || productImages[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className={
                      currentImgObj?.type === "install"
                        ? "object-cover rounded-xl"
                        : "object-contain transition-transform duration-300 group-hover:scale-105"
                    }
                    priority
                    unoptimized
                  />
                </div>

                {/* Prev / Next Arrows */}
                {allThumbnails.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveIndex(
                          (prev) =>
                            (prev - 1 + allThumbnails.length) %
                            allThumbnails.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition-all"
                      aria-label="Ảnh trước"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setActiveIndex(
                          (prev) => (prev + 1) % allThumbnails.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition-all"
                      aria-label="Ảnh tiếp theo"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip (Exact CellphoneS Style) */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {allThumbnails.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl border bg-white shrink-0 overflow-hidden transition-all ${
                        isActive
                          ? "border-red-600 ring-2 ring-red-500/25 scale-105 shadow-sm"
                          : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        sizes="64px"
                        className={
                          item.type === "install"
                            ? "object-cover"
                            : "object-contain p-1"
                        }
                        unoptimized
                      />
                      {item.type === "install" && (
                        <span className="absolute bottom-0 inset-x-0 bg-blue-600/85 text-white text-[8px] font-bold text-center py-0.5">
                          Lắp đặt
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cam Kết Sản Phẩm (2x2 Grid like CellphoneS) */}
            <div
              id="cam-ket"
              className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4"
            >
              <h2 className="text-base font-extrabold text-slate-950">
                Cam kết sản phẩm tại An Phú Vina
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
                    🛡️
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hàng mới chính hãng <strong>{product.brand || "Rạng Đông"}</strong> 100%, nguyên hộp, đầy đủ chứng nhận xuất xưởng CO/CQ & hóa đơn VAT 8%.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
                    🔄
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Bảo hành 24 tháng 1 đổi 1</strong> chính hãng tận nơi nếu phát sinh lỗi kỹ thuật. Hỗ trợ đổi trả linh hoạt trong 07 ngày.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                    🚚
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Giao hàng nhanh <strong>1–2 ngày</strong>. Miễn phí vận chuyển nội thành Hà Nội cho đơn hàng từ <strong>1.000.000đ</strong> trở lên.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                    💎
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chính sách <strong>chiết khấu công trình & đại lý 15% – 42%</strong> khi mua số lượng lớn qua Hotline <strong>{companyInfo.hotline}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Ưu Điểm Vượt Trội & Lý Do Đáng Mua */}
            {product.highlights && product.highlights.length > 0 && (
              <div
                id="uu-diem"
                className="bg-gradient-to-br from-blue-50/90 to-indigo-50/70 rounded-3xl p-6 border border-blue-200/70 space-y-3"
              >
                <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
                  <span>✨</span>
                  <span>Tại Sao Nên Chọn {product.name}?</span>
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>

                {product.applications && product.applications.length > 0 && (
                  <div className="pt-3 border-t border-blue-200/50 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-900">
                      🏠 Phù hợp lắp đặt:
                    </span>
                    {product.applications.map((app, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold border border-blue-200/60"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Thư Viện Ảnh Lắp Đặt Minh Họa Thực Tế */}
            {installationImages.length > 0 && (
              <div
                id="lap-dat"
                className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                    <span>🏗️</span>
                    <span>Ảnh Lắp Đặt Minh Họa & Ứng Dụng Thực Tế</span>
                  </h2>
                  <span className="text-xs text-blue-600 font-semibold">
                    Bấm ảnh để phóng to phía trên
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {installationImages.map((imgUrl, idx) => {
                    const targetIdx = allThumbnails.findIndex(
                      (t) => t.url === imgUrl
                    );
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (targetIdx >= 0) setActiveIndex(targetIdx);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Ảnh lắp đặt ${product.name} ${idx + 1}`}
                          fill
                          sizes="240px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mô Tả Chi Tiết */}
            {product.description && (
              <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-3">
                <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <span>📖</span>
                  <span>Thông Tin Chi Tiết & Tư Vấn Sử Dụng</span>
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                  {product.description
                    .split("\n")
                    .filter(Boolean)
                    .map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Sticky Price Box + Options + Stock Info + Specs Table + Actions) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            {/* Dual Price Box (CellphoneS Style) */}
            <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
                <div className="border-r border-slate-200 pr-3">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Giá ưu đãi (đã gồm VAT 8%)
                  </span>
                  <div className="text-2xl font-extrabold text-red-600 mt-0.5">
                    {formatCurrency(salePrice)}
                  </div>
                  {hasDiscount && (
                    <div className="text-xs text-slate-400 line-through font-medium">
                      {formatCurrency(regularPrice)}
                    </div>
                  )}
                </div>

                <div className="pl-2 flex flex-col justify-center">
                  <span className="text-[11px] font-semibold text-blue-700 block">
                    Giá dự án / Số lượng lớn
                  </span>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    Từ {formatCurrency(projectPriceEst)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Chiết khấu thêm 15% – 42%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50/70 border border-red-200/60 text-xs">
                <span className="font-bold text-red-700">
                  🎁 Ưu đãi Khách hàng Dự án / Đại lý
                </span>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-red-600 hover:underline"
                >
                  Hỏi giá sỉ →
                </a>
              </div>
            </div>

            {/* Phiên bản / Màu ánh sáng Selector (CellphoneS Checkmark Cards) */}
            <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Chọn màu sắc / Nhiệt độ ánh sáng
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {optionChoices.map((opt) => {
                  const active = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`relative text-left p-3 rounded-xl border text-xs transition-all ${
                        active
                          ? "border-red-600 bg-red-50/30 ring-1 ring-red-600 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      {active && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-bl-lg rounded-tr-lg">
                          ✓
                        </span>
                      )}
                      <div className="font-bold text-slate-900 leading-tight pr-3">
                        {opt}
                      </div>
                      <div className="text-[11px] text-red-600 font-semibold mt-0.5">
                        {formatCurrency(salePrice)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kho Hàng Có Sẵn Box (CellphoneS Store Availability Style) */}
            <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>📦</span> Sản phẩm có sẵn tại kho
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sẵn hàng giao ngay
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                <p className="font-bold text-slate-800">{companyInfo.address}</p>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`tel:${companyInfo.hotlineRaw}`}
                    className="text-red-600 font-bold hover:underline"
                  >
                    📞 {companyInfo.hotline}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      companyInfo.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500"
                  >
                    📍 Bản đồ
                  </a>
                </div>
              </div>

              {/* Quantity + Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700">Số lượng đặt:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-xs font-extrabold text-slate-950 bg-white border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAddToQuote}
                  className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>Thêm Báo Giá</span>
                </button>
                <Link
                  href="/quote"
                  onClick={handleAddToQuote}
                  className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📋</span>
                  <span>Lên Đơn Ngay</span>
                </Link>
              </div>

              <a
                href={`https://zalo.me/${companyInfo.hotlineRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>💬</span>
                <span>TƯ VẤN ZALO SẾP: {companyInfo.hotline}</span>
              </a>
            </div>

            {/* Bảng Thông Số Kỹ Thuật (Right Column Card like CellphoneS) */}
            <div
              id="thong-so"
              className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm space-y-3"
            >
              <h3 className="text-sm font-extrabold text-slate-950 flex items-center justify-between">
                <span>⚙️ Thông số kỹ thuật</span>
                <span className="text-[11px] font-semibold text-blue-600">
                  {product.specsTable?.length || 0} thông số
                </span>
              </h3>

              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    {product.specsTable?.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-slate-100 last:border-b-0 ${
                          idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-500 font-medium w-2/5 border-r border-slate-100">
                          {item.label}
                        </td>
                        <td className="py-2.5 px-3 text-slate-950 font-bold w-3/5">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-950">
                Sản phẩm cùng thương hiệu & danh mục
              </h2>
              <Link
                href="/products"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="group bg-white rounded-2xl p-4 border border-black/[0.06] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="relative aspect-square w-full rounded-xl bg-slate-50 overflow-hidden p-2">
                    <Image
                      src={rp.image || "/images/products/image281.png"}
                      alt={rp.name}
                      fill
                      sizes="240px"
                      className="object-contain group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600">
                      {rp.name}
                    </h3>
                    <div className="text-sm font-extrabold text-red-600">
                      {formatCurrency(rp.priceWithVAT)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Bar (Exact CellphoneS Style in User Reference) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white p-1 shrink-0 hidden sm:block">
              <Image
                src={productImages[0]}
                alt={product.name}
                fill
                sizes="44px"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {product.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {selectedOption} • SL: {quantity}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden xs:block">
              <div className="text-sm sm:text-base font-extrabold text-red-600">
                {formatCurrency(salePrice * quantity)}
              </div>
              {hasDiscount && (
                <div className="text-[10px] text-slate-400 line-through">
                  {formatCurrency(regularPrice * quantity)}
                </div>
              )}
            </div>
            <button
              onClick={handleAddToQuote}
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm transition-all whitespace-nowrap"
            >
              🛒 Thêm vào báo giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
