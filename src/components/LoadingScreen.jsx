import React from 'react';

const LoadingScreen = () => {
  return (
    <div
      className="fixed inset-0 bg-[#f8f6f4] z-50 flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      
      {/* 品牌展示区域 */}
      <div className="relative flex flex-col items-center justify-center min-h-[200px]">
        
        {/* 背景光晕：低调的丝绸酒红渐变 */}
        <div
          className="absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full bg-[#7c2b3d]/10 blur-[60px] opacity-70"></div>
        </div>

        {/* 1. Logo: 采用高斯模糊渐入效果 (Blur Reveal) */}
        <h1 
          className="text-5xl md:text-7xl font-serif text-[#7c2b3d] tracking-tight opacity-0"
          style={{ 
            animation: 'logoReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
          }}
        >
          ESTORA
        </h1>

        {/* 2. 丝线动画: 模拟蚕丝的流动 (Silk Flow) */}
        {/* 这条线会循环地从中心向两边生长，模拟呼吸 */}
        <div 
          className="h-[1.5px] bg-[#7c2b3d] rounded-full mt-6 opacity-0"
          style={{ 
            animation: 'silkFlow 3s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(124, 43, 61, 0.2)' // 添加淡淡的丝绸光晕
          }}
        ></div>

        {/* 3. Loading 文字: 延迟淡入 */}
        <p 
          className="absolute -bottom-8 text-[#9a8a85] text-[10px] tracking-[0.4em] uppercase font-medium opacity-0"
          style={{ 
            animation: 'fadeIn 1s ease-out 0.8s forwards' 
          }}
        >
          Loading
        </p>
      </div>

      {/* --- CSS Keyframes 定义 --- */}
      <style>{`
        @keyframes logoReveal {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
            filter: blur(12px); /* 初始模糊 */
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0); /* 清晰 */
          }
        }

        @keyframes silkFlow {
          0% {
            width: 0px;
            opacity: 0;
          }
          30% {
            width: 72px; /* 展开 */
            opacity: 0.6;
          }
          50% {
            width: 96px; /* 最长 */
            opacity: 1;
          }
          70% {
            width: 72px; /* 收缩 */
            opacity: 0.6;
          }
          100% {
            width: 0px; /* 消失 */
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;