# An Phú - Ứng Dụng Quản Lý Báo Giá & Tra Cứu Đèn LED Rạng Đông

Website hiện đại, chuẩn Responsive (mobile, tablet, desktop) được xây dựng từ 4 file dữ liệu Excel của An Phú.

## 🌟 Tính Năng Nổi Bật

1. **Trang chủ (`/`)**:
   - Giao diện hiện đại, chuẩn nhận diện thương hiệu An Phú & Rạng Đông.
   - Thống kê tổng quan: 1,259+ sản phẩm, 21 nhóm danh mục.
   - Lối tắt nhanh vào các danh mục sản phẩm phổ biến nhất.

2. **Bảng Giá Sản Phẩm (`/products`)**:
   - Dữ liệu đầy đủ 1,259 sản phẩm trích xuất từ file `10.10.26 BẢNG TỔNG HỢP GIÁ BÁN.xlsx`.
   - Tìm kiếm tức thì theo tên model / từ khóa.
   - Lọc theo 21 danh mục (Đèn Downlight, Chiếu pha, Panel, Ruột phích, LED dây, Chiếu sáng đường,...).
   - Sắp xếp theo giá tăng/giảm hoặc tên A-Z. Phân trang mượt mà.

3. **Tạo Báo Giá Tự Động (`/quote`)**:
   - Mô phỏng quy trình báo giá từ file `BÁO GIÁ MẪU PP.xlsx` & `Form báo giá 1`.
   - Chọn sản phẩm nhanh từ danh mục, điều chỉnh số lượng.
   - Tự động tính tiền hàng, tiền thuế VAT (8%), tổng thanh toán.
   - Điền thông tin khách hàng & hỗ trợ **In/Xuất PDF báo giá** trực tiếp trên trình duyệt (`Ctrl + P`).

4. **Đối Chiếu Giá Web vs Excel (`/compare`)**:
   - Tích hợp toàn bộ báo cáo từ file `Doi-chieu-LD03-web-va-excel.xlsx`.
   - So sánh trực quan giữa giá bán lẻ đề xuất trên `rangdong.com.vn` với giá Excel nội bộ An Phú.
   - Đánh dấu trạng thái Khớp / Thiếu rõ ràng.

---

## 🚀 Hướng Dẫn Chạy & Deploy Vercel (Phục vụ 100+ Người Dùng)

### Cách 1: Chạy Thử Nghiệm Tại Máy (Local)
Mở terminal tại thư mục `D:\AnPhu\anphu-web`:
```bash
npm run dev
# Mở trình duyệt truy cập: http://localhost:3000
```
Hoặc chạy bản build production đã tối ưu:
```bash
npm run start
```

### Cách 2: Deploy Lên Vercel Bằng Vercel CLI (Nhanh nhất)
1. Trong terminal tại `D:\AnPhu\anphu-web`:
```bash
npx vercel
```
2. Làm theo hướng dẫn đăng nhập và chọn xác nhận (nhấn Enter liên tục để dùng thiết lập mặc định).
3. Đợi khoảng 1 phút, Vercel sẽ cấp cho bạn một domain trực tiếp (ví dụ: `https://anphu-web.vercel.app`) để gửi cho 100 người dùng test ngay.

### Cách 3: Deploy Qua GitHub
1. Tạo 1 repository mới trên GitHub.
2. Đẩy toàn bộ thư mục `anphu-web` lên GitHub.
3. Vào [vercel.com](https://vercel.com) -> New Project -> Import Repository vừa tạo -> Bấm **Deploy**.
