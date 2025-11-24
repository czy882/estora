import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 模拟登录成功，跳转到个人中心或主页
    navigate('/profile');
  };

  return (
    // 1. 背景色更新为品牌奶油色 (#f8f6f4)
    <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-4 animate-fade-in flex items-center justify-center font-sans">
      
      {/* 2. 卡片式容器：圆角更大，阴影更柔和 */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Welcome Back</h1>
          <p className="text-[#9a8a85] text-sm font-light">Sign in to manage your subscription and rewards.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-5">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base placeholder-[#9a8a85] text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full h-12 px-5 rounded-xl border border-[#e5d5d0] text-base placeholder-[#9a8a85] text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-[#7c2b3d] focus:ring-[#7c2b3d]" 
              />
              <label htmlFor="remember" className="text-[#5a5a5a] group-hover:text-[#7c2b3d] transition-colors cursor-pointer select-none">Remember me</label>
            </div>
            <a href="#" className="text-[#9a8a85] hover:text-[#7c2b3d] transition-colors">Forgot password?</a>
          </div>

          <Button className="w-full h-12 text-base shadow-lg shadow-[#7c2b3d]/20" size="lg" type="submit">
            Log In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5d5d0]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-white text-[#d0c0bc]">Or continue with</span>
          </div>
        </div>

        {/* Social Login: 简化为图标按钮 */}
        <div className="grid grid-cols-2 gap-4">
          <button className="h-12 rounded-xl border border-[#e5d5d0] flex items-center justify-center hover:bg-[#fcf9f8] hover:border-[#d0c0bc] transition-all">
            {/* Apple Logo */}
            <svg className="w-5 h-5 text-[#1d1d1f]" viewBox="0 0 384 512" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
            </svg>
          </button>
          
          <button className="h-12 rounded-xl border border-[#e5d5d0] flex items-center justify-center hover:bg-[#fcf9f8] hover:border-[#d0c0bc] transition-all">
            {/* Google Logo */}
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-[#9a8a85]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#7c2b3d] font-medium hover:text-[#5a1e2b] hover:underline transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;