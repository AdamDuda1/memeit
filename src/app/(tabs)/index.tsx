import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { PostCard } from '@/components/PostCard';
import { getPosts, type Post } from '@/lib/api';
import { colors } from '@/theme';

const FILTERS = ['For you', 'Following', 'New'] as const;

// Shown when the API isn't running yet, so the UI is usable from day 1.
const SAMPLE: Post[] = [1, 2, 3].map((i) => ({
  id: `sample-${i}`,
  imageUrl: `https://picsum.photos/seed/meme${i}/800/800`,
  caption: 'Sample meme (start the API to see real posts)',
  handle: i % 2 ? '@dankpotato' : '@memecat',
  createdAt: Date.now() - i * 3600_000,
  likes: 1240 / i,
  comments: 84 / i,
}));

type FeedResult = { posts: Post[]; offline: boolean };

async function fetchFeed(): Promise<FeedResult> {
  try {
    const { posts } = await getPosts();
    return { posts, offline: false };
  } catch {
    return { posts: SAMPLE, offline: true };
  }
}

export default function Feed() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('For you');
  const [posts, setPosts] = useState<Post[]>([]);
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const apply = useCallback((feed: FeedResult) => {
    setPosts(feed.posts);
    setOffline(feed.offline);
    setRefreshing(false);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed().then(apply);
  }, [apply]);

  useEffect(() => {
    fetchFeed().then(apply);
  }, [apply]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          memes<Text style={{ color: colors.accent }}>.</Text>
        </Text>
        <Pressable accessibilityLabel="Search" style={styles.round}>
          <Icon name="search" size={20} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
            >
              <Text style={[styles.pillText, { color: active ? colors.onAccent : colors.textMuted }]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {offline && <Text style={styles.banner}>API not reachable, showing sample memes</Text>}

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
        ListEmptyComponent={
          refreshing ? undefined : <Text style={styles.empty}>No memes yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  logo: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  pill: { height: 36, paddingHorizontal: 16, borderRadius: 18, justifyContent: 'center' },
  pillActive: { backgroundColor: colors.accent },
  pillIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pillText: { fontSize: 14, fontWeight: '600' },
  banner: { color: colors.textMuted, fontSize: 12, paddingHorizontal: 16, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 48 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 80 },
});
