import Link from "next/link";

export default function HomePage() {
  const stats = [
    { label: "Sản phẩm", value: "1,259+", icon: "📦" },
    { label: "Danh mục", value: "21", icon: "📋" },
    { label: "Thương hiệu", value: "Rạng Đông", icon: "⭐" },
    { label: "Giá cập nhật", value: "T9/2026", icon: "📅" },
  ];

  const features = [
    {
      title: "Bảng giá sản phẩm",
      desc: "Tra cứu giá 1,259+ sản phẩm đèn LED, bình giữ nhiệt với bộ lọc danh mục và tìm kiếm nhanh.",
      href: "/products",
      icon: "🔍",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Tạo báo giá nhanh",
      desc: "Chọn sản phẩm, nhập số lượng, tự động tính tổng tiền. Xuất PDF báo giá chuyên nghiệp.",
      href: "/quote",
      icon: "📄",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Đối chiếu giá Web vs Excel",
      desc: "So sánh giá trên rangdong.com.vn với bảng giá nội bộ. Phát hiện chênh lệch ngay.",
      href: "/compare",
      icon: "⚖️",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const categories = [
    { name: "Đèn LED Downlight", count: 225, icon: "💡" },
    { name: "Đèn LED khác", count: 115, icon: "🔆" },
    { name: "Ruột phích", count: 90, icon: "🔋" },
    { name: "Đèn LED Panel", count: 81, icon: "🖥️" },
    { name: "Đèn LED Ốp trần", count: 82, icon: "🏠" },
    { name: "Đèn LED Chiếu pha", count: 73, icon: "🔦" },
    { name: "Đèn LED Chiếu sáng đường", count: 64, icon: "🛣️" },
    { name: "Bóng đèn LED", count: 61, icon: "💡" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS02IDBoMnYyaC0ydi0yem0yLTR2Mmgtdi0yaDJ6bTIgMGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-blue-500/30 text-blue-100 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              ⚡ Giá cập nhật tháng 9/2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              An Phú
              <span className="block text-yellow-400 mt-2">Thiết Bị Điện & Chiếu Sáng</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Chuyên phân phối đèn LED Rạng Đông, bình giữ nhiệt. Tra cứu giá, tạo báo giá nhanh với hơn 1,259 sản phẩm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Xem bảng giá →
              </Link>
              <Link
                href="/quote"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-xl text-base transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                Tạo báo giá
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Công cụ quản lý giá</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Mọi thứ bạn cần để tra cứu giá, tạo báo giá và quản lý sản phẩm</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-6 text-white`}>
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1">
                  Xem chi tiết
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Categories */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Danh mục nổi bật</h2>
            <p className="text-gray-500">Khám phá các nhóm sản phẩm phổ biến nhất</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl p-5 text-center transition-all duration-200 group border border-gray-100 hover:border-blue-200"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
