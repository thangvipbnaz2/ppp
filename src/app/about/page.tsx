import Image from "next/image";
import Link from "next/link";
import { companyInfo, BRANDS } from "@/lib/company";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hồ sơ doanh nghiệp • MST: {companyInfo.mst}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {companyInfo.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Được {companyInfo.issuedBy} cấp phép hoạt động ngày {companyInfo.issuedDate}. An Phú Vina tự hào là đơn vị phân phối thiết bị điện & chiếu sáng chính hãng Rạng Đông, Kingled, Ledvance, MPE, Opple... mang đến giải pháp chiếu sáng xanh và Nhà thông minh Smart Home hàng đầu cho gia đình, tòa nhà và công trình dự án.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-blue-50 transition-all shadow-md"
              >
                Khám phá 672+ sản phẩm →
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                Đăng ký Đại lý / Nhận báo giá
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="bg-white/95 rounded-2xl p-5 text-slate-900 shadow-lg flex items-center gap-4">
              <Image
                src="/images/logo.png"
                alt={companyInfo.shortName}
                width={64}
                height={64}
                className="object-contain shrink-0"
                unoptimized
              />
              <div>
                <div className="text-sm font-extrabold text-slate-950">AN PHÚ VINA</div>
                <div className="text-xs text-slate-500 mt-0.5">{companyInfo.slogan}</div>
                <div className="text-[11px] font-semibold text-blue-600 mt-1">
                  Hotline / Zalo: {companyInfo.hotline}
                </div>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15 shadow-lg">
              <Image
                src={companyInfo.banners[0]}
                alt="An Phú Vina Rạng Đông"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision (Adapted from rangdongapvina.com.vn/gioi-thieu) */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            🎯
          </div>
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Sứ Mệnh</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {companyInfo.mission}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
            🚀
          </div>
          <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Tầm Nhìn</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {companyInfo.vision}
          </p>
        </div>
      </section>

      {/* Policies */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Cam Kết Dịch Vụ & Chính Sách Bán Hàng
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Đồng bộ chính sách hỗ trợ trực tuyến từ hệ thống phân phối An Phú Vina
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {companyInfo.policies.map((pol) => (
            <div
              key={pol.title}
              className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm hover:shadow-md transition-all space-y-2.5"
            >
              <div className="text-2xl">{pol.icon}</div>
              <h3 className="text-sm font-bold text-slate-900">{pol.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{pol.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Brands */}
      <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-black/[0.06] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Thương Hiệu Phân Phối Chính Hãng</h2>
            <p className="text-xs text-slate-500 mt-1">
              Đầy đủ 9 hãng thiết bị điện & chiếu sáng uy tín hàng đầu
            </p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:underline">
            Xem bảng giá tất cả hãng →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BRANDS.filter((b) => b.logo).map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="relative h-10 w-32">
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{b.origin}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
