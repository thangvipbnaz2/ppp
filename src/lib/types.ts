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

export type PriceStatus = "available" | "contact";
export type StockStatus = "instock" | "outofstock";

export interface Product {
  id: number;
  sku?: string;
  name: string;
  category: string;
  categorySlug?: string;
  categoryOriginal?: string;
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
  installationImages?: string[]; // Real-world installation & application photos
  highlights?: string[]; // Key selling points ("Tại sao đáng mua")
  applications?: string[]; // Suitable installation spaces
  source?: string;
  specs?: ProductSpecs;
  specsTable?: ProductSpecItem[];
  shortDescription?: string;
  description?: string;
  attributes?: ProductAttributeOption[];
  brand?: "Rạng Đông" | "Kingled" | "Ledvance" | string;
  subBrand?: string;
  priceStatus?: PriceStatus;
  stockStatus?: StockStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: number;
}

export interface CategoryGroup {
  id?: number;
  slug: string;
  name: string;
  icon: string;
  description: string;
  sortOrder: number;
  categories: string[];
  count?: number;
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  image?: string;
  readTime?: string;
  date?: string;
  highlights: string[];
  sections: { heading: string; content: string }[];
  content?: string;
  published: boolean;
  publishedAt?: string;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer";

export interface OrderItem {
  id?: number;
  productId: number | null;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items?: OrderItem[];
}

export interface BankInfo {
  bank: string;
  branch?: string;
  accountNumber: string;
  accountName: string;
}

export interface SiteSettings {
  hotline: string;
  storeEmail: string;
  storeAddress: string;
  shippingFee: number;
  freeShipThreshold: number;
  bankInfo: BankInfo;
}

export interface DealerRegistration {
  id: number;
  name: string;
  phone: string;
  company?: string;
  interest?: string;
  note?: string;
  status: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
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
