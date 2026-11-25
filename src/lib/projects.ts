export interface ProjectCase {
  id: string;
  title: string;
  client: string;
  location: string;
  date: string;
  contractValue: string;
  status: string;
  scope: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  tag: string;
  badgeColor: string;
  image?: string;
}

export const completedProjects: ProjectCase[] = [
  {
    id: "chung-cu-n04-hoang-dao-thuy",
    title: "Chung Cư N04 Hoàng Đạo Thúy - Hà Nội",
    client: "Ban Quản Lý & Chủ Đầu Tư Tổ Hợp N04 Trung Hòa - Nhân Chính",
    location: "Đường Hoàng Đạo Thúy, Quận Cầu Giấy, TP. Hà Nội",
    date: "Dự án tiêu biểu",
    contractValue: "Hệ thống chiếu sáng tòa nhà cao tầng",
    status: "Đạt chuẩn TCVN 7114:2008 & QCVN 09:2013/BXD",
    scope: "Triển khai hệ thống chiếu sáng sử dụng đèn LED tiết kiệm điện cho toàn bộ khu vực căn hộ, tầng hầm, sảnh và hành lang. Đảm bảo ánh sáng tiện nghi, không nhấp nháy, không gây chói lóa hay sấp bóng.",
    tag: "Chung cư & Tòa nhà",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/Chung_cu_No4_Hoang_Dao_Thuy_Ha_Noi.jpg",
    items: [
      { name: "Đèn LED Downlight âm trần Rạng Đông AT04/AT10", quantity: 500, unit: "Bộ" },
      { name: "Đèn LED ốp trần hành lang & sảnh chờ", quantity: 180, unit: "Cái" },
      { name: "Bộ đèn LED tuýp chống ẩm tầng hầm & Exit sự cố", quantity: 220, unit: "Bộ" },
    ],
  },
  {
    id: "kdt-van-phu",
    title: "Chiếu Sáng Khu Đô Thị Văn Phú - Hà Đông",
    client: "Công ty CP Vật tư Cơ giới và Xây dựng Thống Nhất",
    location: "Số nhà 77 TT9, KĐT Văn Phú, Phường Hà Đông, TP. Hà Nội",
    date: "Năm 2026",
    contractValue: "Hợp đồng dự án hoàn thành",
    status: "Đã nghiệm thu & bàn giao thực tế",
    scope: "Cung cấp trọn gói hệ thống đèn LED âm trần Downlight và đèn ốp trần vuông cao cấp cho công trình biệt thự, nhà liền kề KĐT Văn Phú.",
    tag: "Đô thị & Bất động sản",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    items: [
      { name: "Đèn LED Downlight âm trần AT04 90/10W 6500K", quantity: 110, unit: "Cái" },
      { name: "Đèn LED ốp trần vuông LN12N 220x220/18W SS", quantity: 14, unit: "Cái" },
      { name: "Đèn LED ốp trần vuông LN12N 170x170/12W SS", quantity: 12, unit: "Cái" },
    ],
  },
  {
    id: "hop-dong-cong-trinh-238tr",
    title: "Gói Thầu Chiếu Sáng Tổng Thể Tòa Nhà & Nhà Xưởng",
    client: "Khách hàng Doanh nghiệp & Công trình Dự án",
    location: "Khu vực Hà Nội & các tỉnh lân cận",
    date: "Năm 2026",
    contractValue: "238.030.380 VNĐ",
    status: "Đã hoàn thành 100%",
    scope: "Cung cấp hơn 850 thiết bị chiếu sáng kỹ thuật bao gồm hệ thống chống nổ nhà kho, Panel văn phòng, đèn pha công suất lớn và Highbay nhà xưởng.",
    tag: "Công trình & Công nghiệp",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    items: [
      { name: "Đèn LED ốp trần tràn viền LN29N 220/18W 6500K", quantity: 307, unit: "Cái" },
      { name: "Đèn LED Panel văn phòng P06 600x600/50W", quantity: 134, unit: "Cái" },
      { name: "Đèn LED Downlight AT04 90/10W 6500K", quantity: 149, unit: "Cái" },
      { name: "Bộ đèn LED bán nguyệt M26 1200/50W", quantity: 68, unit: "Bộ" },
      { name: "Đèn LED Chiếu pha cao cấp CP10 150W", quantity: 62, unit: "Bộ" },
      { name: "Đèn LED ốp trần cảm biến Radar LN12.RAD 220/18W", quantity: 60, unit: "Cái" },
      { name: "Bộ đèn LED chống nổ CN01 1200/40W.PLUS", quantity: 20, unit: "Bộ" },
      { name: "Đèn LED High Bay nhà xưởng HB03 290/100W SS", quantity: 3, unit: "Bộ" },
    ],
  },
  {
    id: "ha-tang-csd-ctda",
    title: "Dự Án Chiếu Sáng Giao Thông Đô Thị (CTDA PLUS)",
    client: "Dự án Công trình Chiếu sáng Hạ tầng Đô thị",
    location: "Tuyến đường nhánh & nội khu đô thị",
    date: "Năm 2026",
    contractValue: "26.438.400 VNĐ / đợt",
    status: "Đã bàn giao lắp đặt",
    scope: "Triển khai lắp đặt cột đèn và bộ đèn LED chiếu sáng đường phố công suất cao CSD05 quang thông mạnh mẽ, độ rọi đồng đều đạt chuẩn chiếu sáng đô thị.",
    tag: "Chiếu sáng Hạ tầng",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    items: [
      { name: "Đèn LED chiếu sáng đường CSD05 150W 4000K", quantity: 6, unit: "Bộ" },
      { name: "Cần đèn & phụ kiện kết cấu chiếu sáng đường", quantity: 6, unit: "Bộ" },
    ],
  },
];
