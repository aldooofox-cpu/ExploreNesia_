import { View, Text } from "react-native";
import { useState } from "react";
import { apiTrip, apiWisata, type Trip, type Wisata } from "../../../lib/api";

export default function TripScreen() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [selectedWisataId, setSelectedWisataId] = useState<number | "all">("all");
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const load = async (filter: number | "all") => {
    setLoading(true);
    setError(null);
    try {
      if (filter === "all") {
        setData(await apiTrip.getAll());
      } else {
        setData(await apiTrip.getByWisata(filter));
      }
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Halaman Trip</Text>
    </View>
  );
}
