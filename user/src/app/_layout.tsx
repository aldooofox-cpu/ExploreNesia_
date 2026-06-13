import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="wisata" options={{ title: "Wisata" }} />
      <Stack.Screen name="trip" options={{ title: "Trip" }} />
      <Stack.Screen name="booking" options={{ title: "Booking" }} />
      <Stack.Screen name="my-bookings" options={{ title: "My Bookings" }} />
    </Stack>
  );
}
