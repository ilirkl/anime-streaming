-- Enable RLS for anime table
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to insert anime data
CREATE POLICY "Allow authenticated users to insert anime" 
ON public.anime 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy for authenticated users to select anime data
CREATE POLICY "Allow authenticated users to select anime" 
ON public.anime 
FOR SELECT 
TO authenticated 
USING (true);

-- Enable RLS for episodes table
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to insert episodes
CREATE POLICY "Allow authenticated users to insert episodes" 
ON public.episodes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy for authenticated users to select episodes
CREATE POLICY "Allow authenticated users to select episodes" 
ON public.episodes 
FOR SELECT 
TO authenticated 
USING (true);
