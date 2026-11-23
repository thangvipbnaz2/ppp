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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đối chiếu giá LD03</h1>
        <p className="text-gray-500">
          So sánh giá LED dây LD03 trên Website Rạng Đông (rangdong.com.vn) với bảng giá Excel nội bộ An Phú
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Nguồn dữ liệu:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Giá web: giá bán lẻ đề xuất trên rangdong.com.vn (đã gồm VAT)</li>
              <li>Giá Excel: file &quot;Bảng tổng hợp giá bán&quot; — sheet &quot;Bảng giá tên chuẩn&quot; (giá T9/2026)</li>
              <li>Ngày đối chiếu: 23/11/2026</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison cards for mobile */}
      <div className="block lg:hidden space-y-4">
        {comparisons.map((item) => (
          <div key={item.stt} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    item.match === "KHỚP"
                      ? "bg-green-100 text-green-700"
                      : item.match === "—"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.match === "KHỚP" ? "✓ Khớp" : item.match === "—" ? "⚠ Thiếu" : item.match}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-3">{item.specs}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-purple-600 mb-1">Giá trên Web</div>
                  <div className="font-bold text-purple-800">{formatCurrency(item.webPrice)}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 mb-1">Giá Excel (VAT)</div>
                  <div className="font-bold text-blue-800">
                    {item.excelPriceVAT > 0 ? formatCurrency(item.excelPriceVAT) : "—"}
                  </div>
                </div>
              </div>

              {item.conclusion && (
                <p className="text-xs text-gray-600 mt-3 bg-gray-50 rounded-lg p-2.5">
                  {item.conclusion}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table for desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                <th className="text-left py-4 px-5 font-semibold text-gray-700">STT</th>
                <th className="text-left py-4 px-5 font-semibold text-gray-700">Sản phẩm</th>
                <th className="text-left py-4 px-5 font-semibold text-gray-700">Thông số</th>
                <th className="text-right py-4 px-5 font-semibold text-purple-700">Giá Web (đ/m)</th>
                <th className="text-right py-4 px-5 font-semibold text-blue-700">Giá Excel có VAT</th>
                <th className="text-center py-4 px-5 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-5 font-semibold text-gray-700">Kết luận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparisons.map((item) => (
                <tr key={item.stt} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-5 text-gray-500">{item.stt}</td>
                  <td className="py-4 px-5 font-medium text-gray-800">{item.productName}</td>
                  <td className="py-4 px-5 text-gray-500 text-xs">{item.specs}</td>
                  <td className="py-4 px-5 text-right font-semibold text-purple-700">
                    {formatCurrency(item.webPrice)}
                  </td>
                  <td className="py-4 px-5 text-right font-semibold text-blue-700">
                    {item.excelPriceVAT > 0 ? formatCurrency(item.excelPriceVAT) : "—"}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        item.match === "KHỚP"
                          ? "bg-green-100 text-green-700"
                          : item.match === "—"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.match === "KHỚP" ? "✓ Khớp" : item.match === "—" ? "⚠ Thiếu" : item.match}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-gray-600 max-w-xs">{item.conclusion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          <span>📝</span> Ghi chú quan trọng
        </h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>Giá trên web là GIÁ LẺ đề xuất — không so trực tiếp với giá bán cho khách/đại lý trong Excel.</li>
          <li>3 model THIẾU trong bảng giá T9 (7W, 9W, đổi màu 9W): khách hỏi 3 model này thì hiện không có giá hiện hành, chỉ còn giá T8 cũ.</li>
          <li>Riêng LD03 8W: bảng T9 chỉ còn 2 dòng cuộn 100m (3000K và 6500K), mất cả 2 dòng cuộn 50m so với T8.</li>
          <li>File &quot;Form báo giá 1&quot; và &quot;BÁO GIÁ MẪU PP&quot; không có sheet LED dây/LD03 — chưa có form báo giá sẵn cho nhóm này.</li>
        </ul>
      </div>
    </div>
  );
}
