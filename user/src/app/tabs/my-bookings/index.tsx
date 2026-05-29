import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { apiBooking, Booking } from '../../../lib/api';

function BookingRow({ item }: { item: Booking }) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.12)',
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a' }}>Booking #{item.id}</Text>
      <Text style={{ color: '#64748b', marginTop: 6 }}>
        Trip ID: {item.tripId} • Tiket: {item.jumlahTiket}
      </Text>
      <Text style={{ color: '#2563eb', marginTop: 6, fontWeight: '900' }}>Total: Rp {item.totalHarga?.toLocaleString('id-ID')}</Text>
      <Text style={{ marginTop: 8, fontWeight: '900', color: item.status === 'paid' ? '#16a34a' : '#f59e0b' }}>
        Status: {item.status}
      </Text>
    </View>
  );
}

export default function MyBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiBooking.getAll();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>My Bookings</Text>
        <Text style={{ color: '#64748b', marginTop: 4 }}>Riwayat booking kamu (berdasarkan endpoint GET /booking).</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : null}

      {!loading && error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#ef4444', fontWeight: '700' }}>{error}</Text>
          <Pressable
            onPress={load}
            style={{ marginTop: 14, backgroundColor: '#2563eb', padding: 12, borderRadius: 12 }}
          >
            <Text style={{ color: 'white', fontWeight: '800', textAlign: 'center' }}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => <BookingRow item={item} />}
          ListEmptyComponent={() => (
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: '800', color: '#0f172a' }}>Belum ada booking.</Text>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

