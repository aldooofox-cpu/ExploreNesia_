import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { apiTrip, Trip, apiWisata, Wisata } from '@/lib/api';
import { ApiErrorBox } from '@/components/ApiErrorBox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';

export default function TripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ wisataId?: string }>();

  const initialWisataId = useMemo(() => {
    const raw = params.wisataId;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params.wisataId]);

  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [selectedWisataId, setSelectedWisataId] = useState<number | null>(initialWisataId);
  const [items, setItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const w = await apiWisata.getAll();
        if (mounted) setWisataList(w);
      } catch {
        // ignore wisata list errors; trip can still load
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (selectedWisataId) {
          const data = await apiTrip.getByWisata(selectedWisataId);
          if (mounted) setItems(data);
        } else {
          const data = await apiTrip.getAll();
          if (mounted) setItems(data);
        }
        if (mounted) setError(null);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat trip');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedWisataId]);

  if (loading) {
    return (
      <ThemedView style={styles.center} lightColor="transparent" darkColor="transparent">
        <ThemedText>Kemuat…</ThemedText>
      </ThemedView>
    );
  }

  if (error) return <ApiErrorBox message={error} />;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.filterRow}>
        <ThemedText style={styles.filterLabel}>Filter Wisata</ThemedText>
        <Picker
          selectedValue={selectedWisataId}
          onValueChange={(v) => setSelectedWisataId(v === null ? null : Number(v))}
          style={styles.picker}
        >
          <Picker.Item label="Semua" value={null} />
          {wisataList.map((w) => (
            <Picker.Item key={w.id} label={w.nama} value={w.id} />
          ))}
        </Picker>
      </ThemedView>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
onPress={() => router.push({ pathname: '/booking', params: { tripId: String(item.id) } } as any)}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
          >
            <ThemedText type="subtitle">{item.namaTrip}</ThemedText>
            <ThemedText themeColor="textSecondary">{item.tanggal}</ThemedText>
            <ThemedText themeColor="textSecondary">Kuota: {item.kuota}</ThemedText>
            <ThemedText themeColor="textSecondary">Harga: {item.harga}</ThemedText>
            <ThemedText themeColor="textSecondary">{item.deskripsi}</ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  filterRow: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  listContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
  },
});

