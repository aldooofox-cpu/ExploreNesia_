import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { apiBooking } from '@/lib/api';
import { ApiErrorBox } from '@/components/ApiErrorBox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tripId?: string }>();

  const tripId = useMemo(() => {
    const raw = params.tripId;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params.tripId]);

  const [namaUser, setNamaUser] = useState('');
  const [email, setEmail] = useState('');
  const [jumlahTiket, setJumlahTiket] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    setError(null);
  }, [tripId]);

  async function onSubmit() {
    if (!tripId) return;

    const jumlah = Number(jumlahTiket);
    if (!namaUser.trim()) return Alert.alert('Validasi', 'Nama user wajib diisi');
    if (!email.includes('@')) return Alert.alert('Validasi', 'Email tidak valid');
    if (!Number.isFinite(jumlah) || jumlah < 1) return Alert.alert('Validasi', 'Jumlah tiket harus >= 1');

    try {
      setSubmitting(true);
      setError(null);
      await apiBooking.create({
        namaUser: namaUser.trim(),
        email: email.trim(),
        jumlahTiket: jumlah,
        tripId,
      });

      Alert.alert('Berhasil', 'Booking dibuat.');
router.replace('/my-bookings' as any);
    } catch (e: any) {
      setError(e?.message ?? 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  }

  if (!tripId) {
    return <ApiErrorBox message="tripId tidak tersedia. Kembali ke Trip dulu." />;
  }

  if (error) return <ApiErrorBox message={error} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">Booking</ThemedText>

      <ThemedView style={styles.field}>
        <ThemedText>Nama</ThemedText>
        <TextInput value={namaUser} onChangeText={setNamaUser} style={styles.input} placeholder="Nama Anda" />
      </ThemedView>

      <ThemedView style={styles.field}>
        <ThemedText>Email</ThemedText>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="email@example.com" keyboardType="email-address" />
      </ThemedView>

      <ThemedView style={styles.field}>
        <ThemedText>Jumlah Tiket</ThemedText>
        <TextInput value={jumlahTiket} onChangeText={setJumlahTiket} style={styles.input} keyboardType="numeric" />
      </ThemedView>

      <ThemedView style={styles.buttonRow}>
        <Button title={submitting ? 'Membuat...' : 'Buat Booking'} onPress={onSubmit} disabled={submitting} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.half,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonRow: {
    marginTop: Spacing.two,
  },
});

