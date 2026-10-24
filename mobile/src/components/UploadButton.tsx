import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors } from '@/theme';

const FAB_SIZE = 64;

export function UploadButton(_props: BottomTabBarButtonProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // TODO: wire up once the new meme flow exists.
  const choose = (_action: 'file' | 'create') => setOpen(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="New meme"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setOpen(true);
        }}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Icon name="new" size={32} color={colors.onAccent} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={[styles.backdrop, { paddingBottom: insets.bottom + 90 }]} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Pressable onPress={() => choose('file')} style={[styles.option, styles.secondary]}>
              <Text style={styles.secondaryText}>Choose a file</Text>
            </Pressable>
            <Pressable onPress={() => choose('create')} style={[styles.option, styles.primary]}>
              <Text style={styles.primaryText}>Create</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // lift it above the bar
    marginTop: -FAB_SIZE / 2,
    // the dark "ring" that separates it from the bar
    borderWidth: 6,
    borderColor: colors.bg,
    // shadow (iOS) / elevation (Android)
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  pressed: { transform: [{ scale: 0.94 }] },
  backdrop: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)' },
  menu: { flexDirection: 'row', gap: 10 },
  option: { height: 48, paddingHorizontal: 22, borderRadius: 24, justifyContent: 'center' },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '700', fontSize: 15 },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  secondaryText: { color: colors.text, fontWeight: '600', fontSize: 15 },
});
