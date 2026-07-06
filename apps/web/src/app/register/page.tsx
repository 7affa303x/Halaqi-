'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, setToken } from '@/lib/api';

export default function RegisterPage(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<{ data: { accessToken: string } }>('/auth/register', {
        method: 'POST',
        body: form,
      });
      setToken(response.data.accessToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h1>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </main>
  );
}
