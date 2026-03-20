CREATE TABLE IF NOT EXISTS prompt_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt      TEXT        NOT NULL,
  role        TEXT        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  model       TEXT        NOT NULL,
  output      TEXT        NOT NULL,
  token_count INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS prompt_history_user_id_idx ON prompt_history (user_id, created_at DESC);
