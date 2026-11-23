"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { PriceComparison } from "@/lib/types";

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/price_comparison.json")
      .then((r) => r.json())
      .then((data) => {
        setComparisons(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Đang nạp dữ liệu đối chiếu...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
          <span>⚖️</span> Đối chiếu độc quyền An Phú
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Đối Chiếu LED Dây LD03
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          So sánh thực tế giữa giá bán lẻ đề xuất trên website Rạng Đông (rangdong.com.vn) với bảng giá phân phối nội bộ tháng 9/2026.
        </p>
      </div>

      {/* Cards for Mobile & Tablet */}
      <div className="grid md:grid-cols-2 lg:hidden gap-4">
        {comparisons.map((c) => (
          <div
            key={c.stt}
            className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">#{c.stt}</span>
                <h3 className="font-bold text-slate-900 text-sm">{c.productName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.specs}</p>
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  c.match === "KHỚP"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {c.match === "KHỚP" ? "✓ Khớp 100%" : "⚠ Chưa có trong T9"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-3">
                <span className="text-[10px] text-slate-400">Giá lẻ Web (đ/m)</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {formatCurrency(c.webPrice)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3">
                <span className="text-[10px] text-slate-400">Giá bán T9 (có VAT)</span>
                <p className="text-sm font-bold text-blue-700 mt-0.5">
                  {c.excelPriceVAT > 0 ? formatCurrency(c.excelPriceVAT) : "—"}
                </p>
              </div>
            </div>

            {c.conclusion && (
              <p className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-black/[0.03]">
                {c.conclusion}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modern Cupertino Table for Desktop */}
      <div className="hidden lg:block bg-white rounded-3xl border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-4 px-6 w-12">#</th>
              <th className="py-4 px-6">Tên Model LD03</th>
              <th className="py-4 px-6">Thông số kỹ thuật</th>
              <th className="py-4 px-6 text-right">Giá lẻ Web (đ/m)</th>
              <th className="py-4 px-6 text-right">Giá bán T9 (có VAT)</th>
              <th className="py-4 px-6 text-center">Trạng thái</th>
              <th className="py-4 px-6">Kết luận đối soát</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisons.map((c) => (
              <tr key={c.stt} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6 text-slate-400 font-mono">{c.stt}</td>
                <td className="py-4 px-6 font-bold text-slate-900">{c.productName}</td>
                <td className="py-4 px-6 text-slate-500">{c.specs}</td>
                <td className="py-4 px-6 text-right font-bold text-slate-900">
                  {formatCurrency(c.webPrice)}
                </td>
                <td className="py-4 px-6 text-right font-extrabold text-blue-700">
                  {c.excelPriceVAT > 0 ? formatCurrency(c.excelPriceVAT) : "—"}
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${
                      c.match === "KHỚP"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                    }`}
                  >
                    {c.match === "KHỚP" ? "✓ Khớp 100%" : "⚠ Chưa có trong T9"}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs">{c.conclusion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Professional Callout Note */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
        <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2 mb-2">
          <span>💡</span> Kết luận từ đội ngũ kiểm tra giá An Phú:
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Giá trên website là giá bán lẻ đề xuất cho người tiêu dùng cuối. Giá bán buôn/đại lý trong bảng giá T9/2026 của An Phú dao động bằng khoảng <strong>46%</strong> giá niêm yết web. Đối với 3 model (7W, 9W, đổi màu 9W) tạm thời chưa có giá trong bảng T9, bộ phận kinh doanh có thể tra cứu giá tham chiếu T8 cũ.
        </p>
      </div>
    </div>
  );
}
