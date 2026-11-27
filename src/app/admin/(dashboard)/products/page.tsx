"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "@/components/SafeImage";
import type { CategoryGroup, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductFormState {
  name: string;
  sku: string;
  categorySlug: string;
  brand: string;
  priceNoVAT: string;
  priceWithVAT: string;
  retailPrice: string;
  regularPrice: string;
  vatRate: string;
  priceStatus: "available" | "contact";
  stockStatus: "instock" | "outofstock";
  supportAmount: string;
  supportMechanism: string;
  giftSupport: string;
  image: string;
  images: string;
  installationImages: string;
  highlights: string;
  applications: string;
  shortDescription: string;
  description: string;
  specs: string;
  specsTable: string;
  attributes: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  sku: "",
  categorySlug: "",
  brand: "Rạng Đông",
  priceNoVAT: "",
  priceWithVAT: "",
  retailPrice: "",
  regularPrice: "",
  vatRate: "8",
  priceStatus: "available",
  stockStatus: "instock",
  supportAmount: "",
  supportMechanism: "",
  giftSupport: "",
  image: "",
  images: "",
  installationImages: "",
  highlights: "",
  applications: "",
  shortDescription: "",
  description: "",
  specs: "{}",
  specsTable: "[]",
  attributes: "[]",
  isActive: true,
  isFeatured: false,
};

function linesToArray(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    sku: product.sku ?? "",
    categorySlug: product.categorySlug ?? "",
    brand: product.brand ?? "",
    priceNoVAT: product.priceNoVAT ? String(product.priceNoVAT) : "",
    priceWithVAT: product.priceWithVAT ? String(product.priceWithVAT) : "",
    retailPrice: product.retailPrice ? String(product.retailPrice) : "",
    regularPrice: product.regularPrice ? String(product.regularPrice) : "",
    vatRate: String(Math.round((product.vatRate ?? 0.08) * 100)),
    priceStatus: product.priceStatus === "contact" ? "contact" : "available",
    stockStatus:
      product.stockStatus === "outofstock" ? "outofstock" : "instock",
    supportAmount: product.supportAmount ? String(product.supportAmount) : "",
    supportMechanism: product.supportMechanism ?? "",
    giftSupport: product.giftSupport ?? "",
    image: product.image ?? "",
    images: arrayToLines(product.images),
    installationImages: arrayToLines(product.installationImages),
    highlights: arrayToLines(product.highlights),
    applications: arrayToLines(product.applications),
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    specs: JSON.stringify(product.specs ?? {}, null, 2),
    specsTable: JSON.stringify(product.specsTable ?? [], null, 2),
    attributes: JSON.stringify(product.attributes ?? [], null, 2),
    isActive: product.isActive !== false,
    isFeatured: Boolean(product.isFeatured),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      if (!productsRes.ok) {
        throw new Error(productsData.error || "Lỗi tải sản phẩm");
      }
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) setSearch(initialQuery);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (query) {
        const text =
          `${product.name} ${product.sku ?? ""} ${product.brand ?? ""} ${product.id}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      if (
        categoryFilter !== "all" &&
        product.categorySlug !== categoryFilter
      ) {
        return false;
      }
      if (brandFilter !== "all" && product.brand !== brandFilter) return false;
      if (statusFilter === "active" && product.isActive === false) return false;
      if (statusFilter === "inactive" && product.isActive !== false)
        return false;
      if (statusFilter === "contact" && product.priceStatus !== "contact")
        return false;
      if (
        statusFilter === "outofstock" &&
        product.stockStatus !== "outofstock"
      )
        return false;
      return true;
    });
  }, [products, search, categoryFilter, brandFilter, statusFilter]);

  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "vi")), [products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setFormError("");
    setModalOpen(true);
  };

  const updateForm = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildBody = () => {
    const group = categories.find((item) => item.slug === form.categorySlug);
    const body: Record<string, unknown> = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      categorySlug: form.categorySlug,
      brand: form.brand.trim(),
      priceNoVAT: form.priceNoVAT,
      priceWithVAT: form.priceWithVAT,
      retailPrice: form.retailPrice,
      regularPrice: form.regularPrice,
      vatRate: form.vatRate,
      priceStatus: form.priceStatus,
      stockStatus: form.stockStatus,
      supportAmount: form.supportAmount,
      supportMechanism: form.supportMechanism,
      giftSupport: form.giftSupport,
      image: form.image,
      images: linesToArray(form.images),
      installationImages: linesToArray(form.installationImages),
      highlights: linesToArray(form.highlights),
      applications: linesToArray(form.applications),
      shortDescription: form.shortDescription,
      description: form.description,
      specs: form.specs,
      specsTable: form.specsTable,
      attributes: form.attributes,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };
    if (editingId === null && group) body.category = group.name;
    return body;
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setFormError("");
    try {
      const payload = new FormData();
      payload.append("file", file);
      const response = await fetch("/api/admin/products/upload", { method: "POST", body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không tải được ảnh lên");
      updateForm("image", data.url);
      setToast("Đã tải ảnh sản phẩm lên Supabase Storage");
    } catch (uploadError) {
      setFormError(uploadError instanceof Error ? uploadError.message : "Không tải được ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleQuickPrice = async (product: Product) => {
    const value = window.prompt(`Giá bán có VAT mới cho ${product.name} (để trống = Liên hệ):`, product.priceStatus === "contact" ? "" : String(product.priceWithVAT));
    if (value === null) return;
    const numeric = Number(value.replace(/[^\d]/g, ""));
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priceWithVAT: numeric || null, priceStatus: numeric > 0 ? "available" : "contact" }) });
    const data = await response.json();
    if (!response.ok) { setToast(data.error || "Không cập nhật được giá"); return; }
    setProducts((current) => current.map((item) => item.id === product.id ? data.product : item));
    setToast("Đã cập nhật giá bán");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (form.name.trim().length < 2) {
      setFormError("Tên sản phẩm phải có ít nhất 2 ký tự.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        editingId === null
          ? "/api/admin/products"
          : `/api/admin/products/${editingId}`,
        {
          method: editingId === null ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildBody()),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không lưu được sản phẩm");
      setModalOpen(false);
      setToast(editingId === null ? "Đã tạo sản phẩm" : "Đã cập nhật sản phẩm");
      await load();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Không lưu được sản phẩm",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: product.isActive === false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không cập nhật được");
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, isActive: product.isActive === false }
            : item,
        ),
      );
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Không cập nhật được");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không xóa được");
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setToast("Đã xóa sản phẩm");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Không xóa được");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Quản lý sản phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, SKU, hãng hoặc ID..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none">
          <option value="all">Tất cả thương hiệu</option>
          {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="inactive">Đã ẩn</option>
          <option value="contact">Liên hệ báo giá</option>
          <option value="outofstock">Hết hàng</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
          </div>
        ) : paged.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                  <th className="px-4 py-3 font-semibold">Danh mục</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Giá có VAT
                  </th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="relative w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-contain p-0.5"
                              unoptimized
                            />
                          ) : (
                            <span className="flex items-center justify-center h-full">
                              💡
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {product.sku || `#${product.id}`} • {product.brand || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {product.priceStatus === "contact"
                        ? "Liên hệ"
                        : formatCurrency(product.priceWithVAT)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.isActive === false
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {product.isActive === false ? "Đã ẩn" : "Hiển thị"}
                        </span>
                        {product.priceStatus === "contact" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                            Liên hệ
                          </span>
                        )}
                        {product.stockStatus === "outofstock" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                            Hết hàng
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickPrice(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[10px] font-bold text-amber-700"
                        >
                          Giá nhanh
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                        >
                          {product.isActive === false ? "Hiện" : "Ẩn"}
                        </button>
                        <button
                          onClick={() => openEdit(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-700"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[10px] font-bold text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-[11px] text-slate-500">
            Trang <strong>{page}</strong> / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-black/[0.08]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-950">
                {editingId === null ? "Thêm sản phẩm mới" : "Sửa sản phẩm"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Tên sản phẩm *
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">Mã SKU</span>
                  <input value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Nhóm danh mục
                  </span>
                  <select
                    value={form.categorySlug}
                    onChange={(e) =>
                      updateForm("categorySlug", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="">— Chọn nhóm —</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Thương hiệu
                  </span>
                  <input
                    value={form.brand}
                    onChange={(e) => updateForm("brand", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Giá chưa VAT
                  </span>
                  <input
                    value={form.priceNoVAT}
                    onChange={(e) =>
                      updateForm("priceNoVAT", e.target.value)
                    }
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Giá bán có VAT
                  </span>
                  <input
                    value={form.priceWithVAT}
                    onChange={(e) =>
                      updateForm("priceWithVAT", e.target.value)
                    }
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Giá lẻ niêm yết
                  </span>
                  <input
                    value={form.retailPrice}
                    onChange={(e) =>
                      updateForm("retailPrice", e.target.value)
                    }
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Giá gạch ngang
                  </span>
                  <input
                    value={form.regularPrice}
                    onChange={(e) =>
                      updateForm("regularPrice", e.target.value)
                    }
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    VAT (%)
                  </span>
                  <input
                    value={form.vatRate}
                    onChange={(e) => updateForm("vatRate", e.target.value)}
                    inputMode="decimal"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Trạng thái giá
                  </span>
                  <select
                    value={form.priceStatus}
                    onChange={(e) =>
                      updateForm(
                        "priceStatus",
                        e.target.value as ProductFormState["priceStatus"],
                      )
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="available">Có giá bán</option>
                    <option value="contact">Liên hệ báo giá</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Tình trạng kho
                  </span>
                  <select
                    value={form.stockStatus}
                    onChange={(e) =>
                      updateForm(
                        "stockStatus",
                        e.target.value as ProductFormState["stockStatus"],
                      )
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="instock">Còn hàng</option>
                    <option value="outofstock">Hết hàng</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Số tiền hỗ trợ
                  </span>
                  <input
                    value={form.supportAmount}
                    onChange={(e) =>
                      updateForm("supportAmount", e.target.value)
                    }
                    inputMode="numeric"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Cơ chế hỗ trợ
                  </span>
                  <input
                    value={form.supportMechanism}
                    onChange={(e) =>
                      updateForm("supportMechanism", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Quà tặng / hỗ trợ thêm
                  </span>
                  <input
                    value={form.giftSupport}
                    onChange={(e) =>
                      updateForm("giftSupport", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleUpload(file); }} className="mt-2 block w-full text-[11px] text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-bold file:text-blue-700" />
                  {uploading && <span className="text-[10px] text-blue-600">Đang tải ảnh lên...</span>}
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Ảnh đại diện (URL)
                  </span>
                  <input
                    value={form.image}
                    onChange={(e) => updateForm("image", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Ảnh sản phẩm (mỗi dòng 1 URL)
                  </span>
                  <textarea
                    rows={3}
                    value={form.images}
                    onChange={(e) => updateForm("images", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Ảnh lắp đặt (mỗi dòng 1 URL)
                  </span>
                  <textarea
                    rows={3}
                    value={form.installationImages}
                    onChange={(e) =>
                      updateForm("installationImages", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Ưu điểm (mỗi dòng 1 ý)
                  </span>
                  <textarea
                    rows={3}
                    value={form.highlights}
                    onChange={(e) =>
                      updateForm("highlights", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Không gian phù hợp (mỗi dòng 1 ý)
                  </span>
                  <textarea
                    rows={3}
                    value={form.applications}
                    onChange={(e) =>
                      updateForm("applications", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Mô tả ngắn
                  </span>
                  <input
                    value={form.shortDescription}
                    onChange={(e) =>
                      updateForm("shortDescription", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Mô tả chi tiết
                  </span>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      updateForm("description", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Thông số (JSON)
                  </span>
                  <textarea
                    rows={4}
                    value={form.specs}
                    onChange={(e) => updateForm("specs", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 text-emerald-200 font-mono text-[11px] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Bảng thông số (JSON)
                  </span>
                  <textarea
                    rows={4}
                    value={form.specsTable}
                    onChange={(e) =>
                      updateForm("specsTable", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 text-emerald-200 font-mono text-[11px] focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Thuộc tính / phiên bản (JSON)
                  </span>
                  <textarea
                    rows={3}
                    value={form.attributes}
                    onChange={(e) =>
                      updateForm("attributes", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 text-emerald-200 font-mono text-[11px] focus:outline-none"
                  />
                </label>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-5 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        updateForm("isActive", e.target.checked)
                      }
                      className="accent-blue-600"
                    />
                    Hiển thị trên website
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        updateForm("isFeatured", e.target.checked)
                      }
                      className="accent-amber-500"
                    />
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
