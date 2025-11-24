import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

// 移除：不再需要在这里引入具体的产品页面组件
// import DayComfort from './DayComfort';
// ...

const Collections = ({ onAddToCart }) => {
  const navigate = useNavigate();

  // 核心修复：返回路由字符串，而不是组件对象
  // 这些路径必须与 App.jsx 中的 <Route path="..."> 保持一致
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
    <div className="bg-[#f8f6f4] min-h-screen font-sans text-[#1d1d1f] animate-fade-in">
      
      {/* === Header === */}
      <div className="pt-32 pb-16 text-center px-6">
        <span className="text-[#7c2b3d] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Collection</span>
        <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1d1d1f] mb-6">
          Care for every cycle.
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">
          Premium silk protection designed for your body's unique needs, from light days to heavy nights.
        </p>
      </div>

      {/* === Product Grid === */}
      <div className="max-w-[1400px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(124,43,61,0.1)] transition-all duration-500 border border-[#f0e8e4] flex flex-col md:flex-row items-center gap-8 md:gap-12 cursor-pointer"
              // 点击时跳转到对应 URL
              onClick={() => navigate(getProductLink(product.id))}
            >
              {/* 图片区域 */}
              <div className="w-full md:w-1/2 aspect-4/5 bg-[#f9f9f9] rounded-4xl flex items-center justify-center relative overflow-hidden">
                 <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-3/4 h-3/4 object-contain mix-blend-multiply transform transition-transform duration-700 group-hover:scale-105"
                 />
                 {/* 悬停提示 */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white px-6 py-3 rounded-full text-sm font-medium text-[#7c2b3d] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Details
                    </span>
                 </div>
              </div>

              {/* 信息区域 */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left h-full justify-center">
                 <div className="mb-auto">
                    <h2 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-2 group-hover:text-[#7c2b3d] transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-[#9a8a85] text-sm tracking-wider uppercase font-medium mb-4">{product.tagline}</p>
                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                      {product.description}
                    </p>
                    
                    {/* 规格标签 */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                      {product.specs.map((spec, i) => (
                        <span key={i} className="px-3 py-1 bg-[#f8f6f4] text-[#5a5a5a] text-xs rounded-full border border-[#e5d5d0]">
                          {spec}
                        </span>
                      ))}
                    </div>
                 </div>

                 <div className="flex items-center gap-6 w-full mt-auto pt-6 border-t border-[#f0e8e4]">
                    <span className="text-2xl font-serif text-[#1d1d1f]">${product.price}</span>
                    <Button 
                      className="flex-1 shadow-lg shadow-[#7c2b3d]/10"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigate(getProductLink(product.id));
                      }}
                    >
                      Shop Now <ArrowRight size={16} className="ml-2" />
                    </Button>
                 </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Collections;