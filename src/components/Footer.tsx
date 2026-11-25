import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-slate-900 text-slate-300 mt-20 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Company Profile */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg">
                <Image
                  src="/images/logo.png"
                  alt="An Phú Vina"
                  width={42}
                  height={42}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  CÔNG TY TNHH MTV TM THIẾT BỊ ĐIỆN AN PHÚ VINA
                </h3>
                <p className="text-[11px] text-slate-400">
                  Lòng tin, sự tử tế đồng hành cùng bạn • Rạng Đông Official Distributor
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-normal">
              Được Sở Kế hoạch và Đầu tư TP. Hà Nội cấp phép ngày 02/03/2023. Chuyên phân phối đèn LED Rạng Đông, giải pháp chiếu sáng Smart Bluetooth Mesh, công trình dự án đô thị và dân dụng.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p>📍 <strong className="text-white">Địa chỉ:</strong> Số 8 hẻm 02 ngách 44 ngõ 222, P. Văn Quán, Q. Hà Đông, TP. Hà Nội</p>
              <p>📋 <strong className="text-white">Mã số thuế:</strong> 0110271235 • <strong className="text-white">Giờ làm việc:</strong> 08:30 - 17:30</p>
              <p>📞 <strong className="text-white">Hotline / Zalo:</strong> <a href="tel:0827955888" className="text-yellow-400 font-bold hover:underline">0827.955.888</a></p>
              <p>✉️ <strong className="text-white">Email:</strong> <a href="mailto:Chinh982@gmail.com" className="text-slate-300 hover:text-white">Chinh982@gmail.com</a></p>
              <p>🌐 <strong className="text-white">Website chính thức:</strong> <a href="https://rangdongapvina.com.vn/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">rangdongapvina.com.vn</a></p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Khám Phá Nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  Giới thiệu An Phú Vina
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition-colors">
                  Bảng giá 672+ sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Dự án & Công trình đã bàn giao
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-slate-400 hover:text-white transition-colors">
                  Tin tức & Catalogue kỹ thuật
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Liên hệ & Đăng ký đại lý
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-slate-400 hover:text-white transition-colors">
                  Tạo đơn báo giá chuẩn hợp đồng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cam kết */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Cam Kết Chất Lượng
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>✓ 100% chính hãng Rạng Đông</li>
              <li>✓ Bảo hành 2 năm tận nơi</li>
              <li>✓ Giá đại lý & chiết khấu dự án</li>
              <li>✓ Cung cấp CO, CQ đầy đủ</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Công ty TNHH MTV TM Thiết Bị Điện An Phú Vina. Bảo lưu mọi quyền.</p>
          <p>Hệ thống demo đồng bộ dữ liệu trực tuyến & 4 file Excel quản lý</p>
        </div>
      </div>
    </footer>
  );
}
