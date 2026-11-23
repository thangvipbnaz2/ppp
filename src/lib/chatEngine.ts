import { Product } from "./types";
import { formatCurrency } from "./utils";

export interface BotReply {
  text: string;
  products?: {
    id: number;
    name: string;
    price: number;
    specs: string;
    image: string;
  }[];
  suggestions?: string[];
}

/**
 * Intelligent Consultation Engine:
 * Dynamically answers customer inquiries based on the live catalog of 672 products.
 * Handles superlatives (đắt nhất/rẻ nhất), suitability (trần bê tông/thạch cao), room areas, and catalog surveys.
 */
export function processCustomerQuery(query: string, allProducts: Product[]): BotReply {
  const q = query.toLowerCase().trim();

  // Helper: sort products by price
  const validProducts = allProducts.filter((p) => p && p.priceWithVAT && p.priceWithVAT > 0);

  // -------------------------------------------------------------
  // 1. SUPERLATIVES (ĐẮT NHẤT / RẺ NHẤT / SÁNG NHẤT / CÔNG SUẤT LỚN NHẤT)
  // -------------------------------------------------------------
  const isMostExpensive =
    q.includes("đắt nhất") ||
    q.includes("đắt tiền nhất") ||
    q.includes("dat nhat") ||
    q.includes("giá cao nhất") ||
    q.includes("cao tiền nhất") ||
    q.includes("đắt nhất trên web");

  const isCheapest =
    q.includes("rẻ nhất") ||
    q.includes("re nhat") ||
    q.includes("giá thấp nhất") ||
    q.includes("tiết kiệm nhất") ||
    q.includes("bình dân nhất");

  const isMostPowerful =
    q.includes("sáng nhất") ||
    q.includes("công suất lớn nhất") ||
    q.includes("mạnh nhất") ||
    q.includes("sang nhat") ||
    q.includes("oát cao nhất") ||
    q.includes("w cao nhất");

  // Category classifiers
  const isBulb = q.includes("bóng") || q.includes("bong") || q.includes("bulb") || q.includes("búp");
  const isDownlight = q.includes("âm trần") || q.includes("am tran") || q.includes("downlight") || q.includes("at04") || q.includes("at10");
  const isPanel = q.includes("panel") || q.includes("p06") || q.includes("trần thả") || q.includes("600x600");
  const isPha = q.includes("pha") || q.includes("chiếu pha") || q.includes("cp06") || q.includes("ngoài trời") || q.includes("ip66");
  const isSmart = q.includes("smart") || q.includes("thông minh") || q.includes("wifi") || q.includes("bluetooth") || q.includes("ble") || q.includes("rallismart");
  const isTuyp = q.includes("tuýp") || q.includes("tuyp") || q.includes("t8") || q.includes("bán nguyệt") || q.includes("m16");
  const isStreet = q.includes("đường") || q.includes("duong") || q.includes("csd") || q.includes("năng lượng mặt trời") || q.includes("nlmt");

  // --- 1.1: ĐẮT NHẤT ---
  if (isMostExpensive) {
    if (isBulb) {
      // Find bulbs sorted by price descending
      const bulbs = validProducts
        .filter((p) => {
          const t = (p.name + " " + p.category).toLowerCase();
          return t.includes("bulb") || t.includes("bóng") || t.includes("búp");
        })
        .sort((a, b) => b.priceWithVAT - a.priceWithVAT);

      const topBulb = bulbs[0];
      const secondBulb = bulbs.find((b) => b.id !== topBulb?.id && !b.name.includes("thông minh"));

      return {
        text: `Dạ trên website An Phú Vina hiện nay, dòng **bóng đèn đắt tiền nhất** chính là:

🥇 **${topBulb?.name}** - Giá: **${formatCurrency(topBulb?.priceWithVAT || 1000000)}** (có VAT)
• Đây là dòng bóng LED thông minh cao cấp kết nối Wifi trực tiếp, tùy biến 16 triệu màu RGB, điều khiển bật/tắt hẹn giờ và ra lệnh giọng nói qua điện thoại.

🥈 Kế tiếp ở phân khúc bóng đèn chiếu sáng thông dụng công suất cực đại là:
• **${secondBulb?.name || "Đèn LED Bulb trụ TR135/80W E27"}** - Giá: **${formatCurrency(secondBulb?.priceWithVAT || 374679)}** (Công suất siêu sáng 80W cho nhà xưởng, sân vườn, đui xoáy E27 tiêu chuẩn).

*(Lưu ý: Nếu tính toàn bộ 672 sản phẩm trên website thì thiết bị đắt nhất là dòng **Đèn đường năng lượng mặt trời CSD02.SL 100W** với giá **16.906.159 đ** ạ).*`,
        products: bulbs.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `${p.category} • ${p.specs?.power || "Chính hãng Rạng Đông"}`,
          image: p.image || "/images/products/image281.png",
        })),
        suggestions: [
          "Bóng đèn rẻ nhất là mẫu nào?",
          "Xem các mẫu bóng LED Bulb phổ thông",
          "Tư vấn bóng thông minh đổi màu RGB",
        ],
      };
    }

    if (isDownlight) {
      const downlights = validProducts
        .filter((p) => (p.category.includes("Downlight") || p.name.includes("AT04") || p.name.includes("AT10") || p.name.includes("AT20")))
        .sort((a, b) => b.priceWithVAT - a.priceWithVAT);
      const top = downlights[0];

      return {
        text: `Dạ trong dòng đèn âm trần Downlight trên web, mẫu đắt tiền nhất là **${top.name}** (${formatCurrency(top.priceWithVAT)} có VAT).
Dòng này tích hợp bộ nguồn dự phòng chiếu sáng sự cố khẩn cấp (hoặc công suất lớn 25W lỗ khoét D155mm), tự động bật sáng khi mất điện.
Đối với dòng âm trần dân dụng thông thường thì mức giá rất mềm, chỉ từ **73.000 đ đến 116.000 đ/bóng** tùy công suất 7W - 12W ạ.`,
        products: downlights.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Khoét lỗ thạch cao • ${p.specs?.power || "Downlight"}`,
          image: p.image || "/images/products/image281.png",
        })),
        suggestions: ["Mẫu âm trần bán chạy nhất", "Đèn downlight đổi 3 màu giá bao nhiêu?"],
      };
    }

    // Overall most expensive product in entire store
    const sortedAll = [...validProducts].sort((a, b) => b.priceWithVAT - a.priceWithVAT);
    const topOverall = sortedAll[0];
    const top2 = sortedAll[1];

    return {
      text: `Dạ trên toàn bộ hệ thống website An Phú Vina hiện nay, thiết bị **đắt tiền nhất** là:

🏆 **${topOverall.name}**
• **Giá niêm yết (có VAT)**: **${formatCurrency(topOverall.priceWithVAT)}**
• **Đặc điểm**: Dòng đèn đường cao cấp tích hợp tấm pin năng lượng mặt trời dung lượng lớn, pin lưu trữ Lithium LiFePO4 bền bỉ, chiếu sáng tự động cả đêm không tốn 1 đồng tiền điện, chuyên phục vụ các tuyến cao tốc, đại lộ và khu đô thị sinh thái.

Đứng thứ hai là **${top2.name}** (${formatCurrency(top2.priceWithVAT)}).
Còn nếu anh/chị đang tìm bóng đèn hay đèn chiếu sáng gia đình thì mức giá sẽ dao động từ vài chục nghìn đến vài trăm nghìn thôi ạ!`,
      products: sortedAll.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `${p.category} • Công trình dự án cao cấp`,
        image: p.image || "/images/products/image585.png",
      })),
      suggestions: [
        "Bóng đèn đắt tiền nhất trên web đi",
        "Sản phẩm rẻ nhất trên web là gì?",
        "Xem danh sách đèn bán chạy nhất",
      ],
    };
  }

  // --- 1.2: RẺ NHẤT ---
  if (isCheapest) {
    const cheapProducts = validProducts
      .filter((p) => p.priceWithVAT > 10000)
      .sort((a, b) => a.priceWithVAT - b.priceWithVAT);
    const topCheap = cheapProducts[0];

    return {
      text: `Dạ trên website, sản phẩm có **mức giá rẻ và tiết kiệm nhất** là:

🏷️ **${topCheap.name}** - Giá chỉ: **${formatCurrency(topCheap.priceWithVAT)}** (có VAT)
Ngoài ra, các dòng đèn dân dụng phổ thông có giá cực kỳ hợp lý:
• **Bóng LED Bulb tròn 5W - 7W**: chỉ từ 35.000 đ – 50.000 đ.
• **Đèn LED Ốp tường LN12 5W**: chỉ từ 63.000 đ.
• **Đèn âm trần Downlight AT04 5W**: chỉ từ 73.000 đ.

Tất cả đều là hàng chính hãng Rạng Đông 100%, bảo hành 2 năm đổi mới tận nơi ạ!`,
      products: cheapProducts.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Giá tốt nhất • ${formatCurrency(p.priceWithVAT)}`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Xem bảng giá đèn âm trần",
        "Tư vấn số lượng đèn cho phòng 20m²",
        "Chính sách chiết khấu đại lý",
      ],
    };
  }

  // --- 1.3: CÔNG SUẤT LỚN NHẤT / SÁNG NHẤT ---
  if (isMostPowerful) {
    const powerful = validProducts
      .filter((p) => (p.name + " " + p.category).toLowerCase().includes("pha") || (p.name + " " + p.category).toLowerCase().includes("highbay") || (p.name + " " + p.category).toLowerCase().includes("đường"))
      .sort((a, b) => b.priceWithVAT - a.priceWithVAT)
      .slice(0, 3);

    return {
      text: `Dạ nếu anh/chị cần các dòng đèn **công suất lớn nhất, chiếu sáng cực mạnh** cho kho bãi, sân thể thao, công trường hay đường giao thông:
1. **Đèn Chiếu Pha LED Rạng Đông CP06 200W**: Quang thông lên tới gần 20.000 lumens, rọi xa hàng trăm mét, vỏ nhôm đúc IP66 chống nước bão.
2. **Đèn LED Highbay Nhà Xưởng 150W - 200W**: Chuyên dụng treo trần cao từ 6m – 12m cho xưởng sản xuất, ánh sáng bao phủ rộng.
3. **Đèn Chiếu Sáng Đường Phố CSD08 120W - 150W**: Chiếu sáng đại lộ, khu đô thị.

Dưới đây là các model công suất cực đại có sẵn trên web:`,
      products: powerful.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Siêu sáng • ${p.category} • IP66`,
        image: p.image || "/images/products/image847.png",
      })),
      suggestions: [
        "Báo giá đèn pha 200W",
        "Đèn xưởng trần cao 8m dùng loại nào?",
        "Tư vấn đèn chiếu sáng sân bóng",
      ],
    };
  }

  // -------------------------------------------------------------
  // 2. SUITABILITY & ARCHITECTURE (NHÀ TÔI CÓ SỬ DỤNG ĐƯỢC MẪU NÀY KHÔNG?)
  // -------------------------------------------------------------
  const isConcrete = q.includes("bê tông") || q.includes("be tong") || q.includes("trần đúc") || q.includes("không có thạch cao");
  const isGypsum = q.includes("thạch cao") || q.includes("thach cao") || q.includes("trần chìm") || q.includes("trần thả");
  const isSuitabilityCheck =
    q.includes("có dùng được không") ||
    q.includes("có sử dụng được không") ||
    q.includes("lắp được không") ||
    q.includes("dùng được mẫu này không") ||
    q.includes("nhà tôi có dùng được") ||
    q.includes("nhà tôi sử dụng được");

  // CASE: Trần bê tông
  if (isConcrete || (isSuitabilityCheck && (q.includes("bê tông") || !isGypsum && isDownlight))) {
    const opTran = validProducts.filter((p) => (p.category.includes("Ốp") || p.name.includes("LN12")) && p.image).slice(0, 3);
    const tuyp = validProducts.filter((p) => p.name.includes("T8") || p.category.includes("Tuýp")).slice(0, 1);

    return {
      text: `Dạ em xin trả lời trực tiếp cho anh/chị:

❌ **Nếu nhà mình là trần bê tông nguyên khối:** Anh/chị **KHÔNG NÊN sử dụng mẫu đèn âm trần như AT04 hay AT10** ạ!
• **Lý do kỹ thuật**: Đèn âm trần bắt buộc phải khoét lỗ âm vào trần (đường kính lỗ D90mm – D155mm, sâu ít nhất 5-8cm) và cần tai cài lò xo bung ra để giữ đèn. Trần bê tông đặc không thể khoét lỗ này (nếu khoan rút lõi sẽ tốn kém và phạm vào sắt thép kết cấu nhà).

✅ **Giải pháp chuẩn xác 100% cho trần bê tông:**
1. **Đèn LED Ốp trần tràn viền LN12 (hoặc ốp nổi tròn/vuông)**: Bắt vít ốp nổi trực tiếp sát mặt bê tông, bề dày mỏng thẩm mỹ, góc chiếu tràn viền 180 độ rất thoáng phòng.
2. **Bộ đèn Tuýp LED bán nguyệt M16 hoặc Tuýp T8**: Bắt nổi sát trần, cho ánh sáng tỏa rộng toàn diện.
3. **Đèn rọi ray Tracklight**: Bắt thanh ray nổi trần bê tông, các đầu đèn chỉnh hướng góc rọi rất hiện đại.

Dưới đây là các mẫu ốp trần Rạng Đông chính hãng chuyên dụng cho trần bê tông nhà mình ạ:`,
      products: [...opTran, ...tuyp].map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Ốp nổi trần bê tông • Không cần khoét lỗ • ${p.specs?.power || "10W-24W"}`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Xem thông số đèn ốp trần LN12",
        "Phòng khách trần bê tông 20m2 cần mấy đèn?",
        "Tư vấn đèn tuýp bán nguyệt M16",
      ],
    };
  }

  // CASE: Trần thạch cao
  if (isGypsum && (isDownlight || isSuitabilityCheck)) {
    const downlights = validProducts.filter((p) => (p.name.includes("AT04") || p.name.includes("AT10")) && p.image).slice(0, 3);

    return {
      text: `Dạ với **trần thạch cao**, mẫu **Đèn LED Downlight AT04 hoặc AT10 là LỰA CHỌN HOÀN HẢO NHẤT** cho ngôi nhà của anh/chị ạ!

• **Ưu điểm khi lắp trần thạch cao**: Thợ chỉ cần dùng mũi khoét thạch cao D90mm hoặc D110mm cực kỳ nhanh gọn. Đèn có 2 tai cài lò xo bấm khít vào mặt tấm thạch cao, vành nhôm ôm sát mặt trần phẳng phiu sang trọng.
• **Gợi ý công suất**:
  - Trần cao 2.6m – 2.8m: Dùng **AT04 9W (lỗ D90mm)**, khoảng cách 1m – 1.2m giữa 2 bóng.
  - Trần cao trên 3m hoặc phòng rộng: Dùng **AT04 12W (lỗ D110mm)**.
  - Nếu muốn linh hoạt thay đổi màu sắc: Chọn **AT10 đổi 3 màu** (Trắng làm việc - Vàng ấm cúng - Trung tính ban ngày).

Dưới đây là các mẫu Downlight âm trần thạch cao bán chạy nhất đang có sẵn trên hệ thống:`,
      products: downlights.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Khoét lỗ thạch cao • ${p.specs?.power || "9W-10W"} • CRI ≥ 80`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Cách tính số lượng bóng cho phòng 25m²",
        "Nên chọn viền vàng hay viền trắng bạc?",
        "Thêm vào bảng báo giá hợp đồng",
      ],
    };
  }

  // -------------------------------------------------------------
  // 3. CATALOG MODELS SURVEY ("TRONG WEB CÓ NHỮNG MẪU NÀO?")
  // -------------------------------------------------------------
  const isCatalogQuery =
    q.includes("có những mẫu") ||
    q.includes("có mẫu nào") ||
    q.includes("những mẫu nào") ||
    q.includes("những loại nào") ||
    q.includes("trong web có") ||
    q.includes("danh mục có gì");

  if (isCatalogQuery) {
    if (isPanel) {
      const panels = validProducts.filter((p) => (p.name + " " + p.category).toLowerCase().includes("panel")).slice(0, 4);
      return {
        text: `Dạ trên website An Phú Vina hiện có đầy đủ **các dòng đèn LED Panel Rạng Đông** phục vụ trần thả, trần chìm văn phòng và căn hộ:
1. **Panel vuông 600x600mm (P06, P07, 40W - 50W)**: Chuyên dụng cho trần thả thạch cao văn phòng, trường học, bệnh viện. Hiệu suất sáng cao 5900 lm, chống chói UGR < 19.
2. **Panel tròn đổi màu (PT04.BLE 12W - 18W)**: Dành cho biệt thự, căn hộ, đổi màu Bluetooth Mesh theo nhịp sinh học HCL.
3. **Panel chữ nhật 300x1200mm và 600x1200mm**: Lắp đặt phòng họp lớn, hành lang lễ tân tòa nhà.

Em gửi anh/chị bảng giá một số mẫu tiêu biểu có sẵn hình ảnh trên web:`,
        products: panels.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `${p.specs?.dimensions || "600x600mm"} • ${p.specs?.power || "50W"}`,
          image: p.image || "/images/products/image1002.png",
        })),
        suggestions: ["Báo giá số lượng lớn cho văn phòng", "Panel trần thả hay trần chìm?", "Tư vấn lắp đặt trọn gói"],
      };
    }

    if (isDownlight) {
      const downs = validProducts.filter((p) => (p.name + " " + p.category).toLowerCase().includes("downlight")).slice(0, 4);
      return {
        text: `Dạ về **Đèn LED Âm Trần Downlight**, trên web hiện phân phối hơn **61 model** Rạng Đông với các dòng chính:
• **Dòng đơn màu AT04**: Bán chạy số 1 thị trường, bền bỉ, công suất 5W, 7W, 9W, 10W, 12W, 16W, 25W (lỗ khoét D90, D110, D155).
• **Dòng đổi 3 màu AT10**: Bật tắt công tắc đổi 3 màu Trắng - Vàng - Trung tính, có tùy chọn viền vàng hoặc viền trắng bạc sang trọng.
• **Dòng chỉnh hướng xoay góc AT20.BLE**: Điều khiển thông minh qua điện thoại, chỉnh góc rọi điểm tranh ảnh và hốc tường.
• **Dòng cảm biến chuyển động AT04.PIR**: Tự động sáng khi có người, thích hợp hành lang và cầu thang.`,
        products: downs.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Khoét lỗ thạch cao • ${p.specs?.power || "9W-10W"}`,
          image: p.image || "/images/products/image281.png",
        })),
        suggestions: ["Báo giá đèn downlight AT04 90/10W", "Tư vấn khoảng cách lắp đặt giữa các đèn"],
      };
    }

    if (isBulb) {
      const bulbs = validProducts.filter((p) => (p.name + " " + p.category).toLowerCase().includes("bulb")).slice(0, 4);
      return {
        text: `Dạ đối với **Bóng đèn LED Bulb (búp)**, hệ thống hiện có các nhóm mẫu mã:
• **Bóng Bulb tròn phổ thông (A60)**: Công suất 5W, 7W, 9W, 12W, đui xoáy E27 tiêu chuẩn, thay thế trực tiếp bóng sợi đốt cũ.
• **Bóng Bulb trụ công suất cao (TR80, TR100, TR135)**: Công suất lớn 20W, 30W, 40W, 50W, 60W, 80W dùng cho khu bếp, sân vườn, xưởng may.
• **Bóng Bulb thông minh RGB Bluetooth / Wifi (A60.BLE / A60.WF)**: Đổi 16 triệu màu, điều khiển qua điện thoại và giọng nói.`,
        products: bulbs.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Đui xoáy E27 • ${p.specs?.power || "9W-80W"}`,
          image: p.image || "/images/products/image1105.png",
        })),
        suggestions: ["Bóng bulb 9W giá bao nhiêu?", "Bóng đèn nào sáng nhất cho sân vườn?"],
      };
    }

    if (isSmart) {
      const smarts = validProducts.filter((p) => (p.category.includes("Smart") || p.category.includes("Blutooth") || p.name.includes("BLE") || p.name.includes("Wifi"))).slice(0, 4);
      return {
        text: `Hệ sinh thái **Rạng Đông Smart Home (Rallismart)** trên website hiện có hơn **85 thiết bị** thông minh:
1. **Công tắc cảm ứng thông minh**: Mặt kính cường lực chống xước (1-4 nút), công tắc rèm BLE tự động, công tắc cửa cuốn, công tắc chịu tải lớn 3000W cho bình nóng lạnh.
2. **Đèn chiếu sáng thông minh**: Bóng bulb đổi màu RGB, đèn Panel đổi màu HCL, đèn led dây RGB nháy theo nhạc, đèn rọi tranh xoay góc BLE.
3. **Cảm biến & Tiện ích**: Cảm biến chuyển động PIR, ổ cắm thông minh Wifi đơn OC.01.WF đo điện năng tiêu thụ.`,
        products: smarts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Kết nối Bluetooth Mesh / Wifi • Bảo hành 2 năm`,
          image: p.image || "/images/products/image281.png",
        })),
        suggestions: ["Chi phí làm Smart Home cho căn hộ 2 phòng ngủ", "Công tắc cảm ứng có cần đi lại dây không?"],
      };
    }
  }

  // -------------------------------------------------------------
  // 4. DIỆN TÍCH PHÒNG & SỐ LƯỢNG BÓNG (CALCULATOR)
  // -------------------------------------------------------------
  const areaMatch = q.match(/(\d+)\s*(m2|m²|mét|met)/);
  if (areaMatch || q.includes("bao nhiêu bóng") || q.includes("mấy bóng") || q.includes("cần bao nhiêu")) {
    const area = areaMatch ? parseInt(areaMatch[1], 10) : 25;
    const isBedroom = q.includes("ngủ") || q.includes("ngu");
    const lux = isBedroom ? 150 : 300;
    const totalLumens = area * lux;
    const bulbWatts = isBedroom ? 7 : 9;
    const count = Math.ceil(totalLumens / (bulbWatts * 95));

    const recDownlights = validProducts.filter((p) => (p.name.includes("AT04") || p.name.includes("AT10")) && p.image).slice(0, 2);

    return {
      text: `Dạ để chiếu sáng chuẩn cho không gian **${area}m²** (${isBedroom ? "Phòng ngủ" : "Phòng khách / Sinh hoạt chung"}):
• **Độ rọi tiêu chuẩn**: ${lux} Lux theo tiêu chuẩn chiếu sáng dân dụng TCVN.
• **Tổng quang thông cần thiết**: ~${totalLumens.toLocaleString()} lumens.
• **Số lượng bóng khuyến nghị**: Khoảng **${count} đến ${count + 2} bóng LED Downlight ${bulbWatts}W - 10W**.
• **Bố trí lắp đặt**: Nên rải đều theo chu vi trần giật cấp hoặc chia thành 2-3 hàng, khoảng cách giữa 2 bóng từ 1.0m – 1.2m để ánh sáng tỏa đều, không bị chói mắt khi sinh hoạt.

Anh/chị tham khảo 2 mẫu Downlight Rạng Đông phù hợp nhất bên dưới:`,
      products: recDownlights.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Phù hợp phòng ${area}m² • Cần khoảng ${count} bóng`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        `Thêm ${count} bóng vào đơn báo giá`,
        "Tư vấn trần cao 3m nên dùng bóng mấy Oát?",
      ],
    };
  }

  // -------------------------------------------------------------
  // 5. DIRECT PRODUCT SEARCH & SPECIFIC INQUIRIES
  // -------------------------------------------------------------
  const keywords = q
    .split(/\s+/)
    .filter((w) => w.length > 1 && !["cho", "tôi", "mình", "nhà", "này", "cái", "loại", "xem", "hỏi", "được", "không", "trên", "web", "đi", "nào"].includes(w));

  const matched = validProducts.filter((p) => {
    const fullText = (p.name + " " + p.category + " " + JSON.stringify(p.specs || {})).toLowerCase();
    return keywords.every((k) => fullText.includes(k)) || keywords.filter((k) => fullText.includes(k)).length >= 2;
  }).slice(0, 4);

  if (matched.length > 0) {
    const topMatch = matched[0];
    return {
      text: `Dạ em gửi anh/chị thông tin chính xác về mẫu **"${topMatch.name}"** trên website An Phú Vina:
• **Đơn giá có VAT**: **${formatCurrency(topMatch.priceWithVAT)}** (Giá trước VAT: ${formatCurrency(topMatch.priceNoVAT || Math.round(topMatch.priceWithVAT / 1.08))})
• **Thông số kỹ thuật**: Công suất: ${topMatch.specs?.power || "Chuẩn Rạng Đông"} • Kích thước: ${topMatch.specs?.dimensions || "Tiêu chuẩn"} • Ánh sáng: ${topMatch.specs?.cct || "Trắng / Vàng / Đổi màu"}
• **Bảo hành & Giấy tờ**: Bảo hành chính hãng 2 năm, hỗ trợ xuất hóa đơn điện tử VAT 8% và chứng chỉ CO/CQ xuất xưởng công trình.

Anh/chị có thể bấm vào thẻ sản phẩm bên dưới để xem hình ảnh chi tiết hoặc thêm vào đơn báo giá hợp đồng ạ:`,
      products: matched.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `${p.category} • ${formatCurrency(p.priceWithVAT)}`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Thêm sản phẩm này vào báo giá",
        "Có kích thước hoặc công suất khác không?",
        "Chính sách chiết khấu số lượng lớn",
      ],
    };
  }

  // Default intelligent assistant response
  const topSellers = validProducts.filter((p) => [252, 169, 101, 194].includes(p.id));
  return {
    text: `Dạ em là Trợ lý AI Kỹ thuật An Phú Vina. Em có thể giải đáp chi tiết cho anh/chị về:
1. **Hỏi mẫu mã**: *"Bóng đèn đắt tiền nhất trên web là gì?"*, *"Trong web có những mẫu đèn Panel nào?"*
2. **Kiểm tra trần nhà**: *"Nhà tôi trần bê tông có lắp được AT04 không?"*, *"Trần thạch cao phòng khách nên dùng đèn gì?"*
3. **Tính toán số lượng**: *"Phòng ngủ 15m2 / phòng khách 25m2 cần mấy bóng?"*
4. **Báo giá & Hợp đồng**: Đơn giá có VAT 8%, chiết khấu dự án cho hơn 672 sản phẩm Rạng Đông chính hãng.

Anh/chị cần tư vấn khu vực nào trong nhà cứ nhắn em hỗ trợ ngay nhé!`,
    products: topSellers.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.priceWithVAT,
      specs: `${p.category} • Chính hãng Rạng Đông`,
      image: p.image || "/images/products/image281.png",
    })),
    suggestions: [
      "Bóng đèn đắt tiền nhất trên web đi",
      "Trần bê tông có lắp được AT04 không?",
      "Phòng khách 25m2 cần bao nhiêu bóng?",
      "Trong web có những mẫu đèn Panel nào?",
    ],
  };
}
