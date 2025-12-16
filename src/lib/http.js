// src/lib/http.js
// 中文注释：统一封装网络请求，集中处理 JSON 解析、错误信息、JWT、cookie（CoCart/Woo 会用到）

// ================================
// WordPress 基址读取（Vite Env）
// ================================
const WP_BASE_RAW = String(
  import.meta.env.VITE_WP_BASE_URL || import.meta.env.VITE_WP_BASE || ""
).trim();
const WP_BASE = WP_BASE_RAW.replace(/\/$/, "");

// ================================
// 基址校验（防止误打 localhost）
// ================================
function assertWpBaseConfigured(path) {
  if (WP_BASE) return;
  if (!path) return;

  const p = String(path);
  const isWpApiPath =
    p.startsWith("/wp-json/") || p === "/wp-json" || p.startsWith("wp-json/");

  if (isWpApiPath) {
    throw new Error(
      `未配置 WordPress 基址：
请在 .env.local 设置
VITE_WP_BASE_URL=https://estora.au

当前读取到：
WP_BASE_RAW='${WP_BASE_RAW || ""}'

注意：修改 .env.local 后必须重启 npm run dev`
    );
  }
}

// ================================
// URL 解析
// ================================
function resolveUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  assertWpBaseConfigured(path);

  if (!WP_BASE) return path;
  return `${WP_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ================================
// CoCart Cart Key 存储 key
// ================================
const CART_KEY_STORAGE = "cocartCartKey";

// 中文注释：判断是否是 CoCart 请求
function isCoCart(url) {
  return (
    typeof url === "string" &&
    (url.includes("/wp-json/cocart/") || url.includes("/wp-json/cocart"))
  );
}

// 中文注释：清理明显错误的 cart key（比如你现在的 "1"）
function normalizeCartKey(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  // 明显错误/占位值（你现在常见的就是 "1"）
  if (s === "0" || s === "1" || s === "null" || s === "undefined") return "";
  return s;
}

// ================================
// HTTP 主函数
// ================================
export async function http(path, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
    signal,
  } = options;

  const url = resolveUrl(path);
  const cocart = isCoCart(url);

  // ---------- body 处理 ----------
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && body !== null;
  const shouldJson = hasBody && !isFormData && typeof body === "object";
  const finalBody = shouldJson ? JSON.stringify(body) : body;

  // ---------- headers ----------
  const finalHeaders = {
    ...headers,
    ...(shouldJson ? { "Content-Type": "application/json" } : {}),
  };

  // ================================
  // 自动注入 JWT Token（用于 estora/v1/me 等）
  // ✅ 关键：CoCart 请求不要自动带 Authorization，避免被安全插件/规则拦截导致 403
  // ================================
  if (!cocart) {
    if (!finalHeaders.Authorization && !finalHeaders.authorization) {
      const token = localStorage.getItem("authToken");
      if (token) finalHeaders.Authorization = `Bearer ${token}`;
    }
  } else {
    // 中文注释：确保 CoCart 请求不带 JWT
    delete finalHeaders.Authorization;
    delete finalHeaders.authorization;
  }

  // ================================
  // ✅ CoCart 会话关键：只使用 CoCart-API-Cart-Key
  // 目标：彻底杜绝任何 cart-token 之类的 header（会触发预检 CORS 或被服务端拒绝）
  // 同时，如果外部传入了错误 key（例如 "1"），这里会自动清理。
  // ================================
  if (cocart) {
    // 1) 先统一清理所有可能导致 CORS 预检失败/403 的 header（无论大小写）
    for (const k of Object.keys(finalHeaders)) {
      const lk = k.toLowerCase();

      // 禁止 cart-token（你之前 Network 里出现过 cart-token: 1）
      if (lk === "cart-token" || lk === "carttoken") {
        delete finalHeaders[k];
        continue;
      }

      // 允许我们自己管理 cocart cart key；若外部传入也会做规范化
      if (lk === "cocart-api-cart-key") {
        const cleaned = normalizeCartKey(finalHeaders[k]);
        if (!cleaned) {
          delete finalHeaders[k];
        } else {
          // 统一成标准写法
          delete finalHeaders[k];
          finalHeaders["CoCart-API-Cart-Key"] = cleaned;
        }
        continue;
      }
    }

    // 2) 如果外部没有提供有效 key，则尝试使用本地保存的 key
    const externalKey = normalizeCartKey(
      finalHeaders["CoCart-API-Cart-Key"] || finalHeaders["cocart-api-cart-key"]
    );

    if (!externalKey) {
      const saved = normalizeCartKey(localStorage.getItem(CART_KEY_STORAGE));
      if (saved) {
        finalHeaders["CoCart-API-Cart-Key"] = saved;
      } else {
        // 没有有效 key 就不要强行塞任何占位值
        delete finalHeaders["CoCart-API-Cart-Key"];
      }
    } else {
      // 确保规范化后写回标准 header
      finalHeaders["CoCart-API-Cart-Key"] = externalKey;
      delete finalHeaders["cocart-api-cart-key"];
    }

    // 3) 再次兜底：永远不允许 cart-token
    delete finalHeaders["Cart-Token"];
    delete finalHeaders["cart-token"];
    delete finalHeaders["Cart-token"];

    // 可选调试：确认最终发出的 CoCart headers
    // console.log("[CoCart HTTP]", method, url, { ...finalHeaders });
  }

  // ---------- fetch ----------
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials,
    signal,
  });

  // ================================
  // ✅ 保存 CoCart 返回的 Cart Key（响应头）
  // ================================
  if (cocart) {
    const newKey =
      res.headers.get("CoCart-API-Cart-Key") ||
      res.headers.get("cocart-api-cart-key");

    const normalized = normalizeCartKey(newKey);
    if (normalized) {
      localStorage.setItem(CART_KEY_STORAGE, normalized);
    } else {
      // 如果服务端没给有效 key（或给了错误值），不要保留旧的脏 key
      // 这能避免你遇到的 key=1 导致的 403 循环。
      localStorage.removeItem(CART_KEY_STORAGE);
    }
  }

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      `Request failed: ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    err.url = url;
    err.method = method;
    throw err;
  }

  return data;
}