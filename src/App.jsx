import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Collections from "./pages/products/Collections";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import WhySilk from "./pages/WhySilk";

// 产品页面
import DayComfort from "./pages/products/DayComfort";
import NightSanctuary from "./pages/products/NightSanctuary";
import OvernightProtection from "./pages/products/OvernightProtection";
import DailyLiners from "./pages/products/DailyLiners";
// 动态产品详情页（Woo Store API 联动）
import ProductDetail from "./pages/products/ProductDetail";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Account
import MyOrders from "./pages/account/MyOrders";
import Wishlist from "./pages/account/Wishlist";
import Addresses from "./pages/account/Addresses";
import PaymentMethods from "./pages/account/PaymentMethods";
import Preferences from "./pages/account/Preferences";

// Utils
import ScrollToTop from "./components/ScrollToTop";

// ✅ 使用 CoCart 全局状态
import { useCart } from "./store/cartStore";

function App() {
  // 🔥 来自 WooCommerce 的真实购物车
  const { cart } = useCart();

  // 中文注释：计算购物车数量（从 CoCart cart 结构中安全读取）
  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              cartCount={cartCount}
              session={null} // 后续会换成 WP JWT Session
            />
          }
        >
          {/* --- 公开页面 --- */}
          <Route index element={<Home />} />
          <Route path="collections" element={<Collections />} />
          <Route path="products" element={<Collections />} />
          <Route path="why_silk" element={<WhySilk />} />

          {/* --- 动态产品详情页（/product/:id）--- */}
          <Route path="product/:id" element={<ProductDetail />} />
          {/* --- 单个产品页（内部用 useCart().addItem） --- */}
          <Route path="day_comfort" element={<DayComfort />} />
          <Route path="night_sanctuary" element={<NightSanctuary />} />
          <Route path="overnight_protection" element={<OvernightProtection />} />
          <Route path="daily_liners" element={<DailyLiners />} />

          {/* --- 购物车页（真实 Woo Cart） --- */}
          <Route path="cart" element={<Cart />} />

          {/* --- Checkout：安全跳转 Woo 原生 --- */}
          <Route
            path="checkout"
            element={
              <Navigate
                to="https://estora.au/checkout/"
                replace
              />
            }
          />

          {/* --- Profile / Account --- */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/orders" element={<MyOrders />} />
          <Route path="profile/wishlist" element={<Wishlist />} />
          <Route path="profile/addresses" element={<Addresses />} />
          <Route path="profile/payments" element={<PaymentMethods />} />
          <Route path="profile/preferences" element={<Preferences />} />

          {/* --- Auth --- */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
