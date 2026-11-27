import { NextResponse } from "next/server";
import { getSettings } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();

  return NextResponse.json(
    {
      hotline: settings.hotline,
      shipping_fee: settings.shippingFee,
      free_ship_threshold: settings.freeShipThreshold,
      bank_info: {
        bank: settings.bankInfo.bank,
        branch: settings.bankInfo.branch ?? "",
        account_number: settings.bankInfo.accountNumber,
        account_name: settings.bankInfo.accountName,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
