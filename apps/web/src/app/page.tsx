import Link from 'next/link';

export default function HomePage(): JSX.Element {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Halaqi
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#888', marginBottom: '2rem' }}>
        Premium Barbershop Management System
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/barbershops" style={{ padding: '0.75rem 1.5rem', background: '#667eea', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>
          Find a Barbershop
        </Link>
        <Link href="/login" style={{ padding: '0.75rem 1.5rem', border: '1px solid #667eea', color: '#667eea', borderRadius: '8px', fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </main>
  );
}
