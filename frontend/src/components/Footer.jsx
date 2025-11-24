import React from 'react';

const Footer = () => (
  <footer className="bg-[#f5f5f7] text-[#86868b] text-xs py-10 px-5 mt-auto">
    <div className="max-w-5xl mx-auto border-t border-gray-200 pt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="font-semibold text-[#1d1d1f] mb-2">Shop & Learn</h4>
          <ul className="space-y-2">
            <li>Shop Pads</li>
            <li>Night Range</li>
            <li>Subscription</li>
            <li>Gift Cards</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#1d1d1f] mb-2">Account</h4>
          <ul className="space-y-2">
            <li>Manage Profile</li>
            <li>Order History</li>
            <li>Address Book</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#1d1d1f] mb-2">About AURORA</h4>
          <ul className="space-y-2">
             <li>Our Story</li>
             <li>Sustainability</li>
             <li>Careers</li>
             <li>Newsroom</li>
          </ul>
        </div>
        <div>
           <h4 className="font-semibold text-[#1d1d1f] mb-2">Support & Wellness</h4>
           <ul className="space-y-2">
              <li>FAQ</li>
              <li>Shipping & Returns</li>
              <li>Contact Us</li>
              <li>Period Health Blog</li>
           </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>Copyright © 2025 AURORA Pty Ltd. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Use</span>
          <span className="hover:underline cursor-pointer">Australia</span>
        </div>
      </div>
    </div>
  </footer>
);

// 这一行非常重要！没有它，外部无法使用这个组件，会导致网站白屏。
export default Footer;