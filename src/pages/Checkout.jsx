import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../store/cartStore';

// 中文注释：金额字符串安全转数字
const toNumber = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? 0 : n;
};

// 中文注释：格式化金额
const money = (v) => `$${toNumber(v).toFixed(2)}`;

const Checkout = () => {
  const navigate = useNavigate();

  // ✅ 来自 WooCommerce 的真实购物车（CoCart）
  const { cart, loading, error, refreshCart } = useCart();

  const items = cart?.items || [];

  // 中文注释：优先使用后端 totals（含税/折扣等更准确），没有就兜底前端计算
  const total = useMemo(() => {
    const serverTotal = cart?.totals?.total ?? cart?.totals?.total_price ?? null;
    if (serverTotal !== null && serverTotal !== undefined) return toNumber(serverTotal);

    return items.reduce((acc, item) => {
      const line =
        item?.totals?.line_total ??
        item?.totals?.total ??
        item?.line_total ??
        (toNumber(item?.price) * toNumber(item?.quantity));
      return acc + toNumber(line);
    }, 0);
  }, [cart, items]);

  // 中文注释：Woo 原生结账地址（最稳）
  const WP_CHECKOUT_URL = import.meta.env.VITE_WP_CHECKOUT_URL || 'https://estora.au/checkout/';

  // 中文注释：如果购物车为空，提示返回购物
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-[#1d1d1f] mb-4">Your bag is empty</h2>
        <p className="text-[#9a8a85] font-light mb-10 text-center max-w-md">
          Add items to your bag before checking out.
        </p>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[1200px] mx-auto pt-24 md:pt-32 px-6 pb-20">
        <button
          onClick={() => navigate('/cart')}
          className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Return to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Secure handoff */}
          <div className="flex-1">
            <h1 className="text-3xl font-serif font-medium mb-4 text-[#1d1d1f]">Secure Checkout</h1>

            <div className="flex items-center gap-2 mb-6 text-sm text-[#9a8a85] bg-white p-3 rounded-xl border border-[#e5d5d0] w-fit">
              <ShieldCheck size={16} className="text-[#7c2b3d]" />
              <span>We’ll take you to our secure checkout to complete payment.</span>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#f0e8e4] shadow-sm">
              <h2 className="text-lg font-serif mb-3">Before you continue</h2>
              <p className="text-[#6e6e73] font-light leading-relaxed mb-6">
                Your shopping bag is saved on our store server (WooCommerce). You’ll complete address, shipping and payment
                on the official checkout page.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="h-14 text-lg shadow-xl shadow-[#7c2b3d]/20 flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    // 中文注释：跳转前刷新一次，避免极端情况下 cart 不同步
                    refreshCart?.();
                    window.location.href = WP_CHECKOUT_URL;
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Preparing <Loader2 className="animate-spin" size={20} />
                    </>
                  ) : (
                    <>
                      Continue to Checkout <ArrowRight size={18} className="ml-1" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg flex-1"
                  onClick={() => navigate('/products')}
                >
                  Keep Shopping
                </Button>
              </div>

              <div className="mt-6 text-xs text-[#9a8a85]">
                Tip: If you use Apple Pay / Stripe / Afterpay, those payment options will appear on the checkout page.
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[380px] h-fit lg:sticky lg:top-32">
            <div className="bg-white rounded-4xl p-8 border border-[#f0e8e4] shadow-sm">
              <h3 className="text-xl font-serif mb-6">Order Summary</h3>

              {loading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-[#7c2b3d]" size={28} />
                </div>
              )}

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => {
                  const image =
                    item?.featured_image ||
                    item?.image ||
                    item?.images?.[0] ||
                    'https://placehold.co/600x600/f8f6f4/7c2b3d?text=No+Image';

                  const lineTotal =
                    item?.totals?.line_total ??
                    item?.totals?.total ??
                    item?.line_total ??
                    (toNumber(item?.price) * toNumber(item?.quantity));

                  return (
                    <div key={item?.item_key || item?.key} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#f8f6f4] rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                        <img
                          src={image}
                          alt={item?.name}
                          className="w-12 h-12 object-contain mix-blend-multiply"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7c2b3d] text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm z-10">
                          {item?.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item?.name}</h4>
                        <p className="text-xs text-[#9a8a85] truncate">ESTORA</p>
                      </div>

                      <div className="text-sm font-medium">{money(lineTotal)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#f0e8e4] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5a5a5a]">
                  <span>Subtotal</span>
                  <span>{money(total)}</span>
                </div>
                <div className="flex justify-between text-[#5a5a5a]">
                  <span>Shipping</span>
                  <span className="text-[#7c2b3d]">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#f0e8e4] mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-base font-medium">Estimated Total</span>
                <div>
                  <span className="text-xs text-[#9a8a85] mr-2">AUD</span>
                  <span className="text-2xl font-serif font-medium text-[#1d1d1f]">{money(total)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.href = WP_CHECKOUT_URL}
                  className="w-full text-xs text-[#9a8a85] hover:text-[#7c2b3d] underline underline-offset-4 transition-colors"
                >
                  Open checkout in a new page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;