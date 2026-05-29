import React, { useMemo, useState } from 'react';

import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { apiBooking } from '../../../lib/api';




export default function BookingScreen() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    if (tripId == null) {
      setError('Trip belum dipilih. Pilih Trip dari tab Trip atau kembali ke Wisata.');
      return;
    }

    const jt = Number(jumlahTiket);
    if (!namaUser.trim()) {
      setError('Nama user wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Email tidak valid.');
      return;
    }
    if (!Number.isFinite(jt) || jt <= 0) {
      setError('Jumlah tiket harus lebih dari 0.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiBooking.create({
        namaUser: namaUser.trim(),
        email: email.trim(),
        jumlahTiket: jt,
        tripId,
      });

      setSuccess('Booking berhasil dibuat. Silakan cek tab Booking untuk melihat status (coming soon).');
      setJumlahTiket('1');
    } catch (e: any) {
      setError(e?.message || 'Gagal membuat booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f6f7fb' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: '900', color: '#0f172a' }}>Booking</Text>
      <Text style={{ color: '#64748b', marginTop: 6 }}>
        {tripId != null ? `Trip dipilih: #${tripId}` : 'Belum ada trip yang dipilih'}
      </Text>

      <View style={{ marginTop: 16, backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(37,99,235,0.12)' }}>
        <Text style={{ fontWeight: '900', color: '#0f172a', marginBottom: 10 }}>Data Pemesan</Text>

        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Nama</Text>
        <TextInput
          value={namaUser}
          onChangeText={setNamaUser}
          placeholder="Nama kamu"
          autoCapitalize="words"
          style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(37,99,235,0.12)', marginBottom: 12 }}
        />

        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@contoh.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(37,99,235,0.12)', marginBottom: 12 }}
        />

        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Jumlah Tiket</Text>
        <TextInput
          value={jumlahTiket}
          onChangeText={setJumlahTiket}
          placeholder="1"
          keyboardType="numeric"
          style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(37,99,235,0.12)', marginBottom: 16 }}
        />

        {error ? <Text style={{ color: '#ef4444', fontWeight: '700', marginBottom: 10 }}>{error}</Text> : null}
        {success ? <Text style={{ color: '#16a34a', fontWeight: '700', marginBottom: 10 }}>{success}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={loading}
          style={{ backgroundColor: loading ? 'rgba(37,99,235,0.5)' : '#2563eb', paddingVertical: 12, borderRadius: 12 }}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color="white" />
              <Text style={{ color: 'white', fontWeight: '900', marginLeft: 10 }}>Booking...</Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontWeight: '900', textAlign: 'center' }}>Buat Booking</Text>
          )}
        </Pressable>
      </View>

      <View style={{ marginTop: 14 }}>
        <Text style={{ color: '#64748b', fontSize: 12, lineHeight: 18 }}>
          Catatan: Status booking (pending/paid) bisa dilihat melalui fitur riwayat booking.
          Pada tahap ini fokus UI booking form sudah terhubung ke endpoint POST /booking.
        </Text>
      </View>
    </ScrollView>
  );
}

