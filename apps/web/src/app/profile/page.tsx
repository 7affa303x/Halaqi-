'use client';

import { useEffect, useState } from 'react';
import { apiRequest, getToken, removeToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function ProfilePage(): JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await apiRequest<{ data: UserProfile }>('/users/me', { token: token ?? undefined });
        setUser(res.data ?? null);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleLogout(): void {
    removeToken();
    router.push('/');
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', color: '#fff', background: '#0a0a0a' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Profile</h1>
      {loading ? (
        <p style={{ color: '#888' }}>Loading...</p>
      ) : user ? (
        <div style={{ maxWidth: '400px', padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {user.email}</p>
          {user.phone && <p style={{ marginBottom: '1.5rem' }}><strong>Phone:</strong> {user.phone}</p>}
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '0.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p style={{ color: '#888' }}>Not logged in.</p>
      )}
    </main>
  );
}
