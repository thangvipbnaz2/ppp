"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import ProductModal from "./ProductModal";
import { smartHomeFeatures, curatedSmartProducts } from "@/lib/smarthome";

export default function SmartHomeSection() {
  const router = useRouter();
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
    <section className="relative overflow-hidden py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Decorative Apple-style Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Apple Keynote Style Hero Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.35)] overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Hệ Sinh Thái Rallismart IoT Cao Cấp</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Nhà Thông Minh & Chiếu Sáng Dưỡng Sinh
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Trải nghiệm điều khiển ánh sáng và thiết bị điện mọi lúc mọi nơi qua Smartphone & giọng nói. Tự động đổi màu 16 triệu sắc thái, lập trình kịch bản thông minh cho căn hộ, biệt thự và văn phòng hiện đại.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products?category=smart-home"
                className="px-6 py-3 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-blue-50 shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:scale-102 transition-all duration-300"
              >
                Xem tất cả 85+ thiết bị Smart Home →
              </Link>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>🛡️</span> Bảo hành chính hãng 2 năm
              </span>
            </div>
          </div>
        </div>

        {/* 4 Core Features Bento */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {smartHomeFeatures.map((f) => (
            <div
              key={f.title}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Curated Products Showcase Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
                <span>✨</span> Trưng bày nổi bật
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Sản Phẩm Smart Home Tiêu Biểu
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Bấm vào từng sản phẩm để xem thông số chi tiết, kịch bản tương thích và tạo báo giá
              </p>
            </div>
            <Link
              href="/products?category=smart-home"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Xem toàn bộ danh mục Smart Home <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedSmartProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/products/${p.id}`)}
                className="group relative bg-white rounded-3xl p-4 border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between cursor-pointer select-none"
              >
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                    ⚡ Smart IoT
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    VAT 8%
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
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h4>

                    {/* Micro specs */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {p.specs?.power && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          ⚡ {p.specs.power}
                        </span>
                      )}
                      {p.specs?.cct && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                          🎨 {p.specs.cct.slice(0, 16)}
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
