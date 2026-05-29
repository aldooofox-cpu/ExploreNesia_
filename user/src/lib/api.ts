const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

function normalizeUntukGambar(uri: string) {
  if (!uri) return uri;
  // backend bisa mengirim "http:/..." (kurang 1 slash) atau "//host/..."
  return uri
    .replace(/^http:\/([^/])/, 'http://$1')
    .replace(/^\/\//, 'http://');
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  // RN menangani JSON string cukup, tapi untuk aman jangan normalize gambar di sini.
  return JSON.parse(text) as T;
}

export type Wisata = { id: number; nama: string; deskripsi: string; lokasi: string; gambar: string };
export type Trip = {
  id: number;
  namaTrip: string;
  harga: number;
  tanggal: string;
  kuota: number;
  deskripsi: string;
  wisataId: number;
  wisata?: Wisata;
};
export type Booking = {
  id: number;
  namaUser: string;
  email: string;
  jumlahTiket: number;
  tripId: number;
  totalHarga: number;
  status: 'pending' | 'paid';
  trip?: Trip;
};

export const apiWisata = {
  getAll: async () => {
    const data = await request<Wisata[]>('/wisata');
    return data.map((w) => ({ ...w, gambar: normalizeUntukGambar(w.gambar) }));
  },
};

export const apiTrip = {
  getAll: () => request<Trip[]>('/trip'),
  getByWisata: (wisataId: number) => request<Trip[]>(`/trip/wisata/${wisataId}`),
};

export const apiBooking = {
  getAll: () => request<Booking[]>('/booking'),
  create: (payload: {
    namaUser: string;
    email: string;
    jumlahTiket: number;
    tripId: number;
  }) => request<Booking>('/booking', { method: 'POST', body: JSON.stringify(payload) }),
};

