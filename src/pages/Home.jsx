import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react'; // 引入 Loader 图标
import Button from '../components/Button';
import { useQuery, gql } from '@apollo/client'; // 1. 引入 Apollo Hooks

// --- 2. 定义 GraphQL 查询 ---
// 这个查询会获取最新的4个产品，包含图片、价格和描述
const GET_HOME_PRODUCTS = gql`
  query GetHomeProducts {
    products(first: 4) {
      nodes {
        databaseId
        slug
        name
        shortDescription(format: RAW)
        image {
          sourceUrl
        }
        ... on SimpleProduct {
          price
          regularPrice
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;

// --- 动画辅助组件 (保持不变) ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  // --- 3. 使用 Hooks 获取 WordPress 数据 ---
  const { loading, error, data } = useQuery(GET_HOME_PRODUCTS);

  // 辅助函数：处理描述文本（去除 HTML 标签，如果有的话）
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="bg-[#f8f6f4] text-[#1d1d1f] min-h-screen font-sans selection:bg-[#7c2b3d] selection:text-white">
      
      {/* === Hero Section (保持不变) === */}
      <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-28 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* 左侧文案 */}
            <div className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
              <FadeIn>
                <div className="inline-block mb-6 px-4 py-1.5 border border-[#7c2b3d] rounded-full text-[11px] font-bold tracking-[0.2em] text-[#7c2b3d] uppercase bg-white/50 backdrop-blur-sm">
                  Global Exclusive Patent
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-8 text-[#7c2b3d] leading-[1.1]">
                  The luxury of <br/> <span className="italic">100% Silk.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Discover the world's first sanitary pad with a 100% natural mulberry silk top sheet. 
                  <strong> 99% antibacterial</strong>, nourishing with 18 amino acids, and breathable like a second skin.
                </p>
              </FadeIn>
              
              <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="primary" size="lg" className="h-14 px-8 text-lg shadow-xl shadow-[#7c2b3d]/20" onClick={() => navigate('/products')}>
                    Shop the Collection
                  </Button>
                  <Button variant="ghost" className="text-[#7c2b3d] hover:text-[#5a1e2b] h-14 text-lg">
                    Our Technology <ChevronRight size={18} />
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* 右侧主图 */}
            <div className="lg:w-1/2 w-full relative order-1 lg:order-2 flex justify-center lg:justify-end">
               <FadeIn delay={200} className="w-full max-w-[600px] aspect-4/5 lg:aspect-square relative">
                  <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(124,43,61,0.1)] overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                     <img 
                       src="https://placehold.co/1000x1000/ffffff/7c2b3d?text=AURORA+Hero" 
                       alt="AURORA Collection" 
                       className="w-full h-full object-cover"
                     />
                  </div>
               </FadeIn>
            </div>

          </div>
        </div>
        
        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-linear-to-b from-[#efe6e4] to-transparent rounded-full blur-[120px] z-0 opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-linear-to-t from-white to-transparent rounded-full blur-[100px] z-0 opacity-80 pointer-events-none"></div>
      </section>

      {/* === Value Proposition (保持不变) === */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
           <FadeIn>
             <h3 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-16 text-center text-[#1d1d1f]">
               Why your skin deserves silk.
             </h3>
           </FadeIn>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <FadeIn delay={100} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                   <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h4 className="text-xl font-medium mb-3 font-serif">Nourishing Amino Acids</h4>
                <p className="text-gray-600 font-light leading-relaxed">
                   Contains 18 types of amino acids. Naturally <strong>99% antibacterial</strong> and pH-balanced (5.7).
                </p>
             </FadeIn>
             {/* ...其他Value Props保持不变，为了节省长度这里省略了，你自己代码里保留即可... */}
              <FadeIn delay={200} className="text-center group">
                 <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                    <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                 </div>
                 <h4 className="text-xl font-medium mb-3 font-serif">50x Instant Absorption</h4>
                 <p className="text-gray-600 font-light leading-relaxed">
                    Patented spunlace tech creates a <strong>breathable structure</strong>. Locks fluid instantly—50x its weight.
                 </p>
              </FadeIn>
              <FadeIn delay={300} className="text-center group">
                 <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f8f6f4] flex items-center justify-center group-hover:bg-[#7c2b3d] transition-colors duration-500">
                    <svg className="w-8 h-8 text-[#7c2b3d] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                 </div>
                 <h4 className="text-xl font-medium mb-3 font-serif">Medical-Grade Purity</h4>
                 <p className="text-gray-600 font-light leading-relaxed">
                    <strong>0% Sensitization Rate.</strong> Free from fluorescent agents, bleach, and formaldehyde.
                 </p>
              </FadeIn>
           </div>
        </div>
      </section>

      {/* === Made for You Section (动态产品列表) === */}
      <section className="py-24 px-6 bg-[#f8f6f4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
             <FadeIn>
                <h3 className="text-4xl font-serif font-medium text-[#1d1d1f] mb-4">Care for every cycle.</h3>
                <p className="text-gray-500 text-lg font-light">Premium protection, from light flow to heavy nights.</p>
             </FadeIn>
          </div>

          {/* 4. 处理加载和错误状态 */}
          {loading && (
            <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-[#7c2b3d]" size={48} />
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 py-10">
               Failed to load products. Please check your connection.
            </div>
          )}

          {/* 5. 渲染 WordPress 数据 */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* 这里使用 data.products.nodes 替代了原来的 PRODUCTS */}
              {data?.products?.nodes.map((product, index) => (
                <FadeIn key={product.databaseId} delay={index * 150} className="h-full">
                  <div 
                    // 链接逻辑修改：使用 slug 动态跳转
                    onClick={() => navigate(`/product/${product.slug}`)} 
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    <div className="bg-white rounded-[2.5rem] p-8 mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_15px_40px_-15px_rgba(124,43,61,0.1)] transform group-hover:-translate-y-1">
                      <div className="aspect-3/4 flex items-center justify-center mb-4 relative z-10">
                        {/* 容错处理：如果有图片就显示，没有就显示占位符 */}
                        <img 
                          src={product.image?.sourceUrl || 'https://placehold.co/600x800/f8f6f4/7c2b3d?text=No+Image'} 
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
                      {/* 动态描述 */}
                      <p className="text-sm text-gray-500 mb-2 font-light line-clamp-2">
                        {stripHtml(product.shortDescription)}
                      </p>
                      {/* 动态价格 */}
                      <p className="text-base font-medium text-[#1d1d1f]">{product.price}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === Trust Indicators (保持不变) === */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
               "Global Exclusive Patent",
               "100% Mulberry Silk",
               "0 Fluorescent Agents",
               "0 Bleach",
               "28-Day Biodegradable"
            ].map((text, i) => (
               <FadeIn key={i} delay={i * 100}>
                 <div className="flex items-center gap-2 text-gray-400 font-medium uppercase tracking-wider text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c2b3d]"></span>
                    {text}
                 </div>
               </FadeIn>
            ))}
         </div>
      </section>

    </div>
  );
};

export default Home;