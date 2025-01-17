const JIKAN_API_BASE = 'https://api.jikan.moe/v4'

export interface JikanAnime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  synopsis: string
  rating: string
  score: number
  genres: Array<{ name: string }>
  duration: string
  status: string
  year: number
  episodes: number
}

export async function searchAnime(query: string): Promise<JikanAnime[]> {
  const response = await fetch(
    `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&sfw=true`
  )
  const data = await response.json()
  return data.data
}

export async function getAnimeById(malId: number): Promise<JikanAnime> {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${malId}`)
  const data = await response.json()
  return data.data
}

export async function getAnimeEpisodes(malId: number, page = 1): Promise<any> {
  const response = await fetch(
    `${JIKAN_API_BASE}/anime/${malId}/episodes?page=${page}`
  )
  const data = await response.json()
  return data.data
}

// Rate limiting helper
export function rateLimit() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

