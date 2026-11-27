import { NextResponse } from "next/server";
import { isValidPhone, normalizePhone } from "@/lib/catalog";
import { getSettings } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface IncomingItem {
  productId?: number | string;
  quantity?: number | string;
}

interface OrderRequestBody {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string | null;
  paymentMethod?: "cod" | "bank_transfer";
  items?: IncomingItem[];
}

interface DbOrderProduct {
  id: number;
  name: string;
  image: string | null;
  price_with_vat: number | null;
  price_status: "available" | "contact" | null;
  stock_status: "instock" | "outofstock" | null;
  is_active: boolean | null;
}

function generateOrderCode(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const randomPart = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()
    .padEnd(4, "X");
  return `APV-${datePart}-${randomPart}`;
}

function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: OrderRequestBody;
  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400 },
    );
  }

  const customerName = cleanText(body.customerName, 120);
  const customerPhone = normalizePhone(cleanText(body.customerPhone, 20));
  const customerAddress = cleanText(body.customerAddress, 500);
  const customerNote = cleanText(body.customerNote, 500);
  const paymentMethod = body.paymentMethod;
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (customerName.length < 2) {
    return NextResponse.json(
      { error: "Vui lòng nhập họ tên (ít nhất 2 ký tự)." },
      { status: 400 },
    );
  }
  if (!isValidPhone(customerPhone)) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ." },
      { status: 400 },
    );
  }
  if (customerAddress.length < 10) {
    return NextResponse.json(
      { error: "Vui lòng nhập địa chỉ giao hàng chi tiết (ít nhất 10 ký tự)." },
      { status: 400 },
    );
  }
  if (paymentMethod !== "cod" && paymentMethod !== "bank_transfer") {
    return NextResponse.json(
      { error: "Phương thức thanh toán không hợp lệ." },
      { status: 400 },
    );
  }
  if (rawItems.length === 0 || rawItems.length > 50) {
    return NextResponse.json(
      { error: "Giỏ hàng không hợp lệ." },
      { status: 400 },
    );
  }

  const quantities = new Map<number, number>();
  for (const item of rawItems) {
    const productId = Number(item.productId);
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "Sản phẩm trong giỏ hàng không hợp lệ." },
        { status: 400 },
      );
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: "Số lượng sản phẩm phải từ 1 đến 99." },
        { status: 400 },
      );
    }
    const nextQuantity = (quantities.get(productId) ?? 0) + quantity;
    if (nextQuantity > 99) {
      return NextResponse.json(
        { error: "Số lượng sản phẩm vượt quá giới hạn." },
        { status: 400 },
      );
    }
    quantities.set(productId, nextQuantity);
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Hệ thống đặt hàng chưa được cấu hình. Vui lòng gọi hotline 0827.955.888 để đặt hàng.",
      },
      { status: 503 },
    );
  }

  const productIds = [...quantities.keys()];
  const { data: dbProducts, error: productsError } = await supabase
    .from("products")
    .select(
      "id, name, image, price_with_vat, price_status, stock_status, is_active",
    )
    .in("id", productIds);

  if (productsError) {
    console.error("Lỗi đọc sản phẩm khi đặt hàng:", productsError.message);
    return NextResponse.json(
      { error: "Không thể kiểm tra sản phẩm. Vui lòng thử lại." },
      { status: 500 },
    );
  }

  const productMap = new Map<number, DbOrderProduct>(
    ((dbProducts ?? []) as DbOrderProduct[]).map((product) => [
      product.id,
      product,
    ]),
  );

  let subtotal = 0;
  const orderItems: {
    product_id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[] = [];

  for (const [productId, quantity] of quantities) {
    const product = productMap.get(productId);
    if (!product || product.is_active === false) {
      return NextResponse.json(
        { error: "Có sản phẩm không còn bán. Vui lòng tải lại giỏ hàng." },
        { status: 400 },
      );
    }
    if (
      product.price_status === "contact" ||
      !product.price_with_vat ||
      product.price_with_vat <= 0
    ) {
      return NextResponse.json(
        {
          error: `Sản phẩm "${product.name}" cần liên hệ để báo giá. Vui lòng gọi hotline 0827.955.888.`,
        },
        { status: 400 },
      );
    }
    if (product.stock_status === "outofstock") {
      return NextResponse.json(
        { error: `Sản phẩm "${product.name}" đã hết hàng.` },
        { status: 400 },
      );
    }

    const unitPrice = Number(product.price_with_vat);
    const totalPrice = unitPrice * quantity;
    subtotal += totalPrice;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });
  }

  const settings = await getSettings();
  const shippingFee =
    subtotal >= settings.freeShipThreshold ? 0 : settings.shippingFee;
  const discount = paymentMethod === "bank_transfer" ? Math.round(subtotal * 0.02) : 0;
  const total = subtotal - discount + shippingFee;

  let order: { id: number; order_code: string } | null = null;
  let lastError = "";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderCode = generateOrderCode();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_note: customerNote || null,
        payment_method: paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        discount,
        total,
        status: "new",
      })
      .select("id, order_code")
      .single();

    if (!error && data) {
      order = data as { id: number; order_code: string };
      break;
    }

    lastError = error?.message ?? "Không tạo được đơn hàng";
    if (error?.code !== "23505") break;
  }

  if (!order) {
    console.error("Lỗi tạo đơn hàng:", lastError);
    return NextResponse.json(
      { error: "Không tạo được đơn hàng. Vui lòng thử lại hoặc gọi hotline." },
      { status: 500 },
    );
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    })),
  );

  if (itemsError) {
    console.error("Lỗi tạo chi tiết đơn hàng:", itemsError.message);
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Không lưu được chi tiết đơn hàng. Vui lòng thử lại." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    orderCode: order.order_code,
    subtotal,
    shippingFee,
    discount,
    total,
    paymentMethod,
    bankInfo: settings.bankInfo,
  });
}
