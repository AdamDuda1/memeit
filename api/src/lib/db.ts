export type PostRow = {
  id: string;
  image_key: string;
  caption: string | null;
  created_at: number;
  handle: string;
  likes: number;
  comments: number;
};

export const POST_SELECT = `
  SELECT p.id, p.image_key, p.caption, p.created_at, u.handle,
         (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id)    AS likes,
         (SELECT COUNT(*) FROM comments m WHERE m.post_id = p.id) AS comments
  FROM posts p JOIN users u ON u.id = p.user_id`;

export const findPost = (db: D1Database, id: string) =>
  db.prepare(`${POST_SELECT} WHERE p.id = ?`).bind(id).first<PostRow>();

export const toApi = (r: PostRow, base: string) => ({
  id: r.id,
  imageUrl: base + r.image_key,
  caption: r.caption,
  handle: r.handle,
  createdAt: r.created_at,
  likes: r.likes,
  comments: r.comments,
});
