import React from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronRight, Package, Heart, MapPin, CreditCard, Settings } from 'lucide-react';
import Button from '../components/Button'; // 复用我们的通用按钮组件

const Profile = () => (
  <div className="pt-32 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
    <div className="max-w-[800px] mx-auto px-6">
      
      {/* === 认证状态卡片 (Login/Signup Call to Action) === */}
      <div className="bg-white rounded-[2.5rem] p-10 mb-10 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        {/* 顶部图标 */}
        <div className="w-20 h-20 rounded-full bg-[#f8f6f4] flex items-center justify-center text-[#7c2b3d] mb-6">
           <User size={40} strokeWidth={1.5} />
        </div>
        
        {/* 欢迎文案 */}
        <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Welcome to AURORA</h1>
        <p className="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
          Log in or sign up to manage your subscription, track orders, and unlock exclusive member benefits.
        </p>
        
        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {/* 登录按钮 */}
          <Link to="/login" className="flex-1">
            <Button className="w-full h-12 text-base shadow-xl shadow-[#7c2b3d]/10">
              Log In
            </Button>
          </Link>
          
          {/* 注册按钮 */}
          <Link to="/signup" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* === 账户设置列表 === */}
      <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-6 px-2">Account Settings</h3>
      
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.02)] border border-[#f0e8e4] divide-y divide-[#f5efec]">
        {[
          { title: "My Orders", desc: "Track, return, or buy again", icon: <Package size={20} /> },
          { title: "Wishlist", desc: "Your saved favourites", icon: <Heart size={20} /> },
          { title: "Addresses", desc: "Manage delivery locations", icon: <MapPin size={20} /> },
          { title: "Payment Methods", desc: "Manage cards and billing", icon: <CreditCard size={20} /> },
          { title: "Preferences", desc: "Notification settings", icon: <Settings size={20} /> }
        ].map((item, i) => (
            <div key={i} className="p-6 hover:bg-[#fcf9f8] cursor-pointer flex items-center gap-5 group transition-colors duration-300">
              {/* 左侧图标容器 */}
              <div className="w-12 h-12 rounded-full bg-[#f8f6f4] flex items-center justify-center text-[#9a8a85] group-hover:text-[#7c2b3d] group-hover:bg-[#7c2b3d]/10 transition-colors duration-300">
                {item.icon}
              </div>
              
              {/* 文字内容 */}
              <div className="flex-1">
                 <div className="font-medium text-[#1d1d1f] font-serif text-lg group-hover:text-[#7c2b3d] transition-colors">{item.title}</div>
                 <div className="text-sm text-[#9a8a85] font-light">{item.desc}</div>
              </div>
              
              {/* 右侧箭头 */}
              <ChevronRight size={18} className="text-[#d0c0bc] group-hover:text-[#7c2b3d] transition-colors transform group-hover:translate-x-1 duration-300" />
            </div>
        ))}
      </div>
      
      {/* 底部留白 */}
      <div className="h-20"></div>
    </div>
  </div>
);

export default Profile;