import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, X, ShoppingBag } from 'lucide-react';
import Button from '../../components/Button';
import { PRODUCTS } from '../../data/products';

const Wishlist = ({ onAddToCart }) => {
  const navigate = useNavigate();
  
  // 模拟初始收藏数据 (取第1和第3个产品)
  const [wishlistItems, setWishlistItems] = useState([PRODUCTS[0], PRODUCTS[2]]);

  const handleRemove = (e, id) => {
    e.stopPropagation(); // 防止触发卡片点击
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  // 辅助跳转函数
  const getProductLink = (id) => {
    switch(id) {
      case 1: return '/products/day-comfort';
      case 2: return '/products/night-sanctuary';
      case 3: return '/products/overnight-protection';
      case 4: return '/products/daily-liners';
      default: return '/products';
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/profile')} 
                    className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center hover:border-[#7c2b3d] hover:text-[#7c2b3d] transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-3xl md:text-4xl font-serif font-medium">Your Wishlist</h1>
            </div>
            <p className="text-[#9a8a85] font-light text-sm uppercase tracking-widest">{wishlistItems.length} items saved</p>
        </div>

        {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistItems.map(product => (
                    <div 
                        key={product.id} 
                        className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_30px_-10px_rgba(124,43,61,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(124,43,61,0.08)] transition-all duration-500 border border-[#f0e8e4] flex flex-col group relative cursor-pointer"
                        onClick={() => navigate(getProductLink(product.id))}
                    >
                        
                        {/* Remove Button */}
                        <button 
                            onClick={(e) => handleRemove(e, product.id)}
                            className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-[#f8f6f4] flex items-center justify-center text-[#9a8a85] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors"
                            title="Remove from wishlist"
                        >
                            <X size={16} />
                        </button>

                        {/* Image Area */}
                        <div className="aspect-4/5 bg-[#f9f9f9] rounded-4xl mb-6 flex items-center justify-center overflow-hidden relative">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-3/4 h-3/4 object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-serif font-medium text-[#1d1d1f] mb-1 group-hover:text-[#7c2b3d] transition-colors">{product.name}</h3>
                                <p className="text-xs text-[#9a8a85] uppercase tracking-wider font-medium">{product.category}</p>
                            </div>
                            
                            <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-[#f5efec]">
                                <span className="text-lg font-medium">${product.price}</span>
                                <Button 
                                    size="sm" 
                                    className="shadow-md shadow-[#7c2b3d]/10 flex items-center gap-2"
                                    onClick={(e) => handleAddToCart(e, product)}
                                >
                                    <ShoppingBag size={14} /> Add to Bag
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // Empty State
            <div className="text-center py-32 bg-white rounded-[3rem] border border-[#f0e8e4] shadow-sm">
                <div className="w-20 h-20 mx-auto bg-[#f8f6f4] rounded-full flex items-center justify-center text-[#e5d5d0] mb-6">
                    <Heart size={40} />
                </div>
                <h2 className="text-2xl font-serif text-[#1d1d1f] mb-3">Your wishlist is empty</h2>
                <p className="text-[#9a8a85] mb-10 max-w-md mx-auto font-light leading-relaxed">
                    Save items you love to your wishlist so you can easily find them later.
                </p>
                <Button onClick={() => navigate('/products')} size="lg" className="shadow-xl shadow-[#7c2b3d]/10">
                    Explore Collection
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;