import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function ApiErrorBox({ message }: { message: string }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.container}>
      <ThemedText type="small" style={styles.text}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.25)',
  },
  text: {
    color: 'rgb(175, 0, 0)',
  },
});

