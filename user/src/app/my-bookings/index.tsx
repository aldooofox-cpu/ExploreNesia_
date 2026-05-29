import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { apiBooking, Booking } from '@/lib/api';
import { ApiErrorBox } from '@/components/ApiErrorBox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function MyBookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiBooking.getAll();
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat booking');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center} lightColor="transparent" darkColor="transparent">
        <ThemedText>Kemuat…</ThemedText>
      </ThemedView>
    );
  }

  if (error) return <ApiErrorBox message={error} />;

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">{item.trip?.namaTrip ?? `Trip #${item.tripId}`}</ThemedText>
          <ThemedText themeColor="textSecondary">User: {item.namaUser}</ThemedText>
          <ThemedText themeColor="textSecondary">Tiket: {item.jumlahTiket}</ThemedText>
          <ThemedText themeColor="textSecondary">Total: {item.totalHarga}</ThemedText>
          <ThemedText themeColor="textSecondary">Status: {item.status}</ThemedText>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
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

