import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: 'rgba(37,99,235,0.12)',
          ...(Platform.OS === 'android' ? { height: 60 } : null),
        },
      }}
    >
      <Tabs.Screen
        name="wisata"
        options={{
          title: 'Wisata',
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
        }}
      />
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: 'My Bookings',
        }}
      />
    </Tabs>
  );
}

