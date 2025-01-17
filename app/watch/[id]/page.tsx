import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star } from 'lucide-react'
import { VideoPlayer } from "@/components/video-player"
import { EpisodeList } from "@/components/episode-list"
import { Button, ButtonProps } from "@/components/ui/button"
import { Badge, BadgeProps } from "@/components/ui/badge"
import type { FC } from 'react'
import { supabaseAdmin } from "@/lib/supabase"
import { getAnimeEpisodesById } from "@/app/actions"

interface Anime {
  id: string
  title: string
  cover_image: string
  description: string
  rating: string
  score: number
  genres: string[]
  duration: string
  status: string
  year: number
  episode_count: number
  updated_at: string
}

interface Episode {
  id: string
  anime_id: string
  mal_id: number
  episode_number: number
  title: string
  duration: number
  updated_at: string
}

async function getAnimeDetails(id: string): Promise<Anime | null> {
  const { data: anime, error } = await supabaseAdmin
    .from('anime')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching anime details:', error)
    return null
  }

  return anime
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const anime = await getAnimeDetails(params.id)
  const episodes = await getAnimeEpisodesById(params.id)

  if (!anime) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <a href="/tv" className="hover:text-foreground">TV</a>
          <span>/</span>
          <span className="text-foreground">{anime.title}</span>
        </div>
        
        <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr_300px]">
          <div className="order-2 lg:order-1">
            <EpisodeList episodes={episodes} animeId={anime.id} />
          </div>

          <div className="order-1 lg:order-2">
            <Suspense fallback={<div>Loading...</div>}>
              <VideoPlayer />
            </Suspense>
          </div>

          <div className="order-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={anime.cover_image || "/placeholder.svg"}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h1 className="text-2xl font-bold">{anime.title}</h1>
                
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary">PG-13</Badge>
                  <Badge variant="secondary">HD</Badge>
                  <Badge variant="secondary">TV</Badge>
                  <Badge variant="secondary">23m</Badge>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {anime.description}
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-lg font-bold">8.7</span>
                    </div>
                    <Button>Vote now</Button>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold">What do you think about this anime?</h3>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <Button variant="outline" className="w-full">Boring</Button>
                      <Button variant="outline" className="w-full">Great</Button>
                      <Button variant="outline" className="w-full">Amazing</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
