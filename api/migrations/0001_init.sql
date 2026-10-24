-- Users (auth comes in step 5; for now everything is posted by the demo user)
CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  handle     TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

-- One row per meme. The image itself lives in R2 under image_key.
CREATE TABLE posts (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  image_key  TEXT NOT NULL,
  caption    TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

CREATE TABLE likes (
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comments (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

INSERT INTO users (id, handle, created_at) VALUES ('demo', '@dankpotato', unixepoch() * 1000);
