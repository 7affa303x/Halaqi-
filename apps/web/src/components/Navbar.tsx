'use client';

import Link from 'next/link';

export default function Navbar(): JSX.Element {
  return (
    <nav style={{ padding: '1rem 2rem', background: '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
        Halaqi
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/barbershops" style={{ color: '#888' }}>Barbershops</Link>
        <Link href="/appointments" style={{ color: '#888' }}>Appointments</Link>
        <Link href="/profile" style={{ color: '#888' }}>Profile</Link>
        <Link href="/admin" style={{ color: '#667eea', fontWeight: 600 }}>Admin</Link>
      </div>
    </nav>
  );
}
