import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { PRODUCTS } from '../data/products';

const Home = () => {
  const navigate = useNavigate();

  // 辅助函数：根据产品ID获取对应的详情页路径
  const getProductLink = (id) => {
    switch(id) {
      case 1: return '/day_comfort';
      case 2: return '/night_sanctuary';
      case 3: return '/overnight_protection';
      case 4: return '/daily_liners';
      default: return '/collections';
    }
  };

  return (
    // 柔和的奶油色背景，品牌色选中文本
    <div className="bg-[#f8f6f4] text-[#1d1d1f] min-h-screen font-sans selection:bg-[#7c2b3d] selection:text-white">
      
      {/* === Hero Section: 左右布局，产品图置顶/置右 === */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* 核心修改：增加了 lg:px-28，让左右边距显著变大，内容更聚拢 */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-28 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* 1. 左侧：文案区域 (Text Content) */}
            <div className="lg:w-1/2 text-center lg:text-left animate-slide-up order-2 lg:order-1">
              <div className="inline-block mb-6 px-4 py-1.5 border border-[#7c2b3d] rounded-full text-[11px] font-bold tracking-[0.2em] text-[#7c2b3d] uppercase bg-white/50 backdrop-blur-sm">
                Global Exclusive Patent
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-8 text-[#7c2b3d] leading-[1.1]">
                The luxury of <br/> <span className="italic">100% Silk.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover the world's first sanitary pad with a 100% natural mulberry silk top sheet. 
                <strong> 99% antibacterial</strong>, nourishing with 18 amino acids, and breathable like a second skin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="lg" className="h-14 px-8 text-lg shadow-xl shadow-[#7c2b3d]/20" onClick={() => navigate('/collections')}>
                  Shop the Collection
                </Button>
                <Button variant="ghost" className="text-[#7c2b3d] hover:text-[#5a1e2b] h-14 text-lg">
                  Our Technology <ChevronRight size={18} />
                </Button>
              </div>
            </div>

            {/* 2. 右侧：核心产品主图 (Hero Image) */}
            <div className="lg:w-1/2 w-full relative animate-fade-in order-1 lg:order-2 flex justify-center lg:justify-end" style={{ animationDelay: '0.2s' }}>
               {/* 这是一个大的产品展示位。 */}
               <div className="relative w-full max-w-[600px] aspect-4/5 lg:aspect-square">
                  {/* 主图占位 */}
                  <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(124,43,61,0.1)] overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                     <img 
                       src="https://placehold.co/1000x1000/ffffff/7c2b3d?text=AURORA+Hero+Product+Shot" 
                       alt="AURORA Collection" 
                       className="w-full h-full object-cover"
                     />
                  </div>
                  
                  {/* 装饰性小图 (例如展示材质细节) */}
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-4xl shadow-lg p-2 transform rotate-[5deg] hidden md:block animate-slide-up" style={{ animationDelay: '0.4s' }}>
                     <img 
                       src="https://placehold.co/400x400/fdfbfb/7c2b3d?text=Silk" 
                       alt="Silk Texture" 
                       className="w-full h-full object-cover rounded-3xl"
                     />
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* 背景装饰：柔和的光晕 */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-linear-to-b from-[#efe6e4] to-transparent rounded-full blur-[120px] z-0 opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-linear-to-t from-white to-transparent rounded-full blur-[100px] z-0 opacity-80 pointer-events-none"></div>
      </section>


      {/* === Value Proposition === */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
           <h3 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-16 text-center text-[#1d1d1f]">
             Why your skin deserves silk.
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             
             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">Nourishing Amino Acids</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   Contains 18 types of amino acids. Naturally <strong>99% antibacterial</strong> and pH-balanced (5.7).
                </p>
             </div>

             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">50x Instant Absorption</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   Patented spunlace tech creates a <strong>breathable structure</strong>. Locks fluid instantly—50x its weight.
                </p>
             </div>
             
             <div className="text-center animate-slide-up group" style={{ animationDelay: '0.3s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">Medical-Grade Purity</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   <strong>0% Sensitization Rate.</strong> Free from fluorescent agents, bleach, and formaldehyde.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* === Made for You Section === */}
      <section className="py-24 px-6 bg-[#f8f6f4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 animate-slide-up">
             <h3 className="text-4xl font-serif font-medium text-[#1d1d1f] mb-4">Care for every cycle.</h3>
             <p className="text-gray-500 text-lg font-light">Premium protection, from light flow to heavy nights.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PRODUCTS.map((product, index) => (
              <div 
                key={product.id}
                // 核心修改：点击产品卡片跳转到具体的产品详情页
                onClick={() => navigate(getProductLink(product.id))}
                className="group cursor-pointer flex flex-col animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="bg-white rounded-[2.5rem] p-8 mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_15px_40px_-15px_rgba(124,43,61,0.1)] transform group-hover:-translate-y-1">
                   <div className="aspect-3/4 flex items-center justify-center mb-4 relative z-10">
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                     />
                   </div>
                   <div className="absolute bottom-6 left-0 w-full flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <Button size="sm" className="shadow-lg bg-[#7c2b3d] text-white hover:bg-[#5a1e2b] border-none">
                        Quick Add
                      </Button>
                   </div>
                </div>
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

      {/* === Trust Indicators === */}
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