import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Collections from './pages/products/Collections';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Philosophy from './pages/Philosophy';

// 引入产品页面 (确保路径正确)
import DayComfort from './pages/products/DayComfort';
import NightSanctuary from './pages/products/NightSanctuary';
import OvernightProtection from './pages/products/OvernightProtection';
import DailyLiners from './pages/products/DailyLiners';

// 引入 Login 和 Signup 组件 (根据之前的结构，它们应该在 pages 根目录下)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  const [cart, setCart] = useState([]);

  // 添加商品到购物车
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

  // 更新数量
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  // 删除购物车商品
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout cartCount={cartCount} />}>
          <Route index element={<Home />} />
          
          {/* --- 产品路由 (修正路径以匹配 Navbar) --- */}
          {/* 1. 通用 products 路径 */}
          <Route path="collections" element={<Collections onAddToCart={addToCart} />} />
          <Route path="philosophy" element={<Philosophy onAddToCart={addToCart} />} />
          
          {/* 2. 具体产品路径 (使用连字符 - 而不是下划线 _，匹配 Navbar) */}
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
                // Cart 页面现在自己处理跳转，不需要 onCheckout
              />
            } 
          />
          
          {/* --- 核心修复：传入 cart 数据给 Checkout --- */}
          <Route 
            path="checkout" 
            element={<Checkout cart={cart} />} 
          />

          <Route path="profile" element={<Profile />} />
          
          {/* 登录和注册路由 */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;