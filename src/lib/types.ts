export interface Product {
  id: number;
  name: string;
  category: string;
  priceNoVAT: number;
  priceWithVAT: number;
  vatRate: number;
  retailPrice: number;
  finalPrice: number;
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
  match: string;
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
