CREATE TABLE IF NOT EXISTS sites (
  id SERIAL NOT NULL PRIMARY KEY,
  url TEXT,
  directory TEXT,
  base_path TEXT,
  title TEXT,
  screenshot TEXT,
  entire_site boolean,
  processed boolean,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
