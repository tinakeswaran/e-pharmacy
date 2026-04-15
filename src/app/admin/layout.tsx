import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Pill, Package, LayoutDashboard, Users, BarChart3, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'Admin') {
    redirect('/login');
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Medicines', path: '/admin/medicines', icon: Pill },
    { label: 'Orders', path: '/admin/orders', icon: Package },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#0f172a', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pill size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>PHARMA ADMIN</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}>
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', background: '#f8fafc', marginLeft: '280px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
