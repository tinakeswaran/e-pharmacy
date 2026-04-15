'use client';

import { useState } from 'react';
import { Pill, ShieldCheck, ArrowRight, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = data.redirect || '/dashboard';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginInline: 'auto', marginBottom: '1.5rem', boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' }}>
            <Pill size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>E-PHARMACY</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '1.1rem' }}>Secure Access Portal</p>
        </div>

        <div className="glass-panel" style={{ padding: '3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Username or Email</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  className="input-premium" 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', paddingLeft: '3.5rem' }} 
                  placeholder="Enter credentials..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  type="password"
                  className="input-premium" 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', paddingLeft: '3.5rem' }} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn-premium" style={{ width: '100%', background: '#3b82f6', fontSize: '1.1rem', padding: '1rem' }} disabled={loading}>
              {loading ? <Loader2 size={24} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 600 }}>Need an account? <Link href="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 800 }}>Create One</Link></p>
             <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '50%', margin: '0.5rem auto' }}></div>
             <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Continue as Guest</Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
