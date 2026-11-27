import { isNonElectricalProduct } from "./catalog";

export interface NormalizedImportRow {
  name: string;
  baseName: string;
  category?: string;
  brand?: string;
  priceNoVAT?: number | null;
  priceWithVAT?: number | null;
  retailPrice?: number | null;
  regularPrice?: number | null;
  vatRate?: number | null;
  priceStatus?: "available" | "contact";
  stockStatus?: "instock" | "outofstock";
  supportAmount?: number | null;
  supportMechanism?: string;
  giftSupport?: string;
  image?: string;
  description?: string;
  attributes?: { name: string; options: string[] }[];
}

export interface ImportNormalizeResult {
  rows: NormalizedImportRow[];
  errors: string[];
  rawCount: number;
}

export function normalizeText(value: unknown): string {
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

function pick(row: Record<string, unknown>, aliases: string[]): unknown {
  const normalized = new Map<string, unknown>();
  for (const [key, value] of Object.entries(row)) {
    normalized.set(normalizeText(key), value);
  }
  for (const alias of aliases) {
    const key = normalizeText(alias);
    if (normalized.has(key)) {
      const value = normalized.get(key);
      if (value !== "" && value !== null && value !== undefined) return value;
    }
  }
  for (const [key, value] of normalized) {
    if (aliases.some((alias) => key.includes(normalizeText(alias)))) {
      if (value !== "" && value !== null && value !== undefined) return value;
    }
  }
  return undefined;
}

function findKeyValue(
  row: Record<string, unknown>,
  predicate: (key: string) => boolean,
): unknown {
  for (const [key, value] of Object.entries(row)) {
    if (predicate(normalizeText(key))) {
      if (value !== "" && value !== null && value !== undefined) return value;
    }
  }
  return undefined;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value).trim();
  if (/^\d{1,3}([.,]\d{3})+$/.test(text)) {
    return Number(text.replace(/[.,]/g, ""));
  }
  const cleaned = text.replace(/[^\d.-]/g, "");
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function parseVat(value: unknown): number {
  const number = parseNumber(value);
  if (number === null) return 0.08;
  return number > 1 ? number / 100 : number;
}

export function removeColorSuffix(name: string): string {
  return String(name ?? "")
    .replace(
      /\b(6500K|4000K|3000K|6500|4000|3000|trắng|trang|vàng|vang|trung tính|trung tinh|đổi màu|doi mau|3 màu|3 mau)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function extractColors(name: string): string[] {
  const text = String(name ?? "").toUpperCase();
  const colors: string[] = [];
  if (/\b6500K?\b/.test(text) || /TRẮNG|TRANG/.test(text)) colors.push("6500K (Trắng)");
  if (/\b4000K?\b/.test(text) || /TRUNG TÍNH|TRUNG TINH/.test(text)) colors.push("4000K (Trung tính)");
  if (/\b3000K?\b/.test(text) || /VÀNG|VANG/.test(text)) colors.push("3000K (Vàng)");
  return colors;
}

export function sheetRowsToObjects(rows: unknown[][]): Record<string, unknown>[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const headerIndex = rows.findIndex((row) =>
    row.some((cell) =>
      /san pham|ten san pham|product|ten hang|model/i.test(
        normalizeText(cell),
      ),
    ),
  );
  if (headerIndex === -1) return [];

  const headerRow = rows[headerIndex] ?? [];
  const subHeaderIndex = rows.findIndex(
    (row, index) =>
      index > headerIndex &&
      index <= headerIndex + 3 &&
      row.some((cell) => /chua vat|co vat/i.test(normalizeText(cell))),
  );

  const parentHeaders: string[] = [];
  let lastParent = "";
  let carry = 0;
  for (let col = 0; col < headerRow.length; col += 1) {
    const raw = String(headerRow[col] ?? "").trim();
    if (raw) {
      lastParent = raw;
      carry = 0;
      parentHeaders[col] = raw;
    } else if (lastParent && carry < 1) {
      parentHeaders[col] = lastParent;
      carry += 1;
    } else {
      parentHeaders[col] = "";
      carry = 0;
    }
  }

  const subHeaderRow =
    subHeaderIndex >= 0 ? rows[subHeaderIndex] ?? [] : [];

  const headers: string[] = [];
  for (let col = 0; col < parentHeaders.length; col += 1) {
    const parent = parentHeaders[col];
    const sub = String(subHeaderRow[col] ?? "").trim();
    if (!parent && !sub) {
      headers[col] = "";
      continue;
    }
    if (sub && !normalizeText(parent).includes(normalizeText(sub))) {
      headers[col] = `${parent} - ${sub}`;
    } else {
      headers[col] = parent || sub;
    }
  }

  const dataStart = subHeaderIndex >= 0 ? subHeaderIndex + 1 : headerIndex + 1;
  const objects: Record<string, unknown>[] = [];

  for (let rowIndex = dataStart; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] ?? [];
    const object: Record<string, unknown> = {};
    let hasValue = false;
    for (let col = 0; col < headers.length; col += 1) {
      const header = headers[col];
      if (!header) continue;
      const value = row[col];
      if (value === null || value === undefined || value === "") continue;
      let key = header;
      let suffix = 2;
      while (object[key] !== undefined) {
        key = `${header} (${suffix})`;
        suffix += 1;
      }
      object[key] = value;
      hasValue = true;
    }
    if (hasValue) objects.push(object);
  }

  return objects;
}

export function normalizeImportRows(
  rawRows: Record<string, unknown>[],
): ImportNormalizeResult {
  const errors: string[] = [];
  const rows: NormalizedImportRow[] = [];
  const groups = new Map<string, NormalizedImportRow & { colors: Set<string> }>();

  rawRows.forEach((raw, index) => {
    const name = String(
      pick(raw, [
        "Sản phẩm",
        "Tên sản phẩm",
        "Tên hàng",
        "Product",
        "Product name",
        "Model",
      ]) ?? "",
    ).trim();

    if (!name || name.length < 3) return;
    if (/^sản phẩm$/i.test(name) || /^tên sản phẩm$/i.test(name)) return;
    if (isNonElectricalProduct(name)) return;

    const priceNoVAT = parseNumber(
      findKeyValue(
        raw,
        (key) =>
          key.includes("chua vat") &&
          !key.includes("goc") &&
          !key.includes("gia le") &&
          (key.includes("don gia") || key.includes("gia ban") || key.includes("gia nhap")),
      ) ??
        findKeyValue(
          raw,
          (key) =>
            key.includes("chua vat") &&
            !key.includes("goc") &&
            !key.includes("gia le"),
        ),
    );

    const finalPriceVAT = parseNumber(
      findKeyValue(
        raw,
        (key) => key.includes("gia cuoi") && key.includes("co vat"),
      ),
    );
    const listedPriceVAT = parseNumber(
      findKeyValue(
        raw,
        (key) =>
          key.includes("co vat") &&
          !key.includes("goc") &&
          !key.includes("gia le") &&
          !key.includes("gia cuoi"),
      ),
    );
    const priceWithVAT = finalPriceVAT ?? listedPriceVAT;

    const vatRate = parseVat(
      findKeyValue(
        raw,
        (key) =>
          key === "vat" ||
          key === "vat %" ||
          (key.includes("vat") &&
            !key.includes("chua vat") &&
            !key.includes("co vat") &&
            !key.includes("gia")),
      ),
    );

    const retailNoVAT = parseNumber(
      findKeyValue(
        raw,
        (key) => key.includes("gia le") && key.includes("chua vat"),
      ),
    );
    const retailWithVAT = parseNumber(
      findKeyValue(
        raw,
        (key) => key.includes("gia le") && key.includes("co vat"),
      ),
    );
    const retailPrice =
      retailWithVAT ?? (retailNoVAT ? Math.round(retailNoVAT * (1 + vatRate)) : null);

    const supportAmount = parseNumber(
      findKeyValue(
        raw,
        (key) =>
          (key.includes("so tien ho tro") || key.includes("ho tro")) &&
          !key.includes("tang"),
      ),
    );
    const supportMechanismRaw = findKeyValue(raw, (key) =>
      key.includes("co che"),
    );
    const giftSupportRaw = findKeyValue(raw, (key) =>
      key.includes("tang sp") || key.includes("tang san pham") || key.includes("ho tro tang"),
    );
    const brand = String(
      pick(raw, ["Hãng", "Thương hiệu", "Brand"]) ?? "",
    ).trim();
    const category = String(
      pick(raw, ["Danh mục", "Nhóm", "Category"]) ?? "",
    ).trim();
    const image = String(pick(raw, ["Ảnh", "Hình ảnh", "Image"]) ?? "").trim();
    const description = String(
      pick(raw, ["Mô tả", "Description", "Ghi chú"]) ?? "",
    ).trim();
    const stockRaw = String(
      pick(raw, ["Tồn kho", "Trạng thái kho", "Stock"]) ?? "",
    ).trim();

    const baseName = removeColorSuffix(name) || name;
    const colors = extractColors(name);
    const isContact = !priceWithVAT || priceWithVAT <= 0;

    const row: NormalizedImportRow = {
      name,
      baseName,
      category: category || undefined,
      brand: brand || undefined,
      priceNoVAT: isContact ? null : priceNoVAT,
      priceWithVAT: isContact ? null : priceWithVAT,
      retailPrice: isContact ? null : retailPrice,
      regularPrice: isContact ? null : retailPrice,
      vatRate,
      priceStatus: isContact ? "contact" : "available",
      stockStatus:
        /het|hết|out/i.test(stockRaw) ? "outofstock" : "instock",
      supportAmount: isContact ? null : supportAmount,
      supportMechanism:
        supportMechanismRaw !== undefined
          ? String(supportMechanismRaw)
          : undefined,
      giftSupport:
        giftSupportRaw !== undefined ? String(giftSupportRaw) : undefined,
      image: image || undefined,
      description: description || undefined,
    };

    const groupKey = normalizeText(baseName);
    const existing = groups.get(groupKey);
    if (existing) {
      for (const color of colors) existing.colors.add(color);
      if (!existing.image && image) existing.image = image;
      if (!existing.category && category) existing.category = category;
      if (!existing.brand && brand) existing.brand = brand;
      if (!existing.description && description) existing.description = description;
      return;
    }

    groups.set(groupKey, {
      ...row,
      name: baseName,
      baseName,
      colors: new Set(colors),
    });
    rows.push(row);
  });

  const deduped: NormalizedImportRow[] = [];
  for (const row of rows) {
    const group = groups.get(normalizeText(row.baseName));
    if (!group) continue;
    const colors = [...group.colors];
    deduped.push({
      ...row,
      name: group.name,
      baseName: group.baseName,
      image: group.image,
      category: group.category,
      brand: group.brand,
      description: group.description,
      attributes:
        colors.length > 1
          ? [{ name: "Nhiệt độ màu", options: colors }]
          : undefined,
    });
  }

  return {
    rows: deduped,
    errors,
    rawCount: rawRows.length,
  };
}
