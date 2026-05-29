import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export function LoadingView({ label }: { label?: string }) {
  return (
    <ThemedView style={styles.wrap} lightColor="transparent" darkColor="transparent" type="background">
      <ActivityIndicator />
      {label ? <ThemedView style={styles.spacer} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 8,
  },
});

