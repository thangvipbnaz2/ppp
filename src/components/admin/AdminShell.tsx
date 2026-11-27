"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: "📊" },
  { href: "/admin/products", label: "Sản phẩm", icon: "💡" },
  { href: "/admin/import", label: "Import bảng giá", icon: "📥" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "📦" },
  { href: "/admin/dealers", label: "Đăng ký đại lý", icon: "🤝" },
  { href: "/admin/contact", label: "Liên hệ", icon: "✉️" },
  { href: "/admin/news", label: "Tin tức", icon: "📰" },
  { href: "/admin/settings", label: "Cài đặt", icon: "⚙️" },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await createClient().auth.signOut();
    } catch {}
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-5 py-5 border-b border-white/10">
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <span className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center text-lg font-black">
                A
              </span>
              <span>
                <span className="block text-sm font-extrabold text-white">
                  An Phú Vina
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-400">
                  Quản trị hệ thống
                </span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              ← Về trang chủ
            </Link>
            <div className="px-3 py-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-slate-400">Đăng nhập:</p>
              <p className="text-[11px] font-semibold text-white truncate">
                {email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-xl text-[11px] font-bold bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </aside>

        {menuOpen && (
          <button
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          />
        )}

        <div className="flex-1 lg:pl-64">
          <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-black/[0.06]">
            <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"
                  aria-label="Mở menu"
                >
                  ☰
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Khu vực quản trị
                  </p>
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    Quản lý sản phẩm, đơn hàng & nội dung
                  </p>
                </div>
              </div>
              <form onSubmit={(event) => { event.preventDefault(); const query = globalSearch.trim(); if (query) router.push(`/admin/products?q=${encodeURIComponent(query)}`); }} className="hidden md:block flex-1 max-w-md">
                <input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Tìm nhanh sản phẩm, SKU..." className="w-full px-4 py-2 rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 text-xs focus:outline-none" />
              </form>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                >
                  Xem website
                </Link>
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center">
                  {email.slice(0, 1).toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
