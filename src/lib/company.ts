export interface BrandInfo {
  id: string;
  name: string;
  displayName: string;
  logo: string;
  count?: number;
  badge: string;
  tagline: string;
  origin: string;
}

export const BRANDS: BrandInfo[] = [
  {
    id: "all",
    name: "Tất cả",
    displayName: "Tất Cả Thương Hiệu",
    logo: "",
    count: 672,
    badge: "Tổng kho 672+",
    tagline: "Toàn bộ danh mục sản phẩm An Phú Vina",
    origin: "Đa thương hiệu",
  },
  {
    id: "rangdong",
    name: "Rạng Đông",
    displayName: "Rạng Đông (Ralaco)",
    logo: "/images/brands/rang-dong.jpg",
    count: 610,
    badge: "Chính hãng",
    tagline: "Chiếu sáng LED dân dụng & Smart Home Rallismart IoT",
    origin: "Việt Nam",
  },
  {
    id: "kingled",
    name: "Kingled",
    displayName: "KINGLED",
    logo: "/images/brands/kingled.jpg",
    count: 50,
    badge: "Chính hãng",
    tagline: "Đèn rọi, chiếu pha, ốp trần & đèn exit chỉ dẫn",
    origin: "Việt Nam",
  },
  {
    id: "ledvance",
    name: "Osram / Ledvance",
    displayName: "OSRAM / LEDVANCE",
    logo: "/images/brands/osram.jpg",
    count: 12,
    badge: "Tiêu chuẩn Đức",
    tagline: "Đèn Downlight LDECO & LDVAL DL ALU cao cấp",
    origin: "CHLB Đức",
  },
  {
    id: "asialighting",
    name: "Asia Lighting",
    displayName: "ASIA LIGHTING",
    logo: "/images/brands/asia-lighting.jpg",
    badge: "Chính hãng",
    tagline: "Đèn LED dân dụng và công nghiệp chất lượng cao",
    origin: "Việt Nam",
  },
  {
    id: "elv",
    name: "ELV Lighting",
    displayName: "ELV LIGHTING",
    logo: "/images/brands/elv.jpg",
    badge: "Chính hãng",
    tagline: "Đèn LED cảnh quan sân vườn & chiếu sáng kiến trúc",
    origin: "Việt Nam",
  },
  {
    id: "kaiyokukan",
    name: "Kaiyokukan",
    displayName: "kaiyokukan",
    logo: "/images/brands/kaiyokukan.jpg",
    badge: "Quạt đèn cao cấp",
    tagline: "Quạt trần đèn trang trí phong cách Nhật Bản",
    origin: "Nhật Bản",
  },
  {
    id: "mpe",
    name: "MPE",
    displayName: "MPE",
    logo: "/images/brands/mpe.jpg",
    badge: "Chính hãng",
    tagline: "Thiết bị điện & đèn chiếu sáng thông minh MPE",
    origin: "Việt Nam",
  },
  {
    id: "opple",
    name: "Opple",
    displayName: "OPPLE",
    logo: "/images/brands/opple.jpg",
    badge: "Quốc tế",
    tagline: "Giải pháp chiếu sáng LED toàn cầu",
    origin: "Quốc tế",
  },
  {
    id: "gslighting",
    name: "GS Lighting",
    displayName: "GS LIGHTING",
    logo: "/images/brands/gslighting.jpg",
    badge: "Chính hãng",
    tagline: "Đèn ray nam châm & chiếu sáng nội thất hiện đại",
    origin: "Việt Nam",
  },
];

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  highlights: string[];
  sections: {
    heading: string;
    bullets: string[];
  }[];
}

export const companyInfo = {
  name: "CÔNG TY TNHH MTV TM THIẾT BỊ ĐIỆN AN PHÚ VINA",
  shortName: "An Phú Vina",
  slogan: "Lòng tin, sự tử tế đồng hành cùng bạn",
  mst: "0110271235",
  issuedDate: "02/03/2023",
  issuedBy: "Sở Kế hoạch và Đầu tư TP. Hà Nội",
  address: "Số 8 hẻm 02 ngách 44 ngõ 222, Phường Văn Quán, Quận Hà Đông, Thành phố Hà Nội, Việt Nam",
  hotline: "0827.955.888",
  hotlineRaw: "0827955888",
  email: "Chinh982@gmail.com",
  workingHours: "08:30 - 17:30 (Thứ 2 - Thứ 7)",
  website: "https://rangdongapvina.com.vn/",
  mission:
    "Cung cấp các sản phẩm, dịch vụ, hệ thống & giải pháp chiếu sáng xanh tiết kiệm năng lượng, thân thiện môi trường, bảo vệ sức khỏe và hạnh phúc con người; tận tâm phụng sự khách hàng và đối tác công trình.",
  vision:
    "Trở thành đơn vị phân phối uy tín hàng đầu Việt Nam tiên phong trong lĩnh vực cung cấp thiết bị điện, giải pháp chiếu sáng LED công trình và hệ sinh thái Nhà thông minh Smart Home.",
  banners: [
    "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/z5896122515979_83143d64d0966bf852ab251e7f9163e7.jpg",
    "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/z5896122537084_107ba381a9e8999a167627f03506dba1.jpg",
  ],
  policies: [
    {
      icon: "🚚",
      title: "Giao hàng nhanh 1-2 ngày",
      desc: "Miễn phí vận chuyển toàn nội thành Hà Nội cho đơn hàng từ 1.000.000đ trở lên.",
    },
    {
      icon: "🔄",
      title: "Đổi trả trong 07 ngày",
      desc: "Hỗ trợ đổi mới nhanh chóng trong 7 ngày đầu nếu phát sinh lỗi kỹ thuật từ nhà sản xuất.",
    },
    {
      icon: "🛡️",
      title: "Bảo hành chính hãng 2 năm",
      desc: "100% sản phẩm Rạng Đông, Kingled, Ledvance có tem bảo hành và CO/CQ đầy đủ.",
    },
    {
      icon: "💳",
      title: "Thanh toán & Hóa đơn VAT 8%",
      desc: "Chấp nhận chuyển khoản, COD kiểm hàng khi nhận và xuất hóa đơn VAT điện tử hợp lệ.",
    },
  ],
};

export const newsArticles: NewsArticle[] = [
  {
    id: "den-led-panel-rang-dong-600x600",
    title: "Đèn LED Panel Rạng Đông 600×600 và những ưu điểm vượt trội",
    category: "Catalogue & Kỹ thuật",
    date: "Cập nhật mới nhất",
    readTime: "4 phút đọc",
    summary:
      "Tìm hiểu lý do đèn LED Panel Rạng Đông 600×600 sử dụng chip LED Samsung hiệu suất 150 lm/W đang là lựa chọn hàng đầu cho văn phòng, bệnh viện và trường học.",
    image:
      "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/z5896122515979_83143d64d0966bf852ab251e7f9163e7.jpg",
    highlights: [
      "Tiết kiệm 50% – 65% điện năng so với máng huỳnh quang T8 cũ",
      "Chip LED Samsung cao cấp, hiệu suất sáng lên tới 150 lm/W",
      "Tuổi thọ bền bỉ 25.000 giờ, không hạn chế số lần bật tắt",
      "Đạt chuẩn chiếu sáng Việt Nam TCVN 7114:2008, CRI ≥ 80",
    ],
    sections: [
      {
        heading: "1. Tiết kiệm đến 65% điện năng tiêu thụ",
        bullets: [
          "Sử dụng chip LED Samsung chuyên dụng cho hiệu suất phát quang cao.",
          "Tiết kiệm 50% – 65% điện năng khi thay thế bộ đèn huỳnh quang T8 600×600 (18Wx3, 18Wx4) hoặc 600×1200 (36Wx3) dùng ballast sắt từ.",
          "Giảm đáng kể chi phí hóa đơn tiền điện hàng tháng cho doanh nghiệp và tòa nhà.",
        ],
      },
      {
        heading: "2. Tuổi thọ 25.000 giờ & Dải điện áp rộng EMC/EMI",
        bullets: [
          "Tuổi thọ 25.000 giờ, cao gấp 3–4 lần đèn huỳnh quang truyền thống, không hạn chế số lần bật/tắt.",
          "Dải điện áp hoạt động rộng (150–250V): ánh sáng và công suất ổn định ngay cả khi điện áp lưới dao động.",
          "Tương thích điện từ trường EMC/EMI, không gây nhiễu cho máy tính và thiết bị y tế nhạy cảm.",
        ],
      },
      {
        heading: "3. Chỉ số hoàn màu CRI ≥ 80 & Ứng dụng đa dạng",
        bullets: [
          "Ánh sáng trung thực tự nhiên, không nhấp nháy, bảo vệ thị lực theo TCVN 7114:2008.",
          "Lắp đặt linh hoạt (âm trần thạch cao, trần thả, nổi trần hoặc treo thả) cho hộ gia đình, văn phòng, bệnh viện, trung tâm thương mại.",
        ],
      },
    ],
  },
  {
    id: "giai-phap-chieu-sang-chung-cu-tcvn",
    title: "Tiêu chuẩn chiếu sáng tòa nhà chung cư đạt QCVN 09:2013/BXD",
    category: "Giải pháp dự án",
    date: "Hồ sơ kỹ thuật",
    readTime: "3 phút đọc",
    summary:
      "Ứng dụng đèn LED hiệu suất cao tại căn hộ, sảnh, hành lang và tầng hầm giúp tối ưu chi phí vận hành tòa nhà mà vẫn đảm bảo độ rọi tiện nghi.",
    image:
      "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/Chung_cu_No4_Hoang_Dao_Thuy_Ha_Noi.jpg",
    highlights: [
      "Đáp ứng tiêu chuẩn TCVN 7114:2008 và QCVN 09:2013/BXD",
      "Ánh sáng không nhấp nháy, không gây chói lóa hay sấp bóng",
      "Tích hợp đèn cảm biến Radar cho hành lang & tầng hầm tiết kiệm điện",
    ],
    sections: [
      {
        heading: "Yêu cầu kỹ thuật tại các khu vực tòa nhà",
        bullets: [
          "Khu vực căn hộ & sảnh đón: Ưu tiên đèn Downlight AT04/AT10 CRI ≥ 80 mang lại không gian sang trọng, ấm cúng.",
          "Hành lang & cầu thang bộ: Sử dụng đèn ốp trần cảm biến chuyển động Radar LN12.RAD tự động bật/tắt thông minh.",
          "Tầng hầm & lối thoát hiểm: Kết hợp tuýp LED chống ẩm M26 và đèn sự cố khẩn cấp Exit KC04.",
        ],
      },
    ],
  },
  {
    id: "nha-thong-minh-rallismart-ble-mesh",
    title: "Hệ sinh thái Nhà thông minh Rallismart Bluetooth Mesh & Wifi",
    category: "Smart Home IoT",
    date: "Công nghệ mới",
    readTime: "5 phút đọc",
    summary:
      "Điều khiển kịch bản ánh sáng 16 triệu màu, công tắc cảm ứng mặt kính và cảm biến PIR tự động qua ứng dụng Rallismart hoặc giọng nói tiếng Việt.",
    image:
      "https://rangdongapvina.com.vn/wp-content/uploads/2024/10/z5896122537084_107ba381a9e8999a167627f03506dba1.jpg",
    highlights: [
      "Kết nối Bluetooth Mesh xuyên tầng ổn định ngay cả khi mất Internet",
      "Tương thích Google Assistant, Apple HomeKit (qua Gateway) & Maika",
      "Lắp đặt thay thế công tắc cơ truyền thống nhanh chóng, không cần đục tường",
    ],
    sections: [
      {
        heading: "Điểm mạnh công nghệ Bluetooth Mesh Rạng Đông",
        bullets: [
          "Mỗi thiết bị đóng vai trò như một mắt xích truyền tín hiệu, mở rộng vùng phủ sóng cho nhà nhiều tầng và biệt thự.",
          "Tự động đổi nhiệt độ màu từ 3000K đến 6500K theo nhịp sinh học con người (HCL).",
          "Dễ dàng thiết lập ngữ cảnh: Tiếp khách, Xem phim, Đi ngủ, Về nhà.",
        ],
      },
    ],
  },
];
