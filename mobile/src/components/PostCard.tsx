import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import type { Post } from '@/lib/api';
import { colors, radius } from '@/theme';

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)));

function timeAgo(ms: number) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 60) return `${Math.max(m, 1)}m`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const initials = post.handle.replace('@', '').slice(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.handle}>{post.handle}</Text>
          <Text style={styles.meta}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Pressable accessibilityLabel="More options" style={styles.iconBtn}>
          <Icon name="more" color={colors.textMuted} />
        </Pressable>
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" transition={150} />
      {post.caption ? <Text style={styles.caption}>{post.caption}</Text> : null}

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Like" onPress={() => setLiked((v) => !v)} style={styles.stat}>
          <Icon name="favorite" filled={liked} color={liked ? colors.accent : colors.text} />
          <Text style={[styles.statText, liked && { color: colors.accent }]}>
            {fmt(post.likes + (liked ? 1 : 0))}
          </Text>
        </Pressable>
        <Pressable accessibilityLabel="Share" style={styles.iconBtn}>
          <Icon name="share" size={22} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityLabel="Save" onPress={() => setSaved((v) => !v)} style={styles.iconBtn}>
          <Icon name="bookmark" size={22} filled={saved} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  handle: { color: colors.text, fontWeight: '600', fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 12 },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.avatar,
  },
  caption: { color: colors.text, fontSize: 15 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 6 },
  statText: { color: colors.text, fontWeight: '600', fontSize: 14 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
