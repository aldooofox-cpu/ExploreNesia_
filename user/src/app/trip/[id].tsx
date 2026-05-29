import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TripDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb', padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: '900', color: '#0f172a' }}>Trip Detail</Text>
      <Text style={{ color: '#64748b', marginTop: 8 }}>ID: {params.id}</Text>
      <Text style={{ color: '#64748b', marginTop: 12 }}>
        Detail trip belum diimplementasi. UI dasar app sudah terhubung untuk list trip dan form booking.
      </Text>
    </View>
  );
}

