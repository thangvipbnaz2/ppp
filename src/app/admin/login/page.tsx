"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      if (signInError) throw signInError;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center text-xl font-black shadow-lg">
              A
            </span>
            <span className="text-left">
              <span className="block text-lg font-extrabold text-white">
                An Phú Vina
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400">
                Hệ thống quản trị nội bộ
              </span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)] space-y-5">
          <div>
            <h1 className="text-xl font-extrabold text-slate-950">
              Đăng nhập quản trị
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sử dụng tài khoản admin đã tạo trên Supabase Auth.
            </p>
          </div>

          {!configured && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Chưa cấu hình Supabase.</strong> Thêm
              <code className="mx-1 px-1 py-0.5 rounded bg-white/70 font-mono">
                NEXT_PUBLIC_SUPABASE_URL
              </code>
              và
              <code className="mx-1 px-1 py-0.5 rounded bg-white/70 font-mono">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
              vào <code className="font-mono">.env.local</code>, sau đó khởi
              động lại server.
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email quản trị
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@anphuvina.vn"
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !configured}
              className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <Link
              href="/"
              className="font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Về trang chủ
            </Link>
            <span className="text-slate-400">
              Hotline hỗ trợ: 0827.955.888
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
