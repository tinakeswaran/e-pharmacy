import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Pill, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import Link from 'next/link';
import DashboardLogoutButton from '@/components/DashboardLogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 2rem', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
           <div style={{ padding: '0.5rem', background: '#3b82f6', borderRadius: '10px', display: 'flex' }}>
              <Pill size={24} color="white" />
           </div>
           <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>E-PHARMACY</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <nav style={{ display: 'flex', gap: '2rem', marginRight: '2rem' }}>
              <Link href="/dashboard" style={{ color: '#475569', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Catalog</Link>
              <Link href="/dashboard/orders" style={{ color: '#475569', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>My Orders</Link>
           </nav>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                 <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{user.username}</p>
                 <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6' }}>Customer Account</p>
              </div>
              <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                 <User size={20} />
              </div>
              <DashboardLogoutButton />
            </div>
         </div>
       </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
