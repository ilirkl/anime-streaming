CREATE OR REPLACE FUNCTION update_anime_schema()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update anime table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'mal_id') THEN
    ALTER TABLE anime ADD COLUMN mal_id INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'description') THEN
    ALTER TABLE anime ADD COLUMN description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'rating') THEN
    ALTER TABLE anime ADD COLUMN rating VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'score') THEN
    ALTER TABLE anime ADD COLUMN score DECIMAL(3,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'genres') THEN
    ALTER TABLE anime ADD COLUMN genres TEXT[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'duration') THEN
    ALTER TABLE anime ADD COLUMN duration VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'status') THEN
    ALTER TABLE anime ADD COLUMN status VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'year') THEN
    ALTER TABLE anime ADD COLUMN year INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'anime' AND column_name = 'updated_at') THEN
    ALTER TABLE anime ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Update episodes table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'episodes' AND column_name = 'mal_id') THEN
    ALTER TABLE episodes ADD COLUMN mal_id INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'episodes' AND column_name = 'updated_at') THEN
    ALTER TABLE episodes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Create indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_anime_mal_id') THEN
    CREATE INDEX idx_anime_mal_id ON anime(mal_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_episodes_mal_id') THEN
    CREATE INDEX idx_episodes_mal_id ON episodes(mal_id);
  END IF;
END;
$$;

