import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart }) => { 
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-5xl mx-auto px-6">
        
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-center mb-6 tracking-tight text-[#1d1d1f]">
          Your Shopping Bag
        </h1>
        
        {cart.length > 0 && (
           <p className="text-center text-[#9a8a85] mb-12 font-light">
             Complimentary shipping on all orders over $50.
           </p>
        )}

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-[#9a8a85] mb-8 font-light">Your bag is currently empty.</p>
            <Button onClick={() => navigate('/products')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto">
            
            {/* Cart Items Container */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4] mb-8">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex flex-col md:flex-row gap-8 py-8 border-b border-[#f0e8e4] last:border-0 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }} 
                >
                   {/* Image */}
                   <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f6f4] rounded-2xl flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain mix-blend-multiply" />
                   </div>

                   {/* Details */}
                   <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1">{item.name}</h3>
                            <p className="text-sm text-[#9a8a85]">{item.category} Collection</p>
                         </div>
                         <p className="text-lg font-medium text-[#1d1d1f]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                         <div className="flex items-center gap-4 bg-[#f8f6f4] rounded-full px-4 py-2">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)} 
                              disabled={item.quantity <= 1} 
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] disabled:opacity-30 transition-colors"
                            >
                               <Minus size={16} />
                            </button>
                            <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)} 
                              className="text-[#1d1d1f] hover:text-[#7c2b3d] transition-colors"
                            >
                               <Plus size={16} />
                            </button>
                         </div>

                         <button 
                           onClick={() => onRemoveFromCart(item.id)} 
                           className="text-[#9a8a85] hover:text-[#c94e4e] text-sm flex items-center gap-2 group transition-colors"
                         >
                           <span className="hidden sm:inline group-hover:underline">Remove</span>
                           <Trash2 size={18} /> 
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4] animate-fade-in" style={{ animationDelay: '0.3s' }}>
               <div className="space-y-4 mb-8">
                 <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-[#1d1d1f]">
                    <span className="text-[#9a8a85]">Shipping</span>
                    <span className="text-[#7c2b3d] font-medium">Free</span>
                 </div>
               </div>
               
               <div className="border-t border-[#f0e8e4] pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-sm text-[#9a8a85] mb-1">Total (GST incl.)</span>
                    <div className="text-3xl font-serif font-medium text-[#1d1d1f]">${total.toFixed(2)}</div>
                  </div>
                  
                  {/* 核心修改：点击跳转到 checkout 页面 */}
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" 
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout <ArrowRight size={18} className="ml-2" />
                  </Button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;