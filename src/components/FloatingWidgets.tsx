"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  products?: {
    id: number;
    name: string;
    price: number;
    specs: string;
    image: string;
  }[];
  suggestions?: string[];
}

const quickSuggestions = [
  "Tư vấn đèn âm trần thạch cao phòng khách",
  "Giải pháp Smart Home điều khiển qua điện thoại",
  "Báo giá đèn Panel 600x600 văn phòng",
  "Đèn chiếu pha ngoài trời chống nước IP66",
  "Chiếu sáng nhà xưởng tiết kiệm điện",
  "Chính sách chiết khấu dự án & xuất VAT",
];

export default function FloatingWidgets() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào Quý khách! Em là Trợ lý kỹ thuật An Phú Vina. Em có thể tư vấn giải pháp chiếu sáng Rạng Đông, tính toán công suất hoặc tra cứu giá chiết khấu dự án cho anh/chị ngay ạ.",
      suggestions: [
        "Tư vấn đèn âm trần thạch cao",
        "Giải pháp Smart Home Rạng Đông",
        "Đèn Panel 600x600 văn phòng",
        "Đèn chiếu pha ngoài trời IP66",
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = userText.toLowerCase();
      let botResponse: Message;

      if (q.includes("âm trần") || q.includes("downlight") || q.includes("phòng khách") || q.includes("thạch cao")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Đối với trần thạch cao gia đình và phòng khách, Rạng Đông có dòng Downlight AT04 (đơn màu trắng/vàng) và AT10 / AT20 (đổi 3 màu theo công tắc). Khoét lỗ phổ biến nhất là D90mm (công suất 7W - 9W) và D110mm (10W - 12W) giúp sáng đều và không chói mắt:",
          products: [
            {
              id: 252,
              name: "Đèn LED âm trần Downlight AT04 90/10W",
              price: 82000,
              specs: "Khoét lỗ D90mm • 10W • 1000 lm",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-led-downlight-am-tran-Rang_dong-AT04.90.10-1.jpg",
            },
            {
              id: 231,
              name: "Đèn LED Downlight đổi 3 màu AT10 90/9W",
              price: 99000,
              specs: "Đổi 3 màu: Trắng - Vàng - Trung tính",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-led-am-tran-downlight-Rang-Dong-vien-vang-4.jpg",
            },
          ],
          suggestions: [
            "Cách tính số lượng bóng cho phòng 20m²",
            "Xem báo giá đèn rọi tranh / tracklight",
            "Liên hệ Zalo Sếp nhận báo giá chiết khấu",
          ],
        };
      } else if (q.includes("smart") || q.includes("thông minh") || q.includes("điện thoại") || q.includes("wifi") || q.includes("bluetooth")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Hệ sinh thái Rallismart Smart Home của Rạng Đông kết nối chuẩn Bluetooth Mesh & Wifi, điều khiển trực tiếp qua App trên điện thoại và giọng nói tiếng Việt. Anh/chị có thể bắt đầu với bóng đổi màu RGB và công tắc thông minh cảm ứng:",
          products: [
            {
              id: 102,
              name: "Bóng LED Bulb đổi màu RGB Bluetooth 9W",
              price: 295000,
              specs: "16 triệu màu RGB • Bluetooth Mesh",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Bong-led-bulb-doi-mai-RGB-Bluetooth-Rang-Dong.A60.BLE_.RGBCW_.9W-1.jpg",
            },
            {
              id: 86,
              name: "Công tắc thông minh BLE tải cao 3000W",
              price: 734000,
              specs: "Tải lớn 3000W • Hẹn giờ & Ngữ cảnh",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Cong-tac-cua-cuon-thong-minh-Rang-Dong-CTCU.WF-CN.DOT_.2W.SP-1.jpg",
            },
            {
              id: 85,
              name: "Công tắc cảm ứng rèm thông minh BLE",
              price: 807000,
              specs: "Mặt kính cường lực • Tự động đóng mở",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Cong-tac-cam-ung-rem-BLE-Rang-Dong-CTCU.BLE-V.REMT-MN-1.jpg",
            },
          ],
          suggestions: [
            "Công tắc có cần đi lại dây điện không?",
            "Xem trọn bộ 85+ thiết bị Smart Home",
            "Chat Zalo nhận giải pháp căn hộ",
          ],
        };
      } else if (q.includes("panel") || q.includes("văn phòng") || q.includes("600x600") || q.includes("trần thả")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Dòng đèn LED Panel tấm 600x600mm Rạng Đông là tiêu chuẩn vàng cho trần thạch cao thả văn phòng, phòng học, bệnh viện. Ưu điểm ánh sáng tỏa đều, chống lóa mắt và tiết kiệm điện năng:",
          products: [
            {
              id: 169,
              name: "Đèn LED Panel vuông P06 600x600 50W",
              price: 496000,
              specs: "50W • 5900 lm • Tiết diện mỏng sang trọng",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-led-panel-vuong-Rang-Dong-P06-600x600-50w-2.jpg",
            },
          ],
          suggestions: [
            "Có kích thước 300x1200 hoặc 600x1200 không?",
            "Lên đơn báo giá số lượng lớn",
            "Chính sách bảo hành dự án",
          ],
        };
      } else if (q.includes("pha") || q.includes("ngoài trời") || q.includes("sân") || q.includes("ip66") || q.includes("chống nước")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Đèn chiếu pha Rạng Đông dòng CP06 đạt tiêu chuẩn chống nước bụi IP66, vỏ hợp kim nhôm sơn tĩnh điện tản nhiệt cao cấp, van cân bằng áp suất thích hợp chiếu sáng ngoài trời, sân bóng, bảng hiệu:",
          products: [
            {
              id: 194,
              name: "Đèn chiếu pha LED CP06 50W Outdoor IP66",
              price: 340000,
              specs: "50W • 4500 lm • Chống nước mưa bão IP66",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-chieu-pha-Rang-Dong-CP06-50w.jpg",
            },
            {
              id: 192,
              name: "Đèn chiếu pha LED CP06 100W Chống nước",
              price: 976000,
              specs: "100W • 9500 lm • Rọi xa kho bãi công trình",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-chieu-pha-Rang-Dong-CP06-100w-3.jpg",
            },
          ],
          suggestions: [
            "Đèn pha có cảm biến chuyển động không?",
            "Pha năng lượng mặt trời Rạng Đông",
            "Báo giá công trình dự án",
          ],
        };
      } else if (q.includes("nhà xưởng") || q.includes("tuýp") || q.includes("t8") || q.includes("kho")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Đối với nhà xưởng may mặc, kho bãi và tầng hầm, bộ đèn tuýp LED T8 1.2m 20W vỏ nhôm nhựa tản nhiệt bền bỉ hoặc đèn Highbay công suất lớn là lựa chọn tối ưu chi phí vận hành:",
          products: [
            {
              id: 206,
              name: "Bộ đèn LED Tuýp Rạng Đông T8 1.2m 20W",
              price: 152000,
              specs: "20W • 2300 lm • Chip LED Hàn Quốc",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-tuyp-Rang-Dong-M11-2.jpg",
            },
          ],
          suggestions: [
            "Xem hồ sơ gói thầu nhà xưởng 238 triệu đã giao",
            "Tải mẫu báo giá file Excel",
            "Zalo trực tiếp với Giám đốc An Phú Vina",
          ],
        };
      } else if (q.includes("chiết khấu") || q.includes("vat") || q.includes("hóa đơn") || q.includes("đại lý") || q.includes("giá")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "An Phú Vina là nhà phân phối chính thức của Rạng Đông (MST: 0110271235). Công ty cam kết: \n• Chiết khấu cạnh tranh từ 15% - 42% tùy theo mã hàng và giá trị đơn hàng dự án.\n• Xuất hóa đơn VAT điện tử hợp lệ 100% kèm chứng chỉ CO/CQ xuất xưởng.\n• Hỗ trợ vận chuyển tận công trình tại Hà Nội và toàn quốc.",
          suggestions: [
            "Tự tạo bảng báo giá có VAT trực tuyến",
            "Gặp Sếp trao đổi mức chiết khấu tối đa",
            "Xem hợp đồng các dự án đã hoàn thành",
          ],
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Dạ em đã ghi nhận yêu cầu về "${userText}". An Phú Vina phân phối hơn 672+ model thiết bị chiếu sáng Rạng Đông chính hãng. Em gợi ý anh/chị xem nhanh qua các nhóm sản phẩm trọng điểm sau hoặc nhắn Zalo trực tiếp cho Sếp em để nhận mức chiết khấu tốt nhất nhé:`,
          products: [
            {
              id: 252,
              name: "Đèn LED âm trần Downlight AT04 90/10W",
              price: 82000,
              specs: "Bán chạy nhất • Khoét lỗ D90mm",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/02/Den-led-downlight-am-tran-Rang_dong-AT04.90.10-1.jpg",
            },
            {
              id: 102,
              name: "Bóng LED Bulb Smart RGB Bluetooth",
              price: 295000,
              specs: "Đổi màu điện thoại • Bluetooth Mesh",
              image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Bong-led-bulb-doi-mai-RGB-Bluetooth-Rang-Dong.A60.BLE_.RGBCW_.9W-1.jpg",
            },
          ],
          suggestions: [
            "Xem tất cả 672+ sản phẩm",
            "Nhắn tin Zalo với Sếp (0827.955.888)",
            "Lên đơn báo giá trực tiếp",
          ],
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3.5 select-none">
        {/* Zalo Button (Boss Contact) */}
        <a
          href="https://zalo.me/0827955888"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0068ff] text-white shadow-[0_8px_25px_rgba(0,104,255,0.45)] hover:shadow-[0_12px_32px_rgba(0,104,255,0.6)] hover:scale-108 active:scale-95 transition-all duration-300"
          aria-label="Liên hệ Zalo Sếp (0827.955.888)"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#0068ff] animate-ping opacity-25 pointer-events-none" />

          {/* Zalo Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center font-bold text-base tracking-tighter">
            <span className="text-[13px] font-black tracking-normal">Zalo</span>
          </div>

          {/* Hover Tooltip */}
          <span className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl border border-white/10">
            💬 Chat Zalo với Sếp: <strong className="text-blue-300">0827.955.888</strong>
          </span>
        </a>

        {/* Circular Chatbot Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-950 text-white shadow-[0_8px_25px_rgba(15,23,42,0.4)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.55)] hover:scale-108 active:scale-95 transition-all duration-300 border border-white/10"
          aria-label="Mở Trợ lý ảo tư vấn An Phú Vina"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
          )}

          {/* Tooltip */}
          {!isOpen && (
            <span className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl border border-white/10">
              ✨ Trợ lý gợi ý giải pháp chiếu sáng
            </span>
          )}
        </button>
      </div>

      {/* Cupertino Style Smart Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[82vh] h-[620px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/[0.08] flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="An Phú Vina"
                  width={34}
                  height={34}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Trợ Lý An Phú Vina</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-300">Gợi ý kỹ thuật & Chiết khấu Rạng Đông</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Contact Banner */}
          <div className="px-4 py-2 bg-blue-50/90 border-b border-blue-100/80 flex items-center justify-between text-[11px]">
            <span className="text-blue-900 font-medium">Hotline / Zalo Sếp: <strong>0827.955.888</strong></span>
            <a
              href="https://zalo.me/0827955888"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 hover:text-blue-900 underline"
            >
              Nhắn tin ngay ↗
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-none shadow-sm"
                      : "bg-slate-100 text-slate-800 rounded-bl-none border border-black/[0.04]"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Recommended Product Cards from Catalog */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                    {m.products.map((p) => (
                      <Link
                        key={p.id}
                        href="/products"
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all hover:border-blue-400"
                      >
                        <div className="relative w-12 h-12 rounded-xl bg-slate-50 p-1 flex-shrink-0 border border-black/[0.04] overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">{p.specs}</p>
                          <span className="text-xs font-bold text-blue-600">
                            {formatCurrency(p.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Smart Suggestion Chips */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug) => (
                      <button
                        key={sug}
                        onClick={() => handleSend(sug)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-black/[0.08] transition-all hover:scale-102"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 w-16 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-black/[0.05] overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickSuggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap bg-white text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-black/[0.06] transition-all"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-black/[0.06] flex items-center gap-2">
            <input
              type="text"
              placeholder="Hỏi về đèn âm trần, Smart Home, báo giá..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(input);
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 focus:outline-none text-xs text-slate-900 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend(input)}
              className="p-2.5 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white transition-colors duration-200 flex-shrink-0"
              aria-label="Gửi câu hỏi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
