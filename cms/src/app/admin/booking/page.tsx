'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiBooking, Booking } from '../../../lib/api';

type Status = 'pending' | 'paid';

export default function BookingAdminPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusMap, setStatusMap] = useState<Record<number, Status>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiBooking.getAll();
      setItems(data);
      const map: Record<number, Status> = {};
      data.forEach((b) => {
        map[b.id] = b.status;
      });
      setStatusMap(map);
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: number) => {
    try {
      setError(null);
      const status = statusMap[id];
      await apiBooking.updateStatus(id, { status });
      await load();
    } catch (e: any) {
      setError(e?.message || 'Gagal update status');
    }
  };

  const statusOptions = useMemo(() => ['pending', 'paid'] as Status[], []);

  return (
    <div>
      <h2>Admin - Booking</h2>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Daftar Booking</h3>
        {loading ? <div>Loading...</div> : null}
        {!loading && items.length === 0 ? <div>Belum ada data.</div> : null}

        {error ? <div style={{ color: 'var(--danger)', marginTop: 12 }}>{error}</div> : null}

        {!loading ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Trip</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.namaUser}</td>
                  <td>{b.email}</td>
                  <td>
                    {b.trip?.namaTrip || `Trip #${b.tripId}`}
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {b.trip?.wisata?.nama || ''}
                    </div>
                  </td>
                  <td>{b.jumlahTiket}</td>
                  <td>{b.totalHarga}</td>
                  <td>
                    <select
                      value={statusMap[b.id] || b.status}
                      onChange={(e) => setStatusMap((prev) => ({ ...prev, [b.id]: e.target.value as Status }))}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn" type="button" onClick={() => updateStatus(b.id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

