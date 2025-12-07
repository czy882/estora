import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Collections from './pages/products/Collections';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import WhySilk from './pages/WhySilk';

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

// --- 临时路由保护组件 (WP Auth 待开发) ---
// 目前我们暂时允许通行，直到我们接入 WordPress 的 JWT 登录
const ProtectedRoute = ({ children }) => {
  // TODO: 这里以后会接入 WordPress 的 Auth Context
  const isAuthenticated = false; // 暂时设为 false 或 true 方便调试
  
  // 暂时注释掉拦截逻辑，防止无法访问页面
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  return children;
};

function App() {
  // --- 购物车状态管理 ---
  // 注意：在完整对接 WordPress 后，这里建议改用 Context 或 Apollo Cache 管理
  const [cart, setCart] = useState([]);
  
  // --- Auth 状态管理 (Supabase 已移除) ---
  // const [session, setSession] = useState(null); // 已移除
  const [loading, setLoading] = useState(false); // 暂时设为 false

  // 购物车逻辑 (本地 State 模拟，后续可换成 mutation)
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout cartCount={cartCount} session={null} />}>
          <Route index element={<Home />} />
          
          {/* --- 公开页面 --- */}
          <Route path="collections" element={<Collections onAddToCart={addToCart} />} />
          <Route path="products" element={<Collections onAddToCart={addToCart} />} />
          <Route path="why_silk" element={<WhySilk />} />
          
          {/* 单个产品页面 - 记得也要把这些页面里的 Supabase 逻辑删掉，换成 Apollo */}
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

          {/* --- Account 路由 (暂时解除保护以便调试 UI) --- */}
          <Route path="profile/orders" element={<MyOrders />} />
          <Route path="profile/wishlist" element={<Wishlist onAddToCart={addToCart} />} />
          <Route path="profile/addresses" element={<Addresses />} />
          <Route path="profile/payments" element={<PaymentMethods />} />
          <Route path="profile/preferences" element={<Preferences />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;