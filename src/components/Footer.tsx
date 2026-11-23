export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-blue-800 text-xl">
                AP
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AN PHÚ</h3>
                <p className="text-gray-400 text-xs">Thiết bị điện & chiếu sáng</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chuyên phân phối thiết bị điện, đèn LED Rạng Đông, bình giữ nhiệt và các sản phẩm chiếu sáng chất lượng cao.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-yellow-400 transition-colors">Bảng giá sản phẩm</a></li>
              <li><a href="/quote" className="hover:text-yellow-400 transition-colors">Tạo báo giá</a></li>
              <li><a href="/compare" className="hover:text-yellow-400 transition-colors">Đối chiếu giá</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Hà Đông, Hà Nội
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@anphu.vn
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} An Phú. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
