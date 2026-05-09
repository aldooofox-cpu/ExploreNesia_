const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
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

  // Some endpoints (e.g. DELETE) might return empty body.
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

// Wisata
export const apiWisata = {
  getAll: () => request<Wisata[]>('/wisata'),
  getById: (id: number) => request<Wisata>(`/wisata/${id}`),
  create: (payload: Omit<Wisata, 'id'>) => request<Wisata>('/wisata', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<Omit<Wisata, 'id'>>) =>
    request<Wisata>(`/wisata/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/wisata/${id}`, { method: 'DELETE' }),
};

// Trip
export const apiTrip = {
  getAll: () => request<Trip[]>('/trip'),
  getById: (id: number) => request<Trip>(`/trip/${id}`),
  getByWisata: (wisataId: number) => request<Trip[]>(`/trip/wisata/${wisataId}`),
  create: (payload: Omit<Trip, 'id' | 'wisata'>) => request<Trip>('/trip', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<Omit<Trip, 'id' | 'wisata'>>) =>
    request<Trip>(`/trip/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/trip/${id}`, { method: 'DELETE' }),
};

// Booking
export const apiBooking = {
  getAll: () => request<Booking[]>('/booking'),
  create: (payload: Omit<Booking, 'id' | 'status' | 'totalHarga' | 'trip' | 'tripId'> & { tripId: number }) =>
    request<Booking>('/booking', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id: number, payload: { status: 'pending' | 'paid' }) =>
    request<Booking>(`/booking/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};

