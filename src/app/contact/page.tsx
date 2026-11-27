"use client";

import { useState } from "react";
import { companyInfo } from "@/lib/company";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("Đăng ký làm Đại lý / Nhà phân phối");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!name.trim() || !/^(0|\+84)[0-9]{8,10}$/.test(phone.replace(/\s+/g, ""))) {
      setError("Vui lòng nhập đầy đủ Họ tên và Số điện thoại hợp lệ (10 số).");
      return;
    }
    setError("");
    setSending(true);
    try {
      const dealer = /Đại lý|Nhà phân phối/i.test(interest);
      const response = await fetch(dealer ? "/api/dealer" : "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealer ? { name, phone, company, interest, note } : { name, phone, subject: interest, message: note }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không gửi được thông tin.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không kết nối được. Vui lòng thử lại.");
    } finally { setSending(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
          <span>📞</span> Liên hệ & Đăng ký Nhà phân phối / Đại lý
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Liên Hệ An Phú Vina
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Hỗ trợ tư vấn kỹ thuật chiếu sáng, báo giá công trình dự án và đăng ký chính sách chiết khấu dành cho Đại lý / Nhà phân phối Rạng Đông.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Official Company Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-slate-950">
              {companyInfo.name}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📍</span>
                <div>
                  <strong className="block text-slate-900 text-xs">Địa chỉ trụ sở:</strong>
                  <span>{companyInfo.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">📞</span>
                <div>
                  <strong className="block text-slate-900 text-xs">Hotline / Zalo Kinh Doanh:</strong>
                  <a
                    href={`tel:${companyInfo.hotlineRaw}`}
                    className="text-base font-extrabold text-blue-600 hover:underline"
                  >
                    {companyInfo.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">✉️</span>
                <div>
                  <strong className="block text-slate-900 text-xs">Email nhận hồ sơ & báo giá:</strong>
                  <a href={`mailto:${companyInfo.email}`} className="hover:text-blue-600">
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🕒</span>
                <div>
                  <strong className="block text-slate-900 text-xs">Giờ làm việc:</strong>
                  <span>{companyInfo.workingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🏢</span>
                <div>
                  <strong className="block text-slate-900 text-xs">Mã số thuế:</strong>
                  <span>{companyInfo.mst} ({companyInfo.issuedBy})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href={`https://zalo.me/${companyInfo.hotlineRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-md transition-all"
              >
                💬 Chat Zalo Sếp Ngay
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all"
              >
                🗺️ Tìm chỉ đường
              </a>
            </div>
          </div>
        </div>

        {/* Right: Dealer & Project Quote Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-2">
              Dành cho Nhà Phân Phối / Đại Lý & Công Trình
            </span>
            <h2 className="text-xl font-extrabold text-slate-950">
              Đăng Ký Đại Lý & Nhận Chính Sách Chiết Khấu 15% - 42%
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Điền thông tin để bộ phận kinh doanh An Phú Vina gửi bảng giá sỉ & hỗ trợ trực tiếp.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="text-3xl">✅</div>
              <h3 className="text-base font-bold text-emerald-900">
                Đã tiếp nhận yêu cầu của {name}!
              </h3>
              <p className="text-xs text-emerald-800">
                Để được phản hồi ngay lập tức, anh/chị có thể bấm nút bên dưới để gửi thông tin qua Zalo Sếp ({companyInfo.hotline}).
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <a
                  href={`https://zalo.me/${companyInfo.hotlineRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm"
                >
                  Mở Zalo {companyInfo.hotline} →
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setPhone("");
                    setCompany("");
                    setNote("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Số điện thoại / Zalo *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cửa hàng / Công ty</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Tên đơn vị hoặc công trình"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nhu cầu hỗ trợ</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  >
                    <option>Đăng ký làm Đại lý / Nhà phân phối</option>
                    <option>Báo giá gói thầu công trình dự án</option>
                    <option>Tư vấn lắp đặt Smart Home Rallismart</option>
                    <option>Đặt mua thiết bị lẻ & hỗ trợ kỹ thuật</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nội dung chi tiết</label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú model sản phẩm, số lượng hoặc diện tích công trình cần tư vấn..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
              >
                Gửi Đăng Ký & Nhận Chính Sách Ngay →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
