import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronRight, Package, Heart, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../supabaseClient';

// --- 更新：为每个选项配置路由路径 ---
const ACCOUNT_LINKS = [
  { 
    title: "My Orders", 
    desc: "Track, return, or buy again", 
    icon: <Package size={20} />, 
    path: '/profile/orders' 
  },
  { 
    title: "Wishlist", 
    desc: "Your saved favourites", 
    icon: <Heart size={20} />, 
    path: '/profile/wishlist' 
  },
  { 
    title: "Addresses", 
    desc: "Manage delivery locations", 
    icon: <MapPin size={20} />, 
    path: '/profile/addresses' 
  },
  { 
    title: "Payment Methods", 
    desc: "Manage cards and billing", 
    icon: <CreditCard size={20} />, 
    path: '/profile/payments' 
  },
  { 
    title: "Preferences", 
    desc: "Notification settings", 
    icon: <Settings size={20} />, 
    path: '/profile/preferences' 
  }
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (!error) {
      alert('You have been signed out.');
      navigate('/');
    } else {
      alert(`Logout error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#f8f6f4] flex items-center justify-center">
        <div className="text-xl text-[#7c2b3d] font-serif">Loading profile...</div>
      </div>
    );
  }

  // A. 登录后状态展示
  const LoggedInCard = () => {
    const userMetadata = user.user_metadata || {};
    const firstName = userMetadata.first_name || 'AURORA Member';
    const email = user.email || 'Member email hidden';

    return (
      <div className="bg-white rounded-[2.5rem] p-10 mb-10 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
        <div className="w-20 h-20 rounded-full bg-[#7c2b3d]/10 flex items-center justify-center text-[#7c2b3d] mb-4">
           <User size={40} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-2">Welcome, {firstName}</h1>
        <p className="text-gray-500 mb-6 font-light leading-relaxed">
          {email}
        </p>
        
        <Button 
          variant="outline" 
          className="w-full max-w-xs h-12 text-base bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
    );
  };

  // B. 登出前状态展示
  const LoggedOutCard = () => (
    <div className="bg-white rounded-[2.5rem] p-10 mb-10 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_-10px_rgba(124,43,61,0.05)] border border-[#f0e8e4]">
      <div className="w-20 h-20 rounded-full bg-[#f8f6f4] flex items-center justify-center text-[#7c2b3d] mb-6">
         <User size={40} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-3xl font-serif font-medium text-[#1d1d1f] mb-3">Welcome to AURORA</h1>
      <p className="text-gray-500 mb-8 max-w-md font-light leading-relaxed">
        Log in or sign up to manage your subscription, track orders, and unlock exclusive member benefits.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/login" className="flex-1">
          <Button className="w-full h-12 text-base shadow-xl shadow-[#7c2b3d]/10">
            Log In
          </Button>
        </Link>
        <Link to="/signup" className="flex-1">
          <Button variant="outline" className="w-full h-12 text-base bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="pt-32 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[800px] mx-auto px-6">
        
        {user ? <LoggedInCard /> : <LoggedOutCard />}

        <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-6 px-2">Account Settings</h3>
        
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.02)] border border-[#f0e8e4] divide-y divide-[#f5efec]">
          {ACCOUNT_LINKS.map((item, i) => (
              <div 
                key={i} 
                className="p-6 hover:bg-[#fcf9f8] cursor-pointer flex items-center gap-5 group transition-colors duration-300"
                // 核心跳转逻辑：
                // 1. 如果未登录，统一跳去 Login
                // 2. 如果已登录，跳去对应的 item.path
                onClick={() => { 
                  if (!user) {
                    navigate('/login');
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <div className={`w-12 h-12 rounded-full bg-[#f8f6f4] flex items-center justify-center ${user ? 'text-[#9a8a85] group-hover:text-[#7c2b3d] group-hover:bg-[#7c2b3d]/10' : 'text-[#d0c0bc]'} transition-colors duration-300`}>
                  {item.icon}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-[#1d1d1f] font-serif text-lg group-hover:text-[#7c2b3d] transition-colors">{item.title}</div>
                  <div className="text-sm text-[#9a8a85] font-light">{item.desc}</div>
                </div>
                
                <ChevronRight size={18} className="text-[#d0c0bc] group-hover:text-[#7c2b3d] transition-colors transform group-hover:translate-x-1 duration-300" />
              </div>
          ))}
        </div>
        
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Profile;