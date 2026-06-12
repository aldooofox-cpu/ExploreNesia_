import { View, Text } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { apiTrip, apiWisata, apiBooking, type Trip, type Wisata } from "../../../lib/api";
import { useLocalSearchParams } from "expo-router";

  type FormState = {
    namaUser: string;
    email: string;
    jumlahTiket: string; // simpan string agar mudah dengan TextInput
  };

export default function BookingScreen() {
  const params = useLocalSearchParams<{ tripId?: string }>();

  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [tripList, setTripList] = useState<Trip[]>([]);

  const initialTripId = useMemo(() => {
    const v = params.tripId;
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, [params.tripId]);

  const [selectedWisataId, setSelectedWisataId] = useState<number | "all">("all");
  const [selectedTripId, setSelectedTripId] = useState<number | null>(initialTripId);

  const [form, setForm] = useState<FormState>({
    namaUser: "",
    email: "",
    jumlahTiket: "1",
  });

  const refreshWisata = async () => {
    const w = await apiWisata.getAll();
    setWisataList(w);
    return w;
  };

  const refreshTrips = async (wisataId: number | "all") => {
    if (wisataId === "all") {
      const t = await apiTrip.getAll();
      setTripList(t);
      return t;
    }

    const t = await apiTrip.getByWisata(wisataId);
    setTripList(t);
    return t;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        await refreshWisata();

        // Load daftar trip berdasarkan filter
        if (selectedWisataId === "all") {
          await refreshTrips("all");
        } else {
          await refreshTrips(selectedWisataId);
        }

        // Jika ada deep-link tripId, pertahankan selection (nanti divalidasi oleh tripList)
        if (initialTripId) {
          setSelectedTripId(initialTripId);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Gagal memuat data booking");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Text>Booking Screen</Text>
    </View>
  );
}
