"use client";

import { useCallback, useEffect, useState } from "react";
import type { NewsPost } from "@/lib/types";

interface NewsForm {
  title: string;
  slug: string;
  category: string;
  summary: string;
  image: string;
  readTime: string;
  highlights: string;
  sections: string;
  content: string;
  published: boolean;
}

const EMPTY_FORM: NewsForm = {
  title: "",
  slug: "",
  category: "Tin tức",
  summary: "",
  image: "",
  readTime: "",
  highlights: "",
  sections: "",
  content: "",
  published: true,
};

function postToForm(post: NewsPost): NewsForm {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    summary: post.summary,
    image: post.image ?? "",
    readTime: post.readTime ?? "",
    highlights: (post.highlights ?? []).join("\n"),
    sections: (post.sections ?? [])
      .map((section) => `${section.heading} | ${section.content}`)
      .join("\n"),
    content: post.content ?? "",
    published: post.published,
  };
}

function parseSections(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [heading, ...rest] = line.split("|");
      return {
        heading: heading.trim(),
        content: rest.join("|").trim(),
      };
    })
    .filter((section) => section.heading);
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NewsForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được tin tức");
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được tin tức");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (post: NewsPost) => {
    setEditingId(post.id);
    setForm(postToForm(post));
    setFormError("");
    setModalOpen(true);
  };

  const updateForm = <K extends keyof NewsForm>(key: K, value: NewsForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (form.title.trim().length < 3) {
      setFormError("Tiêu đề phải có ít nhất 3 ký tự.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        editingId === null
          ? "/api/admin/news"
          : `/api/admin/news/${editingId}`,
        {
          method: editingId === null ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            category: form.category,
            summary: form.summary,
            image: form.image,
            readTime: form.readTime,
            highlights: form.highlights,
            sections: parseSections(form.sections),
            content: form.content,
            published: form.published,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không lưu được bài viết");
      setModalOpen(false);
      setToast(editingId === null ? "Đã tạo bài viết" : "Đã cập nhật bài viết");
      await load();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Không lưu được bài viết",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: NewsPost) => {
    if (!confirm(`Xóa bài viết "${post.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/news/${post.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không xóa được");
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
      setToast("Đã xóa bài viết");
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
            Tin tức
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {posts.length} bài viết trong hệ thống
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
        >
          + Thêm bài viết
        </button>
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
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Chưa có bài viết nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Bài viết</th>
                  <th className="px-4 py-3 font-semibold">Danh mục</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Ngày</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 max-w-[360px]">
                      <p className="font-semibold text-slate-900 line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {post.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {post.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {post.published ? "Đã đăng" : "Nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {post.date || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-700"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-black/[0.08]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-950">
                {editingId === null ? "Thêm bài viết" : "Sửa bài viết"}
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
                    Tiêu đề *
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Slug (để trống tự tạo)
                  </span>
                  <input
                    value={form.slug}
                    onChange={(e) => updateForm("slug", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Danh mục
                  </span>
                  <input
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="block">
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
                    Thời gian đọc
                  </span>
                  <input
                    value={form.readTime}
                    onChange={(e) => updateForm("readTime", e.target.value)}
                    placeholder="VD: 5 phút đọc"
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Mô tả ngắn
                  </span>
                  <textarea
                    rows={2}
                    value={form.summary}
                    onChange={(e) => updateForm("summary", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Điểm nổi bật (mỗi dòng 1 ý)
                  </span>
                  <textarea
                    rows={3}
                    value={form.highlights}
                    onChange={(e) => updateForm("highlights", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Nội dung chính (mỗi dòng: Tiêu đề | Nội dung)
                  </span>
                  <textarea
                    rows={5}
                    value={form.sections}
                    onChange={(e) => updateForm("sections", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 block">
                  <span className="text-[11px] font-bold text-slate-700">
                    Nội dung chi tiết (tùy chọn)
                  </span>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => updateForm("content", e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  />
                </label>

                <label className="sm:col-span-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => updateForm("published", e.target.checked)}
                    className="accent-blue-600"
                  />
                  Đăng công khai trên website
                </label>
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
                  {saving ? "Đang lưu..." : "Lưu bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
