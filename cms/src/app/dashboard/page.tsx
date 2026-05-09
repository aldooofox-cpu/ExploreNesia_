import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)' }}>
          Use menu untuk masuk ke admin.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn" href="/admin/wisata">
            Admin Wisata
          </Link>
          <Link className="btn" href="/admin/trip">
            Admin Trip
          </Link>
          <Link className="btn" href="/admin/booking">
            Admin Booking
          </Link>
        </div>
      </div>
    </div>
  );
}

