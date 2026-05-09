'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiWisata, Wisata } from '../../../lib/api';

type WisataForm = Omit<Wisata, 'id'>;

export default function WisataAdminPage() {
  const [items, setItems] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: WisataForm = useMemo(
    () => ({
      nama: '',
      deskripsi: '',
      lokasi: '',
      gambar: '',
    }),
    [],
  );

  const [form, setForm] = useState<WisataForm>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiWisata.getAll();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil data wisata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEdit = (w: Wisata) => {
    setMode('edit');
    setEditingId(w.id);
    setForm({ nama: w.nama, deskripsi: w.deskripsi, lokasi: w.lokasi, gambar: w.gambar });
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
      if (mode === 'create') {
        await apiWisata.create(form);
      } else if (mode === 'edit' && editingId != null) {
        await apiWisata.update(editingId, form);
      }
      reset();
      await load();
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan wisata');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Hapus wisata ini?')) return;
    try {
      setError(null);
      await apiWisata.remove(id);
      await load();
      if (editingId === id) reset();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus wisata');
    }
  };

  return (
    <div>
      <h2>Admin - Wisata</h2>

      <div className="row" style={{ alignItems: 'start' }}>
        <div className="col-6">
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>{mode === 'create' ? 'Tambah Wisata' : 'Edit Wisata'}</h3>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
              <label>
                Nama
                <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </label>
              <label>
                Deskripsi
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                />
              </label>
              <label>
                Lokasi
                <input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
              </label>
              <label>
                Gambar (URL / nama file)
                <input value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} />
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
            <h3 style={{ marginTop: 0 }}>Daftar Wisata</h3>
            {loading ? <div>Loading...</div> : null}
            {!loading && items.length === 0 ? <div>Belum ada data.</div> : null}
            {!loading ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Lokasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((w) => (
                    <tr key={w.id}>
                      <td>{w.id}</td>
                      <td>{w.nama}</td>
                      <td>{w.lokasi}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn" type="button" onClick={() => onEdit(w)}>
                          Edit
                        </button>{' '}
                        <button className="btn btnDanger" type="button" onClick={() => onDelete(w.id)}>
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

