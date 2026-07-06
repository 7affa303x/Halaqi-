export default function BarbershopDetailPage({ params }: { params: { slug: string } }): JSX.Element {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem', color: '#fff', background: '#0a0a0a' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Barbershop Details</h1>
      <p style={{ color: '#888' }}>Slug: {params.slug}</p>
    </main>
  );
}
