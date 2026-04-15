'use client';

import { useState, useEffect } from 'react';
import { Pill, Plus, Search, Edit2, Trash2, ShieldAlert, X, Loader2, Save } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  requiresPrescription: boolean;
}

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    description: '',
    requiresPrescription: false
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    const res = await fetch('/api/medicines');
    const data = await res.json();
    setMedicines(data);
    setLoading(false);
  };

  const handleOpenModal = (medicine?: Medicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        category: medicine.category,
        brand: medicine.brand,
        price: medicine.price.toString(),
        stock: medicine.stock.toString(),
        description: medicine.description,
        requiresPrescription: medicine.requiresPrescription
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        name: '',
        category: '',
        brand: '',
        price: '',
        stock: '',
        description: '',
        requiresPrescription: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingMedicine ? `/api/medicines/${editingMedicine.id}` : '/api/medicines';
    const method = editingMedicine ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchMedicines();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMedicines();
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Medicine Catalog</h1>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Manage your pharmacy inventory and stock levels</p>
        </div>
        <button className="btn-premium" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add New Medicine
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            className="input-premium" 
            style={{ paddingLeft: '3rem' }} 
            placeholder="Search medicine name, brand or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600 }}>Loading inventory...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Medicine</th>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Stock</th>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((med) => (
                <tr key={med.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <Pill size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{med.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{med.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, background: '#f1f5f9', color: '#475569' }}>
                      {med.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', fontWeight: 800, color: '#0f172a' }}>₹{med.price.toFixed(2)}</td>
                  <td style={{ padding: '1.25rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800 }}>{med.stock}</span>
                        {med.stock < 20 && <ShieldAlert size={14} color="#ef4444" />}
                     </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                     <span style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, background: med.stock > 0 ? '#f0fdf4' : '#fef2f2', color: med.stock > 0 ? '#10b981' : '#ef4444' }}>
                        {med.stock > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                     </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenModal(med)}
                        style={{ padding: '0.5rem', borderRadius: '8px', background: '#f1f5f9', border: 'none', color: '#475569', cursor: 'pointer' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(med.id)}
                        style={{ padding: '0.5rem', borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="animate-fade-in glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="label-style">Medicine Name</label>
                  <input 
                    required 
                    className="input-premium" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label-style">Brand</label>
                  <input 
                    required 
                    className="input-premium" 
                    value={formData.brand} 
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="label-style">Category</label>
                  <select 
                    required 
                    className="input-premium" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Cold & Flu">Cold & Flu</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Cardiology">Cardiology</option>
                  </select>
                </div>
                <div>
                  <label className="label-style">Price (₹)</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01" 
                    className="input-premium" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="label-style">Description</label>
                <textarea 
                  required 
                  className="input-premium" 
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="label-style">Initial Stock</label>
                  <input 
                    required 
                    type="number" 
                    className="input-premium" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '2.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="prescription"
                    checked={formData.requiresPrescription} 
                    onChange={(e) => setFormData({...formData, requiresPrescription: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <label htmlFor="prescription" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Requires Prescription</label>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-premium" style={{ flex: 1, background: '#f1f5f9', color: '#475569' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-premium" style={{ flex: 2, background: '#3b82f6' }}>
                  <Save size={18} /> {editingMedicine ? 'Update Medicine' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-style {
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .table-row-hover:hover {
          background-color: #fafafa;
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
