import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Collections from './pages/products/Collections';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import WhySilk from './pages/WhySilk';

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

// 引入 Account 相关页面
import MyOrders from './pages/account/MyOrders';
import Wishlist from './pages/account/Wishlist';
import Addresses from './pages/account/Addresses';
import PaymentMethods from './pages/account/PaymentMethods';
import Preferences from './pages/account/Preferences';

// 引入工具组件
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// --- 路由保护组件 ---
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

  // 加载中状态：使用高端 LoadingScreen
  if (loading) {
    return <LoadingScreen />;
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
          <Route path="why_silk" element={<WhySilk />} />
          
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