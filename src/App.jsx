import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 引入 Navigate 用于重定向
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Collections from './pages/products/Collections';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Philosophy from './pages/Philosophy';

// 引入 Supabase Client
import { supabase } from './supabaseClient';

// 引入产品页面
import DayComfort from './pages/products/DayComfort';
import NightSanctuary from './pages/products/NightSanctuary';
import OvernightProtection from './pages/products/OvernightProtection';
import DailyLiners from './pages/products/DailyLiners';

// 引入 Login 和 Signup 组件
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// 引入 Account 相关页面 (确保这些文件都在 src/pages/account/ 下)
import MyOrders from './pages/account/MyOrders';
import Wishlist from './pages/account/Wishlist';
import Addresses from './pages/account/Addresses';
import PaymentMethods from './pages/account/PaymentMethods';
import Preferences from './pages/account/Preferences';

// 返回最上面
import ScrollToTop from './components/ScrollToTop';

// --- 路由保护组件 ---
// 如果没有 session (未登录)，则重定向到 /login
const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [cart, setCart] = useState([]);
  
  // --- Auth 状态管理 ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 1. 检查初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. 监听状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  // --------------------

  // 购物车逻辑
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      const addedQuantity = product.quantity || 1; 

      if (exists) {
         return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + addedQuantity } : i);
      }
      return [...prev, { ...product, quantity: addedQuantity }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-xl text-[#7c2b3d]">
        Loading Application...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout cartCount={cartCount} session={session} />}>
          <Route index element={<Home />} />
          
          {/* --- 公开页面 --- */}
          <Route path="collections" element={<Collections onAddToCart={addToCart} />} />
          <Route path="products" element={<Collections onAddToCart={addToCart} />} /> {/* 兼容旧链接 */}
          <Route path="philosophy" element={<Philosophy />} />
          
          <Route path="day_comfort" element={<DayComfort onAddToCart={addToCart} />} />
          <Route path="night_sanctuary" element={<NightSanctuary onAddToCart={addToCart} />} />
          <Route path="overnight_protection" element={<OvernightProtection onAddToCart={addToCart} />} />
          <Route path="daily_liners" element={<DailyLiners onAddToCart={addToCart} />} />

          <Route 
            path="cart" 
            element={
              <Cart 
                cart={cart} 
                onUpdateQuantity={updateQuantity} 
                onRemoveFromCart={removeFromCart}
              />
            } 
          />
          
          <Route 
            path="checkout" 
            element={<Checkout cart={cart} />} 
          />

          <Route path="profile" element={<Profile />} />
          
          {/* --- 登录/注册 --- */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* --- 受保护的 Account 路由 --- */}
          {/* 只有登录后才能访问，否则跳到 Login */}
          
          <Route 
            path="profile/orders" 
            element={
              <ProtectedRoute session={session}>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="profile/wishlist" 
            element={
              <ProtectedRoute session={session}>
                <Wishlist onAddToCart={addToCart} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="profile/addresses" 
            element={
              <ProtectedRoute session={session}>
                <Addresses />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="profile/payments" 
            element={
              <ProtectedRoute session={session}>
                <PaymentMethods />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="profile/preferences" 
            element={
              <ProtectedRoute session={session}>
                <Preferences />
              </ProtectedRoute>
            } 
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;