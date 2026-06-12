import { View, Text, ActivityIndicator } from "react-native";
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
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Text>My Bookings</Text>
    </View>
  );
}