// src/services/cocartApi.js
import { http } from "../lib/http";

// 中文注释：CoCart API 基址
const COCART_BASE = import.meta.env.VITE_COCART_API || "/wp-json/cocart/v2";

// 中文注释：获取购物车
export function getCart() {
  return http(`${COCART_BASE}/cart`, { method: "GET" });
}

// ✅ 关键修复：add-item 在不同 CoCart 版本/扩展下，参数名可能是 id 或 product_id
// - 你现在报：Invalid parameter(s): id  => 说明此端点不接受 id
// - 我们做自动 fallback：先试 id，失败再试 product_id（或反过来）
export async function addToCart(productId, quantity = 1) {
  const pid = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1);

  if (!pid || Number.isNaN(pid)) {
    throw new Error("Missing/invalid product id");
  }

  // 中文注释：很多站点对类型很敏感（string 更稳）
  const payloadId = { id: String(pid), quantity: String(qty) };
  const payloadProductId = { product_id: String(pid), quantity: String(qty) };

  try {
    return await http(`${COCART_BASE}/cart/add-item`, {
      method: "POST",
      body: payloadId,
    });
  } catch (e1) {
    const msg = String(e1?.message || "");
    const dataMsg = String(e1?.data?.message || "");

    // 中文注释：如果后端明确说 id 不合法，就改用 product_id
    if (msg.includes("Invalid parameter(s): id") || dataMsg.includes("Invalid parameter(s): id")) {
      return await http(`${COCART_BASE}/cart/add-item`, {
        method: "POST",
        body: payloadProductId,
      });
    }

    // 中文注释：如果后端说缺 product_id，也尝试另一种
    if (
      msg.includes("Missing parameter(s): product_id") ||
      dataMsg.includes("Missing parameter(s): product_id")
    ) {
      return await http(`${COCART_BASE}/cart/add-item`, {
        method: "POST",
        body: payloadProductId,
      });
    }

    // 其它错误直接抛出
    throw e1;
  }
}

// 中文注释：更新某个 item 数量（CoCart v2：/cart/item/{item_key}）
export function updateCartItem(itemKey, quantity) {
  const key = encodeURIComponent(String(itemKey || "").trim());
  const qty = Math.max(1, Number(quantity) || 1);

  if (!key) throw new Error("Missing item key");

  // 中文注释：同样用 string 更稳
  return http(`${COCART_BASE}/cart/item/${key}`, {
    method: "POST",
    body: { quantity: String(qty) },
  });
}

// ✅ 删除某个 item（优先 DELETE，失败则 quantity=0）
export async function removeCartItem(itemKey) {
  const key = encodeURIComponent(String(itemKey || "").trim());
  if (!key) throw new Error("Missing item key");

  try {
    return await http(`${COCART_BASE}/cart/item/${key}`, { method: "DELETE" });
  } catch (e) {
    return await http(`${COCART_BASE}/cart/item/${key}`, {
      method: "POST",
      body: { quantity: "0" },
    });
  }
}

// 中文注释：清空购物车
export function clearCart() {
  return http(`${COCART_BASE}/cart/clear`, { method: "POST" });
}