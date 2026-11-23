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

export default function ProductModal({ product, onClose, onAddToQuote }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "pricing" | "raw">("specs");

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setActiveTab("specs");
  }, [product]);

  if (!product) return null;

  const specs = product.specs;

  const handleCopy = () => {
    let text = `${product.name}\nDanh mục: ${product.category}\nGiá có VAT: ${formatCurrency(product.priceWithVAT)}\nGiá chưa VAT: ${formatCurrency(product.priceNoVAT)}`;
    if (specs) {
      if (specs.power) text += `\nCông suất: ${specs.power}`;
      if (specs.voltage) text += `\nĐiện áp: ${specs.voltage}`;
      if (specs.cct) text += `\nNhiệt độ màu: ${specs.cct}`;
      if (specs.lumen) text += `\nQuang thông: ${specs.lumen}`;
      if (specs.dimensions) text += `\nKích thước: ${specs.dimensions}`;
      if (specs.warranty) text += `\nBảo hành: ${specs.warranty}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = () => {
    if (onAddToQuote) {
      onAddToQuote(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-black/[0.08] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">Mã ID: #{product.id}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-12 gap-6 items-start">
            {/* Image Box */}
            <div className="sm:col-span-5 relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 p-6 flex items-center justify-center border border-black/[0.04]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="text-5xl text-slate-300">💡</div>
              )}
            </div>

            {/* Title & Core Price */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Chính hãng Rạng Đông • Bảo hành 2 năm</p>
              </div>

              {/* Price card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Giá bán (Đã gồm VAT):</span>
                  <span className="text-2xl font-black text-blue-700 tracking-tight">
                    {product.priceWithVAT > 0 ? formatCurrency(product.priceWithVAT) : "Liên hệ"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Đơn giá chưa VAT:</span>
                    <span className="font-semibold text-slate-800">
                      {product.priceNoVAT > 0 ? formatCurrency(product.priceNoVAT) : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Thuế VAT:</span>
                    <span className="font-semibold text-emerald-600">
                      {(product.vatRate * 100).toFixed(0)}%
                    </span>
                  </div>
                  {product.retailPrice > 0 && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Giá bán lẻ hãng:</span>
                      <span className="line-through text-slate-500 font-medium">
                        {formatCurrency(product.retailPrice)}
                      </span>
                    </div>
                  )}
                  {product.finalPrice > 0 && product.finalPrice !== product.priceWithVAT && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Giá cuối (sau cơ chế):</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(product.finalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Support mechanisms from Excel */}
                {(product.supportMechanism || product.giftSupport) && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    {product.supportMechanism && (
                      <p className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                        🎁 Cơ chế: {product.supportMechanism}
                      </p>
                    )}
                    {product.giftSupport && (
                      <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
                        ✨ Ưu đãi tặng kèm: {product.giftSupport}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Số lượng lên đơn:</span>
                <div className="inline-flex items-center rounded-xl bg-slate-100 border border-slate-200/80 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-colors shadow-sm"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* iOS Tabs: Thông số kỹ thuật / Chính sách giá Excel / Mô tả gốc */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 max-w-fit mb-4">
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "specs"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "pricing"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cơ chế & Chiết khấu Excel
              </button>
              {specs?.rawSpecs && (
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "raw"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mô tả gốc trong Excel
                </button>
              )}
            </div>

            {/* Tab 1: Specs Table */}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {specs?.power && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Công suất định mức:</span>
                    <strong className="text-slate-900">{specs.power}</strong>
                  </div>
                )}
                {specs?.voltage && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Dải điện áp hoạt động:</span>
                    <strong className="text-slate-900">{specs.voltage}</strong>
                  </div>
                )}
                {specs?.cct && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Nhiệt độ màu (CCT):</span>
                    <strong className="text-slate-900">{specs.cct}</strong>
                  </div>
                )}
                {specs?.lumen && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Quang thông:</span>
                    <strong className="text-slate-900">{specs.lumen}</strong>
                  </div>
                )}
                {specs?.cri && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Chỉ số hoàn màu (CRI):</span>
                    <strong className="text-slate-900">{specs.cri}</strong>
                  </div>
                )}
                {specs?.chipLed && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Chip LED công nghệ:</span>
                    <strong className="text-slate-900">{specs.chipLed}</strong>
                  </div>
                )}
                {specs?.lifespan && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Tuổi thọ đèn:</span>
                    <strong className="text-slate-900">{specs.lifespan}</strong>
                  </div>
                )}
                {specs?.dimensions && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Kích thước (DxRxC):</span>
                    <strong className="text-slate-900">{specs.dimensions}</strong>
                  </div>
                )}
                {specs?.cutout && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Kích thước khoét trần:</span>
                    <strong className="text-slate-900">{specs.cutout}</strong>
                  </div>
                )}
                {specs?.ipRating && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Cấp bảo vệ:</span>
                    <strong className="text-blue-700">{specs.ipRating}</strong>
                  </div>
                )}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">Chế độ bảo hành:</span>
                  <strong className="text-emerald-700">{specs?.warranty || "2 năm chính hãng"}</strong>
                </div>
              </div>
            )}

            {/* Tab 2: Pricing Mechanics */}
            {activeTab === "pricing" && (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Đơn giá gốc T9 (chưa trừ cơ chế):</span>
                    <span className="font-semibold text-slate-800">
                      {product.originalPriceNoVAT ? formatCurrency(product.originalPriceNoVAT) : formatCurrency(product.priceNoVAT)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Số tiền hỗ trợ trực tiếp (đ):</span>
                    <span className="font-semibold text-blue-700">
                      {product.supportAmount ? formatCurrency(product.supportAmount) : "0 đ"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Cơ chế áp dụng T9:</span>
                    <span className="font-semibold text-slate-800">
                      {product.supportMechanism || "Áp dụng theo bảng tổng hợp giá T9/2026"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Hỗ trợ tặng SP T9:</span>
                    <span className="font-semibold text-slate-800">
                      {product.giftSupport || "Theo chính sách đại lý"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Raw Excel Description */}
            {activeTab === "raw" && specs?.rawSpecs && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-mono whitespace-pre-line text-slate-700 leading-relaxed max-h-60 overflow-y-auto">
                {specs.rawSpecs}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className={`flex-1 py-3.5 px-6 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-950 hover:bg-slate-800 text-white"
              }`}
            >
              {added ? "✓ Đã thêm vào báo giá!" : `Thêm vào báo giá (${quantity} cái)`}
            </button>

            <button
              onClick={handleCopy}
              className="py-3.5 px-5 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              {copied ? "✓ Đã sao chép!" : "Sao chép toàn bộ thông số"}
            </button>

            <Link
              href="/quote"
              className="py-3.5 px-5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all"
            >
              Xem bảng báo giá →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
