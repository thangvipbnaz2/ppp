import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvFile(fileName) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: class ServerOnlyWebSocketTransport {} },
});

const groups = JSON.parse(
  fs.readFileSync(path.join(root, "src", "data", "category-groups.json"), "utf8"),
);
const rawProducts = JSON.parse(
  fs.readFileSync(path.join(root, "public", "data", "products.json"), "utf8"),
);

const EXCLUDED_PRODUCT_IDS = new Set([289, 291, 670, 671, 672]);
const NON_ELECTRICAL_PATTERN =
  /bình nước|bình giữ nhiệt|phích|ruột phích|ly giữ nhiệt|ca giữ nhiệt/i;
const CONTACT_DEFAULT_PRICE = 150000;
const FEATURED_IDS = new Set([
  252, 169, 206, 194, 231, 175, 192, 115, 102, 103, 85, 86, 98, 563, 96, 254,
]);

function fixBlutoothText(value) {
  return String(value).replace(/blutooth/gi, "Bluetooth");
}

function deepFix(value) {
  if (typeof value === "string") return fixBlutoothText(value);
  if (Array.isArray(value)) return value.map((item) => deepFix(item));
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      result[fixBlutoothText(key)] = deepFix(item);
    }
    return result;
  }
  return value;
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const groupByCategory = new Map();
for (const group of groups) {
  for (const category of group.categories) {
    groupByCategory.set(category, group);
  }
}
const groupBySlug = new Map(groups.map((group) => [group.slug, group]));
const defaultGroup = groupBySlug.get("thiet-bi-dien-khac");

function resolveGroup(originalCategory, productName) {
  const category = fixBlutoothText(originalCategory ?? "");
  const direct = groupByCategory.get(category);
  if (direct) {
    if (direct.slug !== "thiet-bi-dien-khac") return direct;
    return resolveSpecialGroup(productName);
  }
  return resolveSpecialGroup(productName);
}

function resolveSpecialGroup(name) {
  const text = String(name ?? "");
  if (
    /cảm biến|công tắc|ổ cắm|wifi|wi-fi|\bble\b|bluetooth|thông minh|smart|điều khiển/i.test(
      text,
    )
  ) {
    return groupBySlug.get("smart-home") ?? defaultGroup;
  }
  if (/gắn tường|ốp tường|chiếu gương|gương/i.test(text)) {
    return groupBySlug.get("den-led-gan-tuong") ?? defaultGroup;
  }
  if (/thả trần|thả/i.test(text)) {
    return groupBySlug.get("den-led-trang-tri") ?? defaultGroup;
  }
  return defaultGroup;
}

function toJsonArray(value) {
  return Array.isArray(value) ? value : [];
}

function toJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

async function main() {
  console.log("Đang kiểm tra bảng categories...");
  const { data: dbCategories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug");
  if (categoriesError) {
    console.error(
      "Không đọc được bảng categories. Hãy chạy supabase/schema.sql trong SQL Editor trước.",
    );
    console.error(categoriesError.message);
    process.exit(1);
  }

  const categoryIdBySlug = new Map(
    (dbCategories ?? []).map((category) => [category.slug, category.id]),
  );

  const excluded = [];
  const seenIds = new Set();
  const rows = [];

  for (const raw of rawProducts) {
    if (EXCLUDED_PRODUCT_IDS.has(raw.id)) {
      excluded.push(`${raw.id} (danh sách loại trừ)`);
      continue;
    }
    if (NON_ELECTRICAL_PATTERN.test(raw.name ?? "")) {
      excluded.push(`${raw.id} (không phải thiết bị điện)`);
      continue;
    }
    if (seenIds.has(raw.id)) {
      excluded.push(`${raw.id} (trùng id)`);
      continue;
    }
    seenIds.add(raw.id);

    const product = deepFix(raw);
    const group = resolveGroup(product.category, product.name);
    const categoryId = categoryIdBySlug.get(group.slug) ?? null;
    const isDefaultPrice =
      !product.priceWithVAT ||
      product.priceWithVAT <= 0 ||
      product.priceWithVAT === CONTACT_DEFAULT_PRICE;
    const isContact = isDefaultPrice;
    const regularPrice = product.regularPrice || product.retailPrice || null;

    rows.push({
      id: product.id,
      name: product.name,
      slug: `${slugify(product.slug || product.name)}-${product.id}`,
      category_id: categoryId,
      category_original: product.category,
      brand: product.brand ?? null,
      price_no_vat: isContact ? null : product.priceNoVAT ?? null,
      price_with_vat: isContact ? null : product.priceWithVAT ?? null,
      retail_price: isContact ? null : product.retailPrice ?? null,
      regular_price: isContact ? null : regularPrice,
      vat_rate: product.vatRate ?? 0.08,
      price_status: isContact ? "contact" : "available",
      stock_status: product.stockStatus === "outofstock" ? "outofstock" : "instock",
      support_amount: isContact ? null : product.supportAmount ?? null,
      support_mechanism: product.supportMechanism ?? null,
      gift_support: product.giftSupport ?? null,
      image: product.image ?? null,
      images: toJsonArray(product.images),
      installation_images: toJsonArray(product.installationImages),
      highlights: toJsonArray(product.highlights),
      applications: toJsonArray(product.applications),
      specs: toJsonObject(product.specs),
      specs_table: toJsonArray(product.specsTable),
      attributes: toJsonArray(product.attributes),
      short_description: product.shortDescription ?? null,
      description: product.description ?? null,
      source: product.source ?? null,
      is_active: true,
      is_featured: FEATURED_IDS.has(product.id),
    });
  }

  const contactCount = rows.filter((row) => row.price_status === "contact").length;
  console.log(
    `Chuẩn bị ${rows.length} sản phẩm (${contactCount} sản phẩm "Liên hệ", ${
      rows.length - contactCount
    } sản phẩm có giá).`,
  );
  console.log(`Loại bỏ: ${excluded.join(", ") || "không có"}`);

  if (EXCLUDED_PRODUCT_IDS.size > 0) {
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .in("id", [...EXCLUDED_PRODUCT_IDS]);
    if (deleteError) {
      console.warn("Không xóa được sản phẩm loại trừ:", deleteError.message);
    }
  }

  const chunkSize = 100;
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    const { error } = await supabase
      .from("products")
      .upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error(
        `Lỗi upsert sản phẩm nhóm ${index + 1}-${index + chunk.length}:`,
        error.message,
      );
      process.exit(1);
    }
    console.log(`Đã upsert ${index + chunk.length}/${rows.length} sản phẩm`);
  }

  const { error: sequenceError } = await supabase.rpc("reset_products_id_seq");
  if (sequenceError) {
    console.warn(
      "Không reset được sequence products.id:",
      sequenceError.message,
    );
  } else {
    console.log("Đã reset sequence products.id.");
  }

  const newsSeed = JSON.parse(
    fs.readFileSync(path.join(root, "src", "data", "news-seed.json"), "utf8"),
  );
  for (const post of newsSeed) {
    const { error } = await supabase.from("news_posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        category: post.category,
        summary: post.summary,
        image: post.image,
        read_time: post.readTime,
        highlights: post.highlights ?? [],
        sections: post.sections ?? [],
        published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) {
      console.warn(`Không seed được tin "${post.title}":`, error.message);
    }
  }
  console.log(`Đã seed ${newsSeed.length} tin tức.`);

  const { error: settingsError } = await supabase.from("settings").upsert(
    [
      { key: "hotline", value: "0827955888" },
      { key: "shipping_fee", value: 30000 },
      { key: "free_ship_threshold", value: 1000000 },
      {
        key: "bank_info",
        value: {
          bank: "BIDV",
          branch: "",
          account_number: "",
          account_name: "CONG TY TNHH MTV TM THIET BI DIEN AN PHU VINA",
        },
      },
    ],
    { onConflict: "key", ignoreDuplicates: true },
  );
  if (settingsError) {
    console.warn("Không seed được settings:", settingsError.message);
  } else {
    console.log("Đã kiểm tra settings mặc định.");
  }

  const groupCounts = new Map();
  for (const row of rows) {
    const group = groups.find((item) => categoryIdBySlug.get(item.slug) === row.category_id);
    const name = group?.name ?? "Chưa phân nhóm";
    groupCounts.set(name, (groupCounts.get(name) ?? 0) + 1);
  }
  console.log("\nPhân bố theo 17 nhóm:");
  for (const group of groups) {
    console.log(`- ${group.name}: ${groupCounts.get(group.name) ?? 0}`);
  }

  if (process.argv.includes("--create-admin")) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.warn(
        "\nBỏ qua tạo admin: cần ADMIN_EMAIL và ADMIN_PASSWORD trong .env.local.",
      );
    } else {
      const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) {
        if (/already|registered|exists/i.test(error.message)) {
          console.log(`\nTài khoản admin ${email} đã tồn tại.`);
        } else {
          console.error("\nKhông tạo được admin:", error.message);
        }
      } else {
        console.log(`\nĐã tạo tài khoản admin ${email}.`);
      }
    }
  }

  console.log("\nHoàn tất migrate.");
}

main().catch((error) => {
  console.error("Migrate thất bại:", error);
  process.exit(1);
});
