"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pageSize = 24;

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json").then((r) => r.json()),
      fetch("/data/categories.json").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat !== null) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
    const br = searchParams.get("brand");
    if (br !== null) {
      setSelectedBrand(br);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const smartHomeCount = useMemo(() => {
    return products.filter((p) => {
      const text = (p.name + " " + p.category + " " + JSON.stringify(p.specs || {})).toLowerCase();
      return ["smart", "thông minh", "mesh", "wifi", "bluetooth", "ble", "công tắc", "cảm biến", "pir", "rgb"].some((k) => text.includes(k));
    }).length;
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;

    if (selectedBrand === "rangdong") {
      result = result.filter((p) => p.brand === "Rạng Đông");
    } else if (selectedBrand === "kingled") {
      result = result.filter((p) => p.brand === "Kingled");
    } else if (selectedBrand === "ledvance") {
      result = result.filter((p) => p.brand === "Ledvance");
    }

    if (selectedCategory) {
      if (selectedCategory === "smart-home") {
        result = result.filter((p) => {
          const text = (p.name + " " + p.category + " " + JSON.stringify(p.specs || {})).toLowerCase();
          return ["smart", "thông minh", "mesh", "wifi", "bluetooth", "ble", "công tắc", "cảm biến", "pir", "rgb"].some((k) => text.includes(k));
        });
      } else {
        result = result.filter((p) => p.category === selectedCategory);
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sortBy === "priceAsc") return a.priceWithVAT - b.priceWithVAT;
      if (sortBy === "priceDesc") return b.priceWithVAT - a.priceWithVAT;
      return a.name.localeCompare(b.name, "vi");
    });

    return result;
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Đang nạp dữ liệu 672+ sản phẩm...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-xs font-semibold animate-fade-in flex items-center gap-2 border border-white/10">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Bảng giá sản phẩm
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hiển thị {filtered.length} sản phẩm {selectedCategory && `thuộc "${selectedCategory}"`} • Bấm vào sản phẩm để xem chi tiết
        </p>
      </div>

      {/* iOS-Style Search & Filter Bar */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
        {/* Brand Selector Tabs */}
        <div className="flex items-center gap-2 pb-2 border-b border-black/[0.05] overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap mr-1">
            🏷️ Hãng sản xuất:
          </span>
          {[
            { id: "all", name: "Tất cả các hãng", count: products.length, icon: "🌐" },
            { id: "rangdong", name: "Rạng Đông", count: products.filter((p) => p.brand === "Rạng Đông").length, icon: "🔆" },
            { id: "kingled", name: "Kingled", count: products.filter((p) => p.brand === "Kingled").length, icon: "👑" },
            { id: "ledvance", name: "Ledvance", count: products.filter((p) => p.brand === "Ledvance").length, icon: "⚡" },
          ].map((b) => {
            const active = selectedBrand === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBrand(b.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-slate-900 text-white shadow-sm scale-102"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/90 hover:text-slate-900"
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* iOS Search input */}
          <div className="relative sm:col-span-2">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tên model (ví dụ: AT04, CP10, LN12, 150W...)"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 text-xs text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 focus:outline-none text-xs text-slate-800 transition-all"
          >
            <option value="name">Sắp xếp: Tên A → Z</option>
            <option value="priceAsc">Giá: Thấp đến Cao</option>
            <option value="priceDesc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        {/* Category Pill Carousel - iOS Style */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === ""
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
            }`}
          >
            Tất cả ({products.length})
          </button>

          {/* Special Smart Home & IoT Pill */}
          <button
            onClick={() => handleCategoryChange("smart-home")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
              selectedCategory === "smart-home"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] scale-102"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100/80 hover:text-blue-900 border border-blue-200/60"
            }`}
          >
            <span>✨</span>
            <span>Smart Home & IoT</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategory === "smart-home" ? "bg-white/20 text-white" : "bg-blue-200/60 text-blue-900"
            }`}>
              {smartHomeCount}
            </span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {paged.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paged.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                onAddToQuote={() => handleAddToQuote(product, 1)}
              />
            ))}
          </div>

          {/* iOS Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-700 disabled:opacity-30 hover:bg-white shadow-sm transition-all"
              >
                ← Trước
              </button>

              <span className="text-xs text-slate-500 px-3">
                Trang <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-slate-700 disabled:opacity-30 hover:bg-white shadow-sm transition-all"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.06] shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1">Vui lòng thử từ khóa khác hoặc xóa bộ lọc danh mục.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(prod, qty) => handleAddToQuote(prod, qty)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
