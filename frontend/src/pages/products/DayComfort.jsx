import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, ShieldCheck, Leaf, Droplets, Wind } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

const DayComfort = ({ onAddToCart }) => {
  // 注意：不再使用 useParams()，因为路由是固定的。
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // 核心修复：直接查找 ID 为 1 的 Day Comfort 产品
  const product = PRODUCTS.find(p => p.id === 1);

  if (!product) return <div className="pt-32 text-center">Product data for Day Comfort is missing. Please check products.js.</div>;

  // 处理数量加减
  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f] animate-fade-in">
      
      {/* === Main Product Section (Sticky Layout) === */}
      <div className="max-w-[1400px] mx-auto pt-24 md:pt-32 px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Sticky Gallery (预留图片位) */}
          <div className="lg:w-1/2 h-fit lg:sticky lg:top-32">
            {/* 主图：包装展示 */}
            <div className="bg-[#f8f6f4] rounded-[3rem] aspect-4/5 mb-6 relative overflow-hidden flex items-center justify-center group">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute bottom-6 left-0 w-full text-center text-[#9a8a85] text-xs tracking-widest uppercase">
                  Premium Packaging
               </div>
            </div>
            
            {/* 缩略图/细节图网格 */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                 <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Silk+Texture+Macro" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Texture" />
                 <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">Macro Texture</span>
               </div>
               <div className="bg-[#f8f6f4] rounded-4xl aspect-square relative overflow-hidden group cursor-pointer">
                 <img src="https://placehold.co/600x600/fdfbfb/7c2b3d?text=Ultra+Thin+Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thin Profile" />
                 <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-widest text-[#7c2b3d]">0.1cm Ultra-Thin</span>
               </div>
            </div>
          </div>

          {/* Right Column: Product Info & Story (滚动内容) */}
          <div className="lg:w-1/2 pb-20">
            {/* 面包屑 */}
            <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-6 flex items-center hover:text-[#7c2b3d] transition-colors">
              <ChevronRight className="rotate-180 mr-1" size={14} /> Back to Home
            </button>

            {/* 标题与价格 */}
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1d1d1f] mb-3 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500 mb-8 font-light">{product.tagline}</p>
            
            <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
               <span className="text-3xl font-medium">${product.price}</span>
               <span className="text-sm text-gray-400">GST Included</span>
            </div>

            {/* 简短描述 */}
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              {product.description} Designed for the modern Australian lifestyle, our Day Comfort pads combine the 
              luxury of <strong>100% Mulberry Silk</strong> with patented absorbency technology. 
              Perfect for active days, office hours, or light movement.
            </p>

            {/* 核心规格选择/展示 */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</div>
                  <div className="font-medium">{product.specs[0]}</div>
               </div>
               <div className="border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Quantity</div>
                  <div className="font-medium">{product.specs[2]}</div>
               </div>
            </div>

            {/* 购买操作区 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 sticky top-4 z-20 bg-white/90 backdrop-blur-sm py-4">
               {/* 数量选择器 */}
               <div className="flex items-center justify-between bg-[#f5f5f7] rounded-full px-4 h-14 sm:w-40">
                  <button onClick={() => handleQuantity('dec')} className="text-xl px-2 hover:text-[#7c2b3d]">-</button>
                  <span className="font-medium">{quantity}</span>
                  <button onClick={() => handleQuantity('inc')} className="text-xl px-2 hover:text-[#7c2b3d]">+</button>
               </div>
               {/* 添加购物车按钮 */}
               <Button 
                 className="flex-1 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" 
                 onClick={() => onAddToCart({...product, quantity})}
               >
                 Add to Cart - ${(product.price * quantity).toFixed(2)}
               </Button>
            </div>

            {/* === 详细卖点介绍 (基于 PPT) === */}
            <div className="space-y-16 mt-16">
               
               {/* Feature 1: 材质 (The Material) */}
               <div className="animate-slide-up">
                 <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Leaf size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Nature's Embrace</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Skincare for your intimate area.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Unlike synthetic alternatives, our top sheet is crafted from <strong>100% Natural Mulberry Silk</strong>. 
                     Rich in 18 amino acids and natural proteins, it actively nourishes delicate skin, 
                     maintaining a balanced pH of 5.7 to prevent irritation.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                     <li className="flex gap-2"><Check size={16} className="text-[#7c2b3d]"/> 99% Natural Antibacterial (Sericin)</li>
                     <li className="flex gap-2"><Check size={16} className="text-[#7c2b3d]"/> Reduces itchiness and redness</li>
                     <li className="flex gap-2"><Check size={16} className="text-[#7c2b3d]"/> Hypoallergenic & Dermatologist tested</li>
                  </ul>
               </div>

               {/* Feature 2: 工艺 (The Technology) */}
               <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <Wind size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Breathable Engineering</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">The Global Exclusive Patent.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     We use a revolutionary <strong>Spunlace Technology</strong> (water-jet entanglement) instead of glues 
                     to bond the silk layer. This creates a structure that is incredibly porous and breathable, 
                     eliminating the "sauna effect" of traditional pads.
                  </p>
                  <div className="bg-[#f8f6f4] p-6 rounded-2xl">
                     <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-[#7c2b3d] shadow-sm">
                           <Droplets size={20} />
                        </div>
                        <div>
                           <div className="font-serif text-lg mb-1">50x Instant Absorption</div>
                           <p className="text-xs text-gray-500 leading-relaxed">
                              Our core locks fluid instantly—holding up to 50x its own weight—keeping the surface 
                              dry and pristine. No reverse osmosis, just confidence.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature 3: 安全 (The Promise) */}
               <div className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4 text-[#7c2b3d]">
                     <ShieldCheck size={24} />
                     <h3 className="text-sm font-bold uppercase tracking-widest">Medical-Grade Purity</h3>
                  </div>
                  <h4 className="text-3xl font-serif mb-4">Zero compromise on safety.</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     We believe period care should be as clean as the food you eat. AURORA pads are manufactured 
                     in a medical-grade sterile environment.
                  </p>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                     {['0 Fluorescent Agents', '0 Bleach', '0 Formaldehyde', '0 Plasticizers'].map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></div>
                           {item}
                        </div>
                     ))}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayComfort;