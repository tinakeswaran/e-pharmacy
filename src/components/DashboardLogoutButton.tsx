'use client';

import { LogOut } from 'lucide-react';

export default function DashboardLogoutButton() {
  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
    >
      <LogOut size={20} />
    </button>
  );
}
