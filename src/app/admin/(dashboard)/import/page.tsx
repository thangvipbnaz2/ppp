"use client";

import { useRef, useState } from "react";
import {
  normalizeImportRows,
  sheetRowsToObjects,
  type ImportNormalizeResult,
  type NormalizedImportRow,
} from "@/lib/import-products";
import { formatCurrency } from "@/lib/utils";

interface ImportResult {
  updated: number;
  created: number;
  skipped: number;
  total: number;
  errors: string[];
}

export default function AdminImportPage() {
  const workbookRef = useRef<unknown>(null);
  const [fileName, setFileName] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [normalized, setNormalized] = useState<ImportNormalizeResult | null>(
    null,
  );
  const [updateOnly, setUpdateOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const parseSheet = async (sheetName: string) => {
    const workbook = workbookRef.current as {
      Sheets: Record<string, import("xlsx").WorkSheet>;
    } | null;
    if (!workbook) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const XLSX = await import("xlsx");
      const sheet = workbook.Sheets[sheetName];
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: "",
        raw: true,
        blankrows: false,
      });
      const objects = sheetRowsToObjects(matrix);
      const data = normalizeImportRows(objects);
      setNormalized(data);
      if (data.rows.length === 0) {
        setError(
          "Không đọc được dòng sản phẩm nào. Kiểm tra lại tên cột trong file.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi đọc file Excel.");
      setNormalized(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    setNormalized(null);
    setFileName(file.name);
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      workbookRef.current = workbook;
      setSheetNames(workbook.SheetNames);
      const preferred =
        workbook.SheetNames.find((name) => /bảng giá|bang gia/i.test(name)) ??
        workbook.SheetNames[0];
      setSelectedSheet(preferred);
      await parseSheet(preferred);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không đọc được file. Hỗ trợ .xlsx, .xls, .csv",
      );
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!normalized || normalized.rows.length === 0) return;
    setImporting(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: normalized.rows,
          updateOnly,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import thất bại");
      setResult(data as ImportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import thất bại");
    } finally {
      setImporting(false);
    }
  };

  const preview: NormalizedImportRow[] = normalized?.rows.slice(0, 30) ?? [];

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Import bảng giá
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Nhập hàng loạt từ file Excel/CSV theo cột bảng giá hiện tại. Hệ thống
          tự ghép biến thể màu và cập nhật giá.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-all">
            Chọn file Excel/CSV
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </label>
          {fileName && (
            <span className="text-xs text-slate-600 font-medium">
              {fileName}
            </span>
          )}
          {sheetNames.length > 0 && (
            <select
              value={selectedSheet}
              onChange={(e) => {
                setSelectedSheet(e.target.value);
                parseSheet(e.target.value);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            >
              {sheetNames.map((name) => (
                <option key={name} value={name}>
                  Sheet: {name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={updateOnly}
              onChange={(e) => setUpdateOnly(e.target.checked)}
              className="accent-blue-600"
            />
            Chỉ cập nhật sản phẩm đã có (không tạo mới)
          </label>
          {normalized && (
            <span className="text-slate-500">
              Đọc được <strong>{normalized.rawCount}</strong> dòng gốc →{" "}
              <strong>{normalized.rows.length}</strong> sản phẩm sau khi gộp
              biến thể
            </span>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            Đang đọc file...
          </div>
        )}

        {normalized && normalized.rows.length > 0 && (
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all"
          >
            {importing
              ? "Đang import..."
              : `Import ${normalized.rows.length} sản phẩm`}
          </button>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm space-y-3">
          <h2 className="text-sm font-extrabold text-slate-950">
            Kết quả import
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Đã cập nhật", value: result.updated, color: "text-emerald-700" },
              { label: "Tạo mới", value: result.created, color: "text-blue-700" },
              { label: "Bỏ qua", value: result.skipped, color: "text-amber-700" },
              { label: "Tổng dòng", value: result.total, color: "text-slate-700" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <p className="text-[10px] font-semibold text-slate-500 uppercase">
                  {item.label}
                </p>
                <p className={`text-xl font-extrabold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          {result.errors.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1 max-h-48 overflow-y-auto">
              {result.errors.map((item, index) => (
                <p key={index}>• {item}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {preview.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-slate-950">
              Xem trước ({preview.length}/{normalized?.rows.length} dòng)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Tên sản phẩm</th>
                  <th className="px-4 py-2.5 font-semibold">Danh mục</th>
                  <th className="px-4 py-2.5 font-semibold text-right">
                    Giá có VAT
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-right">
                    Giá lẻ
                  </th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.map((row, index) => (
                  <tr key={`${row.name}-${index}`}>
                    <td className="px-4 py-2.5 font-semibold text-slate-800">
                      {row.name}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {row.category || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold">
                      {row.priceStatus === "contact" || !row.priceWithVAT
                        ? "Liên hệ"
                        : formatCurrency(row.priceWithVAT)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500">
                      {row.retailPrice ? formatCurrency(row.retailPrice) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.priceStatus === "contact"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.priceStatus === "contact" ? "Liên hệ" : "Có giá"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200/60 text-[11px] text-blue-900 leading-relaxed">
        <strong>Mẹo:</strong> file bảng giá cần có cột tên sản phẩm (Sản phẩm /
        Tên sản phẩm), cột giá chưa VAT, cột VAT, cột giá cuối có VAT và cột giá
        lẻ. Dòng không có giá sẽ được đánh dấu “Liên hệ”.
      </div>
    </div>
  );
}
