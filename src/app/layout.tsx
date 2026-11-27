import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "An Phú Vina - Nhà Phân Phối Thiết Bị Chiếu Sáng & Smart Home Rạng Đông",
  description: "Công ty TNHH MTV TM Thiết Bị Điện An Phú Vina (MST: 0110271235). Cung cấp đèn LED Rạng Đông, Smart Home Rallismart chính hãng, giải pháp công trình và dự án.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-[#fbfbfd] text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingWidgets />
        </Providers>
      </body>
    </html>
  );
}
