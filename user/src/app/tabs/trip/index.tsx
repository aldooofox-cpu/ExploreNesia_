import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiTrip, Trip } from '../../../lib/api';

function TripCard({ item, onPress }: { item: Trip; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.12)',
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a' }} numberOfLines={1}>
        {item.namaTrip}
      </Text>
      <Text style={{ color: '#64748b', marginTop: 6 }}>{item.tanggal}</Text>
      <Text style={{ color: '#64748b', marginTop: 4 }}>Kuota: {item.kuota}</Text>
      <Text style={{ color: '#2563eb', marginTop: 8, fontWeight: '900' }}>Rp {item.harga.toLocaleString('id-ID')}</Text>

      <View style={{ marginTop: 8 }}>
        <Text style={{ color: '#64748b', fontSize: 12 }} numberOfLines={1}>
          {item.wisata?.nama || `Wisata #${item.wisataId}`}
        </Text>
      </View>
    </Pressable>
  );
}

export default function TripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ wisataId?: string; namaWisata?: string }>();

  const wisataId = useMemo(() => {
    const raw = params.wisataId;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params.wisataId]);

  const [items, setItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      if (wisataId == null) {
        setItems(await apiTrip.getAll());
      } else {
        setItems(await apiTrip.getByWisata(wisataId));
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil data trip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wisataId]);


  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>Trip</Text>
        <Text style={{ color: '#64748b', marginTop: 4 }}>
          {wisataId != null ? `Filter wisata: ${params.namaWisata || wisataId}` : 'Semua trip'}
        </Text>
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
          renderItem={({ item }) => (
            <TripCard
              item={item}
              onPress={() => {
                // booking page but since booking form expects selection, pass tripId
                router.push({ pathname: '/booking', params: { tripId: String(item.id) } });
              }}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: '800', color: '#0f172a' }}>Belum ada trip</Text>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

