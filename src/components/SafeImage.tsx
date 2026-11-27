"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
export default function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState<unknown>(null);
  const source = typeof props.src === "string" ? props.src : props.src;
  const isSourceHotlink = typeof source === "string" && /https?:\/\/(?:www\.)?rangdongapvina\.com\.vn/i.test(source);
  const safeSource = !source || isSourceHotlink || failed === source ? "/images/logo.png" : source;
  return <Image {...props} src={safeSource} onError={() => setFailed(source)} />;
}
