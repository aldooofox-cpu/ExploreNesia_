'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiTrip, apiWisata, Trip, Wisata } from '../../../lib/api';

type TripForm = Omit<Trip, 'id' | 'wisata'> & { wisataId: number };

export default function TripAdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [wisatas, setWisatas] = useState<Wisata[]>([]);

  const [filterWisataId, setFilterWisataId] = useState<number | 'all'>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: TripForm = useMemo(
    () => ({
      namaTrip: '',
      harga: 0,
      tanggal: '',
      kuota: 0,
      deskripsi: '',
      wisataId: 1,
    }),
    [],
  );

  const [form, setForm] = useState<TripForm>(emptyForm);

  const loadWisata = async () => {
    const data = await apiWisata.getAll();
    setWisatas(data);
  };

  const loadTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      if (filterWisataId === 'all') {
        setTrips(await apiTrip.getAll());
      } else {
        setTrips(await apiTrip.getByWisata(filterWisataId));
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil data trip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadWisata();
      } catch (e: any) {
        setError(e?.message || 'Gagal mengambil data wisata');
      }
      await loadTrips();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterWisataId]);

  const onEdit = (t: Trip) => {
    setMode('edit');
    setEditingId(t.id);
    setForm({
      namaTrip: t.namaTrip,
      harga: t.harga,
      tanggal: t.tanggal,
      kuota: t.kuota,
      deskripsi: t.deskripsi,
      wisataId: t.wisataId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setMode('create');
    setEditingId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const payload = {
        namaTrip: form.namaTrip,
        harga: Number(form.harga),
        tanggal: form.tanggal,
        kuota: Number(form.kuota),
        deskripsi: form.deskripsi,
        wisataId: Number(form.wisataId),
      };

      if (mode === 'create') {
        await apiTrip.create(payload);
      } else if (mode === 'edit' && editingId != null) {
        await apiTrip.update(editingId, payload);
      }

      reset();
      await loadTrips();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan trip');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Hapus trip ini?')) return;
    try {
      setError(null);
      await apiTrip.remove(id);
      if (editingId === id) reset();
      await loadTrips();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus trip');
    }
  };

  return (
    <div>
      <h2>Admin - Trip</h2>

      <div className="panel" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Filter</h3>
        <div className="row">
          <div className="col-4">
            <label>
              Wisata
              <select
                value={filterWisataId}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilterWisataId(v === 'all' ? 'all' : Number(v));
                }}
              >
                <option value="all">Semua</option>
                {wisatas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="row" style={{ alignItems: 'start' }}>
        <div className="col-6">
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>{mode === 'create' ? 'Tambah Trip' : 'Edit Trip'}</h3>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
              <label>
                Nama Trip
                <input value={form.namaTrip} onChange={(e) => setForm({ ...form, namaTrip: e.target.value })} />
              </label>
              <label>
                Harga
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                />
              </label>
              <label>
                Tanggal
                <input
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  placeholder="YYYY-MM-DD"
                />
              </label>
              <label>
                Kuota
                <input
                  type="number"
                  value={form.kuota}
                  onChange={(e) => setForm({ ...form, kuota: Number(e.target.value) })}
                />
              </label>
              <label>
                Deskripsi
                <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
              </label>
              <label>
                WisataId
                <select
                  value={form.wisataId}
                  onChange={(e) => setForm({ ...form, wisataId: Number(e.target.value) })}
                >
                  {wisatas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" type="submit">
                  {mode === 'create' ? 'Simpan' : 'Update'}
                </button>
                {mode === 'edit' ? (
                  <button className="btn btnDanger" type="button" onClick={reset}>
                    Batal
                  </button>
                ) : null}
              </div>
            </form>
            {error ? <div style={{ color: 'var(--danger)', marginTop: 12 }}>{error}</div> : null}
          </div>
        </div>

        <div className="col-6">
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Daftar Trip</h3>
            {loading ? <div>Loading...</div> : null}
            {!loading && trips.length === 0 ? <div>Belum ada data.</div> : null}

            {!loading ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Kuota</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.namaTrip}</td>
                      <td>{t.harga}</td>
                      <td>{t.kuota}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn" type="button" onClick={() => onEdit(t)}>
                          Edit
                        </button>{' '}
                        <button className="btn btnDanger" type="button" onClick={() => onDelete(t.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

