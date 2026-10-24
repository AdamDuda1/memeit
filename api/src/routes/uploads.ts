import { Hono } from 'hono';

import { ALLOWED_TYPES, sniffImageType } from '../lib/images';

const uploads = new Hono<{ Bindings: Env }>();

uploads.put('/', async (c) => {
  const bytes = new Uint8Array(await c.req.arrayBuffer());
  if (bytes.length === 0) return c.json({ error: 'Empty body' }, 400);
  if (bytes.length > Number(c.env.MAX_UPLOAD_BYTES)) return c.json({ error: 'File too large' }, 413);

  const type = sniffImageType(bytes);
  if (!type) {
    console.log('rejected upload, content-type header was:', c.req.header('content-type'));
    return c.json({ error: 'Unsupported image type' }, 415);
  }

  const key = `memes/${crypto.randomUUID()}.${ALLOWED_TYPES[type]}`;
  await c.env.BUCKET.put(key, bytes, { httpMetadata: { contentType: type } });
  return c.json({ key }, 201);
});

export default uploads;
