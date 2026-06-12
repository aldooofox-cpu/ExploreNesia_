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



