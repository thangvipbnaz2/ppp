"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import SmartHomeSection from "./SmartHomeSection";
import BestSellersSection from "./BestSellersSection";
import { BRANDS } from "./BrandSidebar";

interface BrandFilteredSectionProps {
  selectedBrand: string;
  onSelectBrand?: (brandId: string) => void;
}

export default function BrandFilteredSection({
  selectedBrand,
  onSelectBrand,
}: BrandFilteredSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [subCategory, setSubCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  // Reset page & subCategory when brand changes
  useEffect(() => {
    setCurrentPage(1);
    setSubCategory("all");
  }, [selectedBrand]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddToQuote = (product: Product, quantity = 1) => {
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
        `✓ Đã thêm ${quantity} x "${product.name.slice(0, 30)}..." vào báo giá!`
      );
    } catch {
      showToast(`✓ Đã thêm vào báo giá!`);
    }
  };

  // Filter products by brand
  const brandProducts = useMemo(() => {
    if (selectedBrand === "rangdong") {
      return products.filter((p) => p.brand === "Rạng Đông");
    }
    if (selectedBrand === "kingled") {
      return products.filter((p) => p.brand === "Kingled");
    }
    if (selectedBrand === "ledvance") {
      return products.filter((p) => p.brand === "Ledvance");
    }
    return products;
  }, [products, selectedBrand]);

  // Extract available categories for the selected brand
  const availableSubCategories = useMemo(() => {
    if (selectedBrand === "all") return [];
    const cats = new Set<string>();
    brandProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [brandProducts, selectedBrand]);

  // Filter by subcategory
  const filteredProducts = useMemo(() => {
    let list = brandProducts;
    if (subCategory === "smart-home") {
      list = list.filter(
        (p) =>
          p.subBrand === "Rallismart" ||
          p.category.toLowerCase().includes("smart") ||
          p.name.toLowerCase().includes("smart") ||
          p.name.toLowerCase().includes("wifi") ||
          p.name.toLowerCase().includes("ble")
      );
    } else if (subCategory !== "all") {
      list = list.filter((p) => p.category === subCategory);
    }
    return list;
  }, [brandProducts, subCategory]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  // If user selected "all", display the default Homepage flow (Smart Home + Best Sellers)
  if (selectedBrand === "all" || !selectedBrand) {
    return (
      <div className="space-y-12">
        <SmartHomeSection />
        <BestSellersSection />
      </div>
    );
  }

  const currentBrandInfo = BRANDS.find((b) => b.id === selectedBrand);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Brand Hero Showcase Banner */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-white/10 ${
          selectedBrand === "rangdong"
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
            : selectedBrand === "kingled"
            ? "bg-gradient-to-br from-slate-950 via-amber-950 to-orange-950"
            : selectedBrand === "ledvance"
            ? "bg-gradient-to-br from-slate-950 via-orange-950 to-red-950"
            : "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Thương Hiệu: {currentBrandInfo?.displayName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {selectedBrand === "rangdong" && "Thiết Bị Điện & Chiếu Sáng Rạng Đông Chính Hãng"}
              {selectedBrand === "kingled" && "Đèn LED Chiếu Sáng Cao Cấp Kingled"}
              {selectedBrand === "ledvance" && "Đèn Downlight LEDVANCE (Osram) — Tiêu Chuẩn CHLB Đức"}
              {!["rangdong", "kingled", "ledvance"].includes(selectedBrand) &&
                `Thiết Bị Chiếu Sáng ${currentBrandInfo?.displayName} Chính Hãng`}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              {currentBrandInfo?.tagline}. Phân phối ủy quyền bởi Công ty TNHH MTV TM Thiết Bị Điện An Phú Vina (MST: 0110271235) với chính sách chiết khấu đại lý & dự án 15% - 42%.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {brandProducts.length > 0 ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                    <span>📦</span>
                    <span>{brandProducts.length} sản phẩm trực tuyến</span>
                  </div>
                  <Link
                    href={`/products?brand=${selectedBrand}`}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-blue-50 shadow-md hover:scale-102 transition-all"
                  >
                    Xem toàn bộ trong bảng giá →
                  </Link>
                </>
              ) : (
                <a
                  href="https://zalo.me/0827955888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-md flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>Liên hệ Zalo Sếp nhận báo giá {currentBrandInfo?.name}</span>
                </a>
              )}
            </div>
          </div>

          {/* Brand Logo Card in Hero */}
          {currentBrandInfo?.logo && (
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-white/20 shrink-0 self-center md:self-auto flex items-center justify-center w-44 h-24">
              <Image
                src={currentBrandInfo.logo}
                alt={currentBrandInfo.name}
                width={150}
                height={50}
                className="max-h-14 w-auto object-contain"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      {/* Subcategory Pills or Partner Showcase */}
      {brandProducts.length > 0 ? (
        <>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-black/[0.06] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Lọc theo danh mục ({filteredProducts.length} sản phẩm):
              </span>
              {onSelectBrand && (
                <button
                  onClick={() => onSelectBrand("all")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>←</span>
                  <span>Hiện tất cả các hãng</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <button
                onClick={() => {
                  setSubCategory("all");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  subCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tất cả {currentBrandInfo?.name} ({brandProducts.length})
              </button>

              {selectedBrand === "rangdong" && (
                <button
                  onClick={() => {
                    setSubCategory("smart-home");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    subCategory === "smart-home"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/50"
                  }`}
                >
                  <span>✨</span>
                  <span>Rallismart Smart Home</span>
                </button>
              )}

              {availableSubCategories.map((cat) => {
                const count = brandProducts.filter((p) => p.category === cat).length;
                const active = subCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSubCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">
                Đang tải sản phẩm {currentBrandInfo?.name}...
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pagedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => setSelectedProduct(p)}
                    onAddToQuote={() => handleAddToQuote(p, 1)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage((cp) => Math.max(1, cp - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-700 disabled:opacity-30 hover:bg-white shadow-sm transition-all"
                  >
                    ← Trước
                  </button>

                  <span className="text-xs text-slate-500 px-3">
                    Trang <strong className="text-slate-900">{currentPage}</strong> /{" "}
                    {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((cp) => Math.min(totalPages, cp + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-700 disabled:opacity-30 hover:bg-white shadow-sm transition-all"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Partner Brand Showcase Details */
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-black/[0.06] shadow-sm text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <h3 className="text-xl font-bold text-slate-900">
              Nhà Phân Phối Thương Hiệu {currentBrandInfo?.displayName}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              An Phú Vina cung cấp và phân phối toàn bộ danh mục sản phẩm của <strong>{currentBrandInfo?.displayName}</strong> theo yêu cầu thiết kế và bản vẽ kỹ thuật của quý khách.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-lg mb-1">🏷️</div>
                <div className="text-xs font-bold text-slate-800">Chiết khấu 15% - 42%</div>
                <div className="text-[10px] text-slate-400">Ưu đãi dự án & công trình</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-lg mb-1">🛡️</div>
                <div className="text-xs font-bold text-slate-800">Bảo hành 2 năm</div>
                <div className="text-[10px] text-slate-400">Đổi mới chính hãng</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-lg mb-1">📄</div>
                <div className="text-xs font-bold text-slate-800">Đầy đủ CO/CQ</div>
                <div className="text-[10px] text-slate-400">Xuất hóa đơn VAT điện tử</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://zalo.me/0827955888"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
            >
              <span>💬</span>
              <span>Chat Zalo Sếp nhận báo giá: 0827.955.888</span>
            </a>
            <Link
              href="/quote"
              className="px-6 py-3 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md"
            >
              Lên Đơn Báo Giá Dự Án 📋
            </Link>
            {onSelectBrand && (
              <button
                onClick={() => onSelectBrand("all")}
                className="px-6 py-3 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                ← Xem các sản phẩm khác
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToQuote={(prod, quantity) => {
            handleAddToQuote(prod, quantity);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
