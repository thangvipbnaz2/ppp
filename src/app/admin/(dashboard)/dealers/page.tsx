"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface Dealer {
  id: number;
  name: string;
  phone: string;
  company: string | null;
  interest: string | null;
  note: string | null;
  status: string;
  created_at: string;
}

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const updateStatus = async (id: number, status: string) => {
    const response = await fetch("/api/admin/dealers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok) { setToast(data.error || "Không cập nhật được"); return; }
    setDealers((current) => current.map((item) => item.id === id ? data : item));
    setToast("Đã cập nhật đăng ký");
  };
  const remove = async (id: number) => {
    if (!window.confirm("Xóa đăng ký đại lý này?")) return;
    const response = await fetch(`/api/admin/dealers?id=${id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); setToast(data.error || "Không xóa được"); return; }
    setDealers((current) => current.filter((item) => item.id !== id));
    setToast("Đã xóa đăng ký");
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dealers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được đăng ký");
      setDealers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không tải được đăng ký đại lý",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return dealers;
    return dealers.filter((item) =>
      `${item.name} ${item.phone} ${item.company ?? ""} ${item.interest ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [dealers, search]);

  return (
    <div className="space-y-5 max-w-7xl">
      {toast && <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-semibold">{toast}</div>}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Đăng ký đại lý
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {dealers.length} đăng ký từ form liên hệ
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, số điện thoại, công ty..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
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
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Chưa có đăng ký đại lý nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Công ty</th>
                  <th className="px-4 py-3 font-semibold">Nhu cầu</th>
                  <th className="px-4 py-3 font-semibold">Ghi chú</th>
                  <th className="px-4 py-3 font-semibold">Ngày gửi</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dealer) => (
                  <tr key={dealer.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {dealer.name}
                      </p>
                      <a
                        href={`tel:${dealer.phone}`}
                        className="text-[10px] text-blue-600 font-medium"
                      >
                        {dealer.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {dealer.company || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {dealer.interest || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[280px]">
                      <p className="line-clamp-2">{dealer.note || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(dealer.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3"><select value={dealer.status} onChange={(event) => void updateStatus(dealer.id, event.target.value)} className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold"><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select></td>
                    <td className="px-4 py-3 text-right"><button onClick={() => void remove(dealer.id)} className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold">Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
