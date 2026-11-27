"use client";

import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { isContactProduct, isOutOfStock } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import Image from "@/components/SafeImage";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onAddToQuote?: (product: Product) => void;
}

export default function ProductCard({ product, onClick, onAddToQuote }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const specs = product.specs;

  const contact = isContactProduct(product);
  const outOfStock = isOutOfStock(product);
  const regularPrice = product.regularPrice || product.retailPrice || 0;
  const hasDiscount = !contact && regularPrice > product.priceWithVAT;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - product.priceWithVAT) / regularPrice) * 100)
    : 0;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact || outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image ?? "",
      price: product.priceWithVAT,
      priceNoVat: product.priceNoVAT,
      stockStatus: product.stockStatus ?? "instock",
      priceStatus: product.priceStatus ?? "available",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl p-4 border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          {outOfStock ? (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-600 text-white shadow-xs uppercase">
              Hết hàng
            </span>
          ) : hasDiscount ? (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white shadow-xs uppercase">
              -{discountPercent}%
            </span>
          ) : null}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-black/[0.04] truncate">
            {product.category}
          </span>
        </div>
        {product.vatRate > 0 && !contact && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            VAT {(product.vatRate * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 p-4 flex items-center justify-center overflow-hidden mb-3 border border-black/[0.03]">
        {product.image && !imgError ? (
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-contain transition-transform duration-500 ease-out ${
                outOfStock ? "opacity-60" : "group-hover:scale-108"
              }`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-[10px] mt-1 text-slate-400">Rạng Đông</span>
          </div>
        )}
      </div>

      {/* Info & Micro Specs Pill */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Key Specs Pills from Excel */}
          {specs && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {specs.power && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  ⚡ {specs.power}
                </span>
              )}
              {specs.cct && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  💡 {specs.cct}
                </span>
              )}
              {specs.ipRating && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  🛡️ {specs.ipRating}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-slate-500">Giá có VAT:</span>
            {contact ? (
              <span className="text-sm font-extrabold text-amber-600">
                Liên hệ
              </span>
            ) : (
              <span className="text-base font-bold text-slate-900 tracking-tight">
                {formatCurrency(product.priceWithVAT)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Giá niêm yết:</span>
              <span className="line-through">
                {formatCurrency(regularPrice)}
              </span>
            </div>
          )}

          {!contact && product.priceNoVAT > 0 && (
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Chưa VAT:</span>
              <span>{formatCurrency(product.priceNoVAT)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`mt-4 grid gap-2 ${onAddToQuote ? "grid-cols-2" : "grid-cols-1"}`}>
          <button
            onClick={handleAddToCart}
            disabled={contact || outOfStock}
            className={`py-2.5 px-3 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              contact || outOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {outOfStock ? "Hết hàng" : contact ? "Liên hệ" : added ? "Đã thêm ✓" : "Thêm giỏ"}
          </button>

          {onAddToQuote && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToQuote(product);
              }}
              className="py-2.5 px-3 rounded-xl text-[11px] font-bold bg-slate-900 hover:bg-blue-600 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>📋</span>
              Báo giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
