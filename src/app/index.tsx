import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText style={styles.logo}>Meme<ThemedText style={[styles.logo, {color: "#FACC14"}]}>It</ThemedText>!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: "relative",
    top: 50,
    left: 50,
    fontFamily: "Space Grotesk",
    fontWeight: "bold",
    fontSize: 28
  }
});
