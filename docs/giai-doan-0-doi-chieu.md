# Giai đoạn 0 — Đối chiếu và gộp mã nguồn

## Nguồn production

- Deployment hiện tại: `dpl_4Wui66Mcefxu9ykXPnwFtXGCCaUB`.
- Đây là lần redeploy của `dpl_3KAnjZpfCdQcrsfsBTFztJEVPgfk`.
- Metadata Git: `thangvipbnaz2/ppp`, nhánh `main`, commit `0cd3c8f7d4e4ca6b4835bf1308d152b2f5fa038a`.
- Deployment có `gitDirty=1`, do đó source production không trùng hoàn toàn commit Git.
- Source chính xác 1.061 file đã được lấy bằng Vercel Files API về `D:\AnPhu\vercel-production-source-dpl_3KAnjZpfCdQcrsfsBTFztJEVPgfk`.

## Khác biệt chức năng

| Khu vực | Production phục hồi | Local trước khi gộp | Quyết định gộp |
|---|---|---|---|
| Checkout COD/chuyển khoản | Có COD, chuyển khoản và freeship theo settings; source không có phép giảm 2% | Giống production, chỉ thêm ảnh fallback | Giữ toàn bộ luồng, bổ sung giảm 2% ở cả UI và API server theo yêu cầu đã xác nhận |
| Phí vận chuyển | Miễn phí khi tạm tính đạt `free_ship_threshold` (mặc định 1.000.000đ) | Giống production | Giữ nguyên |
| Lưu đơn/tra cứu | API ghi `orders`, `order_items`; tra cứu bằng mã đơn + điện thoại | Giống production | Giữ nguyên |
| Catalog | 672 bản ghi JSON, runtime loại 4 bản | 695 bản ghi sau harvest, không hotlink | Giữ catalog 695 và quy tắc không ghi đè giá |
| Báo giá | Đọc JSON tĩnh, có thể dùng nguồn giá khác storefront | Đọc `/api/products`, bỏ mẫu, sản phẩm thiếu giá hiện Liên hệ | Dùng bản local |
| Ảnh | `next/image`, ảnh nguồn lỗi có thể vỡ | `SafeImage` fallback, catalog không hotlink | Dùng bản local |
| Số liệu giao diện | Hardcode 672/85/9 hãng | Tính từ `/api/products` | Dùng bản local |
| Chính sách | Chưa có route riêng | Có 4 route chính sách | Dùng bản local |
| Tin tức | Mặc định mở trang `/news` | Hỗ trợ mở đúng bài theo query | Dùng bản local |
| Chữ/danh mục | Còn một số tên lỗi và phân nhóm cũ | Chuẩn hóa Bluetooth/Giá/nhiệt độ màu và nhóm Smart Home | Dùng bản local |
| Admin | Có khung admin và CRUD cơ bản | Cùng nền production, schema/admin đang được mở rộng | Tiếp tục ở Giai đoạn 2 |

Không tìm thấy tính năng hợp lệ nào chỉ có trong source production mà local đã loại bỏ. Các thay đổi chung giữa hai cây chủ yếu là ảnh fallback, nguồn dữ liệu thống nhất, số đếm động và sửa nội dung P0–P2.
