'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, Search, Loader2, MapPin, CalendarDays, X } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: any[];
  estimatedDelivery?: string;
  shippingAddress?: string;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={20} />;
      case 'Processing': return <Package size={20} />;
      case 'Shipped': return <Truck size={20} />;
      case 'Delivered': return <CheckCircle2 size={20} />;
      default: return <Package size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' };
      case 'Processing': return { bg: '#eff6ff', text: '#3b82f6', border: '#dbeafe' };
      case 'Shipped': return { bg: '#f5f3ff', text: '#8b5cf6', border: '#ede9fe' };
      case 'Delivered': return { bg: '#f0fdf4', text: '#10b981', border: '#dcfce7' };
      case 'Cancelled': return { bg: '#fef2f2', text: '#ef4444', border: '#fee2e2' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#f3f4f6' };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Track Orders</h1>
        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>Monitor your medications from pharmacy to doorstep</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {loading ? (
             <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: '#3b82f6', margin: '0 auto' }} />
             </div>
        ) : orders.map((order) => {
          const colors = getStatusColor(order.status);
          return (
            <div key={order.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
               <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                     <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        background: colors.bg, 
                        color: colors.text, 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: `1px solid ${colors.border}`
                     }}>
                        {getStatusIcon(order.status)}
                     </div>
                     <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>Order #{order.id}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 800, 
                            padding: '0.25rem 0.6rem', 
                            borderRadius: '6px', 
                            background: colors.bg,
                            color: colors.text,
                            textTransform: 'uppercase'
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Ordered on {new Date(order.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order Total</p>
                     <p style={{ fontWeight: 900, fontSize: '1.25rem' }}>₹{order.total.toFixed(2)}</p>
                  </div>
               </div>

               <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <CalendarDays size={18} color="#94a3b8" />
                     <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Est. Delivery</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{order.estimatedDelivery || 'Calculating...'}</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <MapPin size={18} color="#94a3b8" />
                     <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Shipping To</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{order.shippingAddress || 'Home Address'}</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                     <button 
                       onClick={() => setTrackingOrder(order)}
                       style={{ 
                        padding: '0.75rem 1.25rem', 
                        borderRadius: '10px', 
                        background: 'white', 
                        border: '1px solid #e2e8f0', 
                        fontWeight: 800, 
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                     }}>
                        Track Package <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
            </div>
          );
        })}
        {orders.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0', border: '2px dashed #e2e8f0', borderRadius: '24px' }}>
            <p style={{ fontWeight: 800, color: '#94a3b8' }}>No orders found.</p>
          </div>
        )}
      </div>

      {trackingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="animate-fade-in glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Tracking Order</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Order #{trackingOrder.id}</p>
              </div>
              <button 
                onClick={() => setTrackingOrder(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '7.5px', top: '0', bottom: '0', width: '3px', background: '#f1f5f9' }} />
              
              {[
                { status: 'Pending', label: 'Order Placed', time: 'Received successfully', icon: Clock },
                { status: 'Processing', label: 'Processing', time: 'Pharmacy verification', icon: Package },
                { status: 'Shipped', label: 'In Transit', time: 'Package out for delivery', icon: Truck },
                { status: 'Delivered', label: 'Delivered', time: 'Signed and received', icon: CheckCircle2 }
              ].map((step, idx, arr) => {
                const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                const currentIdx = statuses.indexOf(trackingOrder.status);
                const isActive = statuses.indexOf(step.status) <= currentIdx;
                
                return (
                  <div key={step.status} style={{ position: 'relative', marginBottom: idx === arr.length - 1 ? 0 : '2.5rem' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-32.5px', 
                      top: '0', 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      background: isActive ? '#3b82f6' : '#f1f5f9',
                      border: '4px solid white',
                      boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                      zIndex: 1
                    }} />
                    <div>
                      <h4 style={{ fontWeight: 800, color: isActive ? '#0f172a' : '#94a3b8', fontSize: '1rem', marginBottom: '0.25rem' }}>{step.label}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{isActive ? step.time : 'Waiting...'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <MapPin size={20} color="#3b82f6" />
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Current Location</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
                  {trackingOrder.status === 'Delivered' ? 'Delivered Home' : 'Main Distribution Center'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
