export interface ProductSpecs {
  power?: string;
  voltage?: string;
  cri?: string;
  cct?: string;
  lumen?: string;
  chipLed?: string;
  lifespan?: string;
  dimensions?: string;
  cutout?: string;
  ipRating?: string;
  warranty?: string;
  discountNote?: string;
  rawSpecs?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  priceNoVAT: number;
  priceWithVAT: number;
  vatRate: number;
  retailPrice: number;
  finalPrice: number;
  supportAmount?: number;
  supportMechanism?: string;
  giftSupport?: string;
  originalPriceNoVAT?: number;
  originalPriceVAT?: number;
  image?: string;
  specs?: ProductSpecs;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
}

export interface PriceComparison {
  stt: number;
  productName: string;
  webPrice: number;
  specs: string;
  retailPriceNoVAT: number;
  retailPriceVAT: number;
  match: string;
  excelPriceNoVAT: number;
  excelPriceVAT: number;
  supportAmount: number;
  finalPriceVAT: number;
  oldPriceT8: string;
  conclusion: string;
}

export interface FormProduct {
  sheetName: string;
  products: {
    name: string;
    quantity: number;
    listPrice: number;
  }[];
}
