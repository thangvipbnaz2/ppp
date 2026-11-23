import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const stats = [
    { label: "Sản phẩm xác thực", value: "438", sub: "Đầy đủ ảnh, thông số & giá", icon: "⚡" },
    { label: "Phân loại danh mục", value: "18", sub: "Chiếu sáng Rạng Đông", icon: "📐" },
    { label: "Thương hiệu phân phối", value: "Rạng Đông", sub: "Chính hãng 100%", icon: "⭐" },
    { label: "Bảng giá áp dụng", value: "T9/2026", sub: "Đã cập nhật cơ chế", icon: "📅" },
  ];

  const highlights = [
    {
      title: "Bảng giá thông minh",
      desc: "Tra cứu tức thì 438 sản phẩm đèn LED Rạng Đông. 100% có hình ảnh thực tế, thông số kỹ thuật đầy đủ và giá bán niêm yết.",
      href: "/products",
      tag: "438 Model Đầy Đủ",
      gradient: "from-blue-600/10 via-indigo-600/5 to-transparent",
      accent: "text-blue-600",
    },
    {
      title: "Lập báo giá chuẩn",
      desc: "Chọn sản phẩm trực quan, tự động tính tổng tiền và mức thuế VAT (8%), hỗ trợ in và xuất PDF báo giá hợp đồng tức thì.",
      href: "/quote",
      tag: "Xuất PDF / In",
      gradient: "from-emerald-600/10 via-teal-600/5 to-transparent",
      accent: "text-emerald-600",
    },
    {
      title: "Thông số chi tiết",
      desc: "Bấm vào bất kỳ sản phẩm nào để xem đầy đủ: công suất, điện áp, quang thông, CCT, chip LED, kích thước và cơ chế chiết khấu.",
      href: "/products",
      tag: "Thông Số Đầy Đủ",
      gradient: "from-purple-600/10 via-pink-600/5 to-transparent",
      accent: "text-purple-600",
    },
  ];

  const featuredCats = [
    { name: "Đèn LED Downlight", count: 68, img: "/images/products/image281.png" },
    { name: "Đèn LED Panel", count: 54, img: "/images/products/image1002.png" },
    { name: "Đèn LED Chiếu pha", count: 24, img: "/images/products/image847.png" },
    { name: "Đèn LED Ốp trần", count: 47, img: "/images/products/image923.png" },
    { name: "Đèn Chiếu sáng đường", count: 35, img: "/images/products/image585.png" },
    { name: "Bóng đèn LED", count: 43, img: "/images/products/image1105.png" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/[0.04] border border-black/[0.06] backdrop-blur-md mb-8 hover:bg-slate-900/[0.07] transition-all cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">
              Đồng bộ dữ liệu: Đầy đủ Ảnh thực tế • Thông số kỹ thuật • Giá bán
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
            Hệ thống Báo giá & Chiếu sáng
            <span className="block bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent mt-2">
              An Phú Distribution
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Tuyển chọn 438 sản phẩm đèn LED Rạng Đông chính hãng đáp ứng nghiêm ngặt 3 tiêu chí: Có hình ảnh rõ nét, có đầy đủ thông số kỹ thuật và có đơn giá chuẩn.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-full text-sm font-semibold bg-slate-950 text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300"
            >
              Xem 438 sản phẩm →
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

      {/* Floating Metric Cards */}
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

      {/* Feature Bento Grid */}
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
              className="group relative bg-white rounded-3xl p-8 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
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

      {/* Featured Categories with Verified Clean Native Images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Danh mục nổi bật
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hình ảnh thực tế chuẩn từ file mẫu báo giá
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-700 hover:text-slate-950 items-center gap-1"
          >
            Tất cả 18 danh mục <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCats.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl p-4 border border-black/[0.05] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-3 rounded-xl bg-slate-50 p-2 overflow-hidden flex items-center justify-center border border-black/[0.03]">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out p-1"
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
