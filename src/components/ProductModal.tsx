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

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product]);

  if (!product) return null;

  const handleCopy = () => {
    const text = `${product.name}\nDanh mục: ${product.category}\nGiá có VAT: ${formatCurrency(product.priceWithVAT)}\nGiá chưa VAT: ${formatCurrency(product.priceNoVAT)}`;
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
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card - Apple Sheet Style */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-black/[0.08] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            {/* Image Box */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 p-6 flex items-center justify-center border border-black/[0.04]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="text-4xl text-slate-300">💡</div>
              )}
            </div>

            {/* Info Box */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-black/[0.04]">
                  {product.category}
                </span>
                <h2 className="text-xl font-bold text-slate-950 leading-snug pt-1">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-400">Mã ID: #{product.id} • Rạng Đông</p>
              </div>

              {/* Price block */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Giá bán (Đã gồm VAT):</span>
                  <span className="text-2xl font-extrabold text-blue-700 tracking-tight">
                    {product.priceWithVAT > 0 ? formatCurrency(product.priceWithVAT) : "Liên hệ"}
                  </span>
                </div>

                {product.priceNoVAT > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Đơn giá chưa VAT:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(product.priceNoVAT)}</span>
                  </div>
                )}

                {product.vatRate > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Thuế suất VAT:</span>
                    <span className="font-semibold text-emerald-600">{(product.vatRate * 100).toFixed(0)}%</span>
                  </div>
                )}

                {product.retailPrice > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Giá niêm yết hãng:</span>
                    <span className="line-through">{formatCurrency(product.retailPrice)}</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600">Số lượng:</span>
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

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
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
              {copied ? "✓ Đã sao chép!" : "Sao chép thông tin"}
            </button>

            <Link
              href="/quote"
              className="py-3.5 px-5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all"
            >
              Xem báo giá →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
