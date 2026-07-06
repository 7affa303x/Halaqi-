'use client';

import { useEffect, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';

export default function AdminDashboardPage(): JSX.Element {
  const [stats, setStats] = useState({ barbershops: 0, appointments: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = getToken();
        const [shopsRes, apptsRes] = await Promise.all([
          apiRequest<{ data: unknown[] }>('/barbershops', { token: token ?? undefined }),
          apiRequest<{ data: unknown[] }>('/appointments/barbershop/all', { token: token ?? undefined }),
        ]);
        setStats({
          barbershops: shopsRes.data?.length ?? 0,
          appointments: apptsRes.data?.length ?? 0,
          users: 0,
        });
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', color: '#fff', background: '#0a0a0a' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Admin Dashboard</h1>
      {loading ? (
        <p style={{ color: '#888' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Barbershops</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea' }}>{stats.barbershops}</p>
          </div>
          <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Appointments</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea' }}>{stats.appointments}</p>
          </div>
          <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#667eea' }}>{stats.users}</p>
          </div>
        </div>
      )}
    </main>
  );
}
