import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Moon, Shield, Droplets, Star, Maximize } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

const OvernightProtection = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // 获取 ID 为 3 的产品 (Overnight Protection)
  const product = PRODUCTS.find(p => p.id === 3);

  if (!product) return <div className="pt-32 text-center">Product data missing</div>;

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f] animate-fade-in">
      
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* === Left: Visual Gallery === */}
          <div className="lg:w-1/2 h-fit lg:sticky lg:top-32">
            {/* 主图：深邃的夜空蓝背景，体现极致安全感 */}
            <div className="bg-[#1a1a2e]/5 rounded-[3rem] aspect-4/5 mb-6 relative overflow-hidden flex items-center justify-center group">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute bottom-6 left-0 w-full text-center text-[#576574] text-xs tracking-widest uppercase">
                  Maximum Coverage
               </div>
            </div>
            
            {/* 细节图 */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                  <img src="https://placehold.co/600x600/1a1a2e/ffffff?text=350mm+Max" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Length" />
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-white/90 mix-blend-difference">350mm Length</span>
               </div>
               <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                  <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Wider+Back" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Wider Back" />
                  <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">Wider Fan Tail</span>
               </div>
            </div>
          </div>

          {/* === Right: Content === */}
          <div className="lg:w-1/2 pb-20">
            <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-6 flex items-center hover:text-[#7c2b3d] transition-colors">
              <ChevronRight className="rotate-180 mr-1" size={14} /> Back to Home
            </button>

            <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1d1d1f] mb-3 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500 mb-8 font-light flex items-center gap-2">
              <Star size={20} className="text-[#7c2b3d] fill-[#7c2b3d]" /> {product.tagline}
            </p>
            
            <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
               <span className="text-3xl font-medium">${product.price}</span>
               <span className="text-sm text-gray-400">GST Included</span>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              For your heaviest nights, trust in our longest protection yet. The <strong>Overnight Protection</strong> features 
              an extended <strong>350mm length</strong> and a wider fan-shaped back, providing absolute security no matter how you sleep.
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</div>
                  <div className="font-medium">{product.specs[0]}</div>
               </div>
               <div className="border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Absorbency</div>
                  <div className="font-medium">Maximum / Heavy Flow</div>
               </div>
            </div>

            {/* Purchase Action */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 sticky top-4 z-20 bg-white/90 backdrop-blur-sm py-4">
               <div className="flex items-center justify-between bg-[#f5f5f7] rounded-full px-4 h-14 sm:w-40">
                  <button onClick={() => handleQuantity('dec')} className="text-xl px-2 hover:text-[#7c2b3d]">-</button>
                  <span className="font-medium">{quantity}</span>
                  <button onClick={() => handleQuantity('inc')} className="text-xl px-2 hover:text-[#7c2b3d]">+</button>
               </div>
               <Button 
                 className="flex-1 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" 
                 onClick={() => onAddToCart({...product, quantity})}
               >
                 Add to Cart - ${(product.price * quantity).toFixed(2)}
               </Button>
            </div>

            {/* Detailed Features */}
            <div className="space-y-16 mt-16">
               
               {/* Feature 1: 350mm Coverage */}
               <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Maximize size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">350mm Max Coverage</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Sleep in any position.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Designed for restless sleepers and heavy flow. The <strong>extra-long 350mm body</strong> and widened back fan design 
                     catch fluids before they can leak, giving you the confidence to sleep soundly until morning.
                  </p>
               </div>

               {/* Feature 2: Tech */}
               <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Droplets size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Instant Lock Tech</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Heavy flow? No problem.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Our patented core handles surges effortlessly, absorbing up to <strong>50x its weight</strong>. 
                     Even on your heaviest nights, the silk surface stays dry against your skin, preventing that damp, uncomfortable feeling.
                  </p>
               </div>

               {/* Feature 3: Silk Benefits */}
               <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Moon size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Silk Sleep Therapy</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Gentle on sensitive skin.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Long hours of wear require the gentlest touch. Our <strong>100% Mulberry Silk</strong> is naturally hypoallergenic 
                     and breathable, reducing the risk of heat rash and irritation that often comes with synthetic overnight pads.
                  </p>
                  <div className="flex gap-4 text-sm font-medium text-gray-500">
                     <span className="flex items-center gap-2"><Shield size={16} className="text-[#7c2b3d]"/> 0% Plastic Contact</span>
                     <span className="flex items-center gap-2"><Shield size={16} className="text-[#7c2b3d]"/> Breathable Back</span>
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvernightProtection;