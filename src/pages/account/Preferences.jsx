import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Mail, Shield, Moon } from 'lucide-react';
import Button from '../../components/Button';

// --- 本地复用：Toggle Switch 组件 ---
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
      checked ? 'bg-[#7c2b3d]' : 'bg-[#e5d5d0]'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const Preferences = () => {
  const navigate = useNavigate();

  // 模拟设置状态
  const [settings, setSettings] = useState({
    emailNews: true,
    emailOrder: true,
    smsAlerts: false,
    dataSharing: false,
    personalizedAds: true,
    darkMode: false, // 仅作为示例，实际暗黑模式需要全局 Context
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // 模拟保存操作
    alert('Preferences saved successfully.');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center hover:border-[#7c2b3d] hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">Preferences</h1>
        </div>

        <div className="space-y-8">
          
          {/* Section 1: Notifications */}
          <div className="bg-white rounded-4xl p-8 shadow-sm border border-[#f0e8e4]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f5efec]">
               <Bell className="text-[#7c2b3d]" size={24} />
               <h2 className="text-xl font-serif font-medium">Notifications</h2>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium mb-1">New Arrivals & Offers</h3>
                     <p className="text-sm text-[#9a8a85]">Receive updates about new products and exclusive sales.</p>
                  </div>
                  <ToggleSwitch checked={settings.emailNews} onChange={() => handleToggle('emailNews')} />
               </div>
               
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium mb-1">Order Updates</h3>
                     <p className="text-sm text-[#9a8a85]">Get notified when your order is shipped or delivered.</p>
                  </div>
                  <ToggleSwitch checked={settings.emailOrder} onChange={() => handleToggle('emailOrder')} />
               </div>

               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium mb-1">SMS Alerts</h3>
                     <p className="text-sm text-[#9a8a85]">Receive urgent updates via text message.</p>
                  </div>
                  <ToggleSwitch checked={settings.smsAlerts} onChange={() => handleToggle('smsAlerts')} />
               </div>
            </div>
          </div>

          {/* Section 2: Privacy & Data */}
          <div className="bg-white rounded-4xl p-8 shadow-sm border border-[#f0e8e4]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f5efec]">
               <Shield className="text-[#7c2b3d]" size={24} />
               <h2 className="text-xl font-serif font-medium">Privacy & Data</h2>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium mb-1">Personalized Ads</h3>
                     <p className="text-sm text-[#9a8a85]">Allow us to show you products based on your interests.</p>
                  </div>
                  <ToggleSwitch checked={settings.personalizedAds} onChange={() => handleToggle('personalizedAds')} />
               </div>
               
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium mb-1">Data Sharing</h3>
                     <p className="text-sm text-[#9a8a85]">Allow sharing anonymous usage data to improve our service.</p>
                  </div>
                  <ToggleSwitch checked={settings.dataSharing} onChange={() => handleToggle('dataSharing')} />
               </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
             <Button size="lg" className="shadow-xl shadow-[#7c2b3d]/20 px-12" onClick={handleSave}>
               Save Changes
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Preferences;