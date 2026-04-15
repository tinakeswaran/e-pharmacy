'use client';

import { useState, useEffect } from 'react';
import { Pill, Search, ShoppingCart, Filter, ArrowRight, Star, Heart, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

export default function GuestLandingPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Guest Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: '#3b82f6', borderRadius: '10px' }}>
            <Pill color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>E-PHARMACY</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', color: '#475569', fontWeight: 800, fontSize: '0.9rem' }}>Sign In</Link>
          <Link href="/register" style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '5rem 2rem', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
           <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px' }}>Healthcare Delivered to Your Doorstep.</h1>
           <p style={{ fontSize: '1.25rem', opacity: 0.7, fontWeight: 500, lineHeight: 1.6, marginBottom: '2.5rem' }}>Browse genuine medications, healthcare essentials, and wellness products from the comfort of your home.</p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <ShieldCheck size={20} color="#3b82f6" />
                 <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Verified Pharmacy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Heart size={20} color="#ef4444" />
                 <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Member Care 24/7</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Activity size={20} color="#10b981" />
                 <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Health Analytics</span>
              </div>
           </div>
        </div>
      </header>

      {/* Catalog Section */}
      <main style={{ maxWidth: '1200px', margin: '-4rem auto 5rem', padding: '0 2rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', background: 'white', border: '1px solid #e2e8f0', position: 'relative', zIndex: 1, borderRadius: '24px' }}>
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  className="input-premium" 
                  style={{ paddingLeft: '3.5rem' }} 
                  placeholder="What are you looking for today? (e.g. Paracetamol, Vitamin C)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="input-premium" 
                style={{ width: '220px', fontWeight: 700 }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Cold & Flu">Cold & Flu</option>
              </select>
           </div>

           {loading ? (
             <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: '#3b82f6', margin: '0 auto' }} />
             </div>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredMedicines.map((med) => (
                  <div key={med.id} className="med-card" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '1.5rem' }}>
                        <Pill size={24} />
                     </div>
                     <h3 style={{ fontWeight: 900, marginBottom: '0.25rem' }}>{med.name}</h3>
                     <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.75rem' }}>{med.brand} • {med.category}</p>
                     <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{med.description}</p>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '1.5rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>₹{med.price.toFixed(2)}</span>
                        <Link href="/register" className="btn-premium" style={{ textDecoration: 'none', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                           Login to Buy
                        </Link>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
         <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}>© 2026 E-Pharmacy Management System. Restricted Access for Authorized Personnel.</p>
      </footer>

      <style jsx>{`
        .med-card { transition: all 0.3s ease; }
        .med-card:hover { transform: translateY(-8px); border-color: #3b82f6; box-shadow: 0 12px 30px rgba(59, 130, 246, 0.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
