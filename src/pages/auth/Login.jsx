import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { supabase } from '../../supabaseClient';

// --- 核心浮动标签输入组件 (与 Signup 保持一致的最新版本) ---
const FloatingLabelInput = ({ id, label, type, value, onChange, required = false, className = '' }) => {
  // 1. 基础输入框样式：
  // - 恢复 h-14 (56px) 高度
  // - 恢复 text-[17px] 字体大小
  // - 增加 pt-5 pb-1 为文字留出下方空间，同时上方留出空隙给浮动标签
  const inputBaseClass = "peer w-full h-14 px-4 pt-5 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all";
  
  // 2. 标签基础样式：
  // - 初始状态：垂直居中，字体大小 17px (与输入文字一致)，颜色 #9a8a85 (灰色)
  const labelBaseClass = "absolute left-4 top-1/4 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out text-[#9a8a85] text-[17px] select-none origin-[0]";
  
  // 3. 浮动效果逻辑：
  // - 没输入时 (placeholder-shown): 保持原位 (translate-y-0)
  // - 聚焦或有内容时: 向上移动 (-translate-y-3), 缩小 (scale-75), 颜色变品牌色
  // - 保持字体原样，只是缩小
  const labelFloatClass = "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#7c2b3d] peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:text-[#7c2b3d]";

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBaseClass}
        placeholder=" " // 必须留一个空格占位符，用于触发 CSS 状态
        required={required}
      />
      <label
        htmlFor={id}
        className={`${labelBaseClass} ${labelFloatClass}`}
      >
        {label}
      </label>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-4 animate-fade-in flex items-center justify-center font-sans">
      
      {/* 卡片式容器 */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Welcome Back</h1>
          <p className="text-[#9a8a85] text-sm font-light">Sign in to manage your subscription and rewards.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <FloatingLabelInput 
            id="email"
            label="Email Address"
            type="email" 
            value={email} 
            onChange={setEmail} 
            required
          />

          <FloatingLabelInput 
            id="password"
            label="Password"
            type="password" 
            value={password} 
            onChange={setPassword} 
            required
          />
          
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

          {/* Error Message */}
          {error && (
            <div className="text-sm text-center text-[#7c2b3d] bg-[#fdf2f4] p-3 rounded-xl border border-[#f0d5da]">
              {error}
            </div>
          )}

          <Button 
            className="w-full h-14 text-[17px] shadow-lg shadow-[#7c2b3d]/20" 
            size="lg" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        {/* Footer Link */}
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