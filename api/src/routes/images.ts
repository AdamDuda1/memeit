import { Hono } from 'hono';

const images = new Hono<{ Bindings: Env }>();

images.get('/*', async (c) => {
  const key = c.req.path.replace('/images/', '');
  const obj = await c.env.BUCKET.get(key);
  if (!obj) return c.notFound();

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(obj.body, { headers });
});

export default images;
