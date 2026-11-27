import fs from "node:fs";
import path from "node:path";

for (const rawLine of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const index = line.indexOf("=");
  if (index < 0) continue;
  const key = line.slice(0, index).trim();
  let value = line.slice(index + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  if (!process.env[key]) process.env[key] = value;
}

const baseUrl = process.argv[2] || "http://localhost:3101";
const orderCode = process.argv[3];
const orderPhone = process.argv[4];
const dealerPhone = process.argv[5];
const productId = Number(process.argv[6]);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!orderCode || !orderPhone || !dealerPhone || !Number.isInteger(productId)) throw new Error("Thiếu tham số kiểm thử.");
if (!supabaseUrl || !anonKey || !serviceKey || !adminEmail) throw new Error("Thiếu biến môi trường Supabase/admin.");

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status}: ${data.error_description || data.msg || data.error || data.message || "Request failed"}`);
  return data;
}

const link = await jsonFetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
  method: "POST",
  headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({ type: "magiclink", email: adminEmail }),
});
const tokenHash = link.properties?.hashed_token || link.hashed_token;
if (!tokenHash) throw new Error("Supabase không trả hashed_token cho admin.");

const session = await jsonFetch(`${supabaseUrl}/auth/v1/verify`, {
  method: "POST",
  headers: { apikey: anonKey, "Content-Type": "application/json" },
  body: JSON.stringify({ type: "magiclink", token_hash: tokenHash }),
});

const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
const cookieName = `sb-${projectRef}-auth-token`;
const encoded = `base64-${Buffer.from(JSON.stringify(session), "utf8").toString("base64url")}`;
const chunks = [];
for (let index = 0; index < encoded.length; index += 3180) chunks.push(`${cookieName}.${index / 3180}=${encoded.slice(index, index + 3180)}`);
const cookie = chunks.length === 1 ? `${cookieName}=${encoded}` : chunks.join("; ");
const adminHeaders = { Cookie: cookie };

const [stats, orders, dealers, adminProducts] = await Promise.all([
  jsonFetch(`${baseUrl}/api/admin/stats`, { headers: adminHeaders }),
  jsonFetch(`${baseUrl}/api/admin/orders?status=all`, { headers: adminHeaders }),
  jsonFetch(`${baseUrl}/api/admin/dealers`, { headers: adminHeaders }),
  jsonFetch(`${baseUrl}/api/admin/products`, { headers: adminHeaders }),
]);

const orderFound = orders.find((order) => order.order_code === orderCode && order.customer_phone === orderPhone);
const dealerFound = dealers.find((dealer) => dealer.phone === dealerPhone);
const originalProduct = adminProducts.find((product) => product.id === productId);
if (!orderFound || !dealerFound || !originalProduct) throw new Error("Không tìm thấy đủ dữ liệu kiểm thử trong admin.");

const originalPrice = originalProduct.priceWithVAT;
const testPrice = originalPrice + 1080;
await jsonFetch(`${baseUrl}/api/admin/products/${productId}`, {
  method: "PATCH",
  headers: { ...adminHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ priceWithVAT: testPrice, priceStatus: "available" }),
});
const storefrontChanged = await jsonFetch(`${baseUrl}/api/products`);
const changedPrice = storefrontChanged.find((product) => product.id === productId)?.priceWithVAT;

await jsonFetch(`${baseUrl}/api/admin/products/${productId}`, {
  method: "PATCH",
  headers: { ...adminHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ priceWithVAT: originalPrice, priceStatus: "available" }),
});
const storefrontRestored = await jsonFetch(`${baseUrl}/api/products`);
const restoredPrice = storefrontRestored.find((product) => product.id === productId)?.priceWithVAT;

console.log(JSON.stringify({
  adminAuthenticated: true,
  dashboard: { products: stats.products, orders: stats.orders, dealers: stats.dealers },
  orderVisibleInAdmin: Boolean(orderFound),
  dealerVisibleInAdmin: Boolean(dealerFound),
  priceTest: { productId, originalPrice, testPrice, changedPrice, restoredPrice, passed: changedPrice === testPrice && restoredPrice === originalPrice },
}, null, 2));
