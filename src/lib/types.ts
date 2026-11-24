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

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface ProductAttributeOption {
  name: string;
  options: string[];
}

export interface Product {
  id: number;
  name: string;
  category: string;
  categories?: string[];
  slug?: string;
  permalink?: string;
  priceNoVAT: number;
  priceWithVAT: number;
  vatRate: number;
  retailPrice: number; // Strikethrough regular price (giá niêm yết)
  finalPrice: number;
  regularPrice?: number;
  salePrice?: number;
  supportAmount?: number;
  supportMechanism?: string;
  giftSupport?: string;
  originalPriceNoVAT?: number;
  originalPriceVAT?: number;
  image?: string;
  images?: string[]; // Multiple gallery images
  source?: string;
  specs?: ProductSpecs;
  specsTable?: ProductSpecItem[];
  shortDescription?: string;
  description?: string;
  attributes?: ProductAttributeOption[];
  brand?: "Rạng Đông" | "Kingled" | "Ledvance" | string;
  subBrand?: string;
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
