import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
import { Pill, Package, Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';

export default async function AdminOverviewPage() {
  db.load();
  const inventoryValue = db.medicines.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
  
  const stats = [
    { label: 'Total Medicines', value: db.medicines.length, icon: Pill, color: '#3b82f6' },
    { label: 'Pending Orders', value: db.orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length, icon: Package, color: '#8b5cf6' },
    { label: 'Active Users', value: db.users.length, icon: Users, color: '#10b981' },
    { label: 'Inventory Value', value: `₹${inventoryValue.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>Administrator Dashboard</h1>
        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>Welcome back. Here is your pharmacy status for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <stat.icon size={24} />
            </div>
            <h3 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Pharmacy Health Check</h2>
            <p style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>Your inventory levels and order processing times are currently within the optimal range. No critical interventions required.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
               <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>System Status</p>
                  <p style={{ fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} /> Operational
                  </p>
               </div>
               <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>Latency</p>
                  <p style={{ fontWeight: 800 }}>24ms</p>
               </div>
            </div>
         </div>
         <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
               <AlertCircle size={20} color="#ef4444" />
               <h3 style={{ fontWeight: 800 }}>Low Stock Alerts</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {db.medicines.filter(m => m.stock < 100).map(m => (
                 <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</span>
                    <span style={{ fontWeight: 800, color: '#ef4444' }}>{m.stock} Units</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
