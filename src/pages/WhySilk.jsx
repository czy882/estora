import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Sparkles, Droplets, Wind, Microscope } from 'lucide-react';
import Button from '../components/Button';
import silkBg from '../assets/images/why_silk/silk_bg.png';
import silkBgMobile from '../assets/images/why_silk/silk_bg_mobile.png';

// --- 动画辅助组件：FadeIn ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
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
      className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const WhySilk = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f6f4] min-h-screen font-sans text-[#1d1d1f] animate-fade-in">
      
      {/* === Hero Section: Intimate Care Redefined === */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
           {/* 响应式背景图占位：
               md:hidden -> 移动端显示的竖图
               hidden md:block -> 桌面端显示的横图
           */}
           <img 
             src={silkBgMobile}
             alt="Mobile Hero" 
             className="w-full h-full object-cover md:hidden opacity-80"
           />
           <img 
             src={silkBg}
             alt="Desktop Hero" 
             className="w-full h-full object-cover hidden md:block opacity-80"
           />
           <div className="absolute inset-0 bg-linear-to-b from-[#f8f6f4]/60 via-transparent to-[#f8f6f4]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <FadeIn>
            <span className="text-[#7c2b3d] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">Our Philosophy</span>
          </FadeIn>
          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-8 leading-[1.1] text-[#1d1d1f] tracking-tight">
              Intimate Care, <br/>
              <span className="italic text-[#7c2b3d]">Redefined.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={400}>
            <p className="text-xl md:text-3xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Treat your body like your face.
            </p>
            <p className="text-base md:text-lg text-gray-500 mt-6 max-w-2xl mx-auto">
              Why the world's most discerning women are upgrading from Cotton to Silk.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* === Section 1: Beyond Basic Hygiene === */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-20">
           <div className="md:w-1/2">
              <FadeIn>
                {/* 图片占位：展示女性自信或自我关爱的场景 */}
                <div className="relative rounded-t-[150px] rounded-b-[20px] overflow-hidden aspect-[4/5] shadow-[0_30px_60px_-15px_rgba(124,43,61,0.1)] bg-[#f9f9f9]">
                   <img src="https://placehold.co/800x1000/ffffff/7c2b3d?text=Self+Care+Visual" alt="Self Care" className="w-full h-full object-cover" />
                </div>
              </FadeIn>
           </div>
           <div className="md:w-1/2 space-y-8">
              <FadeIn delay={200}>
                <h3 className="text-3xl md:text-5xl font-serif text-[#1d1d1f] leading-tight">Beyond basic hygiene.</h3>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                   For decades, the industry standard has been cotton. It’s functional, familiar, and basic. But modern women demand more than just "basic" functionality.
                </p>
                <p className="text-lg text-gray-600 font-light leading-relaxed mt-4">
                   You invest in silk pillowcases for your hair and skin, and premium serums for your face. <strong>Why should your most delicate intimate area settle for anything less?</strong>
                </p>
                <p className="text-xl text-[#7c2b3d] font-serif italic mt-8 border-l-2 border-[#7c2b3d] pl-6 py-2">
                   "We believe your period care shouldn't just manage a cycle; it should be an act of self-care."
                </p>
              </FadeIn>
           </div>
        </div>
      </section>

      {/* === Section 2: Plant vs. Protein (The Comparison) === */}
      <section className="py-24 px-6 bg-[#1d1d1f] text-[#f8f6f4]">
        <div className="max-w-[1000px] mx-auto text-center mb-20">
           <FadeIn>
             <h3 className="text-3xl md:text-5xl font-serif mb-6">Plant vs. Protein</h3>
             <p className="text-xl text-gray-400 font-light">Here is the uncompromising truth about materials.</p>
           </FadeIn>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Cotton Card */}
           <FadeIn delay={200}>
             <div className="bg-[#2a2a2c] p-10 rounded-[2.5rem] h-full border border-gray-700/50 relative overflow-hidden group">
                <h4 className="text-2xl font-serif mb-4 text-gray-300">Cotton <span className="text-xs font-sans tracking-widest opacity-50 block mt-2 uppercase">The Old Standard</span></h4>
                <div className="w-12 h-1 mb-6 bg-gray-600 rounded-full"></div>
                <p className="text-gray-400 leading-relaxed font-light mb-4">
                   A plant-based cellulose fiber. While absorbent, it can hold moisture against the skin, leading to friction, humidity, and bacterial growth.
                </p>
                <div className="mt-auto inline-block px-4 py-2 rounded-full border border-gray-600 text-sm text-gray-400">
                   Passive Protection
                </div>
             </div>
           </FadeIn>

           {/* Silk Card */}
           <FadeIn delay={400}>
             <div className="bg-[#f8f6f4] p-10 rounded-[2.5rem] h-full text-[#1d1d1f] shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden">
                <h4 className="text-2xl font-serif mb-4 text-[#7c2b3d]">Silk <span className="text-xs font-sans tracking-widest opacity-60 text-[#1d1d1f] block mt-2 uppercase">The New Standard</span></h4>
                <div className="w-12 h-1 mb-6 bg-[#7c2b3d] rounded-full"></div>
                <p className="text-gray-600 leading-relaxed font-light mb-4">
                   An animal protein fiber. Composed of 18 amino acids almost identical to human skin, silk is naturally biocompatible. It doesn't just sit on your skin; it works with it.
                </p>
                <div className="mt-auto inline-block px-4 py-2 rounded-full bg-[#7c2b3d] text-white text-sm shadow-lg shadow-[#7c2b3d]/20">
                   Active Protection
                </div>
             </div>
           </FadeIn>
        </div>
      </section>

      {/* === Section 3: Why Silk is the Ultimate Investment === */}
      <section className="py-24 px-6 bg-[#f8f6f4]">
         <div className="max-w-[1200px] mx-auto">
            <FadeIn className="text-center mb-24">
               <span className="text-[#7c2b3d] font-bold tracking-widest uppercase text-xs">The Ultimate Investment</span>
               <h3 className="text-4xl md:text-6xl font-serif mt-4 text-[#1d1d1f]">Why Silk?</h3>
            </FadeIn>

            <div className="space-y-32">
               
               {/* Feature 1: Skincare Approach */}
               <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2 order-2 md:order-1">
                     <FadeIn delay={200}>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-white rounded-full text-[#7c2b3d] shadow-sm"><Sparkles size={24} /></div>
                           <h4 className="text-2xl font-serif">The "Skincare" Approach</h4>
                        </div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                           Think of our silk layer as a premium serum in fiber form. Unlike cotton, which can dry out natural oils or cause micro-abrasions, silk is naturally hydrating and frictionless. 
                        </p>
                        <p className="text-lg text-gray-600 font-light leading-relaxed mt-4">
                           It respects the pH balance and delicate mucous membranes of your intimate zone.
                        </p>
                     </FadeIn>
                  </div>
                  <div className="md:w-1/2 order-1 md:order-2">
                     <FadeIn>
                        {/* 图片占位：展示丝绸如护肤品般滋润 */}
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-lg bg-white">
                           <img src="https://placehold.co/800x600/ffffff/7c2b3d?text=Silk+as+Skincare+Visual" alt="Skincare Approach" className="w-full h-full object-cover" />
                        </div>
                     </FadeIn>
                  </div>
               </div>

               {/* Feature 2: Moisture Management */}
               <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2">
                     <FadeIn>
                        {/* 图片占位：展示透气性/微气候 */}
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-lg bg-white">
                           <img src="https://placehold.co/800x600/f0f0f0/7c2b3d?text=Breathable+Micro-climate" alt="Moisture Management" className="w-full h-full object-cover" />
                        </div>
                     </FadeIn>
                  </div>
                  <div className="md:w-1/2">
                     <FadeIn delay={200}>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-white rounded-full text-[#7c2b3d] shadow-sm"><Wind size={24} /></div>
                           <h4 className="text-2xl font-serif">Intelligent Moisture Management</h4>
                        </div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                           Cotton absorbs wetness but tends to stay wet. Silk is different. Its porous structure wicks moisture away instantly while remaining dry to the touch.
                        </p>
                        <p className="text-lg text-gray-600 font-light leading-relaxed mt-4">
                           It creates a "micro-climate" that is breathable and cool, drastically reducing the risk of irritation and odour caused by heat and sweat.
                        </p>
                     </FadeIn>
                  </div>
               </div>

               {/* Feature 3: Purity */}
               <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="md:w-1/2 order-2 md:order-1">
                     <FadeIn delay={200}>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-white rounded-full text-[#7c2b3d] shadow-sm"><ShieldCheck size={24} /></div>
                           <h4 className="text-2xl font-serif">Unparalleled Purity</h4>
                        </div>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                           Our silk is sourced with the highest purity standards. No harsh bleaching, no synthetic textures. Just the raw, healing power of nature.
                        </p>
                        <p className="text-lg text-gray-600 font-light leading-relaxed mt-4">
                           It is hypoallergenic by design, making it the only logical choice for women who refuse to compromise on health.
                        </p>
                     </FadeIn>
                  </div>
                  <div className="md:w-1/2 order-1 md:order-2">
                     <FadeIn>
                        {/* 图片占位：展示纯净天然 */}
                        <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-lg bg-white">
                           <img src="https://placehold.co/800x600/fdfbfb/7c2b3d?text=Pure+Nature+Visual" alt="Unparalleled Purity" className="w-full h-full object-cover" />
                        </div>
                     </FadeIn>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* === The Verdict (CTA) === */}
      <section className="py-32 bg-white px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#7c2b3d] via-transparent to-transparent pointer-events-none"></div>
         
         <div className="max-w-4xl mx-auto relative z-10">
            <FadeIn>
               <h2 className="text-4xl md:text-6xl font-serif mb-8 text-[#1d1d1f]">The Verdict</h2>
               <p className="text-xl md:text-2xl text-gray-500 mb-12 font-light leading-relaxed">
                  Cotton was good for yesterday. <span className="text-[#7c2b3d] font-medium">Silk is designed for today.</span><br/>
                  Experience the luxury of nature. Feel the difference of Silk.
               </p>
               <Button variant="primary" size="lg" className="px-12 h-14 text-lg shadow-xl shadow-[#7c2b3d]/20" onClick={() => navigate('/products')}>
                  Upgrade to Silk
               </Button>
            </FadeIn>
         </div>
      </section>

    </div>
  );
};

export default WhySilk;