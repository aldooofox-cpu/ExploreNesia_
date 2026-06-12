import { View, Text } from "react-native";
import { useState } from "react";

export default function BookingScreen() {
  return (
    <View>
      <Text>Form Booking</Text>
    </View>
  );
}

  type FormState = {
    namaUser: string;
    email: string;
    jumlahTiket: string; // simpan string agar mudah dengan TextInput
  };

  const [form, setForm] = useState<FormState>({
    namaUser: "",
    email: "",
    jumlahTiket: "1",
  });