"use client";

import { useEffect, useState } from "react";
import PaymentQr from "@/components/PaymentQr";
import type { SiteSettings } from "@/lib/types";

interface SettingsForm {
  hotline: string;
  storeEmail: string;
  storeAddress: string;
  shippingFee: string;
  freeShipThreshold: string;
  bank: string;
  branch: string;
  accountNumber: string;
  accountName: string;
  qrImage: string;
}

const EMPTY_FORM: SettingsForm = {
  hotline: "",
  storeEmail: "",
  storeAddress: "",
  shippingFee: "30000",
  freeShipThreshold: "1000000",
  bank: "",
  branch: "",
  accountNumber: "",
  accountName: "",
  qrImage: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Không tải được cài đặt");
        return data as SiteSettings;
      })
      .then((settings) => {
        setForm({
          hotline: settings.hotline ?? "",
          storeEmail: settings.storeEmail ?? "",
          storeAddress: settings.storeAddress ?? "",
          shippingFee: String(settings.shippingFee ?? 0),
          freeShipThreshold: String(settings.freeShipThreshold ?? 0),
          bank: settings.bankInfo?.bank ?? "",
          branch: settings.bankInfo?.branch ?? "",
          accountNumber: settings.bankInfo?.accountNumber ?? "",
          accountName: settings.bankInfo?.accountName ?? "",
          qrImage: settings.bankInfo?.qrImage ?? "",
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Không tải được cài đặt",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const update = <K extends keyof SettingsForm>(
    key: K,
    value: SettingsForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotline: form.hotline,
          storeEmail: form.storeEmail,
          storeAddress: form.storeAddress,
          shippingFee: form.shippingFee,
          freeShipThreshold: form.freeShipThreshold,
          bankInfo: {
            bank: form.bank,
            branch: form.branch,
            accountNumber: form.accountNumber,
            accountName: form.accountName,
            qrImage: form.qrImage,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không lưu được cài đặt");
      setToast("Đã lưu cài đặt");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không lưu được cài đặt",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Cài đặt website
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hotline, phí vận chuyển và thông tin chuyển khoản hiển thị trên
          website.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm space-y-5"
      >
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-950">
            Liên hệ & vận chuyển
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Hotline
              </span>
              <input
                value={form.hotline}
                onChange={(e) => update("hotline", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">Email cửa hàng</span>
              <input type="email" value={form.storeEmail} onChange={(e) => update("storeEmail", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-700">Địa chỉ cửa hàng</span>
              <input value={form.storeAddress} onChange={(e) => update("storeAddress", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500" />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Phí ship mặc định (đ)
              </span>
              <input
                value={form.shippingFee}
                onChange={(e) => update("shippingFee", e.target.value)}
                inputMode="numeric"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Freeship từ (đ)
              </span>
              <input
                value={form.freeShipThreshold}
                onChange={(e) =>
                  update("freeShipThreshold", e.target.value)
                }
                inputMode="numeric"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-950">
            Thông tin chuyển khoản
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Ngân hàng
              </span>
              <input
                value={form.bank}
                onChange={(e) => update("bank", e.target.value)}
                placeholder="VD: Vietcombank"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Chi nhánh
              </span>
              <input
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Số tài khoản
              </span>
              <input
                value={form.accountNumber}
                onChange={(e) => update("accountNumber", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-700">
                Chủ tài khoản
              </span>
              <input
                value={form.accountName}
                onChange={(e) => update("accountName", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-700">
                Ảnh QR thanh toán
              </span>
              <input
                value={form.qrImage}
                onChange={(e) => update("qrImage", e.target.value)}
                placeholder="/qr-thanh-toan.png"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </label>
            {form.qrImage && (
              <div className="sm:col-span-2">
                <PaymentQr src={form.qrImage} alt="QR thanh toán đang cấu hình" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold shadow-md disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </form>
    </div>
  );
}
