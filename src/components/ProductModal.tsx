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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [added, setAdded] = useState(false);

  const images = product?.images && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : ["/images/products/image281.png"];

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
    setAdded(false);
    
    // Set default option if available
    if (product?.attributes && product.attributes.length > 0 && product.attributes[0].options.length > 0) {
      setSelectedOption(product.attributes[0].options[0]);
    } else if (product?.specs?.cct) {
      setSelectedOption(product.specs.cct);
    } else {
      setSelectedOption("Ánh sáng trắng - 6500K");
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-black/[0.08] overflow-hidden z-10 flex flex-col my-auto max-h-[92vh]">
        
        {/* Breadcrumb Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 overflow-x-auto no-scrollbar">
            <Link href="/" onClick={onClose} className="hover:text-slate-900 whitespace-nowrap">
              TRANG CHỦ
            </Link>
            <span>/</span>
            <span className="text-slate-700 whitespace-nowrap uppercase">
              {product.brand || "RẠNG ĐÔNG"}
            </span>
            <span>/</span>
            <span className="text-blue-600 font-bold whitespace-nowrap uppercase truncate max-w-[200px]">
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

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          
          {/* Main 2-Column Product Detail Layout (Matching User Reference) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Gallery & Guarantees Box */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Main Image Box */}
              <div className="relative aspect-square w-full rounded-2xl bg-white p-4 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden group">
                {/* Sale Badge */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 z-10 w-11 h-11 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md uppercase tracking-wider">
                    Sale
                  </div>
                )}

                {/* Brand Badge */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 text-[10px] font-bold border border-slate-200">
                  {product.brand || "Rạng Đông"}
                </div>

                <div className="relative w-full h-full">
                  <Image
                    src={images[activeImageIndex] || images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* Multiple Images Gallery Thumbnails (Click to view) */}
              {images.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Góc chụp sản phẩm ({images.length} ảnh):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl border bg-white p-1 shrink-0 overflow-hidden transition-all duration-200 ${
                          activeImageIndex === idx
                            ? "border-red-600 ring-2 ring-red-500/20 scale-105 shadow-sm"
                            : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
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

              {/* Guarantees Box (Direct match from Reference Image) */}
              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-200">
                  <span className="text-emerald-600">🛡️</span>
                  <span>CAM KẾT TỪ AN PHÚ VINA</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-blue-600 shrink-0 mt-0.5">🚚</span>
                  <p className="leading-snug">
                    Thời gian giao hàng <strong>1-2 ngày</strong>. Miễn phí vận chuyển cho đơn hàng từ <strong>1 Triệu</strong> trở lên.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 shrink-0 mt-0.5">🔄</span>
                  <p className="leading-snug">
                    Đổi trả trong vòng <strong>07 ngày</strong> nếu lỗi từ nhà sản xuất.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0 mt-0.5">💳</span>
                  <p className="leading-snug">
                    Thanh toán linh hoạt: Chuyển khoản, tiền mặt (COD), hỗ trợ xuất hóa đơn <strong>VAT 8%</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Prices, Specs Table, CTA & Options */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Product Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Mã SKU / ID: <span className="font-mono text-slate-600 font-semibold">#{product.id}</span> • Thương hiệu: <span className="font-semibold text-blue-600">{product.brand || "Rạng Đông"}</span>
                </p>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-slate-100">
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                    {formatCurrency(regularPrice)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
                  {formatCurrency(salePrice)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đã gồm VAT 8%
                </span>
              </div>

              {/* Technical Specifications Table (Direct match from User Screenshot) */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>📐</span>
                  <span>Thông số kỹ thuật sản phẩm:</span>
                </h3>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white text-xs">
                  <table className="w-full border-collapse">
                    <tbody>
                      {product.specsTable && product.specsTable.length > 0 ? (
                        product.specsTable.map((item, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-slate-100 last:border-b-0 ${
                              idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                            }`}
                          >
                            <td className="py-2.5 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">
                              {item.label}:
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-950 font-bold w-3/5">
                              {item.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          {product.specs?.power && (
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Công suất:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.power}</td>
                            </tr>
                          )}
                          {product.specs?.voltage && (
                            <tr className="border-b border-slate-100 bg-white">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Điện áp:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.voltage}</td>
                            </tr>
                          )}
                          {product.specs?.lumen && (
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Quang thông:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.lumen}</td>
                            </tr>
                          )}
                          {product.specs?.cct && (
                            <tr className="border-b border-slate-100 bg-white">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Nhiệt độ màu:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.cct}</td>
                            </tr>
                          )}
                          {product.specs?.lifespan && (
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Tuổi thọ:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.lifespan}</td>
                            </tr>
                          )}
                          {product.specs?.dimensions && (
                            <tr className="border-b border-slate-100 bg-white">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">Kích thước (ØxH):</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.dimensions}</td>
                            </tr>
                          )}
                          {product.specs?.cutout && (
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <td className="py-2 px-3.5 text-slate-500 font-medium w-2/5 border-r border-slate-100">ĐK lỗ khoét trần:</td>
                              <td className="py-2 px-3.5 text-slate-950 font-bold">{product.specs.cutout}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Green Prominent CTA Button (Match User Reference) */}
              <a
                href="https://zalo.me/0827955888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md"
              >
                <span>📞</span>
                <span>GỌI NGAY ĐỂ CÓ GIÁ TỐT: 0827 955 888</span>
              </a>

              {/* Color / Attributes Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Màu Sắc / Nhiệt độ ánh sáng:</span>
                  <span className="text-[11px] font-normal text-slate-400">Tùy chọn theo thiết kế</span>
                </label>

                {product.attributes && product.attributes.length > 0 && product.attributes[0].options.length > 0 ? (
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {product.attributes[0].options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Ánh sáng trắng - 6500K">Ánh sáng trắng - 6500K (Chiếu sáng sinh hoạt)</option>
                    <option value="Ánh sáng trung tính - 4000K">Ánh sáng trung tính - 4000K (Tự nhiên dịu mắt)</option>
                    <option value="Ánh sáng vàng - 3000K">Ánh sáng vàng - 3000K (Ấm cúng, thư giãn)</option>
                    <option value="Đổi 3 màu">Đổi 3 màu (Trắng / Vàng / Trung tính)</option>
                  </select>
                )}
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-white min-w-[36px] text-center border-x border-slate-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleAdd}
                    className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
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
                    className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 text-center active:scale-98"
                  >
                    <span>📋</span>
                    <span>Lên Đơn Báo Giá Ngay</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Description Section */}
          {product.description && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>📖</span>
                <span>Mô tả chi tiết & Hướng dẫn sử dụng:</span>
              </h3>
              <div className="text-xs text-slate-600 leading-relaxed space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60 font-normal">
                {product.description}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
