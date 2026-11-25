"use client";

import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote?: (product: Product, quantity: number) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToQuote,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageUrl, setActiveImageUrl] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [added, setAdded] = useState(false);

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : ["/images/products/image281.png"];

  const installationImages = product?.installationImages || [];

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setActiveImageUrl(productImages[0]);

    if (product?.attributes && product.attributes.length > 0 && product.attributes[0].options.length > 0) {
      setSelectedOption(product.attributes[0].options[0]);
    } else if (product?.specs?.cct) {
      setSelectedOption(product.specs.cct);
    } else {
      setSelectedOption("Ánh sáng trắng - 6500K");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToQuote) {
      onAddToQuote(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const regularPrice = product.regularPrice || product.retailPrice || Math.round(product.priceWithVAT * 1.35);
  const salePrice = product.priceWithVAT;
  const hasDiscount = regularPrice > salePrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const displayMainImage = activeImageUrl || productImages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-black/[0.08] overflow-hidden z-10 flex flex-col my-auto h-[90vh] md:h-[85vh] max-h-[820px]">
        
        {/* Breadcrumb Header Bar */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 overflow-x-auto no-scrollbar">
            <Link href="/" onClick={onClose} className="hover:text-slate-900 whitespace-nowrap">
              TRANG CHỦ
            </Link>
            <span>/</span>
            <span className="text-slate-700 whitespace-nowrap uppercase">
              {product.brand || "RẠNG ĐÔNG"}
            </span>
            <span>/</span>
            <span className="text-blue-600 font-bold whitespace-nowrap uppercase truncate max-w-[240px]">
              {product.category}
            </span>
          </nav>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors shrink-0 ml-3"
            title="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        {/* Main 2-Column Body: Left Fixed Image, Right Scrollable Specs */}
        <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
          {/* Left Column: Fixed Product Image Gallery & Guarantees Box */}
          <div className="md:col-span-5 md:h-full md:overflow-y-auto p-5 sm:p-6 bg-slate-50/60 border-b md:border-b-0 md:border-r border-slate-100 space-y-4">
            
            {/* Main Image Box */}
            <div className="relative aspect-square w-full rounded-2xl bg-white p-4 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden group">
              {hasDiscount && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md uppercase tracking-wider">
                  -{discountPercent}%
                </div>
              )}

              <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 text-[10px] font-bold border border-slate-200">
                {product.brand || "Rạng Đông"}
              </div>

              <div className="relative w-full h-full">
                <Image
                  src={displayMainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Product Gallery Thumbnails */}
            {productImages.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ảnh sản phẩm ({productImages.length} góc):
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={`prod-${idx}`}
                      onClick={() => setActiveImageUrl(imgUrl)}
                      className={`relative w-14 h-14 rounded-xl border bg-white p-1 shrink-0 overflow-hidden transition-all duration-200 ${
                        displayMainImage === imgUrl
                          ? "border-red-600 ring-2 ring-red-500/20 scale-105 shadow-sm"
                          : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} - góc ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-contain"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Installation Thumbnails Switcher in Left Column */}
            {installationImages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <span>🏗️</span>
                  <span>Ảnh lắp đặt minh họa ({installationImages.length}):</span>
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {installationImages.map((imgUrl, idx) => (
                    <button
                      key={`inst-${idx}`}
                      onClick={() => setActiveImageUrl(imgUrl)}
                      className={`relative w-16 h-12 rounded-xl border bg-white shrink-0 overflow-hidden transition-all duration-200 ${
                        displayMainImage === imgUrl
                          ? "border-blue-600 ring-2 ring-blue-500/20 scale-105 shadow-sm"
                          : "border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Lắp đặt ${product.name} ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantees Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-600 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 pb-1.5 border-b border-slate-100">
                <span className="text-emerald-600">🛡️</span>
                <span>CAM KẾT TỪ AN PHÚ VINA</span>
              </div>
              <p className="leading-snug text-[11px]">🚚 Giao hàng nhanh <strong>1-2 ngày</strong> • Miễn phí ship đơn từ <strong>1 Triệu</strong>.</p>
              <p className="leading-snug text-[11px]">🔄 Đổi trả trong <strong>07 ngày</strong> nếu lỗi từ nhà sản xuất.</p>
              <p className="leading-snug text-[11px]">💳 Bảo hành <strong>2 năm chính hãng</strong> • Hỗ trợ xuất VAT 8%.</p>
            </div>
          </div>

          {/* Right Column: Scrollable Title, Value Highlights, Specs, Installation Photos & CTA */}
          <div className="md:col-span-7 md:h-full md:overflow-y-auto p-5 sm:p-7 space-y-5">
            
            {/* Product Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Mã ID: <span className="font-mono text-slate-600 font-semibold">#{product.id}</span> • Thương hiệu: <span className="font-semibold text-blue-600">{product.brand || "Rạng Đông"}</span>
              </p>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-baseline gap-3 pb-3 border-b border-slate-100">
              {hasDiscount && (
                <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                  {formatCurrency(regularPrice)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
                {formatCurrency(salePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Tiết kiệm {discountPercent}%
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã gồm VAT 8%
              </span>
            </div>

            {/* Why Buy / Highlights Box */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/70 rounded-2xl p-4 border border-blue-200/70 space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Ưu Điểm Vượt Trội & Lý Do Đáng Mua:</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 leading-snug">
                      <span className="text-emerald-600 font-extrabold shrink-0 mt-0.5">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Buy & Options */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 space-y-3">
              {/* Green Prominent CTA Button */}
              <a
                href="https://zalo.me/0827955888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>📞</span>
                <span>GỌI NGAY ĐỂ CÓ GIÁ TỐT: 0827 955 888</span>
              </a>

              <div className="grid sm:grid-cols-2 gap-3 items-end">
                {/* Color / Attributes Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Màu Sắc / Ánh sáng:
                  </label>
                  {product.attributes && product.attributes.length > 0 && product.attributes[0].options.length > 0 ? (
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      {product.attributes[0].options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Ánh sáng trắng - 6500K">Ánh sáng trắng - 6500K</option>
                      <option value="Ánh sáng trung tính - 4000K">Ánh sáng trung tính - 4000K</option>
                      <option value="Ánh sáng vàng - 3000K">Ánh sáng vàng - 3000K</option>
                      <option value="Đổi 3 màu">Đổi 3 màu</option>
                    </select>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-slate-950 min-w-[32px] text-center border-x border-slate-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAdd}
                  className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>{added ? "✓ Đã thêm vào báo giá" : "Thêm Vào Báo Giá"}</span>
                </button>

                <Link
                  href="/quote"
                  onClick={() => {
                    if (onAddToQuote) onAddToQuote(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📋</span>
                  <span>Lên Đơn Báo Giá Ngay</span>
                </Link>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>📐</span>
                <span>Thông Số Kỹ Thuật Chi Tiết ({product.specsTable?.length || 0} chỉ số):</span>
              </h3>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    {product.specsTable && product.specsTable.length > 0 && product.specsTable.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-slate-100 last:border-b-0 ${
                          idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                        }`}
                      >
                        <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">
                          {item.label}:
                        </td>
                        <td className="py-2 px-3.5 text-slate-950 font-bold w-3/5">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suitable Applications */}
            {product.applications && product.applications.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>🏠</span>
                  <span>Không Gian Lắp Đặt Phù Hợp:</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/70"
                    >
                      • {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Installation Illustration Photos Showcase */}
            {installationImages.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span>🏗️</span>
                    <span>Ảnh Lắp Đặt Minh Họa & Ứng Dụng Thực Tế:</span>
                  </h3>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Bấm ảnh để phóng to bên trái
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {installationImages.map((imgUrl, idx) => (
                    <button
                      key={`grid-inst-${idx}`}
                      onClick={() => setActiveImageUrl(imgUrl)}
                      className={`relative aspect-video rounded-xl overflow-hidden border transition-all group ${
                        displayMainImage === imgUrl
                          ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md"
                          : "border-slate-200 hover:border-blue-400"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Ảnh lắp đặt ${product.name} ${idx + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Description Section */}
            {product.description && (
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📖</span>
                  <span>Mô Tả Chi Tiết & Tư Vấn Lắp Đặt:</span>
                </h3>
                <div className="text-xs text-slate-600 leading-relaxed space-y-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 font-normal">
                  {product.description.split("\n").filter(Boolean).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
