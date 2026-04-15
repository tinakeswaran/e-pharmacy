'use client';

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: '12px',
        color: '#ef4444',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
      }}
    >
      <LogOut size={20} /> Logout
    </button>
  );
}
