import Link from 'next/link';

export default function BarbershopsPage(): JSX.Element {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem', color: '#fff', background: '#0a0a0a' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Barbershops</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Halaqi Premium</h2>
          <p style={{ color: '#888', marginBottom: '1rem' }}>Riyadh - Al Olaya</p>
          <Link href="/barbershops/halaqi-premium" style={{ color: '#667eea', fontWeight: 600 }}>
            View Details →
          </Link>
        </div>
      </div>
    </main>
  );
}
