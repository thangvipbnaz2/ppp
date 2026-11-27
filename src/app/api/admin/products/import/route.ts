import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { resolveCategoryGroup, slugifyVietnamese } from "@/lib/catalog";
import type { NormalizedImportRow } from "@/lib/import-products";
import { removeColorSuffix } from "@/lib/import-products";
import { getCategoriesFull } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const STOP_WORDS = new Set([
  "den",
  "led",
  "rang",
  "dong",
  "kingled",
  "ledvance",
  "chinh",
  "hang",
  "dien",
  "chieu",
  "sang",
  "am",
  "tran",
  "downlight",
  "bulb",
  "panel",
  "tuyp",
  "op",
  "pha",
  "nha",
  "xuong",
  "highbay",
  "ufo",
  "smart",
  "wifi",
  "bluetooth",
  "thong",
  "minh",
  "loai",
  "bo",
  "cai",
  "vien",
  "nang",
  "luong",
  "mat",
  "troi",
  "chong",
  "gan",
  "tuong",
  "roi",
  "ray",
  "trang",
  "tri",
  "day",
  "tha",
  "khan",
  "cap",
  "exit",
  "pccc",
  "san",
  "vuon",
  "canh",
  "quan",
  "hoc",
  "duong",
]);

function normalizeKey(value: string): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value: string): Set<string> {
  return new Set(
    normalizeKey(value)
      .split(" ")
      .filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
  );
}

function tokenScore(a: string, b: string): number {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  return intersection / Math.min(left.size, right.size);
}

function extractCodes(value: string): string[] {
  const codes = String(value ?? "")
    .toUpperCase()
    .match(/[A-Z]{1,4}\d+[A-Z0-9.]*/g);
  return (codes ?? []).filter((code) => code.length >= 3 && code !== "LED");
}

function extractNumbers(value: string): string[] {
  const withoutCodes = String(value ?? "").replace(
    /[A-Z]{1,4}\d+[A-Z0-9.]*/gi,
    " ",
  );
  return (withoutCodes.match(/\d+(?:[.,/]\d+)?/g) ?? []).map((item) =>
    item.replace(",", "."),
  );
}

interface ProductLookup {
  id: number;
  name: string;
}

function findMatches(
  row: NormalizedImportRow,
  products: ProductLookup[],
): ProductLookup[] {
  const rowKey = normalizeKey(row.name);
  const rowBase = normalizeKey(row.baseName);
  const rowCodes = extractCodes(row.baseName);
  const rowNumbers = extractNumbers(row.baseName);

  const exact = products.filter(
    (product) =>
      normalizeKey(product.name) === rowKey ||
      normalizeKey(removeColorSuffix(product.name)) === rowBase,
  );
  if (exact.length > 0) return exact;

  if (rowCodes.length > 0) {
    const codeMatches = products.filter((product) => {
      const productCodes = extractCodes(product.name);
      if (!rowCodes.some((code) => productCodes.includes(code))) return false;
      const productNumbers = extractNumbers(product.name);
      return rowNumbers.some((number) => productNumbers.includes(number));
    });
    if (codeMatches.length > 0) return codeMatches;
  }

  let bestScore = 0;
  let best: ProductLookup[] = [];
  for (const product of products) {
    const score = tokenScore(row.baseName, product.name);
    if (score < 0.75) continue;
    if (score > bestScore) {
      bestScore = score;
      best = [product];
    } else if (score === bestScore) {
      best.push(product);
    }
  }
  return best;
}

function toJsonNumber(value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }
  return Math.round(value);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  let body: { rows?: NormalizedImportRow[]; updateOnly?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu import không hợp lệ." },
      { status: 400 },
    );
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  const updateOnly = body.updateOnly !== false;
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Không có dòng dữ liệu nào để import." },
      { status: 400 },
    );
  }
  if (rows.length > 3000) {
    return NextResponse.json(
      { error: "Tối đa 3000 dòng mỗi lần import." },
      { status: 400 },
    );
  }

  const { data: dbProducts, error: productsError } = await supabase
    .from("products")
    .select("id, name");

  if (productsError) {
    return NextResponse.json(
      { error: "Không đọc được danh sách sản phẩm: " + productsError.message },
      { status: 500 },
    );
  }

  const products = (dbProducts ?? []) as ProductLookup[];
  const categories = await getCategoriesFull();
  const categoryByKey = new Map<string, number>();
  for (const category of categories) {
    if (category.id) {
      categoryByKey.set(normalizeKey(category.slug), category.id);
      categoryByKey.set(normalizeKey(category.name), category.id);
    }
  }

  const updates: Record<string, unknown>[] = [];
  const inserts: Record<string, unknown>[] = [];
  const errors: string[] = [];
  const updatedIds = new Set<number>();
  let skipped = 0;

  for (const [index, row] of rows.entries()) {
    const name = String(row.name ?? "").trim();
    if (!name) {
      skipped += 1;
      continue;
    }

    const group = resolveCategoryGroup(row.category, name);
    const categoryId =
      (row.category && categoryByKey.get(normalizeKey(row.category))) ||
      categoryByKey.get(normalizeKey(group.slug)) ||
      categoryByKey.get(normalizeKey(group.name)) ||
      null;

    const priceWithVAT = toJsonNumber(row.priceWithVAT);
    const isContact =
      row.priceStatus === "contact" || !priceWithVAT || priceWithVAT <= 0;
    const priceNoVAT = isContact ? null : toJsonNumber(row.priceNoVAT);
    const retailPrice = isContact ? null : toJsonNumber(row.retailPrice);
    const regularPrice =
      isContact ? null : toJsonNumber(row.regularPrice) ?? retailPrice;

    const matches = findMatches(row, products);
    if (matches.length > 0) {
      for (const match of matches) {
        if (updatedIds.has(match.id)) continue;
        updatedIds.add(match.id);
        updates.push({
          id: match.id,
          price_no_vat: priceNoVAT,
          price_with_vat: isContact ? null : priceWithVAT,
          retail_price: retailPrice,
          regular_price: regularPrice,
          vat_rate: row.vatRate ?? 0.08,
          price_status: isContact ? "contact" : "available",
          stock_status:
            row.stockStatus === "outofstock" ? "outofstock" : "instock",
          category_id: categoryId,
          brand: row.brand ?? null,
          image: row.image ?? null,
        });
      }
      continue;
    }

    if (updateOnly) {
      skipped += 1;
      if (errors.length < 30) {
        errors.push(`Không khớp sản phẩm: ${name}`);
      }
      continue;
    }

    inserts.push({
      name,
      slug: `${slugifyVietnamese(name)}-${Date.now().toString(36)}-${index}`,
      category_id: categoryId,
      category_original: row.category ?? group.name,
      brand: row.brand ?? null,
      price_no_vat: priceNoVAT,
      price_with_vat: isContact ? null : priceWithVAT,
      retail_price: retailPrice,
      regular_price: regularPrice,
      vat_rate: row.vatRate ?? 0.08,
      price_status: isContact ? "contact" : "available",
      stock_status:
        row.stockStatus === "outofstock" ? "outofstock" : "instock",
      support_amount: isContact ? null : toJsonNumber(row.supportAmount),
      support_mechanism: row.supportMechanism ?? null,
      gift_support: row.giftSupport ?? null,
      image: row.image ?? null,
      images: [],
      installation_images: [],
      highlights: [],
      applications: [],
      specs: {},
      specs_table: [],
      attributes: row.attributes ?? [],
      short_description: null,
      description: row.description ?? null,
      source: "import",
      is_active: true,
      is_featured: false,
    });
  }

  let updated = 0;
  if (updates.length > 0) {
    const { data: updatedCount, error: rpcError } = await supabase.rpc(
      "import_product_prices",
      { rows: updates },
    );

    if (!rpcError) {
      updated = Number(updatedCount) || updates.length;
    } else {
      console.warn(
        "RPC import_product_prices lỗi, chuyển sang cập nhật từng dòng:",
        rpcError.message,
      );
      for (const update of updates) {
        const { id, ...fields } = update;
        const { error } = await supabase
          .from("products")
          .update(fields)
          .eq("id", id);
        if (!error) updated += 1;
      }
    }
  }

  let created = 0;
  if (inserts.length > 0) {
    const chunkSize = 100;
    for (let index = 0; index < inserts.length; index += chunkSize) {
      const chunk = inserts.slice(index, index + chunkSize);
      const { error } = await supabase.from("products").insert(chunk);
      if (error) {
        errors.push(`Lỗi tạo sản phẩm mới: ${error.message}`);
        break;
      }
      created += chunk.length;
    }
  }

  return NextResponse.json({
    updated,
    created,
    skipped,
    total: rows.length,
    errors,
  });
}
