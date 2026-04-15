'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, History, Trash2, Megaphone, Info, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Promotion' | 'Alert' | 'System';
  target: 'All' | string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Info' as const,
    target: 'All'
  });

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setFormData({ title: '', message: '', type: 'Info', target: 'All' });
      fetchNotifications();
    }
    setIsSending(false);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Promotion': return <Megaphone size={18} color="#f59e0b" />;
      case 'Alert': return <AlertTriangle size={18} color="#ef4444" />;
      case 'System': return <Info size={18} color="#3b82f6" />;
      default: return <Bell size={18} color="#64748b" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Notifications & Alerts</h1>
        <p style={{ color: '#64748b', fontWeight: 500 }}>Broadcast news, discounts, and system updates to users</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
         {/* Send Notification Form */}
         <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Send size={20} color="#3b82f6" /> Broadcast New Alert
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                  <label className="label-style">Notification Title</label>
                  <input 
                    required 
                    className="input-premium" 
                    placeholder="e.g. Weekend Flash Sale!"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
               </div>
               <div>
                  <label className="label-style">Target Audience</label>
                  <select 
                    className="input-premium"
                    value={formData.target}
                    onChange={e => setFormData({...formData, target: e.target.value})}
                  >
                    <option value="All">All Registered Users</option>
                    <option value="Subscribers">Active Subscribers</option>
                    <option value="Admins">Administrative Staff</option>
                  </select>
               </div>
               <div>
                  <label className="label-style">Alert Type</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                     {['Info', 'Promotion', 'Alert', 'System'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type: type as any})}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            background: formData.type === type ? '#0f172a' : 'white',
                            color: formData.type === type ? 'white' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
               </div>
               <div>
                  <label className="label-style">Message Body</label>
                  <textarea 
                    required 
                    className="input-premium" 
                    style={{ minHeight: '120px' }}
                    placeholder="Enter the notification details here..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
               </div>
               <button type="submit" className="btn-premium" style={{ width: '100%', background: '#3b82f6' }} disabled={isSending}>
                  {isSending ? 'Broadcasting...' : 'Send Notification'} <Send size={18} />
               </button>
            </form>
         </div>

         {/* History */}
         <div>
            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <History size={20} color="#64748b" /> Recent History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {notifications.map((note) => (
                  <div key={note.id} className="glass-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${note.type === 'Alert' ? '#ef4444' : note.type === 'Promotion' ? '#f59e0b' : '#3b82f6'}` }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           {getTypeIcon(note.type)}
                           <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{note.title}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                     </div>
                     <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{note.message}</p>
                     <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>Target: {note.target}</span>
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 800 }}>
                           <CheckCircle2 size={12} /> Delivered
                        </div>
                     </div>
                  </div>
               ))}
               {notifications.length === 0 && (
                  <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '20px', color: '#94a3b8' }}>
                     No notification history
                  </div>
               )}
            </div>
         </div>
      </div>

      <style jsx>{`
        .label-style {
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
