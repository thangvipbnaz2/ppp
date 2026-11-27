"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const updateStatus = async (id: number, status: string) => {
    const response = await fetch("/api/admin/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok) { setToast(data.error || "Không cập nhật được"); return; }
    setMessages((current) => current.map((item) => item.id === id ? data : item));
    setToast("Đã cập nhật tin nhắn");
  };
  const remove = async (id: number) => {
    if (!window.confirm("Xóa tin nhắn liên hệ này?")) return;
    const response = await fetch(`/api/admin/contact?id=${id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); setToast(data.error || "Không xóa được"); return; }
    setMessages((current) => current.filter((item) => item.id !== id));
    setToast("Đã xóa tin nhắn");
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được liên hệ");
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không tải được liên hệ",
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
    if (!query) return messages;
    return messages.filter((item) =>
      `${item.name} ${item.phone} ${item.email ?? ""} ${item.subject ?? ""} ${item.message}`
        .toLowerCase()
        .includes(query),
    );
  }, [messages, search]);

  return (
    <div className="space-y-5 max-w-7xl">
      {toast && <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-semibold">{toast}</div>}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Tin nhắn liên hệ
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {messages.length} tin nhắn từ khách hàng
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, số điện thoại, email, nội dung..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-10 text-center text-xs text-slate-400">
          Chưa có tin nhắn liên hệ nào.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {message.name}
                  </p>
                  <a
                    href={`tel:${message.phone}`}
                    className="text-[11px] text-blue-600 font-semibold"
                  >
                    {message.phone}
                  </a>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(message.created_at).toLocaleString("vi-VN")}
                </span>
              </div>

              {message.email && (
                <p className="text-[11px] text-slate-500">
                  ✉️ {message.email}
                </p>
              )}
              {message.subject && (
                <p className="text-xs font-bold text-slate-800">
                  {message.subject}
                </p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {message.message}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3"><select value={message.status} onChange={(event) => void updateStatus(message.id, event.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-100 text-[10px] font-bold"><option value="new">Mới</option><option value="processing">Đang xử lý</option><option value="done">Đã xong</option></select><button onClick={() => void remove(message.id)} className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold">Xóa</button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
