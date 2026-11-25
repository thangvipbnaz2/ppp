"use client";

import React from "react";
import Image from "next/image";
import { BRANDS, BrandInfo } from "@/lib/company";

export { BRANDS };
export type { BrandInfo };

interface BrandSidebarProps {
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
  className?: string;
}

export default function BrandSidebar({
  selectedBrand,
  onSelectBrand,
  className = "",
}: BrandSidebarProps) {
  return (
    <aside
      className={`bg-white/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-black/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.04)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs shadow-sm">
            🏷️
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Hãng Sản Xuất
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Bấm vào logo để lọc sản phẩm
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-black/[0.04]">
          9 Hãng
        </span>
      </div>

      {/* Brand Cards Grid/Stack Arranged Vertically */}
      <div className="space-y-2.5">
        {BRANDS.map((b) => {
          const isActive =
            selectedBrand === b.id || (b.id === "all" && !selectedBrand);

          if (b.id === "all") {
            return (
              <button
                key={b.id}
                onClick={() => onSelectBrand(b.id)}
                className={`w-full py-2.5 px-3 rounded-2xl text-left transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md scale-[1.02]"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌐</span>
                  <span className="text-xs font-bold">Tất Cả Các Hãng</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  672 SP
                </span>
              </button>
            );
          }

          return (
            <button
              key={b.id}
              onClick={() => onSelectBrand(b.id)}
              className={`w-full bg-white rounded-2xl border transition-all duration-200 p-2 sm:p-2.5 flex items-center justify-between relative group cursor-pointer overflow-hidden ${
                isActive
                  ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20 scale-[1.02]"
                  : "border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:scale-[1.01]"
              }`}
              title={`${b.displayName} - ${b.tagline}`}
            >
              {/* Active Indicator Accent */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
              )}

              {/* Centered Brand Logo exactly like Vinalight card */}
              <div className="h-10 sm:h-11 w-36 max-w-[150px] flex items-center justify-center pl-1">
                <Image
                  src={b.logo}
                  alt={b.name}
                  width={140}
                  height={44}
                  className="max-h-9 sm:max-h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Right side badge */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {b.count ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700"
                    }`}
                  >
                    {b.count} SP
                  </span>
                ) : (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {b.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-black/[0.05] text-center">
        <p className="text-[10px] text-slate-400 leading-tight">
          ✓ Cam kết 100% hàng chính hãng, đầy đủ CO/CQ & hóa đơn VAT
        </p>
      </div>
    </aside>
  );
}
