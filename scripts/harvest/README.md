# Thu thập dữ liệu rangdongapvina.com.vn

Chạy đầy đủ theo thứ tự API → sitemap/scrape → Wayback → bản cache cục bộ:

```bash
npm run harvest
npm run harvest:import
```

Nếu đã xác nhận các nguồn mạng đang ngừng hoạt động và chỉ muốn dựng lại dữ liệu thô từ bản xuất WooCommerce có sẵn:

```bash
npm run harvest -- --cache-only
npm run harvest:import
```

Script giới hạn khoảng một request/giây, retry tối đa ba lần và có thể chạy lại. Import khớp SKU trước, sau đó tên chuẩn hóa; chỉ bổ sung trường thiếu và không ghi đè giá catalog. Chênh lệch giá nằm trong `harvest/conflicts.csv`.

`harvest/raw/` giữ dữ liệu gốc. `harvest/image-map.csv` ánh xạ URL ảnh với file local; dòng có `local_path` rỗng là ảnh không tải được. Không dùng URL nguồn làm ảnh hiển thị sau import.
