import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { PRODUCTS } from '../data/products';

const Home = () => {
  const navigate = useNavigate();

  return (
    // 柔和的奶油色背景，品牌色选中文本
    <div className="bg-[#f8f6f4] text-[#1d1d1f] min-h-screen font-sans selection:bg-[#7c2b3d] selection:text-white">
      
      {/* === Hero Section: 核心竞争力展示 === */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center z-10 relative">
          
          {/* 1. 文字区域：强调桑蚕丝与专利 */}
          <div className="animate-slide-up max-w-4xl mb-12">
            <div className="inline-block mb-4 px-3 py-1 border border-[#7c2b3d] rounded-full text-[10px] font-bold tracking-widest text-[#7c2b3d] uppercase">
              Global Exclusive Patent
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-6 text-[#7c2b3d]">
              The luxury of 100% Silk.
            </h2>
            <p className="text-xl md:text-2xl font-light text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the world's first sanitary pad with a 100% natural mulberry silk top sheet. 
              <strong> 99% antibacterial</strong>, nourishing with 18 amino acids, and breathable like a second skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                Experience Silk Care
              </Button>
              <Button variant="ghost" className="text-[#7c2b3d] hover:text-[#5a1e2b]">
                Our Technology <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* 2. 核心视觉图 (突出材质与包装) */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             
             {/* 左图：产品包装 (Premium Presentation) */}
             <div className="relative group cursor-pointer flex flex-col items-center">
                <div className="w-[280px] h-[380px] bg-white rounded-t-[120px] rounded-b-[20px] shadow-[0_20px_40px_-10px_rgba(124,43,61,0.1)] overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
                   <img 
                     src="https://placehold.co/600x800/ffffff/7c2b3d?text=Premium+Silk+Box" 
                     alt="Premium Packaging" 
                     className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500"></div>
                </div>
                <p className="mt-5 text-xs font-bold tracking-[0.2em] uppercase text-[#9a8a85] group-hover:text-[#7c2b3d] transition-colors">
                  Oriental Aesthetics
                </p>
             </div>

             {/* 右图：桑蚕丝材质细节 (Raw Material) */}
             <div className="relative group cursor-pointer flex flex-col items-center md:mt-16">
                <div className="w-[280px] h-[380px] bg-white rounded-t-[20px] rounded-b-[120px] shadow-[0_20px_40px_-10px_rgba(124,43,61,0.1)] overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
                   <img 
                     src="https://placehold.co/600x800/fdfbfb/7c2b3d?text=100%25+Mulberry+Silk" 
                     alt="100% Mulberry Silk Texture" 
                     className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500"></div>
                </div>
                <p className="mt-5 text-xs font-bold tracking-[0.2em] uppercase text-[#9a8a85] group-hover:text-[#7c2b3d] transition-colors">
                  100% Mulberry Silk
                </p>
             </div>

          </div>
        </div>

        {/* 底部淡入背景装饰 */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-white/80 to-transparent z-0"></div>
      </section>


      {/* === Value Proposition: 基于PPT的核心卖点 === */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
           <h3 className="text-4xl font-serif font-medium tracking-tight mb-16 text-center text-[#1d1d1f]">
             Why your skin deserves silk.
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             
             {/* 卖点 1: 材质与养护 */}
             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   {/* 简单的图标示意：丝绸/水滴 */}
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">Nourishing Amino Acids</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   Contains 18 types of amino acids that nourish intimate skin. Naturally <strong>99% antibacterial</strong> and pH-balanced (5.7) to relieve itching and sensitivity.
                </p>
             </div>

             {/* 卖点 2: 技术与吸收 */}
             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   {/* 图标：保护/锁水 */}
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">50x Instant Absorption</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   Our patented spunlace tech creates a <strong>breathable structure</strong>. It locks fluid instantly—50x its weight—keeping you dry and fresh without reverse osmosis.
                </p>
             </div>
             
             {/* 卖点 3: 安全与纯净 */}
             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.3s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   {/* 图标：树叶/纯天然 */}
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">Medical-Grade Purity</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   <strong>0% Sensitization Rate.</strong> Free from fluorescent agents, bleach, formaldehyde, and fluff pulp. Pure safety for your peace of mind.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* === Made for You Section: 全系列 4 款产品展示 === */}
      <section className="py-24 px-6 bg-[#f8f6f4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 animate-slide-up">
             <h3 className="text-4xl font-serif font-medium text-[#1d1d1f] mb-4">Care for every cycle.</h3>
             <p className="text-gray-500 text-lg font-light">Premium protection, from light flow to heavy nights.</p>
          </div>

          {/* 4列网格布局：自动展示所有 4 款产品 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PRODUCTS.map((product, index) => (
              <div 
                key={product.id}
                onClick={() => navigate('/products')}
                className="group cursor-pointer flex flex-col animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* 产品卡片容器 */}
                <div className="bg-white rounded-4xl p-8 mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_15px_40px_-15px_rgba(124,43,61,0.1)]">
                   
                   {/* 图片区域 */}
                   <div className="aspect-3/4 flex items-center justify-center mb-4 relative z-10">
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                     />
                   </div>
                   
                   {/* 悬停出现的 Quick Add 按钮 */}
                   <div className="absolute bottom-6 left-0 w-full flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <Button size="sm" className="shadow-lg bg-[#7c2b3d] text-white hover:bg-[#5a1e2b] border-none">
                        Quick Add
                      </Button>
                   </div>
                </div>

                {/* 产品文字信息 */}
                <div className="text-center px-2">
                   <h4 className="text-xl font-medium text-[#1d1d1f] mb-1 font-serif group-hover:text-[#7c2b3d] transition-colors duration-300">
                     {product.name}
                   </h4>
                   <p className="text-sm text-gray-500 mb-2 font-light">{product.tagline}</p>
                   <p className="text-base font-medium text-[#1d1d1f]">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Trust Indicators (底部信任背书) === */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
               "Global Exclusive Patent",
               "100% Mulberry Silk",
               "0 Fluorescent Agents",
               "0 Bleach",
               "28-Day Biodegradable"
            ].map((text, i) => (
               <div key={i} className="flex items-center gap-2 text-gray-400 font-medium uppercase tracking-wider text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span>
                  {text}
               </div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default Home;