import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { http } from '../../lib/http';

// --- 核心浮动标签输入组件 (你提供的修复版) ---
const FloatingLabelInput = ({ id, label, type, value, onChange, required = false, className = '' }) => {
  const inputBaseClass = "peer w-full h-14 px-4 pt-5 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-[#fcf9f8] focus:bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all placeholder-transparent";
  const labelBaseClass = "absolute left-4 top-1/4 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out text-[#9a8a85] text-[17px] select-none origin-[0]";
  const labelFloatClass = "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#7c2b3d] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[#7c2b3d]";

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBaseClass}
        placeholder=" " 
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

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [error, setError] = useState(null);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // 中文注释：密码一致性检查
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // 中文注释：Headless 架构下，Woo/WP 默认不提供“匿名注册客户”的安全 REST 端点。
      // 我们使用站点自定义端点（后端需要添加一个极小的注册接口）。
      // 端点建议：/wp-json/estora/v1/register
      const data = await http('/wp-json/estora/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          marketing_opt_in: marketingOptIn,
        }),
      });

      // 中文注释：后端返回 ok=true 或返回 customer/user id 都视为成功
      const ok = data?.ok === true || !!data?.id || !!data?.customer_id || !!data?.user_id;
      if (!ok) {
        throw new Error(data?.message || 'Registration failed. Please try again.');
      }

      alert(`Welcome ${firstName}! Account created successfully. Please log in.`);
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred during registration.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f8f6f4] pt-32 pb-20 px-4 animate-fade-in flex items-center justify-center font-sans">
      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Create Account</h1>
          <p className="text-[#9a8a85] text-sm font-light">
            Become a member to track orders, manage subscriptions, and receive exclusive wellness tips.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput 
              id="firstName"
              label="First Name"
              type="text" 
              value={firstName} 
              onChange={setFirstName} 
              required
            />
            <FloatingLabelInput 
              id="lastName"
              label="Last Name"
              type="text" 
              value={lastName} 
              onChange={setLastName} 
              required
            />
          </div>

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
          
          <FloatingLabelInput 
            id="confirmPassword"
            label="Confirm Password"
            type="password" 
            value={confirmPassword} 
            onChange={setConfirmPassword} 
            required
          />

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#e5d5d0] bg-[#fcf9f8] checked:border-[#7c2b3d] checked:bg-[#7c2b3d] transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-[#5a5a5a] font-light leading-tight group-hover:text-[#1d1d1f] transition-colors select-none">
                Email me with news and offers. I know I can unsubscribe at any time.
              </span>
            </label>
          </div>
          
          {error && (
            <div className="text-sm text-center text-[#7c2b3d] bg-[#fdf2f4] p-3 rounded-xl border border-[#f0d5da]">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-14 text-[17px] shadow-lg shadow-[#7c2b3d]/20"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

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