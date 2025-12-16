// src/pages/Cart.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Button from "../components/Button";
import { useCart } from "../store/cartStore";

// ================================
// ✅ 工具函数：价格解包 + 格式化
// ================================

// 中文注释：把后端可能返回的各种 price 结构统一转成 number
function getPriceNumber(priceLike) {
  if (priceLike == null) return 0;

  if (typeof priceLike === "number") return priceLike;

  if (typeof priceLike === "string") {
    const n = Number(priceLike.replace(/[^\d.]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }

  if (typeof priceLike === "object") {
    const v = priceLike.value ?? priceLike.min_purchase ?? priceLike.max_purchase;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }

  return 0;
}

// 中文注释：把“分(cents)”自动转换为“元(dollars)”
function normalizeMoney(n) {
  const num = Number(n) || 0;
  // 经验规则：>= 1000 的整数通常是 cents（例如 2999 -> 29.99）
  if (Number.isInteger(num) && num >= 1000) return num / 100;
  return num;
}

function formatAUD(n) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(Number(n) || 0);
}

function normalizeCartItems(cart) {
  if (!cart) return [];
  if (Array.isArray(cart)) return cart;

  const maybeItems =
    cart.items ?? cart.line_items ?? cart.cart_items ?? cart.cart_contents ?? cart.contents;

  if (!maybeItems) return [];
  if (Array.isArray(maybeItems)) return maybeItems;
  if (typeof maybeItems === "object") return Object.values(maybeItems);
  return [];
}

function getItemKey(item) {
  return item?.item_key ?? item?.key ?? item?.cart_item_key ?? item?.id;
}

function getItemName(item) {
  return item?.name ?? item?.product_name ?? item?.title ?? "Item";
}

function getItemImage(item) {
  if (typeof item?.image === "string") return item.image;
  if (item?.images?.[0]?.src) return item.images[0].src;
  if (item?.images?.[0]?.source_url) return item.images[0].source_url;
  if (item?.featured_image) return item.featured_image;
  return null;
}

function getItemQuantity(item) {
  const q = item?.quantity ?? item?.qty ?? item?.quantity?.value;
  const n = Number(q);
  return Number.isNaN(n) || n <= 0 ? 1 : n;
}

// 中文注释：尽量统一拿到“单价”（CoCart 常给 item.price / item.price_raw / item.prices?.price）
function getItemUnitPrice(item) {
  if (item?.price_raw != null) return normalizeMoney(getPriceNumber(item.price_raw));
  if (item?.price != null) return normalizeMoney(getPriceNumber(item.price));
  if (item?.prices?.price != null) return normalizeMoney(getPriceNumber(item.prices.price));

  // 中文注释：如果只有 totals（往往是行总价），就按 qty 反推单价
  const qty = getItemQuantity(item);
  const line =
    item?.totals?.line_total ??
    item?.totals?.line_subtotal ??
    item?.line_total ??
    item?.line_subtotal;

  if (line != null && qty > 0) return normalizeMoney(getPriceNumber(line)) / qty;

  return 0;
}

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <div
    className={`animate-slide-up ${className}`}
    style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: "forwards" }}
  >
    {children}
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, refreshCart, updateItem, removeItem } = useCart();

  // 中文注释：局部乐观 UI（避免“请求成功但页面不变”的观感）
  const [optimisticQty, setOptimisticQty] = useState({});
  const [optimisticHidden, setOptimisticHidden] = useState({});

  const items = useMemo(() => normalizeCartItems(cart), [cart]);

  // 中文注释：进入页面强制拉一次最新 cart
  useEffect(() => {
    refreshCart().catch(() => {});
  }, [refreshCart]);

  // 中文注释：当服务端 cart 更新后，只清理“已经同步成功”的乐观缓存，避免 UI 先变后又被清空导致闪烁/回滚
  useEffect(() => {
    // 1) 清理已同步的数量乐观值
    setOptimisticQty((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;
      const next = { ...prev };
      for (const it of items) {
        const k = getItemKey(it);
        if (!k) continue;
        const serverQty = getItemQuantity(it);
        if (next[k] != null && Number(next[k]) === Number(serverQty)) {
          delete next[k];
        }
      }
      return next;
    });

    // 2) 清理已同步的“隐藏(删除)”乐观值：服务端已不存在该 item 时才清理
    setOptimisticHidden((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;
      const next = { ...prev };
      const serverKeys = new Set(items.map((it) => String(getItemKey(it) ?? "")).filter(Boolean));
      for (const k of Object.keys(next)) {
        // 若服务端已没有该 key，则认为删除已确认，移除隐藏标记
        if (!serverKeys.has(String(k))) {
          delete next[k];
        }
      }
      return next;
    });
  }, [items]);

  const viewItems = useMemo(() => {
    // 中文注释：把 “已删除” 的 item 先从 UI 隐藏
    return items.filter((it) => {
      const k = getItemKey(it);
      return !k || !optimisticHidden[k];
    });
  }, [items, optimisticHidden]);

  const total = useMemo(() => {
    return viewItems.reduce((acc, item) => {
      const key = getItemKey(item);
      const qty = key && optimisticQty[key] != null ? optimisticQty[key] : getItemQuantity(item);
      const unit = getItemUnitPrice(item);
      return acc + unit * qty;
    }, 0);
  }, [viewItems, optimisticQty]);

  const hasItems = viewItems.length > 0;

  // ================================
  // 事件：更新数量 / 删除
  // ================================

  const handleSetQty = async (item, nextQty) => {
    const key = getItemKey(item);
    if (!key) return;

    const qty = Math.max(1, Math.floor(Number(nextQty) || 1));

    // ✅ 乐观更新
    setOptimisticQty((prev) => ({ ...prev, [key]: qty }));

    try {
      // 中文注释：让 store 自己用接口返回来更新 cart；这里不强制 refresh，避免马上被旧 cart 覆盖回滚
      await updateItem(key, qty);
    } catch (e) {
      console.error("[Cart] update qty failed:", e);
      // 回滚：刷新一次纠正
      refreshCart().catch(() => {});
    }
  };

  const handleRemove = async (item) => {
    const key = getItemKey(item);
    if (!key) return;

    // ✅ 乐观隐藏
    setOptimisticHidden((prev) => ({ ...prev, [key]: true }));

    try {
      // 中文注释：不强制 refresh，避免成功后立刻被旧 cart 覆盖回滚
      await removeItem(key);
    } catch (e) {
      console.error("[Cart] remove failed:", e);
      // 回滚：取消隐藏并刷新
      setOptimisticHidden((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      refreshCart().catch(() => {});
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f]">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-center mb-6 tracking-tight text-[#1d1d1f]">
            Your Shopping Bag
          </h1>
        </FadeIn>

        {hasItems && (
          <FadeIn delay={100}>
            <p className="text-center text-[#9a8a85] mb-12 font-light">
              Complimentary shipping on all orders over $50.
            </p>
          </FadeIn>
        )}

        {error && (
          <div className="max-w-[900px] mx-auto mb-8">
            <div className="bg-white rounded-[2.5rem] p-6 border border-[#f0e8e4] text-[#7c2b3d] text-sm text-center">
              {error?.message || String(error)}
            </div>
          </div>
        )}

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <FadeIn delay={200} className="relative mb-8">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <ShoppingBag size={64} strokeWidth={1} className="text-[#e5d5d0]" />
              </div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#7c2b3d]/10 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 left-2 w-4 h-4 bg-[#7c2b3d]/20 rounded-full blur-sm"></div>
            </FadeIn>

            <FadeIn delay={300} className="text-center">
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-3">Your bag is currently empty</h2>
              <p className="text-[#9a8a85] mb-10 font-light max-w-md mx-auto">
                Looks like you haven&apos;t added anything yet. Explore our collection of premium silk care.
              </p>
              <Button
                size="lg"
                className="shadow-xl shadow-[#7c2b3d]/10 px-10"
                onClick={() => navigate("/products")}
              >
                Start Shopping
              </Button>
            </FadeIn>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto">
            <FadeIn delay={200}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4] mb-8">
                {viewItems.map((item, index) => {
                  const key = getItemKey(item) ?? index;
                  const serverQty = getItemQuantity(item);
                  const qty = optimisticQty[key] != null ? optimisticQty[key] : serverQty;

                  const unit = getItemUnitPrice(item);
                  const lineTotal = unit * qty;

                  const name = getItemName(item);
                  const image = getItemImage(item);

                  return (
                    <div key={key} className="flex flex-col md:flex-row gap-8 py-8 border-b border-[#f0e8e4] last:border-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f6f4] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                        {image ? (
                          <img src={image} alt={name} className="w-3/4 h-3/4 object-contain mix-blend-multiply" />
                        ) : (
                          <div className="text-xs text-[#9a8a85]">No Image</div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-6">
                          <div className="min-w-0">
                            <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1 truncate">{name}</h3>
                            <p className="text-sm text-[#9a8a85]">
                              {item?.variation?.[0]?.value || item?.variant || item?.category || "ESTORA Collection"}
                            </p>
                          </div>

                          <p className="text-lg font-medium text-[#1d1d1f] whitespace-nowrap">{formatAUD(lineTotal)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2">
                            <button
                              onClick={() => handleSetQty(item, qty - 1)}
                              disabled={loading || qty <= 1}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="font-medium text-sm w-4 text-center">{qty}</span>

                            <button
                              onClick={() => handleSetQty(item, qty + 1)}
                              disabled={loading}
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            disabled={loading}
                            className="text-[#9a8a85] hover:text-[#c94e4e] text-sm flex items-center gap-2 group transition-colors disabled:opacity-40"
                          >
                            <span className="hidden sm:inline group-hover:underline">Remove</span>
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {unit > 0 && (
                          <div className="mt-4 text-xs text-[#9a8a85]">Unit price: {formatAUD(unit)}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Subtotal</span>
                    <span className="font-medium">{formatAUD(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Shipping</span>
                    <span className="text-[#7c2b3d] font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-[#f0e8e4] pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-sm text-[#9a8a85] mb-1">Total (GST incl.)</span>
                    <div className="text-3xl font-serif font-medium text-[#1d1d1f]">{formatAUD(total)}</div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                    onClick={() => navigate("/checkout")}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        Updating <Loader2 className="animate-spin" size={18} />
                      </span>
                    ) : (
                      <>
                        Checkout <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;