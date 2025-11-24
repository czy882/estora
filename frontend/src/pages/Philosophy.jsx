import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Button from '../components/Button';

const Philosophy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f6f4] min-h-screen font-sans text-[#1d1d1f] animate-fade-in">
      
      {/* === Hero Section: 情感引入 === */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* 修复：移除了占位图中的 "Nature and Flow" 文字 
              使用 text=%20 让背景图保持纯净，避免与前景标题重叠
           */}
           <img 
             src="https://placehold.co/1920x1080/e8e0dd/e8e0dd?text=%20" 
             alt="Nature Background" 
             className="w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 bg-linear-to-b from-[#f8f6f4]/20 via-transparent to-[#f8f6f4]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 text-center animate-slide-up">
          <span className="text-[#7c2b3d] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">Our Philosophy</span>
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-8 leading-tight text-[#1d1d1f]">
            Redefining intimacy with <br/> <span className="italic text-[#7c2b3d]">nature's purest fiber.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We believe that what touches your most sensitive skin should be as pure as the food you eat. 
            No plastics. No harsh chemicals. Just 100% organic silk.
          </p>
        </div>
      </section>

      {/* === Section 1: The Origin (蚕丝的故事) === */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
           <div className="md:w-1/2">
              <div className="relative rounded-t-[150px] rounded-b-[20px] overflow-hidden aspect-3/4 shadow-xl">
                 <img src="https://placehold.co/800x1000/ffffff/7c2b3d?text=Silk+Cocoon+Process" alt="Silk Process" className="w-full h-full object-cover" />
              </div>
           </div>
           <div className="md:w-1/2 space-y-6">
              <h3 className="text-3xl md:text-4xl font-serif text-[#1d1d1f]">A gift from nature, <br/>perfected by science.</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                 For centuries, silk has been revered for its healing properties. Rich in <strong>18 natural amino acids</strong> and sericin, it is naturally antibacterial and pH-balanced.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                 We asked ourselves: why are we using plastic and synthetic cotton for our most intimate care, when nature has already provided the perfect solution?
              </p>
              <div className="pt-4">
                 <div className="flex items-center gap-4 mb-4">
                    <Sparkles className="text-[#7c2b3d]" size={24} />
                    <span className="text-lg font-medium">99% Natural Antibacterial</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <Heart className="text-[#7c2b3d]" size={24} />
                    <span className="text-lg font-medium">Hypoallergenic & Nourishing</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === Section 2: The Technology (专利技术) === */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
           <div className="md:w-1/2">
              <div className="relative rounded-full overflow-hidden aspect-square shadow-xl border-8 border-[#f8f6f4]">
                 <img src="https://placehold.co/800x800/f0f0f0/7c2b3d?text=Spunlace+Technology" alt="Technology" className="w-full h-full object-cover" />
              </div>
           </div>
           <div className="md:w-1/2 space-y-6">
              <span className="text-[#7c2b3d] font-bold tracking-widest uppercase text-xs">Global Exclusive Patent</span>
              <h3 className="text-3xl md:text-4xl font-serif text-[#1d1d1f]">Breathable Engineering.</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                 Innovation is at our core. We developed the world's first <strong>Patented Spunlace Technology</strong> to bond silk fibers without using glue.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                 This creates a structure that is incredibly porous, allowing your skin to breathe freely while locking away fluid instantly—up to <strong>50x its own weight</strong>.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                 It's not just a sanitary pad; it's a feat of engineering designed for your comfort.
              </p>
           </div>
        </div>
      </section>

      {/* === Section 3: Values (承诺) === */}
      <section className="py-32 px-6">
         <div className="max-w-4xl mx-auto text-center mb-20">
            <h3 className="text-4xl font-serif mb-6">Our Promise to You</h3>
            <p className="text-xl text-gray-500 font-light">
               We refuse to compromise on health for the sake of cost. AURORA represents the highest standard of safety in the industry.
            </p>
         </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
               <div className="w-16 h-16 mx-auto bg-[#f8f6f4] rounded-full flex items-center justify-center text-[#7c2b3d] mb-6">
                  <ShieldCheck size={32} />
               </div>
               <h4 className="text-xl font-serif mb-3">Medical Grade</h4>
               <p className="text-gray-500">Manufactured in sterile environments. 0% Sensitization rate in dermatological tests.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
               <div className="w-16 h-16 mx-auto bg-[#f8f6f4] rounded-full flex items-center justify-center text-[#7c2b3d] mb-6">
                  <Leaf size={32} />
               </div>
               <h4 className="text-xl font-serif mb-3">Pure & Organic</h4>
               <p className="text-gray-500">Absolutely zero fluorescent agents, bleach, formaldehyde, or plasticizers.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
               <div className="w-16 h-16 mx-auto bg-[#f8f6f4] rounded-full flex items-center justify-center text-[#7c2b3d] mb-6">
                  <Heart size={32} />
               </div>
               <h4 className="text-xl font-serif mb-3">Women First</h4>
               <p className="text-gray-500">Designed to help prevent common gynecological issues caused by synthetic materials.</p>
            </div>
         </div>
      </section>

      {/* === CTA Section === */}
      <section className="py-32 bg-[#1d1d1f] text-[#f8f6f4] text-center px-6">
         <div className="max-w-3xl mx-auto animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Ready to experience the difference?</h2>
            <p className="text-xl text-gray-400 mb-12 font-light">
               Join thousands of women who have upgraded their cycle to AURORA.
            </p>
            <Button variant="primary" size="lg" className="bg-[#f8f6f4] text-[#1d1d1f] hover:bg-white hover:text-[#7c2b3d]" onClick={() => navigate('/products')}>
               Shop the Collection
            </Button>
         </div>
      </section>

    </div>
  );
};

export default Philosophy;