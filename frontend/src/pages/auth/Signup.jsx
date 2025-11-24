import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const Signup = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-4 animate-fade-in flex items-center justify-center font-sans">
      
      {/* 卡片式容器 */}
      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        
        {/* Header: 强调会员权益 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Create Account</h1>
          <p className="text-[#9a8a85] text-sm font-light">
            Become a member to track orders, manage subscriptions, and receive exclusive wellness tips.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          
          {/* 1. 姓名：分开填写符合国际标准，方便后续邮件称呼 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">First Name</label>
              <input 
                type="text" 
                className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Last Name</label>
              <input 
                type="text" 
                className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* 2. 邮箱：这是电商最重要的ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
            />
          </div>

          {/* 3. 密码：只需要输入一次，现代设计通常通过显示/隐藏按钮来确认，这里保持简洁 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#9a8a85] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
            />
            <p className="text-[10px] text-[#9a8a85] mt-1.5 ml-1">Must be at least 8 characters.</p>
          </div>

          {/* 4. 营销许可复选框：这是建立私域流量的关键 */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#e5d5d0] bg-[#fcf9f8] checked:border-[#7c2b3d] checked:bg-[#7c2b3d] transition-all" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-[#5a5a5a] font-light leading-tight group-hover:text-[#1d1d1f] transition-colors">
                Email me with news and offers. I know I can unsubscribe at any time.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button className="w-full h-12 text-base shadow-lg shadow-[#7c2b3d]/20" size="lg">
              Create Account
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-[#9a8a85]">
           Already have an account?{' '}
           <Link to="/login" className="text-[#7c2b3d] font-medium hover:text-[#5a1e2b] hover:underline transition-colors">
             Log in
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;