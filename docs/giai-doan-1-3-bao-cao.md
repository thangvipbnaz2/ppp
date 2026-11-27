# Báo cáo Giai đoạn 1–3

Ngày kiểm thử: 26/11/2026 (Asia/Bangkok)

## Giai đoạn 1 — Storefront

- Catalog Supabase: 690 sản phẩm hợp lệ trong 17 nhóm; 91 sản phẩm ở trạng thái `Liên hệ`, 599 sản phẩm có giá.
- Không còn sản phẩm nào trả về giá bán 150.000đ từ API storefront.
- Trang chủ lấy catalog, danh mục, hãng, Smart Home và tin tức từ API thật.
- Trang sản phẩm có tìm kiếm, lọc hãng/danh mục, sắp xếp giá và phân trang.
- Chi tiết sản phẩm có gallery, placeholder, mô tả/HTML, thông số, liên quan, thêm giỏ và mua ngay.
- COD, chuyển khoản BIDV giảm 2%, freeship từ 1.000.000đ, tra cứu đơn và chính sách đã nối chung dữ liệu.
- Ảnh từ `rangdongapvina.com.vn` bị chặn hotlink ở component ảnh dùng chung.

## Giai đoạn 2 — Admin

- Sửa lỗi dashboard quay vòng: cấp quyền PostgREST còn thiếu cho `anon`, `authenticated`, `service_role` (RLS vẫn giữ nguyên).
- Dashboard: số liệu thật, doanh thu hôm nay/tháng/tổng, biểu đồ 7 ngày, đơn gần đây.
- Đơn hàng: tìm kiếm, lọc, phân trang, chi tiết, đổi trạng thái, giảm giá, in đơn.
- Sản phẩm: CRUD, SKU, lọc, phân trang, giá nhanh, ẩn/hiện, import Excel/CSV, upload ảnh Supabase Storage.
- Đại lý/liên hệ: tìm kiếm, cập nhật trạng thái, xóa.
- Tin tức: CRUD; settings: hotline, email, địa chỉ, ngân hàng, phí ship, freeship.

## Giai đoạn 3 — Kiểm thử Supabase thật

| Bước | Kết quả | Bằng chứng |
|---|---|---|
| Đọc catalog local qua Next API | PASS | 690 sản phẩm, 17 danh mục, 91 `Liên hệ`, 0 giá 150.000đ |
| Đặt đơn COD | PASS | Mã `APV-20261126-P9AE`, 1 sản phẩm, phí ship 30.000đ, trạng thái `new` |
| Tra cứu mã đơn + số điện thoại | PASS | Trả đúng mã, số điện thoại, 1 dòng hàng và tổng 451.200đ |
| Đơn xuất hiện trong admin | PASS | API admin xác thực trả đúng bản ghi trên |
| Gửi đăng ký đại lý | PASS | Bản ghi số điện thoại kiểm thử xuất hiện trong API admin |
| Sửa giá bằng API admin | PASS | SP 635: 421.200đ → 422.280đ; storefront đổi ngay |
| Hoàn nguyên giá | PASS | SP 635 trở lại đúng 421.200đ |
| Chuyển khoản BIDV + freeship | PASS logic | Mã `APV-20261126-Q7OL`: tạm tính 1.263.600đ, ship 0đ, giảm 25.272đ (2%), tổng 1.238.328đ |
| Production build | PASS | `npm run build` hoàn tất, TypeScript pass, toàn bộ route được sinh |

Hai đơn hàng và một đăng ký đại lý mang nhãn **KIỂM THỬ GIAI ĐOẠN 3** được giữ lại để đối chiếu trong admin; không giao hàng.

## Dữ liệu cần điền trước deploy

Tên ngân hàng đã được đặt là **BIDV** theo yêu cầu. Số tài khoản và chi nhánh vẫn để trống vì chưa có dữ liệu được cung cấp; không tự bịa. Cần điền tại `/admin/settings` trước khi cho khách chọn chuyển khoản trên production.

Không push nhánh `main` và không deploy trong Giai đoạn 1–3.
