import { completedProjects } from "@/lib/projects";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
          <span>🏛️</span> Hồ sơ năng lực & Dự án thực tế
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Dự Án Đã Hoàn Thành
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Tổng hợp các công trình tiêu biểu, gói thầu dự án và biên bản giao hàng thực tế đã được An Phú & Phương Phú thực hiện thành công.
        </p>
      </div>

      {/* Projects Grid - Cupertino Cards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {completedProjects.map((p) => (
          <div
            key={p.id}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Badge & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${p.badgeColor}`}>
                  {p.tag}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                  ✓ {p.status}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-lg font-bold text-slate-950 leading-snug group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs font-semibold text-blue-700 mt-1">
                  Giá trị: {p.contractValue}
                </p>
              </div>

              {/* Client & Location */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Đơn vị đối tác / Chủ đầu tư:</span>
                  <strong className="text-slate-900">{p.client}</strong>
                </div>
                <div className="pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Địa điểm bàn giao:</span>
                  <span className="text-slate-700">{p.location}</span>
                </div>
              </div>

              {/* Scope */}
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {p.scope}
              </p>

              {/* Items List */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Hạng mục thiết bị bàn giao:
                </h4>
                <ul className="space-y-1.5">
                  {p.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs text-slate-700">
                      <span className="truncate pr-2">• {item.name}</span>
                      <strong className="shrink-0 text-slate-950 font-mono">
                        {item.quantity} {item.unit}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Thời gian: {p.date}</span>
              <Link
                href="/quote"
                className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1"
              >
                Tạo báo giá tương tự <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Stats Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="grid md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-yellow-400">100%</span>
            <p className="text-xs text-slate-300 font-medium">Sản phẩm chính hãng Rạng Đông</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">850+</span>
            <p className="text-xs text-slate-300 font-medium">Bộ đèn bàn giao cho dự án lớn</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">24/7</span>
            <p className="text-xs text-slate-300 font-medium">Hỗ trợ kỹ thuật & nghiệm thu</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-purple-400">2 Năm</span>
            <p className="text-xs text-slate-300 font-medium">Bảo hành 1 đổi 1 tận nơi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
