import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { apiTrip, apiWisata, type Trip, type Wisata } from "../../../lib/api";
import { FlatList, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";

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

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const w = await apiWisata.getAll();
        if (mounted) setWisata(w);
      } catch {
        // ignore
      }

      if (mounted) {
        await load(selectedWisataId);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWisataId]);

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
    <View>
      <Text>Halaman Trip</Text>
      <Picker
          selectedValue={selectedWisataId}
          onValueChange={(v) => setSelectedWisataId(v === "all" ? "all" : Number(v))}
        >
          <Picker.Item label="Semua" value="all" />
          {wisata.map((w) => (
            <Picker.Item key={w.id} label={w.nama} value={w.id} />
          ))}
        </Picker>

        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          />
    </View>
  );
}
