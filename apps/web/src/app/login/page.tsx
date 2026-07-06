'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, setToken } from '@/lib/api';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<{ data: { accessToken: string } }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(response.data.accessToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h1>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
