import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, CreditCard, Trash2, Check, Lock, ShieldCheck } from 'lucide-react';
import Button from '../../components/Button';

// --- 本地复用：浮动标签输入框 ---
const FloatingInput = ({ label, value, onChange, type = "text", icon, maxLength, placeholder = " " }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className="peer w-full h-14 px-4 pt-5 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all placeholder-transparent"
      placeholder={placeholder}
    />
    <label className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out text-[#9a8a85] text-[17px] select-none origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#7c2b3d] peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[#7c2b3d]">
      {label}
    </label>
    {icon && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a85]">
        {icon}
      </div>
    )}
  </div>
);

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  // 模拟已保存的卡片
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', holder: 'AURORA MEMBER', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/25', holder: 'AURORA MEMBER', isDefault: false },
  ]);

  const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '', cvc: '' });

  const handleAddCard = (e) => {
    e.preventDefault();
    // 简单的模拟添加逻辑
    const id = Math.max(...cards.map(c => c.id), 0) + 1;
    const type = newCard.number.startsWith('5') ? 'Mastercard' : 'Visa';
    setCards([...cards, { 
      id, 
      type, 
      last4: newCard.number.slice(-4) || '0000', 
      expiry: newCard.expiry, 
      holder: newCard.holder.toUpperCase(), 
      isDefault: cards.length === 0 
    }]);
    setIsAdding(false);
    setNewCard({ number: '', holder: '', expiry: '', cvc: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this payment method?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center hover:border-[#7c2b3d] hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">Wallet & Billing</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* === 左侧：卡片列表 === */}
          <div className="lg:col-span-2 space-y-6">
            {cards.map((card) => (
              <div key={card.id} className={`bg-white rounded-4xl p-8 shadow-sm border transition-all relative group overflow-hidden ${card.isDefault ? 'border-[#7c2b3d] ring-1 ring-[#7c2b3d]/20' : 'border-[#f0e8e4]'}`}>
                
                {/* 默认标签 */}
                {card.isDefault && (
                  <div className="absolute top-0 right-0 bg-[#7c2b3d] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-xl">
                    Default
                  </div>
                )}

                <div className="flex items-start gap-6">
                   {/* 卡片图标模拟 */}
                   <div className="w-16 h-10 bg-[#1d1d1f] rounded-lg flex items-center justify-center text-white shadow-md">
                      {card.type === 'Visa' ? <span className="font-serif italic font-bold">VISA</span> : <div className="flex -space-x-2"><div className="w-4 h-4 rounded-full bg-[#eb001b]"></div><div className="w-4 h-4 rounded-full bg-[#f79e1b]"></div></div>}
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-xl font-medium tracking-widest">•••• {card.last4}</h3>
                      </div>
                      <p className="text-sm text-[#9a8a85] mb-4">Expires {card.expiry}</p>
                      <p className="text-xs font-bold text-[#1d1d1f] tracking-widest uppercase">{card.holder}</p>
                   </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-6 mt-8 pt-6 border-t border-[#f5efec]">
                   {!card.isDefault && (
                     <button 
                       onClick={() => handleSetDefault(card.id)}
                       className="text-sm text-[#1d1d1f] hover:text-[#7c2b3d] font-medium transition-colors"
                     >
                       Set as Default
                     </button>
                   )}
                   <button 
                     className="text-sm text-[#1d1d1f] hover:text-[#7c2b3d] underline decoration-[#e5d5d0] hover:decoration-[#7c2b3d] underline-offset-4 transition-all"
                   >
                     Edit Billing Address
                   </button>
                   <button 
                     onClick={() => handleDelete(card.id)}
                     className="text-sm text-[#9a8a85] hover:text-[#c94e4e] flex items-center gap-1 transition-colors ml-auto"
                   >
                     Remove
                   </button>
                </div>
              </div>
            ))}

            {/* 添加新卡按钮 */}
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full bg-[#fcf9f8] rounded-4xl p-8 border-2 border-dashed border-[#e5d5d0] text-[#9a8a85] hover:border-[#7c2b3d] hover:text-[#7c2b3d] hover:bg-white transition-all flex flex-col items-center justify-center gap-3 group h-[180px]"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center group-hover:border-[#7c2b3d] transition-colors">
                  <Plus size={24} />
                </div>
                <span className="font-medium tracking-wide">ADD PAYMENT METHOD</span>
              </button>
            )}
          </div>

          {/* === 右侧/下方：添加新卡表单 === */}
          {isAdding && (
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-[#f0e8e4] animate-slide-up mt-4 lg:mt-0">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif">Add Card</h2>
                  <button onClick={() => setIsAdding(false)} className="text-[#9a8a85] hover:text-[#1d1d1f]">Cancel</button>
               </div>

               <div className="flex items-center gap-2 mb-6 text-sm text-[#9a8a85] bg-[#f8f6f4] p-3 rounded-xl">
                  <ShieldCheck size={16} className="text-[#7c2b3d]" />
                  <span>Your payment information is encrypted and secure.</span>
               </div>

               <form onSubmit={handleAddCard} className="space-y-5">
                  <FloatingInput 
                    label="Card Number" 
                    value={newCard.number} 
                    onChange={v => setNewCard({...newCard, number: v})} 
                    icon={<CreditCard size={18} />}
                    maxLength={19}
                  />
                  
                  <FloatingInput 
                    label="Cardholder Name" 
                    value={newCard.holder} 
                    onChange={v => setNewCard({...newCard, holder: v})} 
                  />
                  
                  <div className="grid grid-cols-2 gap-5">
                    <FloatingInput 
                      label="Expiry (MM/YY)" 
                      value={newCard.expiry} 
                      onChange={v => setNewCard({...newCard, expiry: v})} 
                      maxLength={5}
                    />
                    <FloatingInput 
                      label="CVC" 
                      type="password"
                      value={newCard.cvc} 
                      onChange={v => setNewCard({...newCard, cvc: v})} 
                      icon={<Lock size={16} />}
                      maxLength={4}
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    <Button type="submit" size="lg" className="shadow-xl shadow-[#7c2b3d]/20 px-10">Save Card</Button>
                  </div>
               </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;