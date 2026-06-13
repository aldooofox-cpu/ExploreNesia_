export type Wisata = {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi: string;
  gambar: string;
};

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
  status: 'pending' | 'paid';
  totalHarga: number;
  namaUser: string;
  email: string;
  jumlahTiket: number;
  tripId: number;
  trip?: Trip;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text ? `${res.status}: ${text}` : `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const apiWisata = {
  getAll: () => request<Wisata[]>('/api/wisata'),
  getById: (id: number) => request<Wisata>(`/api/wisata/${id}`),
};

export const apiTrip = {
  getAll: () => request<Trip[]>('/api/trip'),
  getByWisata: (wisataId: number) => request<Trip[]>(`/api/trip/wisata/${wisataId}`),
};

export const apiBooking = {
  create: (payload: { namaUser: string; email: string; jumlahTiket: number; tripId: number }) =>
    request<Booking>('/api/booking', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAll: () => request<Booking[]>('/api/booking'),
  updateStatus: (id: number, payload: { status: 'pending' | 'paid' }) =>
    request<Booking>(`/api/booking/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};


