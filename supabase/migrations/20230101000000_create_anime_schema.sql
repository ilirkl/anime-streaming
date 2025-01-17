-- Create anime table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.anime (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER,
    title VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    description TEXT,
    rating VARCHAR(20),
    score DECIMAL(3,2),
    genres TEXT[],
    duration VARCHAR(50),
    status VARCHAR(50),
    year INTEGER,
    episode_count INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create episodes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.episodes (
    id SERIAL PRIMARY KEY,
    anime_id INTEGER REFERENCES public.anime(id),
    mal_id INTEGER,
    episode_number INTEGER,
    title VARCHAR(255),
    duration INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_anime_mal_id ON public.anime(mal_id);
CREATE INDEX IF NOT EXISTS idx_episodes_mal_id ON public.episodes(mal_id);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON TABLE public.anime TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.episodes TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.anime_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.episodes_id_seq TO authenticated;

