import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Lock, CreditCard } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../store/cartStore';
import { http } from '../lib/http';

// 中文注释：金额安全转数字（兼容 CoCart/Woo 的对象价格结构）
const toNumber = (v) => {
  if (v === null || v === undefined) return 0;

  if (typeof v === 'number') return Number.isNaN(v) ? 0 : v;

  // CoCart/Woo 可能返回对象：{ value, min_purchase, max_purchase }
  if (typeof v === 'object') {
    const raw = v?.value ?? v?.min_purchase ?? v?.max_purchase ?? v?.amount ?? v?.price;
    return toNumber(raw);
  }

  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(n)) return 0;

  // 中文注释：自动识别 cents → dollars（常见：2499 表示 $24.99）
  if (Number.isInteger(n) && Math.abs(n) >= 1000) return n / 100;

  return n;
};

// 中文注释：格式化金额（AUD）
const money = (v) => {
  const n = toNumber(v);
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);
};

// 中文注释：浮动标签输入（沿用你网站的视觉风格）
const FloatingInput = ({ label, value, onChange, type = 'text', required = false, autoComplete }) => {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full h-14 px-4 pt-5 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all placeholder-transparent"
      />
      <label className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out text-[#9a8a85] text-[17px] select-none origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#7c2b3d] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[#7c2b3d]">
        {label}
      </label>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();

  // ✅ 来自 WooCommerce 的真实购物车（CoCart）
  const { cart, loading: cartLoading, error: cartError, refreshCart } = useCart();

  // 中文注释：CoCart 可能返回 items 为数组或对象（item_key -> item）
  const items = useMemo(() => {
    const raw = cart?.items;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') return Object.values(raw);
    return [];
  }, [cart]);

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

  // ================================
  // 1) Checkout 表单状态
  // ================================
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('AU');

  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [sAddress1, setSAddress1] = useState('');
  const [sAddress2, setSAddress2] = useState('');
  const [sCity, setSCity] = useState('');
  const [sState, setSState] = useState('');
  const [sPostcode, setSPostcode] = useState('');
  const [sCountry, setSCountry] = useState('AU');

  // ================================
  // 2) Payment Methods（从 Woo Store API 拉取）
  // ================================
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  // ================================
  // 3) 提交状态
  // ================================
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 中文注释：进入页面时刷新购物车（避免 UI 与后端不同步）
  useEffect(() => {
    refreshCart?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 中文注释：拉取可用支付方式（Woo Blocks / Store API）
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setPaymentLoading(true);
        setPaymentError(null);

        // Woo Store API：/wp-json/wc/store/v1/payment-methods
        const res = await http('/wp-json/wc/store/v1/payment-methods', { method: 'GET' });

        const list = Array.isArray(res) ? res : (res?.payment_methods || res?.methods || []);
        const enabled = (list || []).filter((m) => m && (m.enabled === true || m.enabled === 'yes' || m.status === 'enabled'));

        if (!alive) return;
        setPaymentMethods(enabled);
        // 默认选第一个
        if (!paymentMethod) {
          setPaymentMethod(enabled?.[0]?.id || '');
        }
      } catch (e) {
        if (!alive) return;
        setPaymentError(e?.message || 'Failed to load payment methods.');
        setPaymentMethods([]);
      } finally {
        if (!alive) return;
        setPaymentLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 中文注释：购物车为空 → 回到购物
  if (!cartLoading && items.length === 0) {
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

  // ================================
  // 4) 提交订单（Woo Store API Checkout）
  // ================================
  const placeOrder = async () => {
    setSubmitError(null);

    // 基本校验（前端轻校验）
    if (!email || !firstName || !lastName) {
      setSubmitError('Please fill in your name and email.');
      return;
    }
    if (!address1 || !city || !postcode || !state) {
      setSubmitError('Please fill in your billing address (Street, City, State, Postcode).');
      return;
    }

    // 中文注释：如果支付方式没加载出来，就允许继续（Woo 端会给错误信息）
    const chosenPayment = paymentMethod || paymentMethods?.[0]?.id || '';

    const billing_address = {
      first_name: firstName,
      last_name: lastName,
      address_1: address1,
      address_2: address2,
      city,
      state,
      postcode,
      country,
      email,
      phone,
    };

    const shipping_address = shipToDifferent
      ? {
          first_name: firstName,
          last_name: lastName,
          address_1: sAddress1 || address1,
          address_2: sAddress2 || address2,
          city: sCity || city,
          state: sState || state,
          postcode: sPostcode || postcode,
          country: sCountry || country,
        }
      : {
          first_name: firstName,
          last_name: lastName,
          address_1: address1,
          address_2: address2,
          city,
          state,
          postcode,
          country,
        };

    try {
      setSubmitting(true);

      // 中文注释：提交前强制刷新一次购物车，减少“改了又回去”的视觉问题
      await refreshCart?.();

      // Woo Store API checkout：/wp-json/wc/store/v1/checkout
      // 说明：不同支付网关会要求 payment_data。这里先走“网关自己跳转”的标准流程。
      const res = await http('/wp-json/wc/store/v1/checkout', {
        method: 'POST',
        body: {
          billing_address,
          shipping_address,
          payment_method: chosenPayment,
          // 中文注释：大多数网关会忽略空 payment_data；如果你的网关需要字段再补
          payment_data: [],
        },
      });

      // Woo Blocks 通常会返回 payment_result.redirect_url 或 redirect_url
      const redirectUrl =
        res?.payment_result?.redirect_url ||
        res?.redirect_url ||
        res?.payment_result?.payment_url ||
        res?.payment_url;

      // 中文注释：下单成功后清理/刷新购物车
      await refreshCart?.();

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // 没有跳转则认为已完成（例如货到付款）
      alert('Order placed successfully.');
      navigate('/profile/orders');
    } catch (e) {
      setSubmitError(e?.message || 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

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
          {/* Left Column: Custom Checkout Form */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6 text-sm text-[#9a8a85]">
              <Lock size={16} className="text-[#7c2b3d]" />
              <span>Secure, fully custom checkout — powered by WooCommerce.</span>
            </div>

            {(cartError || submitError || paymentError) && (
              <div className="p-4 bg-[#fdf2f4] text-[#7c2b3d] rounded-xl text-sm mb-6 border border-[#f0d5da]">
                {submitError || paymentError || cartError}
              </div>
            )}

            {/* Contact */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#f0e8e4] shadow-sm mb-8">
              <h2 className="text-xl font-serif font-medium mb-6">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput label="First Name" value={firstName} onChange={setFirstName} required autoComplete="given-name" />
                <FloatingInput label="Last Name" value={lastName} onChange={setLastName} required autoComplete="family-name" />
                <div className="md:col-span-2">
                  <FloatingInput label="Email" value={email} onChange={setEmail} type="email" required autoComplete="email" />
                </div>
                <div className="md:col-span-2">
                  <FloatingInput label="Phone (optional)" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#f0e8e4] shadow-sm mb-8">
              <h2 className="text-xl font-serif font-medium mb-6">Billing Address</h2>
              <div className="space-y-4">
                <FloatingInput label="Address Line 1" value={address1} onChange={setAddress1} required autoComplete="address-line1" />
                <FloatingInput label="Address Line 2 (optional)" value={address2} onChange={setAddress2} autoComplete="address-line2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput label="City" value={city} onChange={setCity} required autoComplete="address-level2" />
                  <FloatingInput label="State" value={state} onChange={setState} required autoComplete="address-level1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput label="Postcode" value={postcode} onChange={setPostcode} required autoComplete="postal-code" />
                  <FloatingInput label="Country" value={country} onChange={setCountry} required autoComplete="country" />
                </div>

                <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shipToDifferent}
                    onChange={(e) => setShipToDifferent(e.target.checked)}
                    className="h-5 w-5 rounded-md border border-[#e5d5d0] accent-[#7c2b3d]"
                  />
                  <span className="text-sm text-[#5a5a5a]">Ship to a different address</span>
                </label>
              </div>
            </div>

            {/* Shipping Address */}
            {shipToDifferent && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#f0e8e4] shadow-sm mb-8">
                <h2 className="text-xl font-serif font-medium mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <FloatingInput label="Address Line 1" value={sAddress1} onChange={setSAddress1} required autoComplete="shipping address-line1" />
                  <FloatingInput label="Address Line 2 (optional)" value={sAddress2} onChange={setSAddress2} autoComplete="shipping address-line2" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput label="City" value={sCity} onChange={setSCity} required autoComplete="shipping address-level2" />
                    <FloatingInput label="State" value={sState} onChange={setSState} required autoComplete="shipping address-level1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput label="Postcode" value={sPostcode} onChange={setSPostcode} required autoComplete="shipping postal-code" />
                    <FloatingInput label="Country" value={sCountry} onChange={setSCountry} required autoComplete="shipping country" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#f0e8e4] shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-serif font-medium">Payment</h2>
                <div className="inline-flex items-center gap-2 text-xs text-[#9a8a85]">
                  <CreditCard size={14} /> Powered by WooCommerce
                </div>
              </div>

              {paymentLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#9a8a85]">
                  <Loader2 className="animate-spin" size={18} /> Loading payment methods…
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.length === 0 ? (
                    <div className="text-sm text-[#9a8a85]">
                      No payment methods detected. Please enable a gateway in WooCommerce.
                    </div>
                  ) : (
                    paymentMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${
                          paymentMethod === m.id ? 'border-[#7c2b3d] bg-[#fcf9f8]' : 'border-[#f0e8e4] bg-white hover:bg-[#fcf9f8]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={m.id}
                            checked={paymentMethod === m.id}
                            onChange={() => setPaymentMethod(m.id)}
                            className="h-4 w-4 accent-[#7c2b3d]"
                          />
                          <div>
                            <div className="text-sm font-medium text-[#1d1d1f]">{m.title || m.name || m.id}</div>
                            {m.description && (
                              <div className="text-xs text-[#9a8a85]">{String(m.description).replace(/<[^>]*>?/gm, '')}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-[#9a8a85]">Secure</div>
                      </label>
                    ))
                  )}

                  <div className="pt-3">
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20"
                      onClick={placeOrder}
                      disabled={submitting || cartLoading}
                    >
                      {submitting ? (
                        <span className="inline-flex items-center gap-2">
                          Placing order <Loader2 className="animate-spin" size={18} />
                        </span>
                      ) : (
                        `Pay ${money(total)}`
                      )}
                    </Button>
                    <div className="mt-3 text-xs text-[#9a8a85]">
                      By placing your order, you agree to our Terms & Privacy Policy.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[380px] h-fit lg:sticky lg:top-32">
            <div className="bg-white rounded-4xl p-8 border border-[#f0e8e4] shadow-sm">
              <h3 className="text-xl font-serif mb-6">Order Summary</h3>

              {cartLoading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-[#7c2b3d]" size={28} />
                </div>
              )}

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => {
                  const imageCandidate =
                    item?.featured_image ||
                    item?.image ||
                    item?.images?.[0] ||
                    item?.images?.[0]?.src ||
                    item?.images?.[0]?.source_url ||
                    'https://placehold.co/600x600/f8f6f4/7c2b3d?text=No+Image';

                  const image = typeof imageCandidate === 'string'
                    ? imageCandidate
                    : (imageCandidate?.src || imageCandidate?.source_url || 'https://placehold.co/600x600/f8f6f4/7c2b3d?text=No+Image');

                  const qty = Math.max(1, toNumber(item?.quantity) || 1);

                  const lineTotal =
                    item?.totals?.line_total ??
                    item?.totals?.total ??
                    item?.line_total ??
                    (toNumber(item?.price) * qty);

                  return (
                    <div key={item?.item_key || item?.key || item?.id || item?.product_id || `${item?.name || 'item'}-${Math.random()}`} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#f8f6f4] rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                        <img
                          src={image}
                          alt={item?.name || 'Item'}
                          className="w-12 h-12 object-contain mix-blend-multiply"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7c2b3d] text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm z-10">
                          {qty}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item?.name || 'Item'}</h4>
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

              <div className="mt-6 text-xs text-[#9a8a85]">
                Checkout is processed by WooCommerce — your details are securely handled.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;