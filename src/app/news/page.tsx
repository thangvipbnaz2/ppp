"use client";

import { useState, useEffect } from "react";
import Image from "@/components/SafeImage";
import Link from "next/link";
import type { NewsArticle } from "@/lib/company";

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/news").then(async response => {
      if (!response.ok) throw new Error();
      const data: import("@/lib/types").NewsPost[] = await response.json();
      const posts: NewsArticle[] = data.map(post => ({ ...post, id: String(post.id), image: post.image || "/images/logo.png", date: post.date || "", readTime: post.readTime || "", sections: post.sections.map(section => ({ heading: section.heading, bullets: section.content.split("\n") })) }));
      setNewsArticles(posts);
      const article = new URLSearchParams(window.location.search).get("article");
      setSelectedArticle(posts.find(p => p.id === article || data.find(d => String(d.id) === p.id)?.slug === article) ?? posts[0] ?? null);
    }).catch(() => setError("Không tải được tin tức. Vui lòng thử lại."));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
          <span>📰</span> Tin tức, Catalogue & Kiến thức chiếu sáng
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Tin Tức & Tư Vấn Kỹ Thuật
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Tổng hợp bài viết chuyên sâu về đèn LED Rạng Đông, giải pháp chiếu sáng tòa nhà đạt chuẩn TCVN và công nghệ Nhà thông minh Smart Home.
        </p>
      </div>

      {error && <p role="alert">{error}</p>}
      {/* Main Split View: Article List + Reader */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Article Cards */}
        <div className="lg:col-span-5 space-y-4">
          {newsArticles.map((art) => {
            const active = selectedArticle?.id === art.id;
            return (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`w-full text-left rounded-3xl p-4 border transition-all duration-300 flex gap-4 items-center ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.01]"
                    : "bg-white hover:bg-slate-50 text-slate-900 border-black/[0.06] shadow-sm"
                }`}
              >
                <div className="relative w-24 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className={active ? "text-blue-300" : "text-blue-600"}>
                      {art.category}
                    </span>
                    <span className="opacity-50">•</span>
                    <span className="opacity-70">{art.readTime}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className={`text-[11px] line-clamp-1 ${active ? "text-slate-300" : "text-slate-500"}`}>
                    {art.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Full Article Reader */}
        {selectedArticle && (
          <article className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-6">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 border border-black/[0.04]">
              <Image
                src={selectedArticle.image}
                alt={selectedArticle.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">
                  {selectedArticle.category}
                </span>
                <span className="text-slate-400">• {selectedArticle.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            {/* Highlights Box */}
            <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200/50 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                Điểm nổi bật kỹ thuật
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-950">
                {selectedArticle.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-5 pt-2">
              {selectedArticle.sections.map((sec, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">{sec.heading}</h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc pl-5">
                    {sec.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors"
              >
                Xem sản phẩm liên quan →
              </Link>
              <Link
                href="/quote"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Tạo đơn báo giá dự án 📋
              </Link>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
