"use client";

import { useEffect, useState } from "react";

interface PaymentQrProps {
  src?: string;
  alt?: string;
}

export default function PaymentQr({
  src,
  alt = "Mã QR chuyển khoản",
}: PaymentQrProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <p className="text-xs text-slate-500">
        Chưa có ảnh QR thanh toán.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {/* The QR path is editable in admin, so native dimensions preserve any uploaded aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-auto w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
