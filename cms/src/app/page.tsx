import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>ExploreNesia CMS</h1>
        <p style={{ color: 'var(--muted)' }}>
          Halaman ini mengarahkan ke area admin.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <Link className="btn" href="/login">Login CMS</Link>
          <Link className="btn" href="/admin/wisata">Ke Admin</Link>
        </div>
      </div>
    </div>
  );
}

