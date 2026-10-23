import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { UploadButton } from '@/components/UploadButton';
import { colors } from '@/theme';

const tabIcon = (name: IconName) => {
    return ({color, focused}: { color: ColorValue; focused: boolean }) => (
      <Icon name={name} color={String(color)} filled={focused}/>
  );
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenListeners={{ tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.nav,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: tabIcon('explore') }} />
      {/* Middle slot: a real route so it takes a place in the bar, but its
          button is replaced by our raised + which opens a menu instead. */}
      <Tabs.Screen name="create" options={{ title: 'New', tabBarButton: (props) => <UploadButton {...props} /> }} />
      <Tabs.Screen name="challenge" options={{ title: 'Challenge', tabBarIcon: tabIcon('challenge') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}
