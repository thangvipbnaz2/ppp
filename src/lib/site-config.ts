import type { SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  hotline: "0827955888",
  storeEmail: "Chinh982@gmail.com",
  storeAddress: "Số 8 hẻm 02 ngách 44 ngõ 222, P. Văn Quán, Q. Hà Đông, TP. Hà Nội",
  shippingFee: 30000,
  freeShipThreshold: 1000000,
  bankInfo: {
    bank: "MB Bank",
    branch: "",
    accountNumber: "922072005",
    accountName: "NGUYEN VAN THANG",
    qrImage: "/qr-thanh-toan.png",
  },
};
