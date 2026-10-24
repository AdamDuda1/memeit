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

export async function uploadMeme(file: { uri: string; mimeType: string }, caption: string) {
  const blob = await (await fetch(file.uri)).blob();
  const up = await fetch(`${API_URL}/uploads`, {
    method: 'PUT',
    headers: { 'Content-Type': file.mimeType },
    body: blob,
  });
  if (!up.ok) throw new Error(await up.text());
  const { key } = await up.json();

  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, caption }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Post>;
}