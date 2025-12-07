import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ChevronLeft, MapPin, ShieldCheck, Loader2 } from 'lucide-react'; // 引入 Loader2
import Button from '../components/Button';
// 1. 引入 Apollo Hooks 和 gql
import { useMutation, useQuery, gql } from '@apollo/client';

// 引入本地图片资源
import applePayImg from '../assets/images/payment_logos/apple_pay_logo.png';
import mastercardImg from '../assets/images/payment_logos/mastercard_logo.png';
import visaImg from '../assets/images/payment_logos/visa_logo.png';

// --- GraphQL: 获取当前登录用户信息 (用于自动填充) ---
const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      id
      email
      firstName
      lastName
    }
  }
`;

// --- GraphQL: 结账 Mutation (核心) ---
const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        total
        status
      }
      result
      redirect
    }
  }
`;

// --- 复用浮动标签输入框 (保持不变) ---
const CheckoutInput = ({ label, value, onChange, type = "text", className = "", required = false, icon, name }) => (
  <div className={`relative ${className}`}>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
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

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  
  // --- 状态管理 ---
  // 1. 表单数据 (Billing & Shipping)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    paymentMethod: 'bacs' // 默认为银行转账，这是最容易跑通的测试方式
  });

  // 2. 支付方式 UI 状态
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('new_card'); // 'new_card', 'apple'

  // --- Apollo Query: 获取用户信息 ---
  const { data: viewerData } = useQuery(GET_VIEWER, {
    onCompleted: (data) => {
      // 如果已登录，自动填充表单
      if (data?.viewer) {
        setFormData(prev => ({
          ...prev,
          firstName: data.viewer.firstName || '',
          lastName: data.viewer.lastName || '',
          email: data.viewer.email || ''
        }));
      }
    }
  });

  // --- Apollo Mutation: 结账 ---
  const [checkout, { loading: checkoutLoading, error: checkoutError }] = useMutation(CHECKOUT_MUTATION);

  // 计算总价
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; 
  const total = subtotal + shipping;

  // --- 处理输入变化 ---
  const handleInputChange = (e) => {
    const { name, value } = e.target; // 注意：CheckoutInput 需要传递 name
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // 专门适配 CheckoutInput 的 onChange 封装
  const createChangeHandler = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 核心：处理支付提交 ---
  const handlePayment = async (e) => {
    e.preventDefault();

    if (selectedPaymentMethod === 'apple') {
        alert("Apple Pay is currently unavailable via API. Please use Credit Card (Simulation).");
        return;
    }

    try {
      // 准备发送给 WordPress 的数据
      const input = {
        paymentMethod: 'bacs', // ⚠️ 关键：这里强制使用 'bacs' (Direct Bank Transfer) 或 'cheque' 以绕过真实的信用卡验证，确保订单能生成。
                               // 如果你装了 Stripe 插件并配置了 Token，这里可以是 'stripe'。
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
        },
        // 将购物车转换成 lineItems
        lineItems: cart.map(item => ({
          productId: item.id || item.databaseId, // 确保这里有 ID
          quantity: item.quantity
        }))
      };

      console.log("Submitting Order...", input);

      const { data } = await checkout({ variables: { input } });

      if (data?.checkout?.order) {
        // 成功！
        console.log("Order Created:", data.checkout.order);
        alert(`Order #${data.checkout.order.orderNumber} placed successfully!`);
        // 这里应该清空购物车，然后跳转
        // navigate('/order-confirmation', { state: { order: data.checkout.order } });
        navigate('/profile/orders'); // 暂时跳转到订单列表
      } else {
         console.error("Checkout result:", data);
         alert("Something went wrong with the checkout.");
      }

    } catch (err) {
      console.error("Checkout Error:", err);
      alert(`Checkout Failed: ${err.message}`);
    }
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
                        </h2>
                        {viewerData?.viewer ? (
                             <div className="bg-white p-4 rounded-xl border border-[#e5d5d0] text-[#5a5a5a] flex items-center justify-between">
                                <span>{viewerData.viewer.email}</span>
                                <span className="text-xs bg-[#7c2b3d]/10 text-[#7c2b3d] px-2 py-1 rounded">Logged In</span>
                             </div>
                        ) : (
                            <div className="space-y-4">
                                <CheckoutInput 
                                    label="Email address" 
                                    type="email" 
                                    required 
                                    value={formData.email}
                                    onChange={createChangeHandler('email')}
                                />
                            </div>
                        )}
                    </section>

                    {/* === 2. Shipping Address === */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Shipping Address</h2>
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <CheckoutInput label="First name" required value={formData.firstName} onChange={createChangeHandler('firstName')} />
                                <CheckoutInput label="Last name" required value={formData.lastName} onChange={createChangeHandler('lastName')} />
                            </div>
                            <CheckoutInput label="Address" required value={formData.address1} onChange={createChangeHandler('address1')} />
                            
                            <div className="grid grid-cols-3 gap-4">
                                <CheckoutInput label="City / Suburb" required value={formData.city} onChange={createChangeHandler('city')} />
                                <div className="relative">
                                    <select 
                                        className="peer w-full h-14 px-4 pt-6 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none appearance-none" 
                                        required
                                        value={formData.state}
                                        onChange={(e) => createChangeHandler('state')(e.target.value)}
                                    >
                                        <option value="" disabled hidden></option>
                                        {['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <label className="absolute left-4 top-4 transform scale-75 origin-[0] text-[#7c2b3d] pointer-events-none">State</label>
                                </div>
                                <CheckoutInput label="Postcode" required value={formData.postcode} onChange={createChangeHandler('postcode')} />
                            </div>
                            <CheckoutInput label="Phone" required value={formData.phone} onChange={createChangeHandler('phone')} />
                        </div>
                    </section>

                    {/* === 3. Payment Method === */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Payment</h2>
                        <div className="flex items-center gap-2 mb-4 text-sm text-[#9a8a85] bg-white p-3 rounded-xl border border-[#e5d5d0] w-fit">
                           <ShieldCheck size={16} className="text-[#7c2b3d]" />
                           <span>All transactions are secure and encrypted.</span>
                        </div>
                        
                        <div className="border border-[#e5d5d0] rounded-2xl overflow-hidden bg-white">
                            
                            {/* Option B: New Credit Card */}
                            <div 
                                className={`p-4 flex items-center gap-3 cursor-pointer border-b border-[#e5d5d0] transition-colors ${selectedPaymentMethod === 'new_card' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setSelectedPaymentMethod('new_card')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'new_card' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {selectedPaymentMethod === 'new_card' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Credit Card</span>
                                <div className="flex gap-2">
                                    <img src={visaImg} alt="Visa" className="h-9 w-auto object-contain" />
                                    <img src={mastercardImg} alt="Mastercard" className="h-9 w-auto object-contain" />
                                </div>
                            </div>
                            
                            {/* New Card Form */}
                            {selectedPaymentMethod === 'new_card' && (
                                <div className="p-6 bg-[#fcf9f8] space-y-4 animate-fade-in border-b border-[#e5d5d0]">
                                    {/* ⚠️ 注意：这里只是前端 UI 模拟。
                                      因为我们使用的是 Headless 模式，为了能在不配置 Stripe Token 的情况下先跑通订单，
                                      点击 "Pay" 实际上会发送 'bacs' (银行转账) 到 WordPress。
                                      这样 WordPress 会生成订单，但不需要真实的信用卡扣款。
                                    */}
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
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedPaymentMethod === 'apple' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setSelectedPaymentMethod('apple')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === 'apple' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {selectedPaymentMethod === 'apple' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Apple Pay</span>
                                <img src={applePayImg} alt="Apple Pay" className="h-9 w-auto object-contain" />
                            </div>

                            {/* Apple Pay Button */}
                            {selectedPaymentMethod === 'apple' && (
                                <div className="p-6 bg-[#fcf9f8] animate-fade-in flex justify-center">
                                    <button type="button" className="w-full bg-black text-white h-12 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                                        <span className="mr-1">Pay with</span>
                                        <img src={applePayImg} alt="Apple Pay" className="h-9 w-auto object-contain invert" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* Error Message */}
                    {checkoutError && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm">
                            {checkoutError.message}
                        </div>
                    )}

                    {/* Pay Button */}
                    {selectedPaymentMethod !== 'apple' && (
                        <Button 
                            size="lg" 
                            className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20 flex items-center justify-center gap-2" 
                            type="submit"
                            disabled={checkoutLoading}
                        >
                            {checkoutLoading ? (
                                <>Processing <Loader2 className="animate-spin" size={20} /></>
                            ) : (
                                `Pay $${total.toFixed(2)}`
                            )}
                        </Button>
                    )}
                </form>
            </div>

            {/* Right Column: Order Summary (保持你的原有代码) */}
            <div className="lg:w-[380px] h-fit lg:sticky lg:top-32">
                <div className="bg-white rounded-4xl p-8 border border-[#f0e8e4] shadow-sm">
                    <h3 className="text-xl font-serif mb-6">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {cart.map(item => (
                            <div key={item.id || item.databaseId} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-[#f8f6f4] rounded-xl flex items-center justify-center shrink-0 relative">
                                    <img src={item.image || item.image?.sourceUrl} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
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