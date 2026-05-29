// NOTE:
// React Native (Expo) tidak mengenal `process.env.*` runtime seperti web.
// Pakai global `EXPO_PUBLIC_API_BASE_URL` yang biasanya diinject saat build.
// Jika belum ada, fallback ke IP jaringan lokal agar bisa diakses dari HP.
// Ganti nilai fallback ini sesuai IP laptop/PC kamu.
const API_BASE_URL =
  (globalThis as any)?.EXPO_PUBLIC_API_BASE_URL ||
  (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL ||
  // fallback agar bisa diakses dari HP saat tidak ada env.
  // GANTI sesuai IP laptop/PC backend kamu.
'http://192.168.101.5:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
      // ignore (no JSON body)
    }
    throw new Error(msg);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
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
  getAll: () => request<Wisata[]>('/wisata'),
  getById: (id: number) => request<Wisata>(`/wisata/${id}`),
};

export const apiTrip = {
  getAll: () => request<Trip[]>('/trip'),
  getByWisata: (wisataId: number) => request<Trip[]>(`/trip/wisata/${wisataId}`),
  getById: (id: number) => request<Trip>(`/trip/${id}`),
};

export const apiBooking = {
  getAll: () => request<Booking[]>('/booking'),
  create: (payload: { namaUser: string; email: string; jumlahTiket: number; tripId: number }) =>
    request<Booking>(`/booking`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

