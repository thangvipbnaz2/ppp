export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-slate-50/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              AP
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 tracking-tight">CÔNG TY TNHH AN PHÚ</p>
              <p className="text-[11px] text-slate-400">Nhà phân phối thiết bị điện & đèn LED Rạng Đông</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Dữ liệu tổng hợp từ 4 file Excel quản lý giá và mẫu báo giá. © {new Date().getFullYear()} An Phú.
          </p>
        </div>
      </div>
    </footer>
  );
}
