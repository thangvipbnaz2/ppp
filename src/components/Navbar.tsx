"use client";

import Link from "next/link";
import Image from "@/components/SafeImage";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Giỏ hàng", href: "/cart" },
  { label: "Tra cứu đơn", href: "/track-order" },
  { label: "Khám phá", href: "/products" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Smart Home", href: "/products?category=smart-home", highlight: true },
  { label: "Dự án", href: "/projects" },
  { label: "Tin tức", href: "/news" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/75 border-b border-black/[0.06] transition-all duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-black/[0.04] group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/logo.png"
                alt="An Phú Vina"
                width={36}
                height={36}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent">
                An Phú Vina
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold truncate max-w-[170px]">
                Lòng tin & Sự tử tế đồng hành
              </span>
            </div>
          </Link>

          {/* Desktop Nav - iOS segmented pill style */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-black/[0.04]">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                    active
                      ? "bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      : item.highlight
                      ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50/60 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {item.highlight && <span>✨</span>}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/quote"
              className="px-4 py-2 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Lên đơn báo giá →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
