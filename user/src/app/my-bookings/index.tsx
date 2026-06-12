import { View, Text } from "react-native";
import { useState } from "react";
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

  return (
    <View>
      <Text>My Bookings</Text>
    </View>
  );
}