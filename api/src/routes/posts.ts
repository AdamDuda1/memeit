import { Hono } from 'hono';

import { currentUserId } from '../lib/auth';
import { findPost, POST_SELECT, type PostRow, toApi } from '../lib/db';
import { imageBase } from '../lib/images';

const PAGE_SIZE = 20;

const posts = new Hono<{ Bindings: Env }>();

posts.get('/', async (c) => {
  const cursor = Number(c.req.query('cursor')) || Number.MAX_SAFE_INTEGER;
  const { results } = await c.env.DB.prepare(
    `${POST_SELECT} WHERE p.created_at < ? ORDER BY p.created_at DESC LIMIT ?`,
  )
    .bind(cursor, PAGE_SIZE)
    .all<PostRow>();

  const base = imageBase(c.req.url);
  return c.json({
    posts: results.map((r) => toApi(r, base)),
    nextCursor: results.length === PAGE_SIZE ? results[results.length - 1].created_at : null,
  });
});

posts.post('/', async (c) => {
  const { key, caption } = await c.req.json<{ key?: string; caption?: string }>();
  if (!key || !key.startsWith('memes/')) return c.json({ error: 'Missing key' }, 400);

  const head = await c.env.BUCKET.head(key);
  if (!head) return c.json({ error: 'Upload not found' }, 404);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO posts (id, user_id, image_key, caption, created_at) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(id, currentUserId(), key, caption?.slice(0, 280) || null, Date.now())
    .run();

  const post = await findPost(c.env.DB, id);
  return c.json(post && toApi(post, imageBase(c.req.url)), 201);
});

export default posts;
