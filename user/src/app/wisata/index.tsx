import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { apiWisata, Wisata } from '@/lib/api';
import { ApiErrorBox } from '@/components/ApiErrorBox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function WisataScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiWisata.getAll();
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat wisata');
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
        <Pressable
onPress={() => router.push({ pathname: '/trip', params: { wisataId: String(item.id) } } as any)}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
        >
          <ThemedText type="subtitle" style={styles.cardTitle}>
            {item.nama}
          </ThemedText>
          <ThemedText style={styles.cardMeta} themeColor="textSecondary">
            {item.lokasi}
          </ThemedText>
          <ThemedText style={styles.cardDesc} themeColor="textSecondary">
            {item.deskripsi}
          </ThemedText>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardTitle: {
    marginBottom: Spacing.half,
  },
  cardMeta: {
    fontSize: 14,
  },
  cardDesc: {
    fontSize: 14,
  },
});

