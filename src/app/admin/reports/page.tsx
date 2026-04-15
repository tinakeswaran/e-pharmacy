import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
import { TrendingUp, IndianRupee, Package, Activity, Award, Star } from 'lucide-react';

export default async function AdminReportsPage() {
  db.load();
  const orders = db.orders;
  const medicines = db.medicines;
  
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);
  const totalItemsSold = orders.reduce((acc, curr) => acc + curr.items.length, 0);
  
  // Calculate popular medicines
  const medSales: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      medSales[item.name] = (medSales[item.name] || 0) + item.quantity;
    });
  });
  
  const popularMedicines = Object.entries(medSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Reporting & Analytics</h1>
        <p style={{ color: '#64748b', fontWeight: 500 }}>Comprehensive overview of sales, stock, and performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                 <p style={{ opacity: 0.6, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Revenue</p>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{totalSales.toFixed(2)}</h2>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                 <IndianRupee size={24} />
              </div>
           </div>
           <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 700 }}>
              <TrendingUp size={16} /> +12.5% from last month
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                 <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Orders Processed</p>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{orders.length}</h2>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', color: '#0f172a' }}>
                 <Package size={24} />
              </div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
         <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Star size={20} color="#f59e0b" fill="#f59e0b" /> Best Selling Medicines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {popularMedicines.map(([name, count], index) => (
                  <div key={name}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 800, color: '#1e293b' }}>{name}</span>
                        <span style={{ fontWeight: 800, color: '#64748b' }}>{count} Units Sold</span>
                     </div>
                     <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          background: index === 0 ? '#3b82f6' : '#94a3b8', 
                          width: `${(count / (popularMedicines[0][1] as number)) * 100}%` 
                        }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Activity size={20} color="#3b82f6" /> Inventory Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Low Stock Items</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{medicines.filter(m => m.stock < 10).length}</p>
               </div>
               <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Out of Stock</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{medicines.filter(m => m.stock === 0).length}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
