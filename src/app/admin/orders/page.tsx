'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Filter, ChevronRight, CheckCircle2, Clock, Truck, ShieldCheck, X, Loader2 } from 'lucide-react';

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid';
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // In a real app we'd have a GET /api/orders
    // For now we fetch from a server action or another route if available, 
    // but I can just use a simple fetch to a new route I'll create or use the db export if I make it an API.
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      setSelectedOrder(null);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#fff7ed', text: '#ea580c' };
      case 'Processing': return { bg: '#eff6ff', text: '#3b82f6' };
      case 'Shipped': return { bg: '#f5f3ff', text: '#8b5cf6' };
      case 'Delivered': return { bg: '#f0fdf4', text: '#10b981' };
      case 'Cancelled': return { bg: '#fef2f2', text: '#ef4444' };
      default: return { bg: '#f8fafc', text: '#64748b' };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Order Management</h1>
        <p style={{ color: '#64748b', fontWeight: 500 }}>Track pharmacy requests and update processing statuses</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            className="input-premium" 
            style={{ paddingLeft: '3rem' }} 
            placeholder="Search by Order ID or Customer Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input-premium" 
          style={{ width: '200px', fontWeight: 700 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
           <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontWeight: 600 }}>Loading orders...</p>
           </div>
        ) : filteredOrders.map((order) => (
          <div key={order.id} className="glass-panel order-card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
               <div style={{ width: '56px', height: '56px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                  <Package size={28} />
               </div>
               <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>#{order.id}</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '6px', 
                      background: getStatusColor(order.status).bg,
                      color: getStatusColor(order.status).text
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Recipient: <strong style={{ color: '#1e293b' }}>{order.customerName}</strong> • {order.date}</p>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Amount Paid</p>
                   <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>₹{order.total.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  style={{ 
                    padding: '0.8rem 1.25rem', 
                    borderRadius: '12px', 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    fontWeight: 800, 
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  className="status-btn"
                >
                  Manage <ChevronRight size={18} />
                </button>
            </div>
          </div>
        ))}
        {!loading && filteredOrders.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
            <p style={{ fontWeight: 700 }}>No orders found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Status Management Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="animate-fade-in glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Update Order Status</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Order #{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: selectedOrder.status === status ? '#3b82f6' : 'white',
                    color: selectedOrder.status === status ? 'white' : '#1e293b',
                    fontWeight: 800,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  {status}
                  {selectedOrder.status === status && <ShieldCheck size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .order-card:hover {
          transform: translateX(5px);
          border-color: #3b82f6;
        }
        .status-btn:hover {
          background: #0f172a !important;
          color: white !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
