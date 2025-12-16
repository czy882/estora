// src/lib/wpProducts.js
// 中文注释：通过 WooCommerce Store API 按 slug 获取产品（避免走本地 /api 造成 404）

import { http } from "./http";

// 中文注释：Woo Store API 基址（优先用 env，否则走站点的 /wp-json/wc/store/v1）
const WC_STORE_BASE =
  import.meta.env.VITE_WC_STORE_API || "/wp-json/wc/store/v1";

/**
 * 中文注释：按 slug 获取单个产品
 * - Woo Store API 支持：GET /products?slug={slug}
 * - 返回通常是数组（可能为空）
 */
export async function fetchProductBySlug(slug) {
  const s = String(slug || "").trim();
  if (!s) throw new Error("Missing slug");

  const url = `${WC_STORE_BASE}/products?slug=${encodeURIComponent(s)}&per_page=1`;
  const data = await http(url, { method: "GET" });

  // 中文注释：Store API 返回是数组；极少数情况下也可能是 { products: [] }
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : [];

  return arr[0] || null;
}