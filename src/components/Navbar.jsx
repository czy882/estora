import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 产品链接配置 (修正为标准连字符路径，匹配 App.jsx)
  const productLinks = [
    { label: 'Day Comfort', path: '/day_comfort' },
    { label: 'Night Sanctuary', path: '/night_sanctuary' },
    { label: 'Overnight Protection', path: '/overnight_protection' },
    { label: 'Daily Liners', path: '/daily_liners' },
  ];

  const otherLinks = [
    { label: 'Collections', path: '/collections' },
    { label: 'Why Silk', path: '/why_silk' },
  ];

  useEffect(() => {
    // 确保在浏览器环境中运行
    if (typeof window !== 'undefined') {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // === 动态样式逻辑 ===
  const navContainerClass = `fixed top-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isScrolled 
      ? 'bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#f0e8e4] py-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]' 
      : 'bg-transparent py-8 border-b border-transparent'
  }`;

  const brandColor = 'text-[#7c2b3d]'; 

  return (
    <>
      <nav className={navContainerClass}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* 1. Logo */}
          <Link to="/" className="group relative z-10">
             <h1 className={`font-serif text-2xl md:text-3xl tracking-tight font-medium transition-colors duration-300 ${isScrolled ? brandColor : 'text-[#2c2c2c]'}`}>
               AURORA
             </h1>
          </Link>

          {/* 2. Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-8">
              {productLinks.map(item => (
                <NavLink key={item.label} to={item.path} label={item.label} />
              ))}
            </div>
            
            <span className="w-1 h-1 rounded-full bg-[#d0c0bc]"></span>

            <div className="flex items-center gap-8">
              {otherLinks.map(item => (
                <NavLink key={item.label} to={item.path} label={item.label} />
              ))}
            </div>
          </div>

          {/* 3. Actions */}
          <div className="flex items-center gap-5 md:gap-8 z-10 text-[#5a5a5a]">
            <button className="hover:text-[#7c2b3d] transition-colors duration-300 transform hover:scale-110">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link to="/profile" className="hover:text-[#7c2b3d] transition-colors duration-300 transform hover:scale-110 hidden sm:block">
              <User size={20} strokeWidth={1.5} />
            </Link>

            <Link to="/cart" className="relative hover:text-[#7c2b3d] transition-colors duration-300 transform hover:scale-110">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-[#7c2b3d] text-white text-[9px] font-medium shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="lg:hidden text-[#2c2c2c]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* === Mobile Menu Overlay === */}
      <div className={`fixed inset-0 z-40 bg-[#fbf9f8] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-10'}`}>
        <div className="h-full flex flex-col p-8 pt-32 relative">
           <button 
             onClick={() => setMobileMenuOpen(false)} 
             className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#2c2c2c]"
           >
              <X size={20} />
           </button>

           <div className="flex flex-col gap-8">
              <div className="space-y-1">
                 <p className="text-xs font-bold tracking-widest uppercase text-[#9a8a85] mb-4">Products</p>
                 {productLinks.map(item => (
                   <MobileNavLink key={item.label} to={item.path} label={item.label} onClick={() => setMobileMenuOpen(false)} />
                 ))}
              </div>
              
              <div className="w-full h-px bg-[#ece0dd]"></div>

              <div className="space-y-1">
                 <p className="text-xs font-bold tracking-widest uppercase text-[#9a8a85] mb-4">Discover</p>
                 {otherLinks.map(item => (
                   <MobileNavLink key={item.label} to={item.path} label={item.label} onClick={() => setMobileMenuOpen(false)} />
                 ))}
              </div>
           </div>

           <div className="mt-auto">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-[#7c2b3d]">Log in / Sign up</Link>
           </div>
        </div>
      </div>
    </>
  );
};

// --- 子组件 ---
const NavLink = ({ to, label }) => (
  <Link 
    to={to} 
    className="relative group py-2"
  >
    {/* 核心修改：添加了 whitespace-nowrap 防止文字换行 */}
    <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#5a5a5a] group-hover:text-[#7c2b3d] transition-colors duration-300 whitespace-nowrap">
      {label}
    </span>
    <span className="absolute bottom-0 left-1/2 w-0 h-px bg-[#7c2b3d] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
  </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block text-2xl font-serif text-[#2c2c2c] hover:text-[#7c2b3d] transition-colors py-2"
  >
    {label}
  </Link>
);

export default Navbar;