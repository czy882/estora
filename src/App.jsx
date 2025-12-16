// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// 全站布局（确保 Navbar / Footer 回来）
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Collections from "./pages/products/Collections";
import ProductDetail from "./pages/products/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// ✅ 这几个就是你刚才报错缺失的页面（按你项目真实路径修改 import）
import DayComfort from "./pages/products/DayComfort";
import NightSanctuary from "./pages/products/NightSanctuary";
import Overnight from "./pages/products/Overnight";
import Liners from "./pages/products/Liners";
import WhySilk from "./pages/WhySilk";

// ScrollToTop：必须在 Router 内部使用（App 本身已经在 main.jsx 的 BrowserRouter 内）
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* ✅ 你缺的这些路由：保持原路径不变 */}
        <Route path="/day-comfort" element={<DayComfort />} />
        <Route path="/night-sanctuary" element={<NightSanctuary />} />
        <Route path="/overnight" element={<Overnight />} />
        <Route path="/liners" element={<Liners />} />
        <Route path="/why_silk" element={<WhySilk />} />

        {/* Collections / Product */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Cart / Checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Auth */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Footer />
    </>
  );
}