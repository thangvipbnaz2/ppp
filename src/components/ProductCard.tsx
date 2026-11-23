"use client";

import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToQuote?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Category badge */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
          {product.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="space-y-2">
          {product.priceWithVAT > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Giá có VAT:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(product.priceWithVAT)}
              </span>
            </div>
          )}
          {product.priceNoVAT > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Giá chưa VAT:</span>
              <span className="text-sm text-gray-700">
                {formatCurrency(product.priceNoVAT)}
              </span>
            </div>
          )}
          {product.retailPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Giá lẻ:</span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.retailPrice)}
              </span>
            </div>
          )}
        </div>

        {product.vatRate > 0 && (
          <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            VAT: {(product.vatRate * 100).toFixed(0)}%
          </div>
        )}

        {onAddToQuote && (
          <button
            onClick={() => onAddToQuote(product)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm vào báo giá
          </button>
        )}
      </div>
    </div>
  );
}
