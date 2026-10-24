import { Hono } from 'hono';
import { cors } from 'hono/cors';

import images from './routes/images';
import posts from './routes/posts';
import uploads from './routes/uploads';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) => c.json({ ok: true, service: 'memes-api' }));

app.route('/uploads', uploads);
app.route('/posts', posts);
app.route('/images', images);

export default app;
