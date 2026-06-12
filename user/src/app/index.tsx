import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
// Langsung dialihkan; pembungkus menjaga UI tetap aman untuk siklus rendering RN.
  const ready = true;
  useEffect(() => {}, []);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href="/wisata" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

