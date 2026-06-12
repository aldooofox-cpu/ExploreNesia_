import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { apiBooking, type Booking } from "../../../lib/api";

export default function MyBookingsScreen() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const refresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiBooking.getAll();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePay = async (bookingId: number) => {
    try {
      setUpdatingId(bookingId);
      setError(null);

      await apiBooking.updateStatus(bookingId, { status: "paid" });
      Alert.alert("Pembayaran sukses", "Status booking berubah menjadi paid.");
      await refresh();
    } catch (e: any) {
      Alert.alert("Pembayaran gagal", e?.message ?? "Coba lagi");
      setError(e?.message ?? "Pembayaran gagal");
    } finally {
      setUpdatingId(null);
    }
  };

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
      refreshing={loading}
      onRefresh={refresh}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.trip?.namaTrip ?? "Trip"}</Text>
          <Text style={styles.meta}>Status: {item.status}</Text>
          <Text style={styles.meta}>Nama: {item.namaUser}</Text>
          <Text style={styles.meta}>Jumlah Tiket: {item.jumlahTiket}</Text>
          <Text style={styles.meta}>Total Harga: {item.totalHarga}</Text>

          {item.status === "pending" ? (
            <TouchableOpacity
              style={[styles.payBtn, updatingId === item.id && { opacity: 0.6 }]}
              disabled={updatingId === item.id}
              onPress={() => handlePay(item.id)}
            >
              <Text style={styles.payBtnText}>
                {updatingId === item.id ? "Memproses..." : "Bayar"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { color: "#4b5563" },
  payBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  payBtnText: { color: "#fff", fontWeight: "800" },
});
