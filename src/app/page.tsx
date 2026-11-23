import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const stats = [
    { label: "Sản phẩm tra cứu", value: "1,259+", sub: "Từ bảng giá T9/2026", icon: "⚡" },
    { label: "Phân loại danh mục", value: "21", sub: "Đèn LED & Gia dụng", icon: "📐" },
    { label: "Thương hiệu đối tác", value: "Rạng Đông", sub: "Chính hãng 100%", icon: "⭐" },
    { label: "Đối chiếu LD03", value: "Hoàn tất", sub: "Web vs File Excel", icon: "⚖️" },
  ];

  const highlights = [
    {
      title: "Bảng giá thông minh",
      desc: "Tra cứu giá tức thì với bộ lọc 21 danh mục, xem cả giá chưa VAT, giá có VAT và giá bán lẻ đề xuất.",
      href: "/products",
      tag: "1,259 Model",
      gradient: "from-blue-600/10 via-indigo-600/5 to-transparent",
      accent: "text-blue-600",
    },
    {
      title: "Lập báo giá chuẩn",
      desc: "Chọn sản phẩm trực quan, tự động tính tổng tiền và mức thuế VAT, xuất PDF in hợp đồng tức thì.",
      href: "/quote",
      tag: "Xuất PDF / In",
      gradient: "from-emerald-600/10 via-teal-600/5 to-transparent",
      accent: "text-emerald-600",
    },
    {
      title: "Đối chiếu chênh lệch",
      desc: "So sánh trực tiếp model LD03 giữa web rangdong.com.vn và Excel An Phú, phát hiện ngay mã thiếu.",
      href: "/compare",
      tag: "Báo cáo chi tiết",
      gradient: "from-purple-600/10 via-pink-600/5 to-transparent",
      accent: "text-purple-600",
    },
  ];

  const featuredCats = [
    { name: "Đèn LED Downlight", count: 225, img: "/images/products/img_jpg_031.jpg" },
    { name: "Đèn LED Panel", count: 81, img: "/images/products/img_jpg_062.jpg" },
    { name: "Đèn LED Chiếu pha", count: 73, img: "/images/products/img_jpg_134.jpg" },
    { name: "Đèn LED Ốp trần", count: 82, img: "/images/products/img_jpg_141.jpg" },
    { name: "Đèn Chiếu sáng đường", count: 64, img: "/images/products/img_jpg_116.jpg" },
    { name: "Ruột phích & Giữ nhiệt", count: 124, img: "/images/products/img_jpg_016.jpg" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section - Apple Style Ambient Glow */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle radial ambient gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/[0.04] border border-black/[0.06] backdrop-blur-md mb-8 hover:bg-slate-900/[0.07] transition-all cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">
              Cập nhật bảng giá áp dụng tháng 9/2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
            Hệ thống Báo giá & Chiếu sáng
            <span className="block bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent mt-2">
              An Phú Distribution
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Dữ liệu đồng bộ trực tiếp từ 4 file Excel quản lý. Hỗ trợ tra cứu nhanh 1,259 sản phẩm Rạng Đông, đối chiếu giá thị trường và xuất báo giá tự động.
          </p>

          {/* Action Buttons - iOS style */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-slate-950 text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300"
            >
              Tra cứu bảng giá →
            </Link>
            <Link
              href="/quote"
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-white text-slate-900 border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300 backdrop-blur-md"
            >
              Tạo đơn báo giá
            </Link>
          </div>
        </div>
      </section>

      {/* Floating iPhone-Style Metric Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="text-xl mb-3">{s.icon}</div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Bento Grid - Apple Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Công cụ tối ưu cho kinh doanh
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Đơn giản hóa quy trình tra giá, làm báo giá và quản lý danh mục sản phẩm
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <Link
              key={h.title}
              href={h.href}
              className={`group relative bg-white rounded-3xl p-8 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl ${h.gradient} rounded-full blur-2xl -z-0 pointer-events-none`} />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-black/[0.04] mb-4">
                  {h.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {h.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {h.desc}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                <span>Trải nghiệm ngay</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Categories with Real Images from Excel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Danh mục nổi bật
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hình ảnh thực tế trích xuất trực tiếp từ file mẫu báo giá
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-700 hover:text-slate-950 items-center gap-1"
          >
            Tất cả 21 danh mục <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCats.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl p-4 border border-black/[0.05] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-3 rounded-xl bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  unoptimized
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.count} sản phẩm
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
