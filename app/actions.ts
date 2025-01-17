'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { getAnimeById, getAnimeEpisodes, rateLimit, type JikanAnime } from '@/lib/jikan'

export async function getAnimeList(limit = 8) {
  const { data, error } = await supabaseAdmin
    .from('anime')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching anime list:', error)
    return []
  }

  return data
}

export async function getAnimeEpisodesById(animeId: string) {
  const { data, error } = await supabaseAdmin
    .from('episodes')
    .select('*')
    .eq('anime_id', animeId)
    .order('episode_number', { ascending: true })

  if (error) {
    console.error('Error fetching anime episodes:', error)
    return []
  }

  return data
}

export async function syncAnimeData(malId: number) {
  try {
    // Fetch anime details from Jikan
    const animeData = await getAnimeById(malId)
    await rateLimit()

    // Fetch episodes
    const episodes = await getAnimeEpisodes(malId)
    await rateLimit()

    // Verify service role client connection
    const { data: serviceRoleTest, error: serviceRoleError } = await supabaseAdmin
      .from('anime')
      .select('*')
      .limit(1)
      
    if (serviceRoleError) {
      console.error('Service role client connection error:', serviceRoleError)
      throw serviceRoleError
    }

    // Check if anime already exists
    const { data: existingAnime, error: selectError } = await supabaseAdmin
      .from('anime')
      .select('id')
      .eq('mal_id', malId)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing anime:', selectError)
      throw selectError
    }

    // Only insert if anime doesn't exist
    let anime
    if (!existingAnime) {
      const { data: newAnime, error: insertError } = await supabaseAdmin
        .from('anime')
        .insert({
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

      if (insertError) {
        console.error('Error inserting anime:', insertError)
        throw insertError
      }
      anime = newAnime
    } else {
      anime = existingAnime
      console.log('Anime already exists, skipping insert')
    }

    // Handle episodes only if anime was successfully created/found
    if (episodes && episodes.length > 0) {
      // First get existing episodes to avoid duplicates
      const { data: existingEpisodes } = await supabaseAdmin
        .from('episodes')
        .select('episode_number')
        .eq('anime_id', anime.id)

      interface ExistingEpisode {
        episode_number: number
      }

      const existingEpisodeNumbers = new Set(
        existingEpisodes?.map((ep: ExistingEpisode) => ep.episode_number) || []
      )

      interface JikanEpisode {
        episode_number?: number
        mal_id?: number
        title?: string
        duration?: number
      }

      // Filter out existing episodes
      const newEpisodes = episodes
        .filter((ep: JikanEpisode) => !existingEpisodeNumbers.has(ep.episode_number || ep.mal_id))
        .map((ep: JikanEpisode) => ({
          anime_id: anime.id,
          mal_id: malId,
          episode_number: ep.episode_number || ep.mal_id,
          title: ep.title || `Episode ${ep.episode_number || ep.mal_id}`,
          duration: ep.duration || 1440,
          updated_at: new Date().toISOString()
        }))

      if (newEpisodes.length > 0) {
        const { error: episodesError } = await supabaseAdmin
          .from('episodes')
          .insert(newEpisodes)

        if (episodesError) {
          console.error('Error inserting episodes:', episodesError)
          throw episodesError
        }
        console.log(`Inserted ${newEpisodes.length} new episodes`)
      } else {
        console.log('No new episodes to insert')
      }
    }

    return { success: true, anime }
  } catch (error) {
    console.error('Error syncing anime data:', error)
    return { success: false, error }
  }
}
