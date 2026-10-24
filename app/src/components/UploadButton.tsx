import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { pickImage } from '@/lib/image';
import { colors } from '@/theme';

const FAB_SIZE = 64;

export function UploadButton(_props: BottomTabBarButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  async function chooseFile() {
    setOpen(false);
    const uri = await pickImage();
    if (uri) router.push({ pathname: '/upload', params: { uri } });
  }

  // TODO: "Create" (meme editor) comes later.
  const create = () => setOpen(false);

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
            <Pressable onPress={chooseFile} style={[styles.option, styles.secondary]}>
              <Text style={styles.secondaryText}>Choose a file</Text>
            </Pressable>
            <Pressable onPress={create} style={[styles.option, styles.primary]}>
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
    marginTop: -FAB_SIZE / 2,
    borderWidth: 6,
    borderColor: colors.bg,
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
