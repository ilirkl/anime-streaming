'use server'

import { supabase } from '@/lib/supabase'
import { getAnimeById, getAnimeEpisodes, rateLimit, type JikanAnime } from '@/lib/jikan'

export async function syncAnimeData(malId: number) {
  try {
    // Fetch anime details from Jikan
    const animeData = await getAnimeById(malId)
    await rateLimit()

    // Fetch episodes
    const episodes = await getAnimeEpisodes(malId)
    await rateLimit()

    // Update or insert anime in Supabase
    const { data: anime, error: upsertError } = await supabase
      .from('anime')
      .upsert({
        mal_id: malId,
        title: animeData.title,
        cover_image: animeData.images.jpg.large_image_url,
        description: animeData.synopsis,
        rating: animeData.rating,
        score: animeData.score,
        genres: animeData.genres.map(g => g.name),
        duration: animeData.duration,
        status: animeData.status,
        year: animeData.year,
        episode_count: animeData.episodes,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (upsertError) throw upsertError

    // Update or insert episodes
    if (episodes && episodes.length > 0) {
      const formattedEpisodes = episodes.map((ep: any) => ({
        anime_id: anime.id,
        mal_id: malId,
        episode_number: ep.mal_id,
        title: ep.title,
        duration: 1440, // Default duration in seconds
        updated_at: new Date().toISOString()
      }))

      const { error: episodesError } = await supabase
        .from('episodes')
        .upsert(formattedEpisodes)

      if (episodesError) throw episodesError
    }

    return { success: true, anime }
  } catch (error) {
    console.error('Error syncing anime data:', error)
    return { success: false, error }
  }
}

