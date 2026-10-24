import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        {/* opened from the + menu, slides up over the tabs */}
        <Stack.Screen name="upload" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
