import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { uploadMeme } from '@/lib/api';
import { compress, pickImage } from '@/lib/image';
import { colors, radius } from '@/theme';

export default function Upload() {
  // The + menu passes the picked image in as ?uri=...
  const router = useRouter();
  const params = useLocalSearchParams<{ uri?: string }>();
  const [image, setImage] = useState<string | null>(params.uri ?? null);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);

  async function changeImage() {
    const uri = await pickImage();
    if (uri) setImage(uri);
  }

  async function post() {
    if (!image) return;
    setBusy(true);
    try {
      const small = await compress(image);
      await uploadMeme({ uri: small, mimeType: 'image/webp' }, caption.trim());
      router.back(); // close the modal, back to the feed
    } catch (e) {
      Alert.alert('Upload failed', String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New meme</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.body}>
        <Pressable onPress={changeImage} style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
          ) : (
            <Text style={styles.muted}>Tap to choose an image</Text>
          )}
        </Pressable>

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Say something funny..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={280}
          style={styles.input}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={post}
          disabled={!image || busy}
          style={[styles.postBtn, { backgroundColor: image ? colors.accent : colors.avatar }]}
        >
          {busy ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <Text style={[styles.postText, { color: image ? colors.onAccent : colors.textMuted }]}>Post meme</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  headerBtn: { minWidth: 74, height: 44, justifyContent: 'center', paddingHorizontal: 12 },
  cancel: { color: colors.textMuted, fontSize: 15 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  imageBox: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  muted: { color: colors.textMuted },
  input: {
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  footer: { padding: 16 },
  postBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  postText: { fontSize: 16, fontWeight: '700' },
});
