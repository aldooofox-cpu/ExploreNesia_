import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { apiWisata, Wisata } from '../../../lib/api';
import { toMediaProxyUrl } from '../../../lib/image';

function Header() {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a' }}>ExploreNesia</Text>
      <Text style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
        Jelajahi wisata terbaik untuk liburanmu.
      </Text>
    </View>
  );
}

function WisataCard({ item, onPress }: { item: Wisata; onPress: () => void }) {
  const imageUri = item.gambar ? item.gambar.replace(/^http:\/\//, 'http://') : null;
  const finalUri = imageUri || item.gambar;

  console.log('[DEBUG] wisata card imageUri =', finalUri);

  return (

    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.12)',
      }}
    >
      <View style={{ height: 140, backgroundColor: 'rgba(37,99,235,0.08)', justifyContent: 'center', alignItems: 'center' }}>
        {item.gambar ? (
          <Image
            source={{ uri: toMediaProxyUrl(item.gambar) }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(err) => {
              const ne = (err as any)?.nativeEvent;
              console.log('[DEBUG] Image gagal nativeEvent:', ne);
              console.log('[DEBUG] Image uri:', item.gambar);
            }}
          />
        ) : null}
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }} numberOfLines={1}>
          {item.nama}
        </Text>
        <Text style={{ fontSize: 13, color: '#64748b', marginTop: 6 }} numberOfLines={2}>
          {item.lokasi}
        </Text>
      </View>
    </Pressable>
  );
}

export default function WisataScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiWisata.getAll();
      console.log('[DEBUG] wisata[0].gambar =', data?.[0]?.gambar);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Gagal mengambil data wisata');
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
      <Header />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : null}

      {!loading && error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#ef4444', fontWeight: '700' }}>{error}</Text>
          <Text style={{ color: '#64748b', marginTop: 8 }}>Pastikan backend sudah berjalan dan API base URL benar.</Text>
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
            <WisataCard
              item={item}
              onPress={() => {
                // navigasi ke trip screen dengan filter wisataId
                router.push({ pathname: '/trip', params: { wisataId: String(item.id), namaWisata: item.nama } });
              }}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: '800', color: '#0f172a' }}>Belum ada data wisata</Text>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

