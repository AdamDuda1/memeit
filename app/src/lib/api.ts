// Talks to the Cloudflare Worker. Set EXPO_PUBLIC_API_URL in app/.env
// (e.g. http://192.168.1.20:8787 when running `wrangler dev` on your laptop).
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

export type Post = {
  id: string;
  imageUrl: string;
  caption: string | null;
  handle: string;
  createdAt: number;
  likes: number;
  comments: number;
};

export async function getPosts(cursor?: number): Promise<{ posts: Post[]; nextCursor: number | null }> {
  const res = await fetch(`${API_URL}/posts${cursor ? `?cursor=${cursor}` : ''}`);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
