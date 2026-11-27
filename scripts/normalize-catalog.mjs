import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "public", "data", "products.json");
const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

function fixText(value) {
  if (typeof value === "string") {
    return value.replace(/blutooth/gi, "Bluetooth").replaceAll("Gía", "Giá");
  }
  if (Array.isArray(value)) return value.map(fixText);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [fixText(key), fixText(item)]));
  }
  return value;
}

let contactCount = 0;
const normalized = products.map((raw) => {
  const product = fixText(raw);
  if (Number(product.priceWithVAT) !== 150000) return product;
  contactCount += 1;
  return {
    ...product,
    priceNoVAT: 0,
    priceWithVAT: 0,
    retailPrice: 0,
    regularPrice: 0,
    salePrice: 0,
    finalPrice: 0,
    supportAmount: 0,
    priceStatus: "contact",
  };
});

fs.writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
console.log(`Đã chuẩn hóa ${normalized.length} sản phẩm; chuyển ${contactCount} giá mặc định 150.000đ thành Liên hệ.`);
