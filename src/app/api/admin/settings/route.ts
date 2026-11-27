import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/server-data";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình." },
      { status: 503 },
    );
  }

  let body: {
    hotline?: string;
    storeEmail?: string;
    storeAddress?: string;
    shippingFee?: number | string;
    freeShipThreshold?: number | string;
    bankInfo?: {
      bank?: string;
      branch?: string;
      accountNumber?: string;
      accountName?: string;
      qrImage?: string;
    };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const current = await getSettings();
  const hotline = String(body.hotline ?? current.hotline).trim();
  if (hotline.length < 8 || hotline.length > 20) {
    return NextResponse.json(
      { error: "Hotline không hợp lệ." },
      { status: 400 },
    );
  }

  const bankInfo = {
    bank: String(body.bankInfo?.bank ?? current.bankInfo.bank ?? "").trim(),
    branch: String(body.bankInfo?.branch ?? current.bankInfo.branch ?? "").trim(),
    accountNumber: String(
      body.bankInfo?.accountNumber ?? current.bankInfo.accountNumber ?? "",
    ).trim(),
    accountName: String(
      body.bankInfo?.accountName ?? current.bankInfo.accountName ?? "",
    ).trim(),
    qrImage: String(
      body.bankInfo?.qrImage ?? current.bankInfo.qrImage ?? "",
    ).trim(),
  };

  const entries = [
    { key: "hotline", value: hotline },
    { key: "store_email", value: String(body.storeEmail ?? current.storeEmail).trim() },
    { key: "store_address", value: String(body.storeAddress ?? current.storeAddress).trim() },
    {
      key: "shipping_fee",
      value: toNumber(body.shippingFee, current.shippingFee),
    },
    {
      key: "free_ship_threshold",
      value: toNumber(body.freeShipThreshold, current.freeShipThreshold),
    },
    { key: "bank_info", value: bankInfo },
  ];

  const { error } = await supabase
    .from("settings")
    .upsert(entries, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(await getSettings());
}
