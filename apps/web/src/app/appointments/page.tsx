'use client';

import { useEffect, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  barbershop: { name: string };
  barber: { user: { firstName: string; lastName: string } };
}

export default function AppointmentsPage(): JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const res = await apiRequest<{ data: Appointment[] }>('/appointments/my', { token: token ?? undefined });
        setAppointments(res.data ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', color: '#fff', background: '#0a0a0a' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>My Appointments</h1>
      {loading ? (
        <p style={{ color: '#888' }}>Loading...</p>
      ) : appointments.length === 0 ? (
        <p style={{ color: '#888' }}>No appointments yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((appt) => (
            <div key={appt.id} style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
              <p style={{ fontWeight: 600 }}>{appt.barbershop?.name ?? 'Unknown'}</p>
              <p style={{ color: '#888', fontSize: '0.875rem' }}>
                {appt.barber?.user?.firstName} {appt.barber?.user?.lastName}
              </p>
              <p style={{ color: '#667eea', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {new Date(appt.scheduledAt).toLocaleString()} · {appt.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
