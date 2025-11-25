import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Button from '../../components/Button';

// --- 模拟订单数据 ---
const MOCK_ORDERS = [
  {
    id: 'AUR-8291',
    date: 'May 14, 2025',
    status: 'Processing',
    total: 61.95,
    items: [
      { name: 'Day Comfort', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Day' },
      { name: 'Night Sanctuary', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Night' },
      { name: 'Daily Liners', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Liner' }
    ]
  },
  {
    id: 'AUR-7732',
    date: 'April 28, 2025',
    status: 'Delivered',
    total: 29.98,
    items: [
      { name: 'Overnight Protection', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Overnight' }
    ]
  },
  {
    id: 'AUR-6610',
    date: 'March 10, 2025',
    status: 'Delivered',
    total: 115.80,
    items: [
      { name: 'Day Comfort', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Day' },
      { name: 'Day Comfort', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Day' },
      { name: 'Night Sanctuary', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Night' },
      { name: 'Daily Liners', image: 'https://placehold.co/200x200/fdfbfb/7c2b3d?text=Liner' }
    ]
  }
];

// 辅助组件：状态标签
const StatusBadge = ({ status }) => {
  const styles = {
    Processing: "bg-orange-100 text-orange-700 border-orange-200",
    Shipped: "bg-blue-100 text-blue-700 border-blue-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons = {
    Processing: <Clock size={14} />,
    Shipped: <Truck size={14} />,
    Delivered: <CheckCircle size={14} />,
    Cancelled: <Package size={14} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Processing}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const MyOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#f8f6f4] font-sans text-[#1d1d1f] animate-fade-in">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 rounded-full bg-white border border-[#e5d5d0] flex items-center justify-center hover:border-[#7c2b3d] hover:text-[#7c2b3d] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl font-serif font-medium">My Orders</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {MOCK_ORDERS.length > 0 ? (
            MOCK_ORDERS.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-4xl p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(124,43,61,0.03)] border border-[#f0e8e4] transition-all hover:shadow-[0_15px_35px_-10px_rgba(124,43,61,0.08)]"
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-[#f5efec]">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-lg text-[#1d1d1f]">Order {order.id}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-[#9a8a85]">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl font-medium text-[#1d1d1f]">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-[#9a8a85]">{order.items.length} items</p>
                  </div>
                </div>

                {/* Order Items (Thumbnails) */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex -space-x-3 overflow-hidden py-1">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="w-12 h-12 rounded-full border-2 border-white bg-[#f8f6f4] flex items-center justify-center relative"
                        title={item.name}
                      >
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain mix-blend-multiply" />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-[#fcf9f8] flex items-center justify-center text-xs font-medium text-[#9a8a85]">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="h-10 px-5 text-sm bg-transparent border-[#e5d5d0] hover:bg-[#fcf9f8] hover:text-[#7c2b3d]"
                    >
                      Track
                    </Button>
                    <Button className="h-10 px-5 text-sm shadow-md shadow-[#7c2b3d]/10">
                      Buy Again
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#f0e8e4]">
              <Package size={48} className="mx-auto text-[#e5d5d0] mb-4" />
              <h3 className="text-xl font-serif text-[#1d1d1f] mb-2">No orders yet</h3>
              <p className="text-[#9a8a85] mb-8">Once you place an order, it will appear here.</p>
              <Button onClick={() => navigate('/products')}>Start Shopping</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyOrders;