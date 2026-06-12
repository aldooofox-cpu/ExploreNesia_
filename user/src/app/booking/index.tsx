import { View, Text, Alert, ActivityIndicator, TextInput } from "react-native";
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

  // Jika tripList berubah dan tidak ada selectedTripId, pilih trip pertama
  useEffect(() => {
    if (tripList.length && selectedTripId === null) {
      // gunakan microtask supaya tidak memicu render berantai secara langsung di body effect
      queueMicrotask(() => {
        setSelectedTripId(tripList[0].id);
      });
    }
  }, [tripList, selectedTripId]);

  // Jika user memilih wisata (dan tidak deep-link), reload trips saat filter berubah
  useEffect(() => {
    if (initialTripId) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const t = await refreshTrips(selectedWisataId);
        if (!mounted) return;

        setSelectedTripId(t.length ? t[0].id : null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Gagal memuat trip");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWisataId]);

  const canSubmit = useMemo(() => {
    const namaOk = form.namaUser.trim().length >= 2;
    const emailOk = form.email.trim().length >= 5 && form.email.includes("@");
    const qty = Number(form.jumlahTiket);
    const qtyOk = Number.isFinite(qty) && qty > 0;
    const tripOk = selectedTripId !== null;
    return namaOk && emailOk && qtyOk && tripOk;
  }, [form, selectedTripId]);

  const handleSubmit = async () => {
    if (!selectedTripId) {
      Alert.alert("Booking", "Pilih trip terlebih dahulu");
      return;
    }

    const qty = Number(form.jumlahTiket);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert("Booking", "Jumlah tiket tidak valid");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await apiBooking.create({
        namaUser: form.namaUser.trim(),
        email: form.email.trim(),
        jumlahTiket: qty,
        tripId: selectedTripId,
      });

      Alert.alert("Booking berhasil", "Silakan cek menu My Bookings.", [
        {
          text: "OK",
          onPress: () => router.replace("/my-bookings"),
        },
      ]);
    } catch (e: any) {
      setError(e?.message ?? "Gagal membuat booking");
      Alert.alert("Booking gagal", e?.message ?? "Coba lagi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
      
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Form Booking</Text>

      <Text style={styles.label}>Nama</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={form.namaUser}
        onChangeText={(t) => setForm((s) => ({ ...s, namaUser: t }))}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        value={form.email}
        onChangeText={(t) => setForm((s) => ({ ...s, email: t }))}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Jumlah Tiket</Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        value={form.jumlahTiket}
        onChangeText={(t) => setForm((s) => ({ ...s, jumlahTiket: t }))}
        keyboardType="numeric"
      />
  );
}
