import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ChevronLeft, MapPin, Check, Plus, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../supabaseClient';

// --- 引入本地图片资源 ---
// 假设图片位于 src/assets/images/ 目录下
// 如果你的图片在 public 目录，请改为 const applePayImg = "/assets/images/apple_pay_logo.png" 等
import applePayImg from '../assets/images/payment_logos/apple_pay_logo.png';
import mastercardImg from '../assets/images/payment_logos/mastercard_logo.png';
import visaImg from '../assets/images/payment_logos/visa_logo.png';

// --- 1. 复用浮动标签输入框 (带右上角浮动动画) ---
const CheckoutInput = ({ label, value, onChange, type = "text", className = "", required = false, icon }) => (
  <div className={`relative ${className}`}>
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className="peer w-full h-14 px-4 pt-6 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all placeholder-transparent"
      placeholder=" " 
      required={required}
    />
    <label className="absolute left-4 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out origin-[0] 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[#9a8a85] peer-placeholder-shown:text-[17px] peer-placeholder-shown:scale-100
      peer-focus:top-4 peer-focus:text-[#7c2b3d] peer-focus:scale-75
      peer-not-placeholder-shown:top-4 peer-not-placeholder-shown:text-[#7c2b3d] peer-not-placeholder-shown:scale-75">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a85]">{icon}</div>}
  </div>
);

// --- 2. 模拟的已保存数据 (仅对登录用户显示) ---
const SAVED_ADDRESS = {
  id: 1,
  firstName: 'Aurora',
  lastName: 'Member',
  line1: '123 Silk Road',
  line2: 'Level 8',
  suburb: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  phone: '0412 345 678'
};

const SAVED_CARDS = [
  { id: 1, type: 'Visa', last4: '4242', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8888', isDefault: false }
];

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // 支付状态
  const [paymentMethod, setPaymentMethod] = useState('saved_card'); // 'saved_card', 'new_card', 'apple'
  const [selectedCardId, setSelectedCardId] = useState(1); // 默认选中第一张卡
  
  // 地址状态 (登录用户可选)
  const [useSavedAddress, setUseSavedAddress] = useState(true);

  // 计算总价
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; 
  const total = subtotal + shipping;

  // 检查登录状态
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setPaymentMethod('saved_card'); // 登录用户默认使用已存卡片
      } else {
        setPaymentMethod('new_card'); // 游客默认使用新卡
      }
    };
    checkUser();
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    alert('Order processing...');
    navigate('/');
  };

  if (cart.length === 0) {
      return (
          <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-6 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-serif text-[#1d1d1f] mb-4">Your bag is empty</h2>
              <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[1200px] mx-auto pt-24 md:pt-32 px-6 pb-20">
        
        <button onClick={() => navigate('/cart')} className="text-[#9a8a85] text-sm mb-8 flex items-center hover:text-[#7c2b3d] transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Return to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left Column: Forms */}
            <div className="flex-1">
                <h1 className="text-3xl font-serif font-medium mb-8 text-[#1d1d1f]">Checkout</h1>
                
                <form onSubmit={handlePayment} className="space-y-10">
                    
                    {/* === 1. Contact Info === */}
                    <section>
                        <h2 className="text-lg font-serif mb-4 flex justify-between items-baseline">
                            Contact Information
                            {!user && (
                                <span className="text-sm font-sans text-[#9a8a85] font-normal hidden sm:inline">
                                    Already have an account? <span onClick={() => navigate('/login')} className="text-[#7c2b3d] cursor-pointer hover:underline">Log in</span>
                                </span>
                            )}
                        </h2>
                        {user ? (
                             // 登录状态：显示只读邮箱
                             <div className="bg-white p-4 rounded-xl border border-[#e5d5d0] text-[#5a5a5a] flex items-center justify-between">
                                <span>{user.email}</span>
                                <span className="text-xs bg-[#7c2b3d]/10 text-[#7c2b3d] px-2 py-1 rounded">Member</span>
                             </div>
                        ) : (
                             // 游客状态：输入邮箱
                            <div className="space-y-4">
                                <CheckoutInput label="Email address" type="email" required />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="news" className="w-4 h-4 text-[#7c2b3d] focus:ring-[#7c2b3d] border-gray-300 rounded" />
                                    <label htmlFor="news" className="text-sm text-[#5a5a5a]">Email me with news and offers</label>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* === 2. Shipping Address === */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Shipping Address</h2>
                        
                        {/* 登录用户：已保存地址展示 */}
                        {user && useSavedAddress ? (
                            <div className="bg-white rounded-2xl border border-[#7c2b3d] p-6 relative ring-1 ring-[#7c2b3d]/20 transition-all">
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-[#7c2b3d] mt-1" size={20} />
                                    <div>
                                        <p className="font-medium text-[#1d1d1f]">{SAVED_ADDRESS.firstName} {SAVED_ADDRESS.lastName}</p>
                                        <p className="text-[#5a5a5a] text-sm mt-1">{SAVED_ADDRESS.line1}, {SAVED_ADDRESS.line2}</p>
                                        <p className="text-[#5a5a5a] text-sm">{SAVED_ADDRESS.suburb}, {SAVED_ADDRESS.state} {SAVED_ADDRESS.postcode}</p>
                                        <p className="text-[#5a5a5a] text-sm mt-1">{SAVED_ADDRESS.phone}</p>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setUseSavedAddress(false)} 
                                    className="mt-4 ml-9 text-sm text-[#7c2b3d] hover:underline"
                                >
                                    Use a different address
                                </button>
                                <div className="absolute top-4 right-4 text-xs font-bold text-[#7c2b3d] bg-[#7c2b3d]/10 px-2 py-1 rounded">DEFAULT</div>
                            </div>
                        ) : (
                            // 游客/新地址表单
                            <div className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <CheckoutInput label="First name" required />
                                    <CheckoutInput label="Last name" required />
                                </div>
                                <CheckoutInput label="Address" required />
                                <CheckoutInput label="Apartment, suite, etc. (optional)" />
                                <div className="grid grid-cols-3 gap-4">
                                    <CheckoutInput label="City / Suburb" required />
                                    <div className="relative">
                                        <select className="peer w-full h-14 px-4 pt-6 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none appearance-none" required>
                                            <option value="" disabled hidden></option>
                                            {['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <label className="absolute left-4 top-4 transform scale-75 origin-[0] text-[#7c2b3d] pointer-events-none">State</label>
                                    </div>
                                    <CheckoutInput label="Postcode" required />
                                </div>
                                <CheckoutInput label="Phone" required />
                                
                                {user && (
                                    <button type="button" onClick={() => setUseSavedAddress(true)} className="text-sm text-[#9a8a85] hover:text-[#1d1d1f] underline">
                                        Cancel and use saved address
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* === 3. Payment Method === */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Payment</h2>
                        <div className="flex items-center gap-2 mb-4 text-sm text-[#9a8a85] bg-white p-3 rounded-xl border border-[#e5d5d0] w-fit">
                           <ShieldCheck size={16} className="text-[#7c2b3d]" />
                           <span>All transactions are secure and encrypted.</span>
                        </div>
                        
                        <div className="border border-[#e5d5d0] rounded-2xl overflow-hidden bg-white">
                            
                            {/* Option A: Saved Cards (Logged in only) */}
                            {user && SAVED_CARDS.map(card => (
                                <div 
                                    key={card.id}
                                    className={`p-4 flex items-center gap-3 cursor-pointer border-b border-[#e5d5d0] transition-colors ${paymentMethod === 'saved_card' && selectedCardId === card.id ? 'bg-[#fcf9f8]' : ''}`}
                                    onClick={() => { setPaymentMethod('saved_card'); setSelectedCardId(card.id); }}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'saved_card' && selectedCardId === card.id ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                        {paymentMethod === 'saved_card' && selectedCardId === card.id && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="font-medium text-[#1d1d1f]">•••• {card.last4}</span>
                                        {/* 使用图片替换 Logo */}
                                        {card.type === 'Visa' ? 
                                          <img src={visaImg} alt="Visa" className="h-9 w-auto object-contain" /> : 
                                          <img src={mastercardImg} alt="Mastercard" className="h-9 w-auto object-contain" />
                                        }
                                    </div>
                                </div>
                            ))}

                            {/* Option B: New Credit Card */}
                            <div 
                                className={`p-4 flex items-center gap-3 cursor-pointer border-b border-[#e5d5d0] transition-colors ${paymentMethod === 'new_card' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setPaymentMethod('new_card')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'new_card' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'new_card' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Credit Card</span>
                                <div className="flex gap-2">
                                    {/* 1. 在 Credit Card 右上角展示 Visa 和 Mastercard 图片 */}
                                    <img src={visaImg} alt="Visa" className="h-9 w-auto object-contain" />
                                    <img src={mastercardImg} alt="Mastercard" className="h-9 w-auto object-contain" />
                                </div>
                            </div>
                            
                            {/* New Card Form */}
                            {paymentMethod === 'new_card' && (
                                <div className="p-6 bg-[#fcf9f8] space-y-4 animate-fade-in border-b border-[#e5d5d0]">
                                    <CheckoutInput label="Card number" icon={<CreditCard size={18} />} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <CheckoutInput label="Expiration (MM / YY)" />
                                        <CheckoutInput label="Security code" icon={<Lock size={16} />} />
                                    </div>
                                    <CheckoutInput label="Name on card" />
                                </div>
                            )}

                            {/* Option C: Apple Pay */}
                            <div 
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'apple' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setPaymentMethod('apple')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'apple' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'apple' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Apple Pay</span>
                                {/* 3. 使用真正的 Apple Pay Logo 图片 */}
                                <img src={applePayImg} alt="Apple Pay" className="h-9 w-auto object-contain" />
                            </div>

                            {/* Apple Pay Button */}
                            {paymentMethod === 'apple' && (
                                <div className="p-6 bg-[#fcf9f8] animate-fade-in flex justify-center">
                                    <button type="button" className="w-full bg-black text-white h-12 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                                        {/* 3. 黑色按钮上也使用 Apple Pay Logo 图片，添加 invert class 确保在黑底上显示 (如果是黑色logo) */}
                                        <span className="mr-1">Pay with</span>
                                        <img src={applePayImg} alt="Apple Pay" className="h-9 w-auto object-contain invert" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Pay Button */}
                    {paymentMethod !== 'apple' && (
                        <Button size="lg" className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" type="submit">
                            {paymentMethod === 'saved_card' ? `Pay $${total.toFixed(2)}` : 'Confirm Order'}
                        </Button>
                    )}
                </form>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:w-[380px] h-fit lg:sticky lg:top-32">
                <div className="bg-white rounded-4xl p-8 border border-[#f0e8e4] shadow-sm">
                    <h3 className="text-xl font-serif mb-6">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-[#f8f6f4] rounded-xl flex items-center justify-center shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                                    {/* 2. 修复角标显示不全，调整位置 */}
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7c2b3d] text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm z-10">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                                    <p className="text-xs text-[#9a8a85]">{item.category}</p>
                                </div>
                                <div className="text-sm font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#f0e8e4] pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-[#5a5a5a]">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#5a5a5a]">
                            <span>Shipping</span>
                            <span className="text-[#7c2b3d]">Free</span>
                        </div>
                    </div>

                    <div className="border-t border-[#f0e8e4] mt-4 pt-4 flex justify-between items-baseline">
                        <span className="text-base font-medium">Total</span>
                        <div>
                            <span className="text-xs text-[#9a8a85] mr-2">AUD</span>
                            <span className="text-2xl font-serif font-medium text-[#1d1d1f]">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;