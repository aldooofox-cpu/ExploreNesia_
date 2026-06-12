import { View, Text } from "react-native";
import { useState } from "react";

export default function TripScreen() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [selectedWisataId, setSelectedWisataId] = useState<number | "all">("all");
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <View>
      <Text>Halaman Trip</Text>
    </View>
  );
}
