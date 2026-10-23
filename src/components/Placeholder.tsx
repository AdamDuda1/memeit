import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

export function Placeholder({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.center}>
        <Text style={styles.muted}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.textMuted },
});
