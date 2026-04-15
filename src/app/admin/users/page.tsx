'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar, Search, UserPlus, X, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User'
  });

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ username: '', email: '', password: '', role: 'User' });
      fetchUsers();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>User Management</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Register, manage, and oversee customer accounts</p>
        </div>
        <button className="btn-premium" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} /> Register New User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            className="input-premium" 
            style={{ paddingLeft: '3rem' }} 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Contact Info</th>
              <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Joined Date</th>
              <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1e293b' }}>{user.username}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>#{user.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: 600 }}>
                      <Mail size={16} color="#94a3b8" />
                      {user.email}
                   </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                   <span style={{ 
                     padding: '0.35rem 0.75rem', 
                     borderRadius: '8px', 
                     fontSize: '0.75rem', 
                     fontWeight: 800, 
                     background: user.role === 'Admin' ? '#f0fdf4' : '#f1f5f9', 
                     color: user.role === 'Admin' ? '#10b981' : '#475569',
                     display: 'inline-flex',
                     alignItems: 'center',
                     gap: '0.4rem'
                   }}>
                      <Shield size={14} /> {user.role.toUpperCase()}
                   </span>
                </td>
                <td style={{ padding: '1.25rem', color: '#64748b', fontWeight: 600 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                   <button 
                     onClick={() => handleDelete(user.id)}
                     disabled={user.role === 'Admin'}
                     style={{ padding: '0.5rem', borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: user.role === 'Admin' ? 'not-allowed' : 'pointer', opacity: user.role === 'Admin' ? 0.5 : 1 }}
                   >
                     <Trash2 size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="animate-fade-in glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '0' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Register Customer</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                  <label className="label-style">Username</label>
                  <input required className="input-premium" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
               </div>
               <div>
                  <label className="label-style">Email Address</label>
                  <input required type="email" className="input-premium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div>
                  <label className="label-style">Temporary Password</label>
                  <input required type="password" className="input-premium" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
               </div>
               <div>
                  <label className="label-style">Assign Role</label>
                  <select className="input-premium" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                     <option value="User">Standard Customer</option>
                     <option value="Manager">Pharmacy Manager</option>
                  </select>
               </div>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-premium" style={{ flex: 1, background: '#f1f5f9', color: '#475569' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-premium" style={{ flex: 2, background: '#3b82f6' }}>Complete Registration</button>
               </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-style { display: block; font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
