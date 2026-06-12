import { View, Text } from "react-native";
import { useState } from "react";

export default function MyBookingsScreen() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  return (
    <View>
      <Text>My Bookings</Text>
    </View>
  );
}