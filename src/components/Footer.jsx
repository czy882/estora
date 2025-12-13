import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const colTitle = "font-semibold text-[#1d1d1f] mb-3 tracking-tight";
  const itemClass = "block text-[#6e6e73] hover:text-[#1d1d1f] transition-colors";

  return (
    <footer className="bg-[#f8f6f4] text-[#6e6e73] text-xs py-14 px-6 mt-auto">
      <div className="max-w-6xl mx-auto border-t border-[#efe6e4] pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Shop */}
          <div>
            <h4 className={colTitle}>Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className={itemClass}>Shop All</Link>
              </li>
              <li>
                <Link to="/collections" className={itemClass}>Collections</Link>
              </li>
              <li>
                <Link to="/why_silk" className={itemClass}>Why Silk</Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className={`${itemClass} text-left`}
                >
                  Shopping Bag
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className={colTitle}>Account</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className={itemClass}>Profile</Link>
              </li>
              <li>
                <Link to="/profile/orders" className={itemClass}>Orders</Link>
              </li>
              <li>
                <Link to="/profile/addresses" className={itemClass}>Addresses</Link>
              </li>
              <li>
                <Link to="/login" className={itemClass}>Log In</Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className={colTitle}>About ESTORA</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={itemClass}>Our Story</Link>
              </li>
              <li>
                <Link to="/" className={itemClass}>Technology</Link>
              </li>
              <li>
                <a
                  href="https://estora.au"
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  Visit WordPress Site
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={colTitle}>Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://estora.au/contact"
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://estora.au/shipping-returns"
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="https://estora.au/faq"
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://estora.au/checkout"
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#efe6e4] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6e6e73]">Copyright © {year} ESTORA. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a
              href="https://estora.au/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1d1d1f] hover:underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://estora.au/terms-of-use"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1d1d1f] hover:underline underline-offset-4 transition-colors"
            >
              Terms
            </a>
            <span className="text-[#9a8a85]">Australia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 这一行非常重要！没有它，外部无法使用这个组件，会导致网站白屏。
export default Footer;