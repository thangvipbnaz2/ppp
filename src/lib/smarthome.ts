import { Product } from "./types";

export interface SmartHomeFeature {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

export const smartHomeFeatures: SmartHomeFeature[] = [
  {
    icon: "🌐",
    title: "Kết nối Bluetooth Mesh & Wifi",
    desc: "Mạng lưới kết nối không dây ổn định, tầm phủ sóng xuyên tầng, điều khiển độc lập qua mạng Local ngay cả khi mất Internet.",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/60",
  },
  {
    icon: "🎨",
    title: "Tùy biến 16 triệu màu RGB",
    desc: "Đổi màu ánh sáng linh hoạt theo cảm xúc, kịch bản xem phim, tiệc tùng hoặc hỗ trợ nhịp sinh học HCL bảo vệ mắt và giấc ngủ.",
    color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200/60",
  },
  {
    icon: "🎙️",
    title: "Điều khiển bằng giọng nói",
    desc: "Tương thích 100% với Google Assistant, trợ lý ảo tiếng Việt Maika, Apple HomeKit (thông qua Gateway) và ứng dụng Rallismart.",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  },
  {
    icon: "⚡",
    title: "Tự động hóa & Kịch bản thông minh",
    desc: "Hẹn giờ bật tắt, phối hợp cảm biến chuyển động PIR mở đèn tự động ban đêm, rèm cửa đón nắng sớm và ngắt điện an toàn khi ra khỏi nhà.",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60",
  },
];

export const curatedSmartProducts: Product[] = [
  {
    id: 102,
    name: "Bóng led bulb đổi màu RGB Bluetooth Rạng Đông A60.BLE.RGBCW/9W",
    category: "Đèn LED Smart",
    priceNoVAT: 273148,
    priceWithVAT: 295000,
    vatRate: 0.08,
    retailPrice: 327000,
    finalPrice: 295000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 32000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Bong-led-bulb-doi-mai-RGB-Bluetooth-Rang-Dong.A60.BLE_.RGBCW_.9W-1.jpg",
    specs: {
      power: "9W",
      voltage: "220V/50-60Hz",
      cct: "(3000 – 6500)K + 16 Triệu màu RGB",
      lumen: "810 lm",
      dimensions: "(60×109) mm",
      warranty: "2 năm chính hãng Rạng Đông",
      cri: "≥ 80",
      rawSpecs: "Kết nối không dây: Bluetooth Mesh. Điều khiển từ xa qua Internet. Tùy chỉnh độ sáng 10-100%, đổi màu RGB. Hẹn giờ và kịch bản ngữ cảnh qua ứng dụng Rallismart."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 103,
    name: "Đèn LED panel tròn đổi màu Bluetooth Rạng Đông PT04.BLE 135/12W",
    category: "Đèn LED Smart",
    priceNoVAT: 375925,
    priceWithVAT: 406000,
    vatRate: 0.08,
    retailPrice: 451000,
    finalPrice: 406000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 45000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Den-led-panel-tron-doi-mau-bluetooth-Rang-Dong-PT04.BLE-135.12W.jpg",
    specs: {
      power: "12W",
      voltage: "(150-250)V",
      cct: "(4000-6500)K đổi màu thông minh",
      lumen: "750 lm",
      lifespan: "25.000 giờ",
      dimensions: "Lỗ khoét 135mm",
      cutout: "135mm",
      warranty: "2 năm chính hãng Rạng Đông",
      cri: "≥ 80",
      rawSpecs: "Kết nối Bluetooth Mesh. Điều khiển từ xa qua Internet. Đổi nhiệt độ màu vàng - trung tính - trắng theo nhịp sinh học HCL."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 85,
    name: "Công tắc cảm ứng rèm BLE Rạng Đông CTCU.BLE V.REMT MN",
    category: "Đèn LED Smart",
    priceNoVAT: 747222,
    priceWithVAT: 807000,
    vatRate: 0.08,
    retailPrice: 896000,
    finalPrice: 807000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 89000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Cong-tac-cam-ung-rem-BLE-Rang-Dong-CTCU.BLE-V.REMT-MN-1.jpg",
    specs: {
      power: "300W",
      voltage: "220V/50Hz",
      dimensions: "(86x86x32) mm",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Mặt kính cường lực chống xước sang trọng. Điều khiển đóng/mở/dừng rèm từ xa qua App hoặc nút bấm cảm ứng điện dung cực nhạy. Hẹn giờ tự động đón ánh sáng mặt trời."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 86,
    name: "Công tắc thông minh Rạng Đông CTCU.BLE CN.01T",
    category: "Đèn LED Smart",
    priceNoVAT: 679629,
    priceWithVAT: 734000,
    vatRate: 0.08,
    retailPrice: 815000,
    finalPrice: 734000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 81000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Cong-tac-cua-cuon-thong-minh-Rang-Dong-CTCU.WF-CN.DOT_.2W.SP-1.jpg",
    specs: {
      power: "Công suất tải cao 3000W",
      voltage: "(150-250)V",
      dimensions: "(120x70x32) mm (Chữ nhật)",
      ipRating: "IP44",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Chịu tải cao 3000W dùng tốt cho bình nóng lạnh, máy bơm hoặc dàn đèn chiếu sáng công suất lớn. Chuẩn kết nối BLE Mesh, phản hồi trạng thái tức thời."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 98,
    name: "Đèn Led dây RGB Wifi Rạng Đông LD01.WF.RGBCW 1000/3W (12VDC)",
    category: "Đèn LED Smart",
    priceNoVAT: 138888,
    priceWithVAT: 150000,
    vatRate: 0.08,
    retailPrice: 175000,
    finalPrice: 150000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 25000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Den-led-day-RGB-Wifi-Rang-Dong-LD01.WF_.RGBCW-10003W-4.jpg",
    specs: {
      power: "3W/m (12VDC)",
      voltage: "12VDC",
      cct: "RGB + CCT (Đổi 16 triệu màu)",
      lumen: "250 lm/m",
      dimensions: "Cuộn 5m dán linh hoạt",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Tích hợp micro nháy theo nhạc, kết nối Wifi trực tiếp không cần Hub. Thích hợp trang trí trần giật cấp, kệ tủ, góc gaming và bàn làm việc cao cấp."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 563,
    name: "Ổ cắm thông minh wifi đơn OC.01.WF 16A",
    category: "Đèn LED Smart",
    priceNoVAT: 141000,
    priceWithVAT: 152280,
    vatRate: 0.08,
    retailPrice: 211500,
    finalPrice: 152280,
    supportMechanism: "Chiết khấu thiết bị chuyên dụng",
    supportAmount: 59220,
    image: "/images/products/image1177.png",
    specs: {
      power: "Tối đa 3000W (16A)",
      voltage: "220V/50Hz",
      dimensions: "(63x44x49) mm",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Kết nối Wifi 2.4GHz điều khiển độc lập mọi thiết bị điện gia dụng (quạt, sạc điện thoại thoại, máy lọc không khí). Đo đếm điện năng tiêu thụ và hẹn giờ thông minh."
    },
    source: "excel"
  },
  {
    id: 96,
    name: "Đèn led Linear thông minh Rạng Đông LR01.BLE 1000/20W",
    category: "Đèn LED Smart",
    priceNoVAT: 871296,
    priceWithVAT: 941000,
    vatRate: 0.08,
    retailPrice: 1045000,
    finalPrice: 941000,
    supportMechanism: "Chính sách chiết khấu trực tuyến",
    supportAmount: 104000,
    image: "https://rangdongapvina.com.vn/wp-content/uploads/2025/03/Den-led-linear-thong-minh-Rang-Dong-LR01.BLE-1000.20W-1.jpg",
    specs: {
      power: "20W/m",
      voltage: "23-25 VDC",
      cct: "6500K / 3000K đổi màu",
      lumen: "1300 lm",
      lifespan: "25.000 giờ",
      dimensions: "(64x32) mm",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Chiếu sáng kiến trúc văn phòng & biệt thự cao cấp. Cho phép ghép nối liền mạch không để lại vệt đen, điều khiển theo vùng qua ứng dụng."
    },
    source: "rangdongapvina.com.vn"
  },
  {
    id: 254,
    name: "Cảm biến chuyển động CB09.PIR (AC)",
    category: "Đèn LED Smart",
    priceNoVAT: 125000,
    priceWithVAT: 135000,
    vatRate: 0.08,
    retailPrice: 168000,
    finalPrice: 135000,
    supportMechanism: "Chính sách chiết khấu",
    supportAmount: 33000,
    image: "/images/products/image224.png",
    specs: {
      power: "Chịu tải 800W",
      voltage: "220V/50Hz",
      dimensions: "Gắn trần gọn gàng",
      ipRating: "IP20",
      warranty: "2 năm chính hãng Rạng Đông",
      rawSpecs: "Cảm biến hồng ngoại thụ động góc quét 360 độ, tầm quét 6m. Tự động bật đèn khi phát hiện người và tắt sau thời gian trễ tùy chỉnh."
    },
    source: "excel"
  }
];
