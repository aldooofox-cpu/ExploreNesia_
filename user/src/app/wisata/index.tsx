import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { apiWisata, type Wisata } from "../../../lib/api";

export default function WisataScreen() {
  const [data, setData] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiWisata.getAll();
        if (!mounted) return;
        setData(res);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Gagal memuat wisata");
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
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // For now navigate to trip tab; filtering can be added later.
            router.push("/trip");
          }}
        >
          {!!item.gambar && (
            <Image source={{ uri: item.gambar }} style={styles.image} resizeMode="cover" />
          )}
          <View style={styles.cardBody}>
            <Text style={styles.title}>{item.nama}</Text>
            <Text numberOfLines={2} style={styles.desc}>
              {item.deskripsi}
            </Text>
            <Text style={styles.loc}>{item.lokasi}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  error: { color: "#b91c1c", textAlign: "center" },
  listContent: { padding: 12, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: { width: "100%", height: 160 },
  cardBody: { padding: 12 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  desc: { color: "#374151", marginBottom: 8 },
  loc: { color: "#6b7280" },
});

