import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Apple, Lock, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'apple' or 'card'

  // 计算总价
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // 全场包邮
  const total = subtotal + shipping;

  const handlePayment = (e) => {
    e.preventDefault();
    alert(`Processing payment via ${paymentMethod === 'apple' ? 'Apple Pay' : 'Credit Card'}...`);
    // 这里可以添加清空购物车的逻辑
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
                    
                    {/* Contact Info */}
                    <section>
                        <h2 className="text-lg font-serif mb-4 flex justify-between items-baseline">
                            Contact Information
                            <span className="text-sm font-sans text-[#9a8a85] font-normal hidden sm:inline">Already have an account? <span className="text-[#7c2b3d] cursor-pointer hover:underline">Log in</span></span>
                        </h2>
                        <div className="space-y-4">
                            <input type="email" placeholder="Email address" required className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="news" className="w-4 h-4 text-[#7c2b3d] focus:ring-[#7c2b3d] border-gray-300 rounded" />
                                <label htmlFor="news" className="text-sm text-[#5a5a5a]">Email me with news and offers</label>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Shipping Address</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First name" required className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                                <input type="text" placeholder="Last name" required className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            </div>
                            <input type="text" placeholder="Address" required className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            <div className="grid grid-cols-3 gap-4">
                                <input type="text" placeholder="City / Suburb" required className="col-span-1 w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                                <select className="col-span-1 w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all text-[#1d1d1f]">
                                    <option value="VIC">VIC</option>
                                    <option value="NSW">NSW</option>
                                    <option value="QLD">QLD</option>
                                    <option value="WA">WA</option>
                                    <option value="SA">SA</option>
                                    <option value="TAS">TAS</option>
                                    <option value="ACT">ACT</option>
                                    <option value="NT">NT</option>
                                </select>
                                <input type="text" placeholder="Postcode" required className="col-span-1 w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            </div>
                            <div className="relative">
                                <input type="text" placeholder="Phone" required className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none transition-all" />
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section>
                        <h2 className="text-lg font-serif mb-4">Payment</h2>
                        <p className="text-sm text-[#9a8a85] mb-4">All transactions are secure and encrypted.</p>
                        
                        <div className="border border-[#e5d5d0] rounded-2xl overflow-hidden bg-white">
                            {/* Credit Card Option */}
                            <div 
                                className={`p-4 flex items-center gap-3 cursor-pointer border-b border-[#e5d5d0] transition-colors ${paymentMethod === 'card' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Credit Card</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div> {/* Visa */}
                                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div> {/* Mastercard */}
                                </div>
                            </div>
                            
                            {/* Card Form (Conditional) */}
                            {paymentMethod === 'card' && (
                                <div className="p-6 bg-[#fcf9f8] space-y-4 animate-fade-in">
                                    <div className="relative">
                                        <input type="text" placeholder="Card number" className="w-full h-12 px-4 pl-10 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none" />
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Expiration (MM / YY)" className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none" />
                                        <input type="text" placeholder="Security code" className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none" />
                                    </div>
                                    <input type="text" placeholder="Name on card" className="w-full h-12 px-4 rounded-xl border border-[#e5d5d0] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none" />
                                </div>
                            )}

                            {/* Apple Pay Option */}
                            <div 
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'apple' ? 'bg-[#fcf9f8]' : ''}`}
                                onClick={() => setPaymentMethod('apple')}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'apple' ? 'border-[#7c2b3d]' : 'border-gray-300'}`}>
                                    {paymentMethod === 'apple' && <div className="w-2.5 h-2.5 rounded-full bg-[#7c2b3d]"></div>}
                                </div>
                                <span className="font-medium flex-1">Apple Pay</span>
                                <Apple size={20} className="text-black" />
                            </div>

                            {/* Apple Pay Button (Conditional) */}
                            {paymentMethod === 'apple' && (
                                <div className="p-6 bg-[#fcf9f8] animate-fade-in flex justify-center">
                                    <button type="button" className="w-full bg-black text-white h-12 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                                        Pay with <Apple size={18} className="mb-0.5" /> <span className="font-semibold">Pay</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Pay Button */}
                    <Button size="lg" className="w-full h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" type="submit">
                        {paymentMethod === 'card' ? `Pay $${total.toFixed(2)}` : 'Confirm Order'}
                    </Button>
                </form>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:w-[380px] h-fit lg:sticky lg:top-32">
                <div className="bg-white rounded-4xl p-8 border border-[#f0e8e4] shadow-sm">
                    <h3 className="text-xl font-serif mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-[#f8f6f4] rounded-xl flex items-center justify-center shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7c2b3d] text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
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