"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface QuoteItem {
  product: Product;
  quantity: number;
}

export default function QuotePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json").then((r) => r.json()),
      fetch("/data/categories.json").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result.slice(0, 50);
  }, [products, selectedCategory, searchQuery]);

  const addToQuote = (product: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setQuoteItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (productId: number) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalNoVAT = quoteItems.reduce(
    (sum, item) => sum + item.product.priceNoVAT * item.quantity,
    0
  );
  const totalVAT = quoteItems.reduce(
    (sum, item) => sum + item.product.priceWithVAT * item.quantity,
    0
  );
  const vatAmount = totalVAT - totalNoVAT;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tạo báo giá</h1>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Product picker */}
        <div className="lg:col-span-2 print:hidden">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📦</span> Chọn sản phẩm
            </h2>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToQuote(product)}
                  className="w-full text-left bg-gray-50 hover:bg-blue-50 rounded-lg p-3 transition-colors border border-transparent hover:border-blue-200"
                >
                  <div className="text-sm font-medium text-gray-800 truncate">{product.name}</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{product.category}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(product.priceWithVAT)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Quote Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white print:bg-blue-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-blue-800 text-2xl shadow-lg">
                  AP
                </div>
                <div>
                  <h2 className="text-xl font-bold">CÔNG TY AN PHÚ</h2>
                  <p className="text-blue-200 text-sm">Thiết bị điện & Chiếu sáng LED</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mt-4">BÁO GIÁ SẢN PHẨM</h3>
              <p className="text-center text-blue-200 text-sm mt-1">
                Ngày: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>

            {/* Customer info */}
            <div className="p-6 border-b border-gray-100 print:hidden">
              <h3 className="font-semibold text-gray-700 mb-3">Thông tin khách hàng</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tên khách hàng / Công ty"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Customer info print */}
            {(customerName || customerAddress) && (
              <div className="hidden print:block p-6 border-b">
                <p className="text-sm"><strong>Khách hàng:</strong> {customerName}</p>
                {customerAddress && <p className="text-sm"><strong>Địa chỉ:</strong> {customerAddress}</p>}
              </div>
            )}

            {/* Items table */}
            <div className="p-6">
              {quoteItems.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-3 font-semibold text-gray-600 rounded-l-lg">STT</th>
                          <th className="text-left py-3 px-3 font-semibold text-gray-600">Sản phẩm</th>
                          <th className="text-center py-3 px-3 font-semibold text-gray-600 print:hidden">SL</th>
                          <th className="text-center py-3 px-3 font-semibold text-gray-600 hidden print:table-cell">SL</th>
                          <th className="text-right py-3 px-3 font-semibold text-gray-600">Đơn giá</th>
                          <th className="text-right py-3 px-3 font-semibold text-gray-600">Thành tiền</th>
                          <th className="text-center py-3 px-3 font-semibold text-gray-600 rounded-r-lg print:hidden">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {quoteItems.map((item, idx) => (
                          <tr key={item.product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3 text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-gray-800">{item.product.name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{item.product.category}</div>
                            </td>
                            <td className="py-3 px-3 text-center print:hidden">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                  className="w-14 text-center py-1 border border-gray-200 rounded-md text-sm"
                                />
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center hidden print:table-cell">{item.quantity}</td>
                            <td className="py-3 px-3 text-right text-gray-700">
                              {formatCurrency(item.product.priceWithVAT)}
                            </td>
                            <td className="py-3 px-3 text-right font-semibold text-gray-800">
                              {formatCurrency(item.product.priceWithVAT * item.quantity)}
                            </td>
                            <td className="py-3 px-3 text-center print:hidden">
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex justify-end">
                      <div className="w-full sm:w-72 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tổng chưa VAT:</span>
                          <span className="font-medium">{formatCurrency(totalNoVAT)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Thuế VAT:</span>
                          <span className="font-medium">{formatCurrency(vatAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-blue-600 border-t border-gray-200 pt-2">
                          <span>TỔNG CỘNG:</span>
                          <span>{formatCurrency(totalVAT)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 print:hidden">
                    <button
                      onClick={handlePrint}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      In báo giá
                    </button>
                    <button
                      onClick={() => setQuoteItems([])}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
                  <p className="text-gray-500">Chọn sản phẩm từ danh sách bên trái để thêm vào báo giá</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
