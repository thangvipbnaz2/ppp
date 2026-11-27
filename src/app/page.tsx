"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCatalog } from "@/lib/use-catalog";
import Image from "@/components/SafeImage";
import BrandSidebar from "@/components/BrandSidebar";
import BrandFilteredSection from "@/components/BrandFilteredSection";
import { companyInfo } from "@/lib/company";
import type { CategoryGroup, NewsPost } from "@/lib/types";

export default function HomePage() {
  const catalog = useCatalog();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((response) => response.ok ? response.json() : []),
      fetch("/api/news").then((response) => response.ok ? response.json() : []),
    ]).then(([categoryData, newsData]) => {
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setNews(Array.isArray(newsData) ? newsData.slice(0, 3) : []);
    }).catch(() => {
      setCategories([]);
      setNews([]);
    });
  }, []);

  const brandCount = useMemo(
    () => new Set(catalog.map((product) => product.brand).filter(Boolean)).size,
    [catalog],
  );
  const smartHomeCount = useMemo(
    () => catalog.filter((product) => product.categorySlug === "smart-home").length,
    [catalog],
  );

  const stats = [
    { label: "Sản phẩm trực tuyến", value: String(catalog.length), sub: "Dữ liệu catalog hiện tại", icon: "⚡" },
    { label: "Nhóm sản phẩm", value: String(categories.length), sub: "Danh mục đang hoạt động", icon: "🗂️" },
    { label: "Sản phẩm Smart Home", value: String(smartHomeCount), sub: "Tính trực tiếp từ catalog", icon: "🏠" },
    { label: "Thương hiệu", value: String(brandCount), sub: "Có sản phẩm đang hiển thị", icon: "🏷️" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-14 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Logo & Slogan Header */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl mb-2">
            <Image
              src="/images/logo.png"
              alt="An Phú Vina"
              width={38}
              height={38}
              className="object-contain"
              priority
              unoptimized
            />
            <div className="text-left">
              <span className="block text-xs font-extrabold text-slate-900 tracking-tight">
                AN PHÚ VINA
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">
                Lòng tin, sự tử tế đồng hành cùng bạn
              </span>
            </div>
            <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
            Thiết Bị Điện & Chiếu Sáng
            <span className="block bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-700 bg-clip-text text-transparent mt-2">
              Rạng Đông Chính Hãng
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Công ty TNHH MTV TM Thiết Bị Điện An Phú Vina (MST: 0110271235). Nhà phân phối giải pháp Nhà thông minh Smart Home, đèn LED dân dụng và công trình dự án hàng đầu với chính sách chiết khấu tốt nhất.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-slate-950 text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300"
            >
              Xem toàn bộ {catalog.length} sản phẩm →
            </Link>
            <Link
              href="/products?category=smart-home"
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300 flex items-center gap-2"
            >
              <span>✨</span>
              <span>Khám phá Smart Home</span>
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Danh mục sản phẩm</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Tìm nhanh theo nhu cầu</h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-blue-600 hover:underline whitespace-nowrap">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} className="min-h-28 rounded-2xl bg-white border border-black/[0.06] p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="text-2xl">{category.icon || "💡"}</div>
                <h3 className="text-xs font-bold text-slate-900 mt-3 line-clamp-2">{category.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{category.count ?? 0} sản phẩm</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Floating Metric Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="text-xl mb-3">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Layout with Left Brand Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Brand Sidebar (Sticky on Left Desktop Rail - Exactly in the Red Box) */}
          <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <BrandSidebar
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
            />
          </div>

          {/* Dynamic Content Area based on Brand Selection */}
          <div className="flex-1 min-w-0 w-full">
            <BrandFilteredSection
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
            />
          </div>
        </div>
      </section>

      {/* Tin Tức & Sự Kiện + Chính Sách Đại Lý (Đồng bộ từ rangdongapvina.com.vn) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
              📰 Kiến Thức & Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Tin Tức & Giải Pháp Chiếu Sáng
            </h2>
          </div>
          <Link href="/news" className="text-xs font-bold text-blue-600 hover:underline">
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.map((art) => (
            <Link
              key={art.id}
              href={`/news?article=${art.slug}`}
              className="group bg-white rounded-3xl p-4 border border-black/[0.06] shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={art.image || "/images/logo.png"}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {art.category}
                </span>
                <h3 className="text-sm font-bold text-slate-950 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600">Đọc chi tiết →</span>
            </Link>
          ))}
        </div>

        {/* Dành Cho Nhà Phân Phối / Đại Lý */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20">
              🤝 Dành Cho Nhà Phân Phối / Đại Lý
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Đăng Ký Làm Đại Lý Chính Thức Rạng Đông & An Phú Vina
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              An Phú Vina luôn có những chính sách chiết khấu dự án 15% - 42%, hỗ trợ kỹ thuật, công nợ và CO/CQ tốt nhất dành cho Nhà phân phối & Đại lý trên toàn quốc.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full text-xs font-extrabold bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all"
            >
              Đăng ký ngay hôm nay →
            </Link>
            <a
              href={`tel:${companyInfo.hotlineRaw}`}
              className="px-5 py-3 rounded-full text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/25 transition-all"
            >
              📞 {companyInfo.hotline}
            </a>
          </div>
        </div>
      </section>

      {/* Callout Chuyển Hướng Menu (Dự Án / Báo Giá / So Sánh Theo Menu) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-blue-200 border border-white/15">
              Hồ Sơ Năng Lực & Dịch Vụ
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Cần hồ sơ dự án đã hoàn thành hoặc tạo báo giá tự động?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Các mục chuyên sâu đã được tích hợp đầy đủ trên thanh Menu: Dự án KĐT Văn Phú, gói thầu 238 triệu và hệ thống lập bảng báo giá hợp đồng có VAT.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-blue-50 transition-all shadow-md"
            >
              Xem Dự Án Đã Làm 🏛️
            </Link>
            <Link
              href="/quote"
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/20 transition-all"
            >
              Lên Đơn Báo Giá 📋
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
