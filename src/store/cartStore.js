// src/store/cartStore.js
// 中文注释：购物车状态管理（CoCart）
// 用法：
// 1) 在 main.jsx 或 App.jsx 外层包裹 <CartProvider>
// 2) 组件中使用 const { cart, addItem, updateItem, clear, refreshCart } = useCart()

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
} from "../services/cocartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCart = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCart();
      setCart(data);
      return data;
    } catch (e) {
      setError(e?.message || "Failed to load cart");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await addToCart(productId, quantity);
      // 中文注释：CoCart 通常会返回更新后的 cart 或包含 cart 内容
      setCart(data);
      return data;
    } catch (e) {
      setError(e?.message || "Failed to add item");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemKey, quantity) => {
    setLoading(true);
    setError("");
    try {
      const data = await updateCartItem(itemKey, quantity);
      setCart(data);
      return data;
    } catch (e) {
      setError(e?.message || "Failed to update item");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await clearCart();
      setCart(data);
      return data;
    } catch (e) {
      setError(e?.message || "Failed to clear cart");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // 中文注释：首次进入站点自动拉取一次购物车（保证 header 购物袋数量正确）
  useEffect(() => {
    refreshCart().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      clear,
    }),
    [cart, loading, error]
  );

  // 中文注释：这里不能用 JSX（因为当前文件是 .js），改用 React.createElement 避免 Vite 解析错误
  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
