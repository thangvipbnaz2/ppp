"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import ProductModal from "./ProductModal";
import { bestSellingProducts } from "@/lib/bestsellers";

export default function BestSellersSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddToQuote = (product: Product, quantity = 1) => {
    try {
      const stored = localStorage.getItem("anphu_quote_items");
      const current = stored ? JSON.parse(stored) : [];
      const existingIdx = current.findIndex((item: { product: Product }) => item.product.id === product.id);
      if (existingIdx >= 0) {
        current[existingIdx].quantity += quantity;
      } else {
        current.push({ product, quantity });
      }
      localStorage.setItem("anphu_quote_items", JSON.stringify(current));
      showToast(`✓ Đã thêm ${quantity} x "${product.name.slice(0, 30)}..." vào báo giá!`);
    } catch {
      showToast(`✓ Đã thêm vào báo giá!`);
    }
  };

  return (
    <section className="relative overflow-hidden py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-2">
              <span>🔥</span> Bán chạy nhất thị trường
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Sản Phẩm Bán Chạy Nhất
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Các model đèn LED âm trần, panel văn phòng, tuýp xưởng và đèn pha ngoài trời được lựa chọn và lắp đặt nhiều nhất cho các công trình trọng điểm
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Xem tất cả 672+ sản phẩm <span>→</span>
          </Link>
        </div>

        {/* 8 Best Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="group relative bg-white rounded-3xl p-4 border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between cursor-pointer select-none"
            >
              {/* Badge Rank & Category */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  <span>★</span> TOP {idx + 1}
                </span>
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[50%]">
                  {p.category}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 p-4 flex items-center justify-center overflow-hidden mb-3 border border-black/[0.03]">
                <Image
                  src={p.image || "/images/products/image281.png"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                  unoptimized
                />
              </div>

              {/* Details */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h3>

                  {/* Micro Specs */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {p.specs?.power && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        ⚡ {p.specs.power}
                      </span>
                    )}
                    {p.specs?.cutout && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        📐 {p.specs.cutout}
                      </span>
                    )}
                    {p.specs?.ipRating && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        🛡️ {p.specs.ipRating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Action */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Giá có VAT:</span>
                    <span className="text-base font-bold text-slate-900 tracking-tight">
                      {p.priceWithVAT > 0 ? formatCurrency(p.priceWithVAT) : "Liên hệ"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQuote(p, 1);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
                  >
                    <span>+ Thêm vào báo giá</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToQuote={handleAddToQuote}
        />
      )}
    </section>
  );
}
