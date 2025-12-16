
import { http } from "../lib/http";

// 中文注释：Woo Store API 基础路径
// 说明：建议优先用“相对路径”交给 http.js 去拼 VITE_WP_BASE_URL，避免误打到 localhost
// 你也可以在 .env.local 设置 VITE_WC_STORE_API 为完整 URL（例如 https://estora.au/wp-json/wc/store/v1）
const WC_STORE_BASE = (import.meta.env.VITE_WC_STORE_API || "/wp-json/wc/store/v1").replace(/\/$/, "");

// 中文注释：安全地构建 querystring（会跳过 undefined/null/空字符串）
function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v);
    if (s === "") return;
    q.set(k, s);
  });
  return q.toString();
}

// 中文注释：获取产品列表（用于 Collections/Home 等）
// Woo Store API 支持分页：page/per_page
export function getProducts(params = {}) {
  const query = buildQuery({
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
    orderby: params.orderby ?? "menu_order",
    order: params.order ?? "asc",

    // 常用筛选（按需传）
    search: params.search, // 关键字搜索
    category: params.category,
    tag: params.tag,
    featured: params.featured,
    on_sale: params.on_sale,
    min_price: params.min_price,
    max_price: params.max_price,
    stock_status: params.stock_status,
  });

  return http(`${WC_STORE_BASE}/products${query ? `?${query}` : ""}`);
}

// 中文注释：按 ID 获取单个产品详情
export function getProductById(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("getProductById: missing id");
  }
  return http(`${WC_STORE_BASE}/products/${encodeURIComponent(String(id))}`);
}

// 中文注释：按 slug 获取单个产品详情（关键修复）
// 注意：Woo Store API 并不保证支持 `?slug=` 精确筛选。
// 因此我们采用：先 search 拉一批，再在前端用 slug 精确匹配。
export async function getProductBySlug(slug) {
  const s = String(slug || "").trim();
  if (!s) throw new Error("getProductBySlug: missing slug");

  // 1) 先用 search 拉回可能结果（一般足够）
  const list = await getProducts({ search: s, per_page: 30, orderby: "relevance", order: "desc" });

  // Woo Store API 返回通常是数组；如果你这边被包装成 { products: [] } 也做兼容
  const arr = Array.isArray(list) ? list : (list?.products || list?.items || []);

  // 2) 精确匹配 slug
  const exact = arr.find((p) => String(p?.slug || "").toLowerCase() === s.toLowerCase());
  if (exact) return exact;

  // 3) 兜底：如果 search 没带回 slug 精确项，再扩大搜索范围（防止 slug 带短横/空格）
  const wider = await getProducts({ search: s.replace(/-/g, " "), per_page: 50, orderby: "relevance", order: "desc" });
  const arr2 = Array.isArray(wider) ? wider : (wider?.products || wider?.items || []);
  const exact2 = arr2.find((p) => String(p?.slug || "").toLowerCase() === s.toLowerCase());
  if (exact2) return exact2;

  throw new Error(`Product not found for slug: ${s}`);
}

// 中文注释：统一的产品详情入口（你路由用 /product/:slug 或 /product/:id 都能用）
export async function getProduct(input) {
  const v = String(input ?? "").trim();
  if (!v) throw new Error("getProduct: missing input");

  // 如果是纯数字，优先当作 ID
  if (/^\d+$/.test(v)) {
    return getProductById(v);
  }
  return getProductBySlug(v);
}
