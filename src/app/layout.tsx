import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "An Phú - Thiết bị điện & Chiếu sáng LED",
  description: "Chuyên phân phối đèn LED Rạng Đông, bình giữ nhiệt, thiết bị chiếu sáng chất lượng cao. Bảng giá cập nhật T9/2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
