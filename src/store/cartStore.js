// src/store/cartStore.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cocartApi";

// 中文注释：Cart Context
const CartContext = createContext(null);

// 中文注释：把 CoCart 返回的结构尽量原样保存（避免你 UI 解析字段出错）
function normalizeCart(cart) {
  return cart || null;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false); // 中文注释：拉取购物车 loading
  const [updating, setUpdating] = useState(false); // 中文注释：加减/删除等操作 loading
  const [error, setError] = useState(null);

  // 中文注释：防止无限并发/循环请求
  const inFlightRef = useRef(false);

  // ================================
  // 1) 拉取购物车（只允许串行）
  // ================================
  const refreshCart = useCallback(async () => {
    if (inFlightRef.current) return; // 中文注释：正在请求就别重复打
    inFlightRef.current = true;

    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(normalizeCart(data));
    } catch (e) {
      setError(e?.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, []);

  // ✅ 关键修复：只在 Provider 首次挂载时拉一次
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // ================================
  // 2) 加入购物车
  // ================================
  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      setUpdating(true);
      setError(null);
      const data = await addToCart(productId, quantity);
      // 中文注释：CoCart 正常会直接返回最新 cart
      setCart(normalizeCart(data));
      return data;
    } catch (e) {
      setError(e?.message || "Failed to add item");
      throw e;
    } finally {
      setUpdating(false);
    }
  }, []);

  // ================================
  // 3) 更新数量
  // ✅ 关键修复：Cart.jsx 通常传的是 delta（+1 / -1），但 CoCart 需要“绝对数量”
  // 这里同时兼容：
  // - 传入 delta：+1 / -1
  // - 传入绝对数量：>= 1 的整数
  // ================================
  function getCartItemsArray(c) {
    if (!c) return [];

    // CoCart 常见：items 是对象（item_key -> item）或数组
    const maybeItems =
      c.items ?? c.line_items ?? c.cart_items ?? c.cart_contents ?? c.contents;

    if (!maybeItems) return [];
    if (Array.isArray(maybeItems)) return maybeItems;
    if (typeof maybeItems === "object") return Object.values(maybeItems);
    return [];
  }

  function getItemQtyFromCart(c, itemKey) {
    const items = getCartItemsArray(c);
    if (!items.length) return 1;

    const found = items.find((it) => {
      const key = it?.item_key ?? it?.key ?? it?.cart_item_key;
      return String(key) === String(itemKey);
    });

    // CoCart 常见：quantity 是 number 或 { value }
    const q = found?.quantity?.value ?? found?.quantity ?? found?.qty;
    const n = Number(q);
    return Number.isNaN(n) || n <= 0 ? 1 : n;
  }

  const updateItem = useCallback(
    async (itemKey, change) => {
      try {
        setUpdating(true);
        setError(null);

        if (!itemKey) throw new Error("Missing item key");

        // 中文注释：判断是 delta 还是 absolute
        const raw = Number(change);
        const isDelta = raw === 1 || raw === -1;

        const currentQty = getItemQtyFromCart(cart, itemKey);

        // 中文注释：如果传的是 delta，就用当前数量推导 nextQty；否则当作绝对数量
        const nextQty = isDelta ? currentQty + raw : raw;

        const qty = Math.max(1, Number(nextQty) || 1);

        const data = await updateCartItem(itemKey, qty);
        setCart(normalizeCart(data));
        return data;
      } catch (e) {
        setError(e?.message || "Failed to update item");
        throw e;
      } finally {
        setUpdating(false);
      }
    },
    [cart]
  );

  // ================================
  // 4) 删除 item
  // ================================
  const removeItem = useCallback(async (itemKey) => {
    try {
      setUpdating(true);
      setError(null);

      const data = await removeCartItem(itemKey);
      setCart(normalizeCart(data));
      return data;
    } catch (e) {
      setError(e?.message || "Failed to remove item");
      throw e;
    } finally {
      setUpdating(false);
    }
  }, []);

  // ================================
  // 5) 清空购物车
  // ================================
  const clear = useCallback(async () => {
    try {
      setUpdating(true);
      setError(null);

      const data = await clearCart();
      setCart(normalizeCart(data));
      return data;
    } catch (e) {
      setError(e?.message || "Failed to clear cart");
      throw e;
    } finally {
      setUpdating(false);
    }
  }, []);

  // 中文注释：提供给外部消费的 value（useMemo 防止无意义重渲染）
  const value = useMemo(
    () => ({
      cart,
      loading,
      updating,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clear,
    }),
    [cart, loading, updating, error, refreshCart, addItem, updateItem, removeItem, clear]
  );

  // ❗不能用 JSX（因为这是 .js 文件），用 createElement 返回
  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}