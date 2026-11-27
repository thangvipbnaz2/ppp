import { notFound } from "next/navigation";
import Link from "next/link";
const policies: Record<string, { title: string; paragraphs: string[] }> = {
  "doi-tra": { title: "Chính sách đổi trả", paragraphs: ["An Phú Vina hỗ trợ đổi trả trong 07 ngày nếu sản phẩm phát sinh lỗi từ nhà sản xuất.", "Khi phát hiện lỗi, vui lòng liên hệ hotline 0827955888, cung cấp mã đơn và mô tả tình trạng sản phẩm để được hỗ trợ kiểm tra và đổi trả."] },
  "bao-hanh": { title: "Chính sách bảo hành", paragraphs: ["Sản phẩm được bảo hành chính hãng 2 năm theo cam kết dịch vụ của An Phú Vina.", "Để được hỗ trợ bảo hành, khách hàng liên hệ hotline 0827955888 và cung cấp thông tin sản phẩm, đơn hàng cùng mô tả lỗi."] },
  "van-chuyen": { title: "Chính sách vận chuyển và thanh toán", paragraphs: ["Thời gian giao hàng theo cam kết dịch vụ: 1–2 ngày.", "Miễn phí vận chuyển nội thành Hà Nội cho đơn hàng từ 1.000.000đ. Khách hàng kiểm tra phí giao hàng hiển thị tại bước thanh toán trước khi đặt hàng.", "An Phú Vina hỗ trợ thanh toán COD hoặc chuyển khoản và xuất hóa đơn VAT 8%. Vui lòng cung cấp thông tin xuất hóa đơn khi đặt hàng hoặc liên hệ hotline 0827955888."] },
  "bao-mat": { title: "Thông tin bảo mật", paragraphs: ["Form đặt hàng sử dụng họ tên, số điện thoại, địa chỉ và ghi chú để xử lý đơn hàng. Form liên hệ và đăng ký đại lý sử dụng thông tin khách hàng nhập để tiếp nhận yêu cầu tư vấn.", "Tra cứu đơn hàng yêu cầu mã đơn và số điện thoại. Khách hàng cần giữ kín thông tin tra cứu và không cung cấp mật khẩu hoặc thông tin đăng nhập qua phần ghi chú.", "Để hỏi về thông tin đã gửi cho An Phú Vina, vui lòng liên hệ hotline 0827955888."] },
};
export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();
  return <article className="max-w-4xl mx-auto px-6 py-12 space-y-6"><h1 className="text-3xl font-extrabold text-slate-950">{policy.title}</h1>{policy.paragraphs.map(p => <p key={p} className="text-slate-600 leading-relaxed">{p}</p>)}<Link href="/contact" className="text-blue-600">Liên hệ An Phú Vina</Link></article>;
}
