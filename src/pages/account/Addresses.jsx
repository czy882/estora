import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, MapPin, Check, ChevronDown } from 'lucide-react';
import Button from '../../components/Button';

// --- 组件：浮动标签输入框 ---
const AddressInput = ({ label, value, onChange, type = "text", className = "", required = false }) => (
  <div className={`relative ${className}`}>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="peer w-full h-14 px-4 pt-6 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] focus:outline-none transition-all placeholder-transparent"
      placeholder=" " 
      required={required}
    />
    {/* Label 逻辑：
      1. 默认状态: top-1/2 (居中), text-[#9a8a85]
      2. 浮动状态 (focus 或 有内容): top-4 (上浮), scale-75 (缩小), text-[#7c2b3d] (高亮)
    */}
    <label className="absolute left-4 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out origin-left 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[#9a8a85] peer-placeholder-shown:text-[17px] peer-placeholder-shown:scale-100
      peer-focus:top-4 peer-focus:text-[#7c2b3d] peer-focus:scale-75
      peer-not-placeholder-shown:top-4 peer-not-placeholder-shown:text-[#7c2b3d] peer-not-placeholder-shown:scale-75">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  </div>
);

// --- 组件：州选择器 (State Select) ---
const StateSelect = ({ value, onChange, required = false }) => {
  return (
    <div className="relative">
      <select 
        className="peer w-full h-14 px-4 pt-6 pb-1 rounded-xl border border-[#e5d5d0] text-[17px] text-[#1d1d1f] bg-white focus:border-[#7c2b3d] focus:ring-1 focus:ring-[#7c2b3d] outline-none appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {/* 这里的 value="" disabled hidden 确保没有选择时显示为空白 */}
        <option value="" disabled hidden></option>
        {['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      
      {/* Label 逻辑 (State 特制版):
        使用 value 是否存在来控制浮动，替代 placeholder-shown
      */}
      <label className={`absolute left-4 transform -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out origin-left 
        ${value 
          ? 'top-4 scale-75 text-[#7c2b3d]' // 有值时：上浮
          : 'top-1/2 text-[#9a8a85] text-[17px]' // 无值时：居中
        }
        peer-focus:top-4 peer-focus:scale-75 peer-focus:text-[#7c2b3d]
      `}>
        State {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a85] pointer-events-none" />
    </div>
  );
};

// --- 组件：地址表单 ---
const AddressForm = ({ initialData, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-4xl p-8 shadow-lg border border-[#7c2b3d] animate-fade-in ring-1 ring-[#7c2b3d]/10">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-medium text-[#7c2b3d]">{title}</h2>
          <button type="button" onClick={onCancel} className="text-[#9a8a85] hover:text-[#1d1d1f] text-sm underline decoration-transparent hover:decoration-current transition-all">
            Cancel
          </button>
       </div>

       <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AddressInput 
              label="First Name" 
              value={formData.firstName} 
              onChange={v => setFormData({...formData, firstName: v})} 
              required 
            />
            <AddressInput 
              label="Last Name" 
              value={formData.lastName} 
              onChange={v => setFormData({...formData, lastName: v})} 
              required 
            />
          </div>
          
          <AddressInput 
            label="Address Line 1" 
            value={formData.line1} 
            onChange={v => setFormData({...formData, line1: v})} 
            required 
          />
          
          <AddressInput 
            label="Address Line 2 (Optional)" 
            value={formData.line2} 
            onChange={v => setFormData({...formData, line2: v})} 
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <AddressInput 
              label="City / Suburb" 
              value={formData.suburb} 
              onChange={v => setFormData({...formData, suburb: v})} 
              required 
            />
            
            <StateSelect 
              value={formData.state} 
              onChange={v => setFormData({...formData, state: v})} 
              required 
            />

            <AddressInput 
              label="Postcode" 
              value={formData.postcode} 
              onChange={v => setFormData({...formData, postcode: v})} 
              required 
            />
          </div>

          <AddressInput 
            label="Phone Number" 
            value={formData.phone} 
            onChange={v => setFormData({...formData, phone: v})} 
            required 
          />

          <div className="pt-4 flex justify-end gap-4">
            <Button type="submit" size="lg" className="shadow-xl shadow-[#7c2b3d]/20 px-10">
              Save Address
            </Button>
          </div>
       </form>
    </div>
  );
};

const Addresses = () => {
  const navigate = useNavigate();
  
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyForm = {
    firstName: '', lastName: '', line1: '', line2: '', suburb: '', state: '', postcode: '', phone: ''
  };

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      isDefault: true,
      firstName: 'Aurora',
      lastName: 'Member',
      line1: '123 Silk Road',
      line2: 'Level 8',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      phone: '0412 345 678'
    }
  ]);

  const handleUpdate = (id, updatedData) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...updatedData, id, isDefault: addr.isDefault } : addr
    ));
    setEditingId(null);
  };

  const handleCreate = (newData) => {
    const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
    const isFirst = addresses.length === 0;
    setAddresses([...addresses, { ...newData, id: newId, isDefault: isFirst }]);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[800px] mx-auto px-6">
        
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center hover:border-[#7c2b3d] hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">My Addresses</h1>
        </div>

        <div className="space-y-6">
          
          {addresses.map((addr) => (
            <div key={addr.id}>
              {editingId === addr.id ? (
                <AddressForm 
                  title="Edit Address"
                  initialData={addr}
                  onSave={(data) => handleUpdate(addr.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="bg-white rounded-4xl p-8 shadow-sm border border-[#f0e8e4] relative group transition-all hover:shadow-md">
                  {addr.isDefault && (
                    <span className="absolute top-8 right-8 text-xs font-bold tracking-widest text-[#7c2b3d] uppercase flex items-center gap-1">
                      <Check size={14} /> Default
                    </span>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                     <div className="mt-1 text-[#9a8a85]"><MapPin size={20} /></div>
                     <div>
                        <h3 className="text-xl font-serif font-medium mb-1">{addr.firstName} {addr.lastName}</h3>
                        <div className="text-[#5a5a5a] font-light leading-relaxed">
                          <p>{addr.line1}</p>
                          {addr.line2 && <p>{addr.line2}</p>}
                          <p>{addr.suburb}, {addr.state} {addr.postcode}</p>
                          <p className="mt-2 text-sm">{addr.phone}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-6 mt-6 pl-9 pt-4 border-t border-[#fcf9f8]">
                     <button 
                       onClick={() => {
                         setEditingId(addr.id); 
                         setIsAdding(false);
                       }}
                       className="text-sm font-medium text-[#1d1d1f] hover:text-[#7c2b3d] underline decoration-[#e5d5d0] hover:decoration-[#7c2b3d] underline-offset-4 transition-all"
                     >
                       Edit
                     </button>
                     {!addr.isDefault && (
                       <button 
                         onClick={() => handleDelete(addr.id)}
                         className="text-sm text-[#9a8a85] hover:text-[#c94e4e] flex items-center gap-1 transition-colors"
                       >
                         Delete
                       </button>
                     )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding ? (
            <AddressForm 
              title="Add New Address"
              initialData={emptyForm}
              onSave={handleCreate}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            !editingId && (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full bg-[#fcf9f8] rounded-4xl p-8 border-2 border-dashed border-[#e5d5d0] text-[#9a8a85] hover:border-[#7c2b3d] hover:text-[#7c2b3d] hover:bg-white transition-all flex flex-col items-center justify-center gap-3 group h-[120px]"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center group-hover:border-[#7c2b3d] transition-colors">
                  <Plus size={20} />
                </div>
                <span className="font-medium tracking-wide text-sm">ADD NEW ADDRESS</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;