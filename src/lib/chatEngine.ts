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
 * Intelligent Consultation Engine that dynamically understands:
 * - All 672 products in the catalog
 * - Architectural structures: trần bê tông vs trần thạch cao
 * - Room types & lux standards (phòng khách 300lx, phòng ngủ 150lx, văn phòng 500lx, ngoài trời IP66)
 * - Suitability checks: "nhà tôi có dùng được mẫu X không?"
 * - Catalog model surveys: "trong web có những mẫu nào?"
 */
export function processCustomerQuery(query: string, allProducts: Product[]): BotReply {
  const q = query.toLowerCase().trim();

  // 1. Check if asking about concrete ceiling vs recessed downlight (e.g. "trần bê tông có lắp được AT04 không?")
  const isConcrete = q.includes("bê tông") || q.includes("be tong") || q.includes("không có trần thạch cao") || q.includes("trần đúc");
  const isGypsum = q.includes("thạch cao") || q.includes("thach cao") || q.includes("trần thả") || q.includes("trần chìm");
  const isSuitabilityCheck = q.includes("dùng được không") || q.includes("lắp được không") || q.includes("sử dụng được không") || q.includes("hợp không") || q.includes("có được không");

  // Specific model mentions
  const mentionsAT04 = q.includes("at04") || q.includes("âm trần") || q.includes("am tran") || q.includes("downlight");
  const mentionsPanel = q.includes("panel") || q.includes("p06") || q.includes("600x600");
  const mentionsPha = q.includes("pha") || q.includes("cp06") || q.includes("ngoài trời") || q.includes("chống nước") || q.includes("ip66");
  const mentionsSmart = q.includes("smart") || q.includes("thông minh") || q.includes("wifi") || q.includes("bluetooth") || q.includes("ble") || q.includes("rallismart") || q.includes("công tắc") || q.includes("rèm");
  const mentionsFactory = q.includes("xưởng") || q.includes("nhà xưởng") || q.includes("highbay") || q.includes("kho") || q.includes("tuýp") || q.includes("t8");
  const mentionsCatalogModels = q.includes("có những mẫu") || q.includes("có mẫu nào") || q.includes("những loại nào") || q.includes("danh sách") || q.includes("trong web có") || q.includes("xem mẫu");

  // CASE 1: Trần bê tông suitability check
  if (isConcrete && (mentionsAT04 || isSuitabilityCheck)) {
    const opTran = allProducts.filter((p) => (p.category.includes("Ốp") || p.name.includes("LN12") || p.name.includes("Ốp")) && p.image).slice(0, 3);
    const tuyp = allProducts.filter((p) => p.name.includes("T8") || p.category.includes("Tuýp")).slice(0, 1);
    const recommended = [...opTran, ...tuyp];

    return {
      text: `Chào anh/chị! Về câu hỏi trần bê tông có lắp được đèn không:
❌ **Không nên dùng đèn âm trần (như Downlight AT04, AT10, AT20)** cho trần bê tông nguyên khối, vì các dòng này bắt buộc phải **khoét lỗ trần (D90mm - D155mm)** và cần khoảng trống bên trên để đẩy tai cài lò xo và tản nhiệt. Việc khoan đục bê tông sẽ làm hỏng kết cấu trần và rất tốn chi phí.

✅ **Giải pháp tối ưu nhất cho trần bê tông nhà anh/chị:**
1. **Đèn LED Ốp trần tràn viền (Dòng Rạng Đông LN12 hoặc ốp tròn/vuông)**: Bắt vít ốp nổi trực tiếp lên mặt trần bê tông, chỉ dày 3-4cm, góc chiếu tràn viền 180 độ cực kỳ sang trọng.
2. **Đèn Tuýp LED bán nguyệt M16 hoặc Tuýp T8 nhôm nhựa**: Lắp sát trần chiếu sáng rộng đều cho phòng khách, bếp hoặc ban công.
3. **Đèn rọi ray Tracklight**: Thanh ray bắt nổi trần bê tông, tạo phong cách hiện đại kiểu kiến trúc Studio/Cafe.

Dưới đây là các mẫu ốp trần chính hãng Rạng Đông đang có sẵn trên web phù hợp trực tiếp với trần bê tông nhà mình ạ:`,
      products: recommended.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Ốp nổi trần bê tông • ${p.specs?.power || "10W-24W"} • Bảo hành 2 năm`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Xem chi tiết thông số đèn ốp trần LN12",
        "Tư vấn số lượng đèn cho phòng khách trần bê tông",
        "Báo giá chiết khấu đại lý",
      ],
    };
  }

  // CASE 2: Trần thạch cao suitability check
  if (isGypsum && (mentionsAT04 || isSuitabilityCheck || q.includes("phòng khách") || q.includes("phòng ngủ"))) {
    const downlights = allProducts.filter((p) => (p.name.includes("AT04") || p.name.includes("AT10") || p.category.includes("Downlight")) && p.image).slice(0, 3);
    return {
      text: `Dạ hoàn toàn **RẤT PHÙ HỢP** ạ! Với trần thạch cao (trần chìm hoặc trần giật cấp), đèn LED Downlight âm trần Rạng Đông (AT04, AT10, AT20) là lựa chọn chuẩn nhất hiện nay:
• **Khoét lỗ D90mm (Công suất 7W - 9W)**: Thích hợp cho phòng ngủ, hành lang và phòng khách trần cao 2.6m - 3m. Khoảng cách bố trí giữa 2 bóng từ 1m - 1.2m.
• **Khoét lỗ D110mm (Công suất 9W - 12W)**: Thích hợp cho phòng khách rộng từ 20m² - 40m² cần độ sáng rực rỡ.
• **Chế độ màu**: Anh/chị có thể chọn dòng **AT10 đổi 3 màu** (Trắng làm việc - Vàng ấm thư giãn - Trung tính dịu mắt) chỉ bằng thao tác bật/tắt công tắc tường.

Dưới đây là các mẫu Downlight âm trần thạch cao bán chạy nhất có sẵn giá và thông số trên hệ thống:`,
      products: downlights.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Khoét lỗ thạch cao • ${p.specs?.power || "9W-10W"} • CRI ≥ 80`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Cách tính số lượng bóng cho phòng khách 25m²",
        "Nên dùng viền vàng hay viền bạc?",
        "Thêm sản phẩm vào bảng báo giá",
      ],
    };
  }

  // CASE 3: Hỏi danh mục mẫu mã ("có những mẫu nào", "trong web có mẫu gì")
  if (mentionsCatalogModels) {
    if (mentionsPanel) {
      const panels = allProducts.filter((p) => (p.name.includes("Panel") || p.name.includes("P06") || p.category.includes("Panel")) && p.image).slice(0, 4);
      return {
        text: `Trên website An Phú Vina hiện có đầy đủ **${panels.length > 0 ? "hơn 69 model" : "các model"} đèn LED Panel Rạng Đông** cho cả trần thả, trần chìm và ốp nổi:
1. **Panel vuông 600x600mm (P06, P07, 40W - 50W)**: Tiêu chuẩn văn phòng, phòng họp, trường học, hiệu suất sáng 5500 - 5900 lm, chống chói UGR < 19.
2. **Panel tròn đổi màu (PT04.BLE 12W - 18W)**: Dành cho căn hộ cao cấp, điều khiển Bluetooth Mesh đổi màu ánh sáng.
3. **Panel chữ nhật 300x1200mm và 600x1200mm**: Lắp đặt hành lang dài, sảnh lễ tân hoặc bàn làm việc văn phòng.

Em gửi anh/chị các mẫu Panel tiêu biểu kèm giá có VAT đang niêm yết trực tiếp trên web:`,
        products: panels.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `${p.specs?.dimensions || "600x600mm"} • ${p.specs?.power || "50W"} • ${p.specs?.lumen || "5900 lm"}`,
          image: p.image || "/images/products/image1002.png",
        })),
        suggestions: ["Báo giá số lượng lớn cho văn phòng", "Panel trần thả hay trần chìm?", "Tư vấn lắp đặt trọn gói"],
      };
    }

    if (mentionsPha) {
      const phas = allProducts.filter((p) => (p.name.includes("CP06") || p.category.includes("Pha")) && p.image).slice(0, 4);
      return {
        text: `Dạ trên web hiện đang phân phối trọn bộ **Đèn LED Chiếu Pha Rạng Đông CP06 chống nước IP66** từ công suất nhỏ đến công suất lớn công trình:
• **Công suất dân dụng**: CP06 10W (147.000đ), CP06 20W (202.000đ), CP06 30W (235.000đ), CP06 50W (340.000đ).
• **Công suất dự án & công trường**: CP06 70W (703.000đ), CP06 100W (976.000đ), CP06 150W (1.380.000đ), CP06 200W (2.176.000đ).
Tất cả đều sử dụng vỏ nhôm đúc tản nhiệt chống oxy hóa, kính cường lực chịu va đập và van thở chống đọng sương đạt chuẩn IP66 chiếu sáng ngoài trời bền bỉ.`,
        products: phas.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Chống nước mưa IP66 • ${p.specs?.power || "50W-100W"} • Bảo hành 2 năm`,
          image: p.image || "/images/products/image847.png",
        })),
        suggestions: ["Đèn pha 50W rọi xa được bao nhiêu mét?", "Có đèn pha năng lượng mặt trời không?", "Nhận báo giá dự án"],
      };
    }

    if (mentionsSmart) {
      const smarts = allProducts.filter((p) => (p.category.includes("Smart") || p.category.includes("Blutooth") || p.name.includes("Smart") || p.name.includes("BLE") || p.name.includes("Wifi")) && p.image).slice(0, 4);
      return {
        text: `Hệ sinh thái **Rạng Đông Smart Home & IoT (Rallismart)** trên website hiện có hơn **85 sản phẩm** phân theo các nhóm thiết bị:
1. **Thiết bị điều khiển**: Công tắc cảm ứng thông minh mặt kính cường lực (1-4 nút), công tắc rèm BLE, công tắc cửa cuốn, công tắc chịu tải cao 3000W cho bình nóng lạnh.
2. **Chiếu sáng thông minh**: Bóng LED bulb RGB đổi màu 16 triệu sắc thái, đèn âm trần xoay góc AT20.BLE, đèn LED dây RGB nháy theo nhạc, đèn Tracklight thông minh.
3. **Cảm biến & Phụ kiện**: Cảm biến chuyển động PIR, cảm biến cửa sổ, ổ cắm thông minh Wifi đơn OC.01.WF đo điện năng tiêu thụ.`,
        products: smarts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.priceWithVAT,
          specs: `Kết nối Bluetooth Mesh / Wifi • ${p.specs?.power || "Thông minh"}`,
          image: p.image || "/images/products/image281.png",
        })),
        suggestions: ["Chi phí làm Smart Home cho căn hộ 2 phòng ngủ", "Công tắc cảm ứng có cần đi lại dây không?", "Tư vấn điều khiển giọng nói tiếng Việt"],
      };
    }

    // Default models listing across categories
    const highlights = allProducts.filter((p) => [252, 169, 206, 194].includes(p.id));
    return {
      text: `Website An Phú Vina hiện phân phối tổng cộng **672+ model thiết bị chiếu sáng Rạng Đông chính hãng**, bao gồm 38 danh mục chuyên biệt:
• **Đèn LED Downlight âm trần**: 61 model (AT04, AT10, AT20, đổi 3 màu, cảm biến PIR...)
• **Đèn LED Panel văn phòng**: 69 model (P06 600x600, 300x1200, 600x1200, Panel tròn...)
• **Hệ Smart Home & IoT Rallismart**: 85 model (Công tắc cảm ứng, bóng RGB, rèm, ổ cắm...)
• **Đèn Chiếu Pha ngoài trời IP66**: 35 model (CP06 từ 10W đến 200W)
• **Đèn Chiếu sáng đường & đô thị**: 43 model (CSD08, CSD02 chuyên dự án)
• **Đèn Tuýp & Máng LED nhà xưởng**: 47 model (T8 nhôm nhựa, bán nguyệt M16, Highbay...)

Anh/chị cần xem chi tiết nhóm sản phẩm nào cứ nhắn em tra cứu và gửi báo giá chính xác ngay nhé!`,
      products: highlights.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `${p.category} • Chính hãng Rạng Đông`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: ["Xem các mẫu đèn âm trần Downlight", "Xem đèn LED Panel văn phòng", "Xem thiết bị Smart Home", "Xem đèn pha chống nước IP66"],
    };
  }

  // CASE 4: Tính toán số lượng bóng theo diện tích phòng (e.g. "phòng khách 25m2", "phòng 20m2", "bao nhiêu bóng")
  const areaMatch = q.match(/(\d+)\s*(m2|m²|mét vuông|met vuong)/);
  if (areaMatch || q.includes("bao nhiêu bóng") || q.includes("bao nhiêu đèn") || q.includes("mấy bóng")) {
    const area = areaMatch ? parseInt(areaMatch[1], 10) : 25;
    const isBedroom = q.includes("ngủ") || q.includes("ngu");
    const requiredLux = isBedroom ? 150 : 300; // Lux standard
    const totalLumens = area * requiredLux;
    const bulbWatts = isBedroom ? 7 : 9;
    const bulbLumens = bulbWatts * 90; // ~90 lm/W
    const count = Math.ceil(totalLumens / bulbLumens);

    const targetDownlights = allProducts.filter((p) => (p.name.includes("AT04") || p.name.includes("AT10")) && p.image).slice(0, 2);

    return {
      text: `Dạ theo Tiêu chuẩn chiếu sáng Việt Nam TCVN 7114:2008 cho ${isBedroom ? "phòng ngủ" : "phòng khách"} diện tích khoảng **${area}m²**:
• **Độ rọi tiêu chuẩn**: ${requiredLux} Lux (tổng quang thông cần thiết: ~${totalLumens.toLocaleString()} lumens).
• **Khuyến nghị công suất**: Sử dụng bóng LED Downlight âm trần **${bulbWatts}W - 10W** (quang thông ~${bulbLumens} lm/bóng).
• **Số lượng bóng cần lắp**: Khoảng **${count} đến ${count + 2} bóng**, bố trí khoảng cách đều từ 1.0m – 1.2m quanh trần giật cấp để ánh sáng tỏa đều, không bị góc tối.

Nếu phòng khách kết hợp xem phim, anh/chị nên chọn loại **đổi 3 màu AT10** hoặc **bóng thông minh Smart BLE** để có thể giảm độ sáng và chuyển sang ánh sáng vàng ấm cúng vào buổi tối:`,
      products: targetDownlights.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `Phù hợp phòng ${area}m² • Cần ~${count} bóng • 1000 lm`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        `Thêm ${count} bóng vào đơn báo giá`,
        "Tư vấn khoảng cách khoét lỗ trần thạch cao",
        "Xem mẫu công tắc cảm ứng đổi màu",
      ],
    };
  }

  // CASE 5: Tìm kiếm trực tiếp sản phẩm bất kỳ theo từ khóa trong tên & danh mục
  const keywords = q.split(/\s+/).filter((w) => w.length > 1 && !["cho", "tôi", "mình", "nhà", "này", "cái", "loại", "xem", "hỏi", "được", "không"].includes(w));
  const matched = allProducts.filter((p) => {
    const text = (p.name + " " + p.category + " " + JSON.stringify(p.specs || {})).toLowerCase();
    return keywords.some((k) => text.includes(k));
  }).slice(0, 4);

  if (matched.length > 0) {
    const first = matched[0];
    return {
      text: `Dạ em đã tra cứu thấy trên hệ thống có **${matched.length} model** phù hợp với yêu cầu của anh/chị:
Mẫu tiêu biểu nhất là **"${first.name}"** (${formatCurrency(first.priceWithVAT)} có VAT):
• **Công suất / Kích thước**: ${first.specs?.power || "Chuẩn Rạng Đông"} • ${first.specs?.dimensions || "Kích thước tiêu chuẩn"}
• **Ánh sáng & Cấp bảo vệ**: ${first.specs?.cct || "Trắng / Vàng"} • ${first.specs?.ipRating || "Chính hãng Rạng Đông"}
• **Chính sách**: Bảo hành 2 năm đổi mới, có sẵn hàng số lượng lớn và hỗ trợ xuất hóa đơn VAT điện tử.

Anh/chị có thể bấm trực tiếp vào thẻ sản phẩm bên dưới để xem thông số kỹ thuật chi tiết hoặc thêm vào đơn báo giá ạ:`,
      products: matched.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceWithVAT,
        specs: `${p.specs?.power || p.category} • ${formatCurrency(p.priceWithVAT)}`,
        image: p.image || "/images/products/image281.png",
      })),
      suggestions: [
        "Xem chi tiết sản phẩm này",
        "Có kích thước hoặc công suất khác không?",
        "Tư vấn thêm vào báo giá hợp đồng",
      ],
    };
  }

  // Fallback: General polite consultant response
  const generalBest = allProducts.filter((p) => [252, 102, 169].includes(p.id));
  return {
    text: `Dạ em là Trợ lý kỹ thuật An Phú Vina. Em có thể tư vấn chi tiết cho anh/chị về:
1. **Kiểm tra tính phù hợp của trần**: Trần thạch cao, trần bê tông, trần nhôm, trần gỗ nên lắp loại đèn nào.
2. **Tính toán số lượng bóng**: Theo diện tích phòng ngủ, phòng khách, bếp, văn phòng, nhà xưởng.
3. **Giải pháp Smart Home**: Công tắc cảm ứng, điều khiển rèm, đổi màu RGB qua điện thoại.
4. **Báo giá & Chiết khấu**: Bảng giá đại lý cho hơn 672+ thiết bị Rạng Đông chính hãng.

Anh/chị có thể đặt câu hỏi cụ thể (ví dụ: *"Trần bê tông có lắp được AT04 không?"* hoặc *"Phòng khách 25m2 cần bao nhiêu bóng?"*) để em tính toán ngay nhé!`,
    products: generalBest.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.priceWithVAT,
      specs: `${p.category} • Chính hãng Rạng Đông`,
      image: p.image || "/images/products/image281.png",
    })),
    suggestions: [
      "Trần bê tông có lắp được đèn âm trần không?",
      "Phòng khách 25m2 cần bao nhiêu bóng?",
      "Trong web có những mẫu đèn Panel nào?",
      "Tư vấn giải pháp Smart Home Rạng Đông",
    ],
  };
}
